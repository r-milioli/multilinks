import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Teste de upload iniciado...')
    
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum arquivo fornecido'
      })
    }

    console.log('📁 Arquivo recebido:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Converter para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ Buffer criado:', buffer.length, 'bytes')

    // Upload de teste usando upload_stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'test',
          public_id: `test_${Date.now()}`,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erro no upload:', error)
            reject(error)
          } else {
            console.log('✅ Upload OK:', result?.public_id)
            resolve(result)
          }
        }
      ).end(buffer)
    }) as any

    console.log('✅ Upload de teste OK:', result.public_id)

    // Deletar a imagem de teste
    await cloudinary.uploader.destroy(result.public_id)
    console.log('✅ Imagem de teste deletada')

    return NextResponse.json({
      success: true,
      message: 'Upload de teste bem-sucedido',
      testResult: {
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      }
    })
  } catch (error) {
    console.error('💥 Erro no teste de upload:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error instanceof Error ? error.stack : undefined
    })
  }
}
