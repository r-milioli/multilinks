import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('🔍 Footer API - Iniciando busca direta no banco...')

    const prisma = new PrismaClient()

    // Buscar dados diretamente do banco
    const [socialLinksSetting, contactInfoSetting] = await Promise.all([
      prisma.systemSettings.findFirst({
        where: { key: 'social_links' }
      }),
      prisma.systemSettings.findFirst({
        where: { key: 'contact_info' }
      })
    ])

    console.log('🔍 Footer API - Dados do banco:')
    console.log('  - Social Links Setting:', JSON.stringify(socialLinksSetting, null, 2))
    console.log('  - Contact Info Setting:', JSON.stringify(contactInfoSetting, null, 2))

    // Extrair dados com fallback
    const socialLinks = socialLinksSetting?.value as any || {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    }

    const contactInfo = contactInfoSetting?.value as any || {
      email: '',
      phone: '',
      address: ''
    }

    console.log('✅ Footer API - Dados extraídos:')
    console.log('  - Social Links:', JSON.stringify(socialLinks, null, 2))
    console.log('  - Contact Info:', JSON.stringify(contactInfo, null, 2))

    const footerData = {
      socialLinks,
      contactInfo
    }

    console.log('📤 Footer API - Dados finais enviados:', JSON.stringify(footerData, null, 2))

    await prisma.$disconnect()

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
