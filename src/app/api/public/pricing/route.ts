import { NextRequest, NextResponse } from 'next/server'
import { PricingService } from '@/modules/admin/services/pricingService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/public/pricing
 * Retorna os dados de preços e recursos dos planos
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Pricing API - Iniciando busca de dados...')
    console.log('🌐 Pricing API - Request URL:', request.url)
    console.log('🌐 Pricing API - Request headers:', Object.fromEntries(request.headers.entries()))
    
    const pricingData = await PricingService.getPricingData()
    console.log('✅ Pricing API - Dados obtidos:', JSON.stringify(pricingData, null, 2))

    const response = {
      success: true,
      data: pricingData
    }
    
    console.log('📤 Pricing API - Enviando resposta:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Pricing API - Erro ao buscar dados de preços:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}