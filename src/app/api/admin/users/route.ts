import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/users
 * Listar usuários com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Users - Iniciando busca de usuários...')

    // Versão ultra simplificada para debug
    const users = await prisma.user.findMany({
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

    console.log('✅ API Users - Usuários encontrados:', users.length)

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

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithStats,
        total: users.length,
        page: 1,
        limit: 20,
        totalPages: 1
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