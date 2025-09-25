import { NextRequest, NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * GET /api/debug/settings
 * Endpoint de debug para verificar configurações do banco
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar todas as configurações
    const allSettings = await SystemSettingsService.getAllSettings()
    
    // Buscar configurações formatadas
    const formattedSettings = await SystemSettingsService.getFormattedSettings()
    
    // Buscar configurações específicas
    const socialLinks = await SystemSettingsService.getSetting('social_links')
    const contactInfo = await SystemSettingsService.getSetting('contact_info')
    const plans = await SystemSettingsService.getSetting('plans')

    return NextResponse.json({
      success: true,
      debug: {
        allSettings,
        formattedSettings,
        socialLinks,
        contactInfo,
        plans
      }
    })

  } catch (error) {
    console.error('❌ Debug Settings - Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
