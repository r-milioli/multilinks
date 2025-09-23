'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { NotificationSettings } from '@/types/common.types'
import { toast } from 'react-hot-toast'

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  weeklyReport: true,
  newFollower: true,
  linkClick: false,
  profileView: false,
  systemUpdates: true,
  marketingEmails: false,
  pushNotifications: true,
  smsNotifications: false,
  notificationFrequency: 'daily'
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      loadNotificationSettings()
    }
  }, [session?.user?.id])

  const loadNotificationSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/notifications')
      const data = await response.json()
      if (data.success && data.data) {
        // Mesclar dados do servidor com valores padrão para garantir que todos os campos existam
        const mergedSettings = {
          ...DEFAULT_NOTIFICATION_SETTINGS,
          ...data.data
        }
        setNotificationSettings(mergedSettings)
      } else {
        setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error)
      setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    setIsSaving(true)
    try {
      // Garantir que todos os campos obrigatórios estejam presentes
      const completeSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...newSettings
      }
      
      const response = await fetch('/api/user/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeSettings),
      })

      const result = await response.json()
      if (result.success) {
        setNotificationSettings(completeSettings)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de notificação:', error)
      return { success: false, error: 'Erro ao salvar configurações' }
    } finally {
      setIsSaving(false)
    }
  }

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = { ...notificationSettings, [key]: value }
    setNotificationSettings(newSettings)
  }

  const resetToDefault = async () => {
    return await saveNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS)
  }

  const toggleAllEmailNotifications = (enabled: boolean) => {
    const newSettings = {
      ...notificationSettings,
      emailNotifications: enabled,
      weeklyReport: enabled,
      newFollower: enabled,
      linkClick: enabled,
      profileView: enabled,
      systemUpdates: enabled,
      marketingEmails: enabled
    }
    setNotificationSettings(newSettings)
  }

  return {
    notificationSettings,
    isLoading,
    isSaving,
    saveNotificationSettings,
    updateNotificationSetting,
    resetToDefault,
    toggleAllEmailNotifications
  }
}

