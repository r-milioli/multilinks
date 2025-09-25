import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * POST /api/debug/set-super-admin
 * API temporária para definir um usuário como SUPER_ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Debug Set Super Admin - Iniciando...')

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email é obrigatório'
      }, { status: 400 })
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado'
      }, { status: 404 })
    }

    // Atualizar role para SUPER_ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    console.log('✅ Debug Set Super Admin - Usuário atualizado:', updatedUser)

    return NextResponse.json({
      success: true,
      message: 'Usuário atualizado para SUPER_ADMIN com sucesso',
      data: updatedUser
    })

  } catch (error) {
    console.error('❌ Debug Set Super Admin - Erro:', error)
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
