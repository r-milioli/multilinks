import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MinIOServerService, MinIOConfig, UploadOptions } from '@/lib/minioServer'
import sharp from 'sharp'

// Configurar MinIO
const minioConfig: MinIOConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
  bucketName: process.env.MINIO_BUCKET || 'multilinks'
}

// Inicializar MinIO
MinIOServerService.initialize(minioConfig)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const cropDataStr = formData.get('cropData') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }

    console.log('🔄 Iniciando upload de avatar para MinIO...')
    console.log('📁 Arquivo recebido:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('✅ Buffer criado:', buffer.length, 'bytes')

    // Aplicar transformações com Sharp
    let processedBuffer = buffer
    let fileName = `${session.user.id}_avatar_${Date.now()}.webp`
    
    try {
      let sharpInstance = sharp(buffer)
      
      // Aplicar crop se fornecido
      if (cropDataStr) {
        try {
          const cropData = JSON.parse(cropDataStr)
          sharpInstance = sharpInstance.extract({
            left: cropData.x,
            top: cropData.y,
            width: cropData.width,
            height: cropData.height
          })
          console.log('✂️ Crop aplicado:', cropData)
        } catch (error) {
          console.error('❌ Erro ao processar crop data:', error)
        }
      }
      
      // Redimensionar para 400x400
      sharpInstance = sharpInstance.resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      
      // Converter para WebP com qualidade 80
      processedBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer()
      
      console.log('✅ Imagem processada com Sharp:', processedBuffer.length, 'bytes')
    } catch (error) {
      console.error('❌ Erro no processamento Sharp:', error)
      // Usar buffer original se falhar
      processedBuffer = buffer
      fileName = `${session.user.id}_avatar_${Date.now()}.jpg`
    }

    console.log('☁️ Iniciando upload para MinIO...')
    console.log('📍 Destino MinIO:', {
      endpoint: minioConfig.endPoint,
      port: minioConfig.port,
      bucket: minioConfig.bucketName,
      folder: 'multilinks/avatars',
      fileName: fileName
    })

    // Upload para MinIO
    const result = await MinIOServerService.uploadImage(
      processedBuffer,
      fileName,
      { folder: 'multilinks/avatars' }
    )

    console.log('✅ Upload concluído:', result)
    console.log('📍 Imagem salva em:', result.url)
    console.log('🆔 Public ID:', result.publicId)

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      imageUrl: result.url
    })

  } catch (error) {
    console.error('❌ Erro no upload do avatar:', error)
    
    let errorMessage = 'Erro interno do servidor'
    if (error instanceof Error) {
      if (error.message.includes('MinIO')) {
        errorMessage = 'Erro na configuração do MinIO'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}