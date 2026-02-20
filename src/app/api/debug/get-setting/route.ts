import { NextRequest, NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/debug/get-setting?key=social_links
 * Endpoint para testar a função getSetting
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') || 'social_links'
    
    console.log('🔍 Debug GetSetting - Testando chave:', key)
    
    const result = await SystemSettingsService.getSetting(key)
    
    console.log('🔍 Debug GetSetting - Resultado:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: true,
      key,
      result
    })

  } catch (error) {
    console.error('❌ Debug GetSetting - Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
