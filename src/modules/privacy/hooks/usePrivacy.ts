'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PrivacySettings } from '@/types/common.types'
import { toast } from 'react-hot-toast'

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  showEmail: false,
  showSocialLinks: true,
  allowAnalytics: true,
  isPublic: true
}

export function usePrivacy() {
  const { data: session } = useSession()
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      loadPrivacySettings()
    }
  }, [session?.user?.id])

  const loadPrivacySettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/privacy')
      const data = await response.json()
      if (data.success && data.data) {
        setPrivacySettings(data.data)
      } else {
        setPrivacySettings(DEFAULT_PRIVACY_SETTINGS)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de privacidade:', error)
      setPrivacySettings(DEFAULT_PRIVACY_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }

  const savePrivacySettings = async (newSettings: PrivacySettings) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/privacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      const result = await response.json()
      if (result.success) {
        setPrivacySettings(newSettings)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de privacidade:', error)
      return { success: false, error: 'Erro ao salvar configurações' }
    } finally {
      setIsSaving(false)
    }
  }

  const updatePrivacySetting = (key: keyof PrivacySettings, value: boolean) => {
    const newSettings = { ...privacySettings, [key]: value }
    setPrivacySettings(newSettings)
  }

  const resetToDefault = async () => {
    return await savePrivacySettings(DEFAULT_PRIVACY_SETTINGS)
  }

  return {
    privacySettings,
    isLoading,
    isSaving,
    savePrivacySettings,
    updatePrivacySetting,
    resetToDefault
  }
}

