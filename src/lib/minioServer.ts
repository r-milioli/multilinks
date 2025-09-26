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
}

export class MinIOServerService {
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

    // Upload para MinIO
    await this.client.putObject(
      this.config.bucketName,
      publicId,
      buffer,
      {
        'Content-Type': 'image/jpeg'
      }
    )

    const protocol = this.config.useSSL ? 'https' : 'http'
    const url = `${protocol}://${this.config.endPoint}:${this.config.port}/${this.config.bucketName}/${publicId}`
    
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
}
