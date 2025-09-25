import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * GET /api/debug/user-role
 * Debug para verificar o role do usuário atual
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug User Role - Iniciando verificação...')

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não autenticado',
        data: null
      })
    }

    // Buscar usuário no banco para verificar o role atual
    const userFromDb = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    })

    if (!userFromDb) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado no banco de dados',
        data: null
      })
    }

    const debugInfo = {
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role
      },
      database: {
        userId: userFromDb.id,
        email: userFromDb.email,
        name: userFromDb.name,
        role: userFromDb.role,
        status: userFromDb.status
      },
      isAdmin: userFromDb.role === 'ADMIN' || userFromDb.role === 'SUPER_ADMIN',
      isSuperAdmin: userFromDb.role === 'SUPER_ADMIN',
      roleMatch: (session.user as any).role === userFromDb.role
    }

    console.log('✅ Debug User Role - Informações do usuário:', debugInfo)

    return NextResponse.json({
      success: true,
      data: debugInfo
    })

  } catch (error) {
    console.error('❌ Debug User Role - Erro:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
