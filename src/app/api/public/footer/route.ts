import { NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

export async function GET() {
  try {
    const result = await SystemSettingsService.getFormattedSettings()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
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

    return NextResponse.json({
      success: true,
      data: footerData
    })
  } catch (error) {
    console.error('Erro ao buscar dados do footer:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
