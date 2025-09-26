import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/users
 * Listar usuários com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    // Extrair parâmetros de query
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    console.log('🔍 API Users - Filtros:', { search, role, status, page, limit, sortBy, sortOrder })

    // Construir condições de filtro
    const where: any = {}

    // Filtro de busca (nome, email, username)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtro de role
    if (role) {
      where.role = role
    }

    // Filtro de status
    if (status) {
      where.status = status
    }

    // Calcular offset para paginação
    const skip = (page - 1) * limit

    // Buscar usuários com filtros
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    console.log('✅ API Users - Usuários encontrados:', users.length, 'Total:', total)

    // Adicionar estatísticas básicas
    const usersWithStats = users.map(user => ({
      ...user,
      stats: {
        totalLinks: 0,
        totalClicks: 0,
        totalForms: 0,
        lastLogin: user.updatedAt?.toISOString()
      }
    }))

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit)

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
    console.error('❌ Erro ao buscar usuários:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}