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

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      return NextResponse.json({
        success: false,
        error: 'Configuração do Cloudinary incompleta',
        config: {
          hasCloudName: !!config.cloud_name,
          hasApiKey: !!config.api_key,
          hasApiSecret: !!config.api_secret
        }
      })
    }

    // Configurar Cloudinary
    cloudinary.config(config)

    // Testar conexão
    const result = await cloudinary.api.ping()
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary configurado corretamente',
      ping: result,
      config: {
        cloud_name: config.cloud_name,
        hasApiKey: !!config.api_key,
        hasApiSecret: !!config.api_secret
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
