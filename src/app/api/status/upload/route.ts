import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
  try {
    // Verificar configuração
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }

    const hasConfig = !!(config.cloud_name && config.api_key && config.api_secret)

    if (!hasConfig) {
      return NextResponse.json({
        status: 'error',
        message: 'Configuração do Cloudinary incompleta',
        timestamp: new Date().toISOString()
      })
    }

    // Configurar Cloudinary
    cloudinary.config(config)

    // Teste de conectividade
    const pingResult = await cloudinary.api.ping()

    return NextResponse.json({
      status: 'ok',
      message: 'Sistema de upload funcionando',
      cloudinary: {
        connected: true,
        rate_limit_remaining: pingResult.rate_limit_remaining,
        rate_limit_reset_at: pingResult.rate_limit_reset_at
      },
      config: {
        cloud_name: config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro no sistema de upload',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    })
  }
}
