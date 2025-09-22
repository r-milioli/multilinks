import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { IntegrationSettings } from '@/types/integrations.types'

const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  googleAnalytics: '',
  facebookPixel: '',
  webhookUrl: '',
  captchaKey: ''
}

export function useIntegrations() {
  const { data: session } = useSession()
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>(DEFAULT_INTEGRATION_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadIntegrationSettings = async () => {
    if (!session?.user?.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/integrations')
      const result = await response.json()
      
      if (result.success && result.data) {
        setIntegrationSettings(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de integração:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveIntegrationSettings = async (newSettings: IntegrationSettings) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      const result = await response.json()
      
      if (result.success) {
        setIntegrationSettings(newSettings)
        toast.success('Integrações salvas com sucesso!')
        return { success: true }
      } else {
        toast.error(result.error || 'Erro ao salvar integrações')
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de integração:', error)
      toast.error('Erro ao salvar configurações')
      return { success: false, error: 'Erro ao salvar configurações' }
    } finally {
      setIsSaving(false)
    }
  }

  const updateIntegrationSetting = (key: keyof IntegrationSettings, value: string) => {
    const newSettings = { ...integrationSettings, [key]: value }
    setIntegrationSettings(newSettings)
  }

  const resetToDefault = async () => {
    return await saveIntegrationSettings(DEFAULT_INTEGRATION_SETTINGS)
  }

  const testWebhook = async () => {
    if (!integrationSettings.webhookUrl) {
      toast.error('URL do webhook não configurada')
      return { success: false, error: 'URL do webhook não configurada' }
    }

    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: integrationSettings.webhookUrl,
          testData: {
            type: 'test',
            message: 'Teste de webhook do Multi-Link',
            timestamp: new Date().toISOString()
          }
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Webhook testado com sucesso!')
      } else {
        toast.error(result.error || 'Erro ao testar webhook')
      }
      
      return result
    } catch (error) {
      console.error('Erro ao testar webhook:', error)
      toast.error('Erro ao testar webhook')
      return { success: false, error: 'Erro ao testar webhook' }
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadIntegrationSettings()
    }
  }, [session?.user?.id])

  return {
    integrationSettings,
    isLoading,
    isSaving,
    saveIntegrationSettings,
    updateIntegrationSetting,
    resetToDefault,
    testWebhook
  }
}
