import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'
import { z } from 'zod'

// Schema de validação
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'A senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),
})

export async function POST(request: NextRequest) {
  try {
    // Validar dados de entrada
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Buscar token no banco
    const resetToken = await (prisma as any).passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expires: { gt: new Date() }
      }
    })

    if (!resetToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token inválido ou expirado' 
        },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
      select: { id: true, email: true }
    })

    if (!user) {
      // Marcar token como usado mesmo se usuário não existir
      await (prisma as any).passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })

      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuário não encontrado' 
        },
        { status: 404 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await hash(password, 12)

    // Iniciar transação para atualizar senha e marcar token como usado
    await prisma.$transaction(async (tx) => {
      // Atualizar senha do usuário
      await tx.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      })

      // Marcar token como usado
      await (tx as any).passwordResetToken.update({
        where: { id: resetToken.id },
        data: { 
          used: true,
          updatedAt: new Date()
        }
      })

      // Invalidar todas as outras sessões do usuário por segurança
      await tx.session.deleteMany({
        where: { userId: user.id }
      })

      // Invalidar todos os outros tokens de reset para este email
      await (tx as any).passwordResetToken.updateMany({
        where: {
          email: resetToken.email,
          used: false,
          id: { not: resetToken.id }
        },
        data: { used: true }
      })
    })

    console.log(`Senha redefinida com sucesso para usuário: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso'
    })

  } catch (error) {
    console.error('Erro no reset-password:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para validar token (opcional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token não fornecido' 
        },
        { status: 400 }
      )
    }

    // Verificar se token existe e é válido
    const resetToken = await (prisma as any).passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expires: { gt: new Date() }
      },
      select: { 
        id: true, 
        email: true, 
        expires: true,
        createdAt: true
      }
    })

    if (!resetToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token inválido ou expirado',
          expired: true
        },
        { status: 400 }
      )
    }

    // Verificar se usuário ainda existe
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
      select: { email: true }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuário não encontrado' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        email: resetToken.email,
        expires: resetToken.expires,
        isValid: true
      }
    })

  } catch (error) {
    console.error('Erro na validação do token:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
