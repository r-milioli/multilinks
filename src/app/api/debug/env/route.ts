import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      'ASAAS_API_KEY': process.env.ASAAS_API_KEY ? 'CONFIGURADA' : 'NÃO CONFIGURADA',
      'ASAAS_ENVIRONMENT': process.env.ASAAS_ENVIRONMENT || 'NÃO CONFIGURADA',
      'ASAAS_API_URL': process.env.ASAAS_API_URL || 'NÃO CONFIGURADA',
      'ASAAS_WEBHOOK_SECRET': process.env.ASAAS_WEBHOOK_SECRET ? 'CONFIGURADA' : 'NÃO CONFIGURADA',
      'NODE_ENV': process.env.NODE_ENV || 'NÃO CONFIGURADA'
    }

    return NextResponse.json({
      success: true,
      message: 'Variáveis de ambiente do Asaas',
      data: envVars,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}