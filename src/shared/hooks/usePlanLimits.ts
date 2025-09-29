import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { PlanLimits, LimitCheckResult, PlanFeatureAccess, ResourceUsage } from '@/types/common.types'

interface PlanLimitsState {
  plan: string
  limits: PlanLimits
  usage: ResourceUsage
  isLoading: boolean
  error: string | null
}

interface FeatureAccess {
  analytics: PlanFeatureAccess
  themeEditing: PlanFeatureAccess
  prioritySupport: PlanFeatureAccess
  webhooks: PlanFeatureAccess
}

interface LinkLimits {
  current: number
  limit: number
  isUnlimited: boolean
  allowed: boolean
  upgradeRequired: boolean
}

interface FormLimits {
  current: number
  limit: number
  isUnlimited: boolean
  allowed: boolean
  upgradeRequired: boolean
}

export function usePlanLimits() {
  const { data: session, status } = useSession()
  
  console.log('🔍 usePlanLimits - status da sessão:', status)
  console.log('🔍 usePlanLimits - dados da sessão:', session)
  const [state, setState] = useState<PlanLimitsState>({
    plan: 'free',
    limits: {
      maxLinks: 5,
      maxForms: 0,
      maxWebhooks: 0,
      themeEditing: true,
      analytics: false,
      prioritySupport: false
    },
    usage: {
      links: 0,
      forms: 0,
      webhooks: 0
    },
    isLoading: true,
    error: null
  })

  const [featureAccess, setFeatureAccess] = useState<FeatureAccess>({
    analytics: { feature: 'analytics', allowed: false, upgradeRequired: true },
    themeEditing: { feature: 'themeEditing', allowed: true, upgradeRequired: false },
    prioritySupport: { feature: 'prioritySupport', allowed: false, upgradeRequired: true },
    webhooks: { feature: 'maxWebhooks', allowed: false, upgradeRequired: true }
  })

  const [linkLimits, setLinkLimits] = useState<LinkLimits>({
    current: 0,
    limit: 5,
    isUnlimited: false,
    allowed: true,
    upgradeRequired: false
  })

  const [formLimits, setFormLimits] = useState<FormLimits>({
    current: 0,
    limit: 0,
    isUnlimited: false,
    allowed: false,
    upgradeRequired: true
  })

  // Carregar dados do plano
  useEffect(() => {
    const loadPlanData = async () => {
      console.log('🔍 usePlanLimits - useEffect executando')
      console.log('🔍 usePlanLimits - status:', status)
      console.log('🔍 usePlanLimits - session:', session)
      console.log('🔍 usePlanLimits - session?.user?.id:', session?.user?.id)
      
      // Aguardar a sessão carregar completamente
      if (status === 'loading') {
        console.log('🔍 usePlanLimits - sessão ainda carregando, aguardando...')
        return
      }
      
      if (status === 'unauthenticated' || !session?.user?.id) {
        console.log('🔍 usePlanLimits - usuário não autenticado, parando')
        setState(prev => ({ ...prev, isLoading: false }))
        return
      }

      try {
        console.log('🔍 usePlanLimits - iniciando carregamento de dados')
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        // Buscar dados via API
        const response = await fetch('/api/user/plan-limits')
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erro ao buscar dados do plano')
        }

        console.log('🔍 usePlanLimits - dados recebidos da API:', data.data)

        // Atualizar estado com dados da API
        setState({
          plan: data.data.plan,
          limits: data.data.limits,
          usage: data.data.usage,
          isLoading: false,
          error: null
        })

        // Atualizar feature access
        setFeatureAccess(data.data.featureAccess)

        // Atualizar limites de links e formulários
        setLinkLimits(data.data.linkLimits)
        setFormLimits(data.data.formLimits)
        
        console.log('🔍 usePlanLimits - formLimits atualizado:', data.data.formLimits)

      } catch (error) {
        console.error('❌ usePlanLimits - Erro ao carregar dados do plano:', error)
        console.error('❌ usePlanLimits - Error details:', error)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar dados do plano'
        }))
      }
    }

    loadPlanData()
  }, [session?.user?.id, status])

  // Verificar se pode executar uma ação
  const canCreateLink = () => linkLimits.allowed
  const canCreateForm = () => {
    console.log('🔍 canCreateForm - formLimits.allowed:', formLimits.allowed)
    console.log('🔍 canCreateForm - formLimits:', formLimits)
    return formLimits.allowed
  }
  const canAccessAnalytics = () => featureAccess.analytics.allowed
  const canEditTheme = () => featureAccess.themeEditing.allowed
  const canUseWebhooks = () => featureAccess.webhooks.allowed
  const hasPrioritySupport = () => featureAccess.prioritySupport.allowed

  // Verificar limite específico
  const checkLimit = async (resource: 'links' | 'forms' | 'webhooks') => {
    if (!session?.user?.id) return { allowed: false, upgradeRequired: true }

    switch (resource) {
      case 'links':
        return await PlanLimitsService.checkLinkLimit(session.user.id)
      case 'forms':
        return await PlanLimitsService.checkFormLimit(session.user.id)
      case 'webhooks':
        return await PlanLimitsService.checkWebhookLimit(session.user.id)
      default:
        return { allowed: false, upgradeRequired: true }
    }
  }

  // Recarregar dados (útil após upgrade)
  const refresh = async () => {
    if (session?.user?.id) {
      const loadPlanData = async () => {
        try {
          const [plan, limits, usage] = await Promise.all([
            PlanLimitsService.getUserPlan(session.user.id),
            PlanLimitsService.getPlanLimits(await PlanLimitsService.getUserPlan(session.user.id)),
            PlanLimitsService.getCurrentUsage(session.user.id)
          ])

          setState({
            plan,
            limits,
            usage,
            isLoading: false,
            error: null
          })
        } catch (error) {
          console.error('Erro ao recarregar dados do plano:', error)
        }
      }
      await loadPlanData()
    }
  }

  return {
    // Estado do plano
    plan: state.plan,
    limits: state.limits,
    usage: state.usage,
    isLoading: state.isLoading,
    error: state.error,

    // Acesso às features
    featureAccess,
    canAccessAnalytics,
    canEditTheme,
    canUseWebhooks,
    hasPrioritySupport,

    // Limites específicos
    linkLimits,
    formLimits,
    canCreateLink,
    canCreateForm,

    // Utilitários
    checkLimit,
    refresh
  }
}
