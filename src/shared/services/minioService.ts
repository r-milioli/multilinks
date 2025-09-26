import { Client } from 'minio'

export interface MinIOConfig {
  endPoint: string
  port: number
  useSSL: boolean
  accessKey: string
  secretKey: string
  bucketName: string
}

export interface UploadOptions {
  folder?: string
  publicId?: string
  transformation?: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'crop'
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
}

export interface TransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: string
}

export class MinIOService {
  private static client: Client
  private static config: MinIOConfig

  static initialize(config: MinIOConfig) {
    this.config = config
    this.client = new Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    })
  }

  static async uploadImage(
    buffer: Buffer, 
    fileName: string, 
    options: UploadOptions = {}
  ): Promise<{ url: string; publicId: string }> {
    if (!this.client) {
      throw new Error('MinIO não foi inicializado')
    }

    const { folder = 'multilinks' } = options
    const publicId = options.publicId || `${folder}/${fileName}`

    // Upload para MinIO (sem transformações aqui)
    await this.client.putObject(
      this.config.bucketName,
      publicId,
      buffer,
      {
        'Content-Type': 'image/jpeg'
      }
    )

    const url = `${this.config.endPoint}:${this.config.port}/${this.config.bucketName}/${publicId}`
    
    return { url, publicId }
  }

  static async deleteImage(publicId: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('MinIO não foi inicializado')
    }

    try {
      await this.client.removeObject(this.config.bucketName, publicId)
      return true
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      return false
    }
  }

  static getImageUrl(publicId: string, options?: TransformOptions): string {
    const baseUrl = `${this.config.endPoint}:${this.config.port}/${this.config.bucketName}`
    
    if (!options) {
      return `${baseUrl}/${publicId}`
    }

    // Para transformações dinâmicas, usar API de transformação
    const transformParams = new URLSearchParams()
    if (options.width) transformParams.set('w', options.width.toString())
    if (options.height) transformParams.set('h', options.height.toString())
    if (options.quality) transformParams.set('q', options.quality.toString())
    if (options.format) transformParams.set('f', options.format)

    const transformString = transformParams.toString()
    return transformString 
      ? `/api/image/${publicId}?${transformString}`
      : `${baseUrl}/${publicId}`
  }

  static getOptimizedAvatarUrl(publicId: string, size = 400): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      quality: 80,
      format: 'webp'
    })
  }

  static getOptimizedBackgroundUrl(publicId: string, width = 1920, height = 1080): string {
    return this.getImageUrl(publicId, {
      width,
      height,
      quality: 85,
      format: 'webp'
    })
  }
}
