import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/admin/users
 * Listar usuários com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar autenticação e permissões quando implementarmos
    // const session = await getServerSession(authOptions)
    // if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    //   return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro e paginação
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status) {
      where.status = status
    }

    // Ordenação
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calcular offset
    const skip = (page - 1) * limit

    // Buscar usuários (versão simplificada)
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
        bio: true,
        website: true,
        socialLinks: true
      }
    })

    const total = await prisma.user.count({ where })

    // Adicionar estatísticas básicas (sem queries complexas por enquanto)
    const usersWithStats = users.map(user => ({
      ...user,
      stats: {
        totalLinks: 0, // TODO: Implementar contagem real
        totalClicks: 0, // TODO: Implementar contagem real
        totalForms: 0, // TODO: Implementar contagem real
        lastLogin: user.updatedAt?.toISOString()
      }
    }))

    const totalPages = Math.ceil(total / limit)

    // await prisma.$disconnect() // Removido para evitar desconexão da instância global

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithStats,
        total,
        page,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    // await prisma.$disconnect() // Removido para evitar desconexão da instância global
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
