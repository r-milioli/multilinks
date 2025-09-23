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
    console.log('🗑️ API: Iniciando exclusão de conta...')
    
    const session = await getServerSession(authOptions)
    console.log('🔍 API: Sessão encontrada:', !!session?.user?.id)

    if (!session?.user?.id) {
      console.log('❌ API: Usuário não autorizado')
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📋 API: Dados recebidos:', { hasPassword: !!body.confirmPassword, confirmText: body.confirmText })
    
    const validatedData = deleteAccountSchema.safeParse(body)

    if (!validatedData.success) {
      console.log('❌ API: Validação falhou:', validatedData.error.errors[0].message)
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      )
    }

    const { confirmPassword } = validatedData.data
    console.log('✅ API: Validação passou, verificando senha...')

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
    console.log('🔐 API: Senha válida:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ API: Senha incorreta')
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 400 }
      )
    }

    console.log('🗑️ API: Deletando usuário e todos os dados relacionados...')
    
    // Deletar todos os dados do usuário em cascata
    // O Prisma vai deletar automaticamente devido às relações onDelete: Cascade
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    console.log('✅ API: Usuário deletado com sucesso!')

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

