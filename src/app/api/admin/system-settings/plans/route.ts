import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * GET /api/admin/system-settings/plans
 * Retorna as informações básicas dos planos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const result = await SystemSettingsService.getSetting('plans')

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data?.value || []
    })
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/system-settings/plans
 * Atualiza as informações básicas dos planos
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const plans = await request.json()

    // Validar estrutura dos dados
    if (!Array.isArray(plans)) {
      return NextResponse.json(
        { success: false, error: 'Formato de dados inválido' },
        { status: 400 }
      )
    }

    // Validar cada plano
    for (const plan of plans) {
      if (!plan.name || typeof plan.price !== 'number' || !plan.description) {
        return NextResponse.json(
          { success: false, error: 'Estrutura de plano inválida' },
          { status: 400 }
        )
      }
    }

    const result = await SystemSettingsService.upsertSetting({
      key: 'plans',
      value: plans,
      description: 'Informações básicas dos planos',
      category: 'pricing',
      isPublic: true
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Erro ao salvar planos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}