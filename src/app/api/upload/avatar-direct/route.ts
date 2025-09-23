import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import { UploadResponse } from '@/types/common.types'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando upload direto de avatar...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
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
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      )
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('✅ Buffer criado:', buffer.length, 'bytes')

    // Upload direto usando upload_buffer
    const result = await cloudinary.uploader.upload_buffer(buffer, {
      folder: 'multilink/avatars',
      public_id: `${session.user.id}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
      resource_type: 'image',
      timeout: 60000
    })

    console.log('✅ Upload direto concluído:', {
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

    return NextResponse.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('💥 Erro no upload direto:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
