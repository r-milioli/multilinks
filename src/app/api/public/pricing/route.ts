import { NextRequest, NextResponse } from 'next/server'
import { PricingService } from '@/modules/admin/services/pricingService'

/**
 * GET /api/public/pricing
 * Retorna os dados de preços e recursos dos planos
 */
export async function GET(request: NextRequest) {
  try {
    const pricingData = await PricingService.getPricingData()

    return NextResponse.json({
      success: true,
      data: pricingData
    })
  } catch (error) {
    console.error('Erro ao buscar dados de preços:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}