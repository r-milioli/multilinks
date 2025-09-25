import { NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * GET /api/debug/test-getsetting
 * Endpoint de debug para testar getSetting individualmente
 */
export async function GET() {
  try {
    console.log('🔍 Debug Test GetSetting API - Testando getSetting para cada chave...')
    
    const socialLinksResult = await SystemSettingsService.getSetting('social_links')
    const contactInfoResult = await SystemSettingsService.getSetting('contact_info')
    const plansResult = await SystemSettingsService.getSetting('plans')
    
    console.log('🔍 Debug Test GetSetting API - Resultados:')
    console.log('  - Social Links Result:', JSON.stringify(socialLinksResult, null, 2))
    console.log('  - Contact Info Result:', JSON.stringify(contactInfoResult, null, 2))
    console.log('  - Plans Result:', JSON.stringify(plansResult, null, 2))
    
    // Testar extração manual dos dados
    const socialLinksData = socialLinksResult.success && socialLinksResult.data?.value 
      ? socialLinksResult.data.value 
      : null
    
    const contactInfoData = contactInfoResult.success && contactInfoResult.data?.value 
      ? contactInfoResult.data.value 
      : null
    
    const plansData = plansResult.success && plansResult.data?.value 
      ? plansResult.data.value 
      : null
    
    console.log('🔍 Debug Test GetSetting API - Dados extraídos:')
    console.log('  - Social Links Data:', JSON.stringify(socialLinksData, null, 2))
    console.log('  - Contact Info Data:', JSON.stringify(contactInfoData, null, 2))
    console.log('  - Plans Data:', JSON.stringify(plansData, null, 2))
    
    return NextResponse.json({
      success: true,
      results: {
        socialLinks: {
          result: socialLinksResult,
          extractedData: socialLinksData
        },
        contactInfo: {
          result: contactInfoResult,
          extractedData: contactInfoData
        },
        plans: {
          result: plansResult,
          extractedData: plansData
        }
      }
    })
  } catch (error) {
    console.error('❌ Debug Test GetSetting API - Erro inesperado:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
