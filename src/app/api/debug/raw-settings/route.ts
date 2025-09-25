import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/debug/raw-settings
 * Endpoint para verificar dados brutos do banco
 */
export async function GET() {
  try {
    // Buscar todas as configurações do banco
    const allSettings = await prisma.systemSettings.findMany({
      orderBy: { category: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: allSettings,
      count: allSettings.length
    })

  } catch (error) {
    console.error('❌ Debug Raw Settings - Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
