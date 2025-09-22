import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { UploadService } from '@/shared/services/uploadService'
import { validateImageFile } from '@/shared/utils/validation'

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadAvatar = async (file: File, cropData?: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    try {
      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast.error(validation.error || 'Arquivo inválido')
        return { success: false, error: validation.error }
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await UploadService.uploadAvatar(file, cropData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result) {
        toast.success('Avatar enviado com sucesso!')
        return { success: true, data: result }
      } else {
        toast.error('Erro ao enviar avatar')
        return { success: false, error: 'Erro no upload' }
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao enviar imagem')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadBackground = async (file: File) => {
    try {
      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast.error(validation.error || 'Arquivo inválido')
        return { success: false, error: validation.error }
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await UploadService.uploadBackground(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result) {
        toast.success('Imagem de fundo enviada com sucesso!')
        return { success: true, data: result }
      } else {
        toast.error('Erro ao enviar imagem de fundo')
        return { success: false, error: 'Erro no upload' }
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao enviar imagem')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteImage = async (publicId: string) => {
    try {
      const success = await UploadService.deleteImage(publicId)
      
      if (success) {
        toast.success('Imagem removida com sucesso!')
        return { success: true }
      } else {
        toast.error('Erro ao remover imagem')
        return { success: false, error: 'Erro na remoção' }
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      toast.error('Erro ao remover imagem')
      return { success: false, error: 'Erro interno' }
    }
  }

  return {
    isUploading,
    uploadProgress,
    uploadAvatar,
    uploadBackground,
    deleteImage
  }
}

