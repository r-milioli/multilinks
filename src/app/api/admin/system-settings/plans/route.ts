import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados recebidos
    if (!body || !Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos - esperado array de planos' },
        { status: 400 }
      )
    }

    // Validar estrutura dos planos
    const plans = body.map((plan: any, index: number) => {
      if (!plan || typeof plan !== 'object') {
        throw new Error(`Plano ${index + 1} inválido`)
      }

      return {
        name: plan.name || `Plano ${index + 1}`,
        price: typeof plan.price === 'number' ? plan.price : 0,
        features: Array.isArray(plan.features) ? plan.features : []
      }
    })

    const result = await SystemSettingsService.savePlans(plans)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Planos salvos com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao salvar planos:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
