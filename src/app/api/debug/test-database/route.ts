import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

/**
 * GET /api/debug/test-database
 * Endpoint de debug para testar acesso direto ao banco de dados
 */
export async function GET() {
  try {
    console.log('🔍 Debug Test Database API - Testando acesso direto ao banco...')
    
    const prisma = new PrismaClient()
    
    // Testar conexão com o banco
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Debug Test Database API - Conexão com banco OK:', connectionTest)
    
    // Buscar todas as configurações
    const allSettings = await prisma.systemSettings.findMany({
      orderBy: { key: 'asc' }
    })
    console.log('✅ Debug Test Database API - Todas as configurações:', JSON.stringify(allSettings, null, 2))
    
    // Buscar configuração específica de social_links
    const socialLinksSetting = await prisma.systemSettings.findFirst({
      where: { key: 'social_links' }
    })
    console.log('✅ Debug Test Database API - Social Links Setting:', JSON.stringify(socialLinksSetting, null, 2))
    
    // Buscar configuração específica de contact_info
    const contactInfoSetting = await prisma.systemSettings.findFirst({
      where: { key: 'contact_info' }
    })
    console.log('✅ Debug Test Database API - Contact Info Setting:', JSON.stringify(contactInfoSetting, null, 2))
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      data: {
        connectionTest,
        allSettings,
        socialLinksSetting,
        contactInfoSetting
      }
    })
  } catch (error) {
    console.error('❌ Debug Test Database API - Erro:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
