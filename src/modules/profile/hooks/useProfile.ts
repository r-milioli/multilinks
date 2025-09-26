import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { User, SocialLink } from '@prisma/client'
import { UpdateProfileData, CreateSocialLinkData, UpdateSocialLinkData } from '@/types/profile.types'
import { ProfileService } from '../services/profileService'
import { apiClient } from '@/shared/services/apiClient'

export function useProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<User & { socialLinks: SocialLink[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchProfile = async () => {
    if (!session?.user?.id) return

    try {
      setIsLoading(true)
      const response = await apiClient.get<User & { socialLinks: SocialLink[] }>('/user/profile')
      
      if (response.success && response.data) {
        setProfile(response.data)
      } else {
        toast.error('Erro ao carregar perfil')
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      toast.error('Erro ao carregar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      console.log('🔄 useProfile: Iniciando atualização do perfil')
      console.log('🔄 useProfile: Dados para atualizar:', data)
      setIsUpdating(true)
      
      const response = await apiClient.put<User>('/user/profile', data)
      console.log('🔄 useProfile: Resposta da API:', response)
      
      if (response.success && response.data) {
        console.log('✅ useProfile: Perfil atualizado com sucesso')
        setProfile(prev => prev ? { ...prev, ...response.data! } : null)
        toast.success('Perfil atualizado com sucesso!')
        return { success: true, data: response.data }
      } else {
        console.error('❌ useProfile: Erro na resposta da API:', response.error)
        toast.error(response.error || 'Erro ao atualizar perfil')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('❌ useProfile: Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsUpdating(false)
    }
  }

  const createSocialLink = async (data: CreateSocialLinkData) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      const response = await apiClient.post<SocialLink>('/user/social-links', data)
      
      if (response.success && response.data) {
        setProfile(prev => prev ? {
          ...prev,
          socialLinks: [...prev.socialLinks, response.data!]
        } : null)
        toast.success('Link social adicionado com sucesso!')
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || 'Erro ao adicionar link social')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao criar social link:', error)
      toast.error('Erro ao adicionar link social')
      return { success: false, error: 'Erro interno' }
    }
  }

  const updateSocialLink = async (socialLinkId: string, data: UpdateSocialLinkData) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      const response = await apiClient.put<SocialLink>(`/user/social-links/${socialLinkId}`, data)
      
      if (response.success && response.data) {
        setProfile(prev => prev ? {
          ...prev,
          socialLinks: prev.socialLinks.map(link => 
            link.id === socialLinkId ? response.data! : link
          )
        } : null)
        toast.success('Link social atualizado com sucesso!')
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || 'Erro ao atualizar link social')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao atualizar social link:', error)
      toast.error('Erro ao atualizar link social')
      return { success: false, error: 'Erro interno' }
    }
  }

  const deleteSocialLink = async (socialLinkId: string) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      const response = await apiClient.delete(`/user/social-links/${socialLinkId}`)
      
      if (response.success) {
        setProfile(prev => prev ? {
          ...prev,
          socialLinks: prev.socialLinks.filter(link => link.id !== socialLinkId)
        } : null)
        toast.success('Link social removido com sucesso!')
        return { success: true }
      } else {
        toast.error(response.error || 'Erro ao remover link social')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao deletar social link:', error)
      toast.error('Erro ao remover link social')
      return { success: false, error: 'Erro interno' }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [session?.user?.id])

  return {
    profile,
    isLoading,
    isUpdating,
    updateProfile,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    refetch: fetchProfile
  }
}

