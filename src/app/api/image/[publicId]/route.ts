import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { MinIOService } from '@/shared/services/minioService'

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const { publicId } = params

    // Parâmetros de transformação
    const width = searchParams.get('w') ? parseInt(searchParams.get('w')!) : undefined
    const height = searchParams.get('h') ? parseInt(searchParams.get('h')!) : undefined
    const quality = searchParams.get('q') ? parseInt(searchParams.get('q')!) : 80
    const format = searchParams.get('f') as 'webp' | 'jpg' | 'png' | undefined

    console.log('🖼️ Transformando imagem:', { publicId, width, height, quality, format })

    // Buscar imagem do MinIO
    const imageBuffer = await MinIOService.client.getObject(
      process.env.MINIO_BUCKET_NAME!,
      publicId
    )

    // Aplicar transformações com Sharp
    let sharpInstance = sharp(imageBuffer)

    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
    }

    // Aplicar formato e qualidade
    let outputBuffer: Buffer
    const outputFormat = format || 'webp'

    switch (outputFormat) {
      case 'webp':
        outputBuffer = await sharpInstance.webp({ quality }).toBuffer()
        break
      case 'jpg':
        outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer()
        break
      case 'png':
        outputBuffer = await sharpInstance.png({ quality }).toBuffer()
        break
      default:
        outputBuffer = await sharpInstance.webp({ quality }).toBuffer()
    }

    // Retornar imagem transformada
    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': `image/${outputFormat}`,
        'Cache-Control': 'public, max-age=31536000', // 1 ano
        'Content-Length': outputBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('❌ Erro na transformação de imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar imagem' },
      { status: 500 }
    )
  }
}
