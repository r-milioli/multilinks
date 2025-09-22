import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { compare, hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Usuário não possui senha definida' },
        { status: 400 }
      )
    }

    const isCurrentPasswordValid = await compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Senha atual incorreta' },
        { status: 400 }
      )
    }

    // Validar nova senha
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'A nova senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedNewPassword = await hash(newPassword, 12)

    // Atualizar senha no usuário
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    // Atualizar senha na conta de credenciais
    await prisma.account.updateMany({
      where: {
        userId: session.user.id,
        provider: 'credentials'
      },
      data: { refresh_token: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

