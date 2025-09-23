import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    }

    const analysis = {
      cloud_name: {
        exists: !!envVars.CLOUDINARY_CLOUD_NAME,
        value: envVars.CLOUDINARY_CLOUD_NAME,
        length: envVars.CLOUDINARY_CLOUD_NAME?.length || 0,
        trimmed: envVars.CLOUDINARY_CLOUD_NAME?.trim()
      },
      api_key: {
        exists: !!envVars.CLOUDINARY_API_KEY,
        value: envVars.CLOUDINARY_API_KEY,
        length: envVars.CLOUDINARY_API_KEY?.length || 0,
        trimmed: envVars.CLOUDINARY_API_KEY?.trim(),
        preview: envVars.CLOUDINARY_API_KEY ? `${envVars.CLOUDINARY_API_KEY.substring(0, 4)}...` : 'undefined'
      },
      api_secret: {
        exists: !!envVars.CLOUDINARY_API_SECRET,
        value: envVars.CLOUDINARY_API_SECRET,
        length: envVars.CLOUDINARY_API_SECRET?.length || 0,
        trimmed: envVars.CLOUDINARY_API_SECRET?.trim(),
        preview: envVars.CLOUDINARY_API_SECRET ? `${envVars.CLOUDINARY_API_SECRET.substring(0, 4)}...` : 'undefined'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Análise das variáveis de ambiente',
      analysis,
      allConfigured: analysis.cloud_name.exists && analysis.api_key.exists && analysis.api_secret.exists
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}
