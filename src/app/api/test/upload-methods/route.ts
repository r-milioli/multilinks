import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Teste de métodos de upload iniciado...')
    
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

    const results = {
      upload_stream: null,
      upload_direct: null,
      upload_base64: null
    }

    // Teste 1: upload_stream
    try {
      console.log('🧪 Teste 1: upload_stream...')
      const result1 = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'test',
            public_id: `test_stream_${Date.now()}`,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              console.error('❌ Erro no upload_stream:', error)
              reject(error)
            } else {
              console.log('✅ upload_stream OK:', result?.public_id)
              resolve(result)
            }
          }
        ).end(buffer)
      }) as any

      results.upload_stream = {
        success: true,
        public_id: result1.public_id,
        url: result1.secure_url
      }

      // Deletar
      await cloudinary.uploader.destroy(result1.public_id)
    } catch (error) {
      console.error('❌ upload_stream falhou:', error)
      results.upload_stream = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 2: upload direto com buffer
    try {
      console.log('🧪 Teste 2: upload direto...')
      const result2 = await cloudinary.uploader.upload(buffer, {
        folder: 'test',
        public_id: `test_direct_${Date.now()}`,
        resource_type: 'image'
      })

      results.upload_direct = {
        success: true,
        public_id: result2.public_id,
        url: result2.secure_url
      }

      // Deletar
      await cloudinary.uploader.destroy(result2.public_id)
    } catch (error) {
      console.error('❌ upload direto falhou:', error)
      results.upload_direct = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 3: upload com base64
    try {
      console.log('🧪 Teste 3: upload base64...')
      const base64 = buffer.toString('base64')
      const dataUri = `data:${file.type};base64,${base64}`
      
      const result3 = await cloudinary.uploader.upload(dataUri, {
        folder: 'test',
        public_id: `test_base64_${Date.now()}`,
        resource_type: 'image'
      })

      results.upload_base64 = {
        success: true,
        public_id: result3.public_id,
        url: result3.secure_url
      }

      // Deletar
      await cloudinary.uploader.destroy(result3.public_id)
    } catch (error) {
      console.error('❌ upload base64 falhou:', error)
      results.upload_base64 = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Teste de métodos concluído',
      results
    })
  } catch (error) {
    console.error('💥 Erro no teste de métodos:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}
