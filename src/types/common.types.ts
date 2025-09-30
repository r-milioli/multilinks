/**
 * Tipos relacionados aos planos e limites
 */

export interface PlanLimits {
  maxLinks: number
  maxForms: number
  maxWebhooks: number
  themeEditing: boolean
  analytics: boolean
  prioritySupport: boolean
  price: number
  name?: string
}

export interface LimitCheckResult {
  allowed: boolean
  current: number
  limit: number
  upgradeRequired?: boolean
  message?: string
}

export interface PlanFeatureAccess {
  feature: string
  allowed: boolean
  upgradeRequired?: boolean
  message?: string
}

export interface PlanUpgradeInfo {
  currentPlan: string
  suggestedPlan: string
  reason: string
  benefits: string[]
  priceChange: {
    from: number
    to: number
    currency: string
  }
}

/**
 * Tipos para configuração de planos no admin
 */
export interface PlanConfigurationData {
  planId: string
  name: string
  limits: PlanLimits
  isActive: boolean
  updatedAt: string
  updatedBy: string
}

export interface PlanLimitUpdateRequest {
  planId: string
  limits: Partial<PlanLimits>
}

export interface PlanLimitUpdateResponse {
  success: boolean
  data?: PlanConfigurationData
  error?: string
}

/**
 * Tipos para verificação de limites
 */
export interface ResourceUsage {
  links: number
  forms: number
  webhooks: number
}

export interface PlanLimitVerification {
  allowed: boolean
  resource: keyof ResourceUsage
  current: number
  limit: number
  upgradeInfo?: PlanUpgradeInfo
}