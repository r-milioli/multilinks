import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { SystemSettingsService, SystemSettingsData } from '../services/systemSettingsService'
import { apiClient } from '@/shared/services/apiClient'

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Carregar configurações do sistema
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<SystemSettingsData>('/admin/system-settings')
      
      if (response.success && response.data) {
        setSettings(response.data)
      } else {
        toast.error('Erro ao carregar configurações')
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Salvar configurações de redes sociais
   */
  const saveSocialLinks = async (socialLinks: SystemSettingsData['socialLinks']) => {
    try {
      setIsSaving(true)
      const response = await apiClient.put('/admin/system-settings/social-links', socialLinks)
      
      if (response.success) {
        setSettings(prev => prev ? { ...prev, socialLinks } : null)
        toast.success('Links sociais salvos com sucesso!')
        return true
      } else {
        toast.error('Erro ao salvar links sociais')
        return false
      }
    } catch (error) {
      console.error('Erro ao salvar links sociais:', error)
      toast.error('Erro ao salvar links sociais')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Salvar informações de contato
   */
  const saveContactInfo = async (contactInfo: SystemSettingsData['contactInfo']) => {
    try {
      setIsSaving(true)
      const response = await apiClient.put('/admin/system-settings/contact-info', contactInfo)
      
      if (response.success) {
        setSettings(prev => prev ? { ...prev, contactInfo } : null)
        toast.success('Informações de contato salvas com sucesso!')
        return true
      } else {
        toast.error('Erro ao salvar informações de contato')
        return false
      }
    } catch (error) {
      console.error('Erro ao salvar informações de contato:', error)
      toast.error('Erro ao salvar informações de contato')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Salvar planos
   */
  const savePlans = async (plans: SystemSettingsData['plans']) => {
    try {
      setIsSaving(true)
      const response = await apiClient.put('/admin/system-settings/plans', plans)
      
      if (response.success) {
        setSettings(prev => prev ? { ...prev, plans } : null)
        toast.success('Planos salvos com sucesso!')
        return true
      } else {
        toast.error('Erro ao salvar planos')
        return false
      }
    } catch (error) {
      console.error('Erro ao salvar planos:', error)
      toast.error('Erro ao salvar planos')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Carregar configurações quando o hook for montado
   */
  useEffect(() => {
    loadSettings()
  }, [])

  return {
    settings,
    isLoading,
    isSaving,
    loadSettings,
    saveSocialLinks,
    saveContactInfo,
    savePlans
  }
}
