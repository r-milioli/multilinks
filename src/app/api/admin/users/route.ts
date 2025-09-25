import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

/**
 * GET /api/admin/users
 * Listar usuários com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

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

    // Buscar usuários
    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
          socialLinks: true,
          _count: {
            select: {
              links: true,
              forms: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Buscar estatísticas adicionais para cada usuário
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Buscar total de cliques
        const totalClicks = await prisma.analyticsClick.count({
          where: {
            link: {
              userId: user.id
            }
          }
        })

        // Buscar último login (simulado - pode ser implementado com logs)
        const lastLogin = user.updatedAt // Por enquanto usando updatedAt

        return {
          ...user,
          stats: {
            totalLinks: user._count.links,
            totalClicks,
            totalForms: user._count.forms,
            lastLogin: lastLogin?.toISOString()
          }
        }
      })
    )

    const totalPages = Math.ceil(total / limit)

    await prisma.$disconnect()

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
    await prisma.$disconnect()
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
