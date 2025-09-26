import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { validateImageFile } from '@/shared/utils/validation'
import { apiClient } from '@/shared/services/apiClient'
import { useProfile } from './useProfile'

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { updateProfile, refetch } = useProfile()

  const uploadAvatar = async (file: File, cropData?: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    console.log('🔄 useImageUpload: Iniciando upload de avatar...')
    console.log('📁 useImageUpload: Arquivo recebido:', file)
    console.log('✂️ useImageUpload: Dados de crop:', cropData)
    
    try {
      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        console.error('❌ useImageUpload: Arquivo inválido:', validation.error)
        toast.error(validation.error || 'Arquivo inválido')
        return { success: false, error: validation.error }
      }

      console.log('✅ useImageUpload: Arquivo válido, iniciando upload...')
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

      const formData = new FormData()
      formData.append('file', file)
      if (cropData) {
        formData.append('cropData', JSON.stringify(cropData))
      }

      const response = await apiClient.upload('/upload/avatar-minio', formData)
      console.log('📥 useImageUpload: Resposta do upload:', response)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response && response.success) {
        const result = response
        console.log('🔄 useImageUpload: Upload bem-sucedido, atualizando perfil...')
        console.log('🖼️ useImageUpload: URL do avatar:', result.imageUrl || result.url)
        
        const avatarUrl = result.imageUrl || result.url
        
        console.log('💾 useImageUpload: Atualizando perfil com avatar:', avatarUrl)
        const updateResult = await updateProfile({ avatar: avatarUrl })
        
        if (updateResult.success) {
          console.log('✅ useImageUpload: Avatar atualizado no banco de dados')
          // Recarregar o perfil para mostrar a nova imagem
          await refetch()
          console.log('✅ useImageUpload: Perfil recarregado com nova imagem')
          toast.success('Avatar enviado com sucesso!')
          return {
            success: true,
            data: result,
            url: result.imageUrl || result.url,
            error: null
          }
        } else {
          const errorMessage = updateResult.error || 'Erro ao atualizar perfil'
          console.error('❌ useImageUpload: Erro ao atualizar avatar no banco:', errorMessage)
          toast.error(errorMessage)
          return {
            success: false,
            data: null,
            url: null,
            error: errorMessage
          }
        }
      } else {
        const errorMessage = 'Erro ao enviar avatar'
        console.error('❌ useImageUpload: Upload falhou:', errorMessage)
        toast.error(errorMessage)
        return {
          success: false,
          data: null,
          url: null,
          error: errorMessage
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro interno'
      console.error('❌ useImageUpload: Erro no upload:', error)
      toast.error('Erro ao enviar imagem')
      return {
        success: false,
        data: null,
        url: null,
        error: errorMessage
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadLinkImage = async (file: File, cropData?: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    console.log('🔄 useImageUpload: Iniciando upload de imagem do link...')
    console.log('📁 useImageUpload: Arquivo recebido:', file)
    console.log('✂️ useImageUpload: Dados de crop:', cropData)
    
    try {
      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        console.error('❌ useImageUpload: Arquivo inválido:', validation.error)
        toast.error(validation.error || 'Arquivo inválido')
        return { success: false, error: validation.error }
      }

      console.log('✅ useImageUpload: Arquivo válido, iniciando upload...')
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

      const formData = new FormData()
      formData.append('file', file)
      if (cropData) {
        formData.append('cropData', JSON.stringify(cropData))
      }

      const response = await apiClient.upload('/upload/link-image-minio', formData)
      console.log('📥 useImageUpload: Resposta do upload:', response)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response && response.success) {
        const result = response
        console.log('✅ useImageUpload: Upload de imagem do link bem-sucedido')
        console.log('🖼️ useImageUpload: URL da imagem:', result.imageUrl || result.url)
        
        return {
          success: true,
          data: result,
          url: result.imageUrl || result.url,
          error: null
        }
      } else {
        const errorMessage = 'Erro ao enviar imagem do link'
        console.error('❌ useImageUpload: Upload falhou:', errorMessage)
        toast.error(errorMessage)
        return {
          success: false,
          data: null,
          url: null,
          error: errorMessage
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro interno'
      console.error('❌ useImageUpload: Erro no upload:', error)
      toast.error('Erro ao enviar imagem')
      return {
        success: false,
        data: null,
        url: null,
        error: errorMessage
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadBackground = async (file: File, cropData?: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    console.log('🔄 useImageUpload: Iniciando upload de background...')
    console.log('📁 useImageUpload: Arquivo recebido:', file)
    console.log('✂️ useImageUpload: Dados de crop:', cropData)
    
    try {
      // Validar arquivo
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        console.error('❌ useImageUpload: Arquivo inválido:', validation.error)
        toast.error(validation.error || 'Arquivo inválido')
        return { success: false, error: validation.error }
      }

      console.log('✅ useImageUpload: Arquivo válido, iniciando upload...')
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

      const formData = new FormData()
      formData.append('file', file)
      if (cropData) {
        formData.append('cropData', JSON.stringify(cropData))
      }

      const response = await apiClient.upload('/upload/background-minio', formData)
      console.log('📥 useImageUpload: Resposta do upload:', response)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response && response.success) {
        const result = response
        console.log('🔄 useImageUpload: Upload bem-sucedido, atualizando perfil...')
        console.log('🖼️ useImageUpload: URL do background:', result.imageUrl || result.url)
        
        const backgroundUrl = result.imageUrl || result.url
        
        console.log('💾 useImageUpload: Atualizando perfil com background:', backgroundUrl)
        const updateResult = await updateProfile({ backgroundImage: backgroundUrl })
        
        if (updateResult.success) {
          console.log('✅ useImageUpload: Background atualizado no banco de dados')
          // Recarregar o perfil para mostrar a nova imagem
          await refetch()
          console.log('✅ useImageUpload: Perfil recarregado com nova imagem')
          toast.success('Imagem de fundo enviada com sucesso!')
          return {
            success: true,
            data: result,
            url: result.imageUrl || result.url,
            error: null
          }
        } else {
          const errorMessage = updateResult.error || 'Erro ao atualizar imagem de fundo'
          console.error('❌ useImageUpload: Erro ao atualizar background no banco:', errorMessage)
          toast.error(errorMessage)
          return {
            success: false,
            data: null,
            url: null,
            error: errorMessage
          }
        }
      } else {
        const errorMessage = 'Erro ao enviar imagem de fundo'
        console.error('❌ useImageUpload: Upload falhou:', errorMessage)
        toast.error(errorMessage)
        return {
          success: false,
          data: null,
          url: null,
          error: errorMessage
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro interno'
      console.error('❌ useImageUpload: Erro no upload:', error)
      toast.error('Erro ao enviar imagem')
      return {
        success: false,
        data: null,
        url: null,
        error: errorMessage
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteImage = async (publicId: string) => {
    try {
      const response = await apiClient.delete(`/upload/minio/${publicId}`)
      const success = response.success
      
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
    uploadLinkImage,
    deleteImage
  }
}

