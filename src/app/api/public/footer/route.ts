import { NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

export async function GET() {
  try {
    console.log('🔍 Footer API - Iniciando busca de configurações...')
    
    const result = await SystemSettingsService.getFormattedSettings()
    
    console.log('🔍 Footer API - Resultado da busca:', JSON.stringify(result, null, 2))
    
    if (!result.success) {
      console.log('❌ Footer API - Erro na busca:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    console.log('✅ Footer API - Dados encontrados:', JSON.stringify(result.data, null, 2))

    // Verificar se os dados estão vazios e inicializar se necessário
    const hasData = result.data?.socialLinks && 
      (result.data.socialLinks.instagram || result.data.socialLinks.facebook || result.data.socialLinks.twitter || result.data.socialLinks.linkedin)

    if (!hasData) {
      console.log('🔧 Footer API - Dados vazios, inicializando configurações padrão...')
      await SystemSettingsService.initializeDefaultSettings()
      
      // Buscar novamente após inicialização
      const newResult = await SystemSettingsService.getFormattedSettings()
      if (newResult.success && newResult.data) {
        result.data = newResult.data
        console.log('✅ Footer API - Dados inicializados:', JSON.stringify(result.data, null, 2))
      }
    }

    // Retornar apenas os dados necessários para o footer
    const footerData = {
      socialLinks: result.data?.socialLinks || {
        instagram: '',
        facebook: '',
        twitter: '',
        linkedin: ''
      },
      contactInfo: result.data?.contactInfo || {
        email: '',
        phone: '',
        address: ''
      }
    }

    console.log('📤 Footer API - Dados finais enviados:', JSON.stringify(footerData, null, 2))

    return NextResponse.json({
      success: true,
      data: footerData
    })
  } catch (error) {
    console.error('❌ Footer API - Erro ao buscar dados do footer:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
