import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
function configureCloudinary() {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  }

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error('Configuração do Cloudinary incompleta')
  }

  cloudinary.config(config)
  return config
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando upload de imagem de link...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.warn('⚠️ Tentativa de upload de imagem de link sem autenticação.')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('✅ Usuário autenticado:', session.user.email)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    // Configurar Cloudinary
    console.log('🔧 Configurando Cloudinary...')
    const config = configureCloudinary()
    console.log('✅ Cloudinary configurado:', {
      hasCloudName: !!config.cloud_name,
      hasApiKey: !!config.api_key,
      hasApiSecret: !!config.api_secret,
      cloudName: config.cloud_name
    })

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Converter buffer para base64
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    console.log('🔄 Iniciando upload de imagem de link...')
    console.log('📁 Arquivo recebido:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Upload direto para Cloudinary (mesmo método do avatar)
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `multilinks/link-images/${session.user.id}`,
      public_id: `link-${Date.now()}`,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      timeout: 60000,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    })

    console.log('✅ Upload de imagem de link concluído:', {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    })

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    })

  } catch (error) {
    console.error('Erro no upload da imagem do link:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Configuração do Cloudinary')) {
        return NextResponse.json({ 
          error: 'Configuração de upload não disponível' 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ error: 'ID público não fornecido' }, { status: 400 })
    }

    // Configurar Cloudinary
    configureCloudinary()

    // Deletar imagem do Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Falha ao deletar imagem' }, { status: 500 })
    }

  } catch (error) {
    console.error('Erro ao deletar imagem do link:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
