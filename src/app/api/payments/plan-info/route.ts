import { NextRequest, NextResponse } from 'next/server'
import { PlanLimitsService } from '@/shared/services/planLimitsService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'ID do plano não fornecido' },
        { status: 400 }
      )
    }

    // Buscar dados do plano
    const planData = await PlanLimitsService.getPlanLimits(planId)
    
    console.log(`🔍 Buscando plano ${planId}:`, planData)
    
    if (!planData) {
      return NextResponse.json(
        { success: false, error: 'Plano não encontrado' },
        { status: 404 }
      )
    }

    // Mapear nomes dos planos
    const planNames: Record<string, string> = {
      free: 'Gratuito',
      pro: 'Pro',
      business: 'Business'
    }

    const planInfo = {
      id: planId,
      name: planNames[planId] || planId.charAt(0).toUpperCase() + planId.slice(1),
      price: planData.price || 0,
      description: `Plano ${planNames[planId] || planId} do MultiLink`,
      features: {
        maxLinks: planData.maxLinks,
        maxForms: planData.maxForms,
        maxWebhooks: planData.maxWebhooks,
        themeEditing: planData.themeEditing,
        analytics: planData.analytics,
        prioritySupport: planData.prioritySupport
      }
    }

    return NextResponse.json({
      success: true,
      data: planInfo
    })

  } catch (error: any) {
    console.error('Erro ao buscar informações do plano:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
