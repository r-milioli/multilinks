'use client'

import { ReactNode } from 'react'
import { usePlanLimits } from '@/shared/hooks/usePlanLimits'
import { UpgradeNotification } from './UpgradeNotification'

interface FeatureGuardProps {
  feature: 'analytics' | 'themeEditing' | 'webhooks' | 'prioritySupport'
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
}

export function FeatureGuard({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: FeatureGuardProps) {
  const { 
    plan, 
    featureAccess, 
    canAccessAnalytics, 
    canEditTheme, 
    canUseWebhooks, 
    hasPrioritySupport,
    isLoading 
  } = usePlanLimits()

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    )
  }

  // Verificar se tem acesso à feature
  let hasAccess = false
  let featureInfo = null

  switch (feature) {
    case 'analytics':
      hasAccess = canAccessAnalytics()
      featureInfo = featureAccess.analytics
      break
    case 'themeEditing':
      hasAccess = canEditTheme()
      featureInfo = featureAccess.themeEditing
      break
    case 'webhooks':
      hasAccess = canUseWebhooks()
      featureInfo = featureAccess.webhooks
      break
    case 'prioritySupport':
      hasAccess = hasPrioritySupport()
      featureInfo = featureAccess.prioritySupport
      break
  }

  // Se tem acesso, mostrar o conteúdo
  if (hasAccess) {
    return <>{children}</>
  }

  // Se não tem acesso, mostrar fallback ou notificação de upgrade
  if (fallback) {
    return <>{fallback}</>
  }

  if (showUpgrade) {
    return (
      <UpgradeNotification
        feature={feature}
        currentPlan={plan}
        featureInfo={featureInfo}
      />
    )
  }

  // Fallback padrão se não especificado
  return (
    <div className="text-center p-8">
      <div className="text-gray-500">
        <h3 className="text-lg font-medium mb-2">
          {getFeatureTitle(feature)} não disponível
        </h3>
        <p className="text-sm">
          Esta funcionalidade não está incluída no seu plano atual.
        </p>
      </div>
    </div>
  )
}

function getFeatureTitle(feature: string): string {
  switch (feature) {
    case 'analytics':
      return 'Analytics'
    case 'themeEditing':
      return 'Editor de Tema'
    case 'webhooks':
      return 'Webhooks'
    case 'prioritySupport':
      return 'Suporte Prioritário'
    default:
      return 'Funcionalidade'
  }
}
