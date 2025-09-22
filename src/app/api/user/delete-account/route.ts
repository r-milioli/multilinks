import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const deleteAccountSchema = z.object({
  confirmPassword: z.string().min(1, 'Senha de confirmação é obrigatória'),
  confirmText: z.string().refine((text) => text === 'DELETAR', {
    message: 'Deve digitar exatamente "DELETAR" para confirmar'
  })
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = deleteAccountSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      )
    }

    const { confirmPassword } = validatedData.data

    // Buscar usuário para verificar senha
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado ou senha não definida' },
        { status: 404 }
      )
    }

    // Verificar senha
    const { compare } = await import('bcryptjs')
    const isPasswordValid = await compare(confirmPassword, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 400 }
      )
    }

    // Deletar todos os dados do usuário em cascata
    // O Prisma vai deletar automaticamente devido às relações onDelete: Cascade
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Conta deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar conta:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

