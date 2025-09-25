import { NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * GET /api/debug/formatted-settings
 * Endpoint de debug para testar a função getFormattedSettings
 */
export async function GET() {
  try {
    console.log('🔍 Debug Formatted Settings API - Testando getFormattedSettings...')
    
    const result = await SystemSettingsService.getFormattedSettings()
    
    if (result.success) {
      console.log('✅ Debug Formatted Settings API - Resultado:', JSON.stringify(result, null, 2))
      return NextResponse.json({ 
        success: true, 
        data: result.data,
        debug: 'getFormattedSettings funcionou corretamente'
      })
    } else {
      console.error('❌ Debug Formatted Settings API - Erro:', result.error)
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Debug Formatted Settings API - Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
