import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET() {
  try {
    console.log('🔍 Iniciando diagnóstico completo do Cloudinary...')
    
    // Verificar variáveis de ambiente
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }

    console.log('📋 Configuração:', {
      hasCloudName: !!config.cloud_name,
      hasApiKey: !!config.api_key,
      hasApiSecret: !!config.api_secret,
      cloudName: config.cloud_name
    })

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
    console.log('✅ Cloudinary configurado')

    // Teste 1: Ping básico
    console.log('🧪 Teste 1: Ping básico...')
    const pingResult = await cloudinary.api.ping()
    console.log('✅ Ping bem-sucedido:', pingResult)

    // Teste 2: Verificar uso da conta
    console.log('🧪 Teste 2: Verificar uso da conta...')
    try {
      const usageResult = await cloudinary.api.usage()
      console.log('✅ Uso da conta:', usageResult)
    } catch (usageError) {
      console.log('⚠️ Erro ao verificar uso:', usageError)
    }

    // Teste 3: Listar recursos
    console.log('🧪 Teste 3: Listar recursos...')
    try {
      const resourcesResult = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'multilink',
        max_results: 1
      })
      console.log('✅ Recursos encontrados:', resourcesResult.resources?.length || 0)
    } catch (resourcesError) {
      console.log('⚠️ Erro ao listar recursos:', resourcesError)
    }

    // Teste 4: Upload de teste
    console.log('🧪 Teste 4: Upload de teste...')
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'test',
      public_id: `test_${Date.now()}`,
      resource_type: 'image',
      timeout: 30000
    })
    console.log('✅ Upload de teste bem-sucedido:', uploadResult.public_id)

    // Deletar a imagem de teste
    await cloudinary.uploader.destroy(uploadResult.public_id)
    console.log('✅ Imagem de teste deletada')

    return NextResponse.json({
      success: true,
      message: 'Todos os testes passaram',
      results: {
        ping: pingResult,
        upload: {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url
        }
      }
    })
  } catch (error) {
    console.error('💥 Erro no diagnóstico:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : undefined
    })
  }
}
