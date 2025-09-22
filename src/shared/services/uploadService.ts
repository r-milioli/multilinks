import { UploadResponse } from '@/types/common.types'
import { apiClient } from './apiClient'

export class UploadService {
  static async uploadAvatar(file: File, cropData?: {
    x: number
    y: number
    width: number
    height: number
  }): Promise<UploadResponse | null> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'avatar')
    
    if (cropData) {
      formData.append('cropData', JSON.stringify(cropData))
    }

    const response = await apiClient.upload<UploadResponse>('/upload/avatar', formData)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return null
  }

  static async uploadBackground(file: File): Promise<UploadResponse | null> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'background')

    const response = await apiClient.upload<UploadResponse>('/upload/background', formData)
    
    if (response.success && response.data) {
      return response.data
    }
    
    return null
  }

  static async deleteImage(publicId: string): Promise<boolean> {
    const response = await apiClient.delete(`/upload/${publicId}`)
    return response.success
  }

  static getImageUrl(publicId: string, options?: {
    width?: number
    height?: number
    quality?: number
    format?: string
  }): string {
    const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    
    if (!options) {
      return `${baseUrl}/${publicId}`
    }

    const transformations = []
    
    if (options.width) transformations.push(`w_${options.width}`)
    if (options.height) transformations.push(`h_${options.height}`)
    if (options.quality) transformations.push(`q_${options.quality}`)
    if (options.format) transformations.push(`f_${options.format}`)
    
    const transformString = transformations.length > 0 ? `${transformations.join(',')}/` : ''
    
    return `${baseUrl}/${transformString}${publicId}`
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

