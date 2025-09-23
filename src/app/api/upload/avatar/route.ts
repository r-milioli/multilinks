import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import { UploadResponse } from '@/types/common.types'

// Configurar Cloudinary com validação
function configureCloudinary() {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  }

  console.log('🔧 Configuração Cloudinary:', {
    hasCloudName: !!config.cloud_name,
    hasApiKey: !!config.api_key,
    hasApiSecret: !!config.api_secret,
    cloudName: config.cloud_name,
    apiKey: config.api_key ? `${config.api_key.substring(0, 4)}...` : 'undefined'
  })

  // Validar configuração
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Configuração do Cloudinary incompleta')
  }

  // Configurar Cloudinary com valores limpos
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
  })
  
  return config
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando upload de avatar...')
    
    // Verificar configuração do Cloudinary
    const cloudinaryConfig = configureCloudinary()
    console.log('✅ Cloudinary configurado:', { cloud_name: cloudinaryConfig.cloud_name })

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('❌ Usuário não autenticado')
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    console.log('✅ Usuário autenticado:', session.user.email)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const cropDataStr = formData.get('cropData') as string

    if (!file) {
      console.log('❌ Nenhum arquivo fornecido')
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      )
    }

    console.log('📁 Arquivo recebido:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Tipo de arquivo não suportado:', file.type)
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      )
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.log('❌ Arquivo muito grande:', file.size)
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    console.log('🔄 Convertendo arquivo para buffer...')
    
    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('✅ Buffer criado:', buffer.length, 'bytes')

    // Upload para Cloudinary - configuração otimizada para produção
    const uploadOptions = {
      folder: 'multilink/avatars',
      public_id: `${session.user.id}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      resource_type: 'image' as const,
      timeout: 60000,
      // Configurações para produção
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }

    // Aplicar crop se fornecido
    if (cropDataStr) {
      try {
        const cropData = JSON.parse(cropDataStr)
        uploadOptions.transformation.unshift({
          x: cropData.x,
          y: cropData.y,
          width: cropData.width,
          height: cropData.height,
          crop: 'crop'
        })
        console.log('✂️ Crop aplicado:', cropData)
      } catch (error) {
        console.error('❌ Erro ao processar crop data:', error)
      }
    }

    console.log('☁️ Iniciando upload para Cloudinary...')
    console.log('⚙️ Opções de upload:', uploadOptions)

    // Upload usando método direto (mais confiável)
    console.log('🔄 Iniciando upload direto...')
    
    // Converter buffer para base64
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`
    
    console.log('✅ Data URI criado:', dataUri.length, 'caracteres')
    
    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)
    
    console.log('✅ Upload OK:', result.public_id)
    
    console.log('✅ Upload concluído:', {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    })

    const response: UploadResponse = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }

    console.log('🎉 Upload finalizado com sucesso!')

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('💥 Erro no upload:', error)
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }

    // Retornar erro específico baseado no tipo
    let errorMessage = 'Erro interno do servidor'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('Cloudinary')) {
        errorMessage = 'Erro na configuração do Cloudinary'
        statusCode = 503
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout no upload. Tente novamente.'
        statusCode = 408
      } else if (error.message.includes('network')) {
        errorMessage = 'Erro de rede. Verifique sua conexão.'
        statusCode = 503
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}