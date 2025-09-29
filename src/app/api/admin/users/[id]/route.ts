import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * PUT /api/admin/users/[id]
 * Atualizar usuário
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    const userId = params.id
    const body = await request.json()

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 })
    }

    // TODO: Verificar permissões para alterar role quando implementarmos autenticação
    // if (body.role && body.role !== existingUser.role) {
    //   // Apenas SUPER_ADMIN pode alterar roles de ADMIN/SUPER_ADMIN
    //   if (['ADMIN', 'SUPER_ADMIN'].includes(existingUser.role) && session.user.role !== 'SUPER_ADMIN') {
    //     return NextResponse.json({ success: false, error: 'Sem permissão para alterar role de administrador' }, { status: 403 })
    //   }
    // }

         // Campos permitidos para atualização
         const allowedFields = ['name', 'email', 'role', 'status', 'bio', 'username']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        image: true,
        username: true,
        bio: true
      }
    })

    // Se subscriptionPlan foi fornecido, atualizar UserStats
    if (body.subscriptionPlan !== undefined) {
      const validPlans = ['free', 'pro', 'business']
      if (validPlans.includes(body.subscriptionPlan)) {
        await prisma.userStats.upsert({
          where: { userId },
          update: {
            subscriptionPlan: body.subscriptionPlan
          },
          create: {
            userId,
            subscriptionPlan: body.subscriptionPlan,
            totalLinks: 0,
            totalForms: 0,
            totalClicks: 0
          }
        })
      }
    }

    // await prisma.$disconnect() // Removido para evitar desconexão da instância global

    return NextResponse.json({
      success: true,
      data: updatedUser
    })

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    // await prisma.$disconnect() // Removido para evitar desconexão da instância global
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Deletar usuário
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    const userId = params.id

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 })
    }

    // TODO: Verificar permissões quando implementarmos autenticação
    // // Não permitir deletar o próprio usuário
    // if (existingUser.id === session.user.id) {
    //   return NextResponse.json({ success: false, error: 'Não é possível deletar seu próprio usuário' }, { status: 400 })
    // }

    // // Não permitir deletar SUPER_ADMIN (apenas outros SUPER_ADMIN podem)
    // if (existingUser.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json({ success: false, error: 'Sem permissão para deletar super administrador' }, { status: 403 })
    // }

    // Deletar usuário (cascade delete irá remover links, forms, etc.)
    await prisma.user.delete({
      where: { id: userId }
    })

    // await prisma.$disconnect() // Removido para evitar desconexão da instância global

    return NextResponse.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    // await prisma.$disconnect() // Removido para evitar desconexão da instância global
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
