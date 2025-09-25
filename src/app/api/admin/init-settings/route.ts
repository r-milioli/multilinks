import { NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * POST /api/admin/init-settings
 * Endpoint para inicializar configurações padrão
 */
export async function POST() {
  try {
    console.log('🔧 Init Settings API - Iniciando...')
    
    const result = await SystemSettingsService.initializeDefaultSettings()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Configurações padrão inicializadas com sucesso'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Init Settings API - Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
