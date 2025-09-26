import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { EmailService } from '@/lib/emailService'
import { z } from 'zod'
import crypto from 'crypto'

// Schema de validação
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export async function POST(request: NextRequest) {
  try {
    // Validar dados de entrada
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true }
    })

    // Por segurança, sempre retornamos sucesso mesmo se o email não existir
    // Isso previne que atacantes descubram quais emails estão cadastrados
    if (!user) {
      console.log(`Tentativa de reset para email não cadastrado: ${email}`)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação.'
      })
    }

    // Verificar se já existe um token ativo para este email
    const existingToken = await (prisma as any).passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
        expires: { gt: new Date() },
        used: false
      }
    })

    // Se já existe um token válido, não criamos outro (rate limiting)
    if (existingToken) {
      console.log(`Token já existe para email: ${email}`)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação.'
      })
    }

    // Gerar token seguro
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Salvar token no banco de dados
    await (prisma as any).passwordResetToken.create({
      data: {
        token,
        email: email.toLowerCase(),
        expires,
        used: false
      }
    })

    // Enviar email de reset
    const emailResult = await EmailService.sendPasswordResetEmail(
      user.email,
      token,
      user.name || undefined
    )

    if (!emailResult.success) {
      console.error('Erro ao enviar email de reset:', emailResult.error)
      
      // Remover token se o email falhou
      await (prisma as any).passwordResetToken.deleteMany({
        where: { token }
      })

      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao enviar email. Tente novamente mais tarde.' 
        },
        { status: 500 }
      )
    }

    console.log(`Token de reset criado com sucesso para: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação.'
    })

  } catch (error) {
    console.error('Erro no forgot-password:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos',
          details: error.errors 
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

// Limpar tokens expirados (função utilitária)
export async function cleanupExpiredTokens() {
  try {
    const result = await (prisma as any).passwordResetToken.deleteMany({
      where: {
        expires: { lt: new Date() }
      }
    })
    
    console.log(`Tokens expirados removidos: ${result.count}`)
    return result.count
  } catch (error) {
    console.error('Erro ao limpar tokens expirados:', error)
    return 0
  }
}
