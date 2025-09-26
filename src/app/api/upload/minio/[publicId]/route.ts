import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MinIOServerService, MinIOConfig } from '@/lib/minioServer'

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { publicId } = params

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID não fornecido' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deletando imagem do MinIO:', publicId)

    // Deletar do MinIO
    const success = await MinIOServerService.deleteImage(publicId)

    if (success) {
      console.log('✅ Imagem deletada com sucesso:', publicId)
      return NextResponse.json({
        success: true,
        message: 'Imagem deletada com sucesso'
      })
    } else {
      console.log('❌ Falha ao deletar imagem:', publicId)
      return NextResponse.json(
        { error: 'Falha ao deletar imagem' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Erro ao deletar imagem:', error)
    
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
