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

/**
 * Tipos para configurações de tema
 */
export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  backgroundType: 'solid' | 'gradient' | 'image'
  backgroundImage?: string
  fontFamily: string
  buttonStyle: string
  borderRadius: number
  nameColor: string
  titleColor: string
  bioColor: string
  buttonColors: {
    background: string
    text: string
    border: string
    hoverBackground: string
    hoverText: string
    hoverBorder: string
  }
  linkButtonSettings: {
    style: string
    size: string
    spacing: string
    alignment: string
    showIcons: boolean
    showDescriptions: boolean
    hoverEffect: string
    animationSpeed: number
  }
  socialButtonsSettings: {
    style: string
    size: string
    shape: string
    spacing: string
    alignment: string
    showLabels: boolean
    hoverEffect: string
    animationSpeed: number
    backgroundColor: string
    iconColor: string
    borderColor: string
    hoverBackgroundColor: string
    hoverIconColor: string
  }
  imageSettings: {
    position: string
    size: string
    borderRadius: string
    spacing: string
  }
  avatarSettings: {
    size: string
    shape: string
    borderWidth: number
    borderColor: string
    shadow: string
    position: string
  }
  backgroundSettings: {
    position: string
    size: string
    repeat: string
    attachment: string
  }
  formModalSettings: {
    backgroundColor: string
    textColor: string
    borderColor: string
    borderRadius: number
    shadow: string
    backdropBlur: boolean
    inputBackgroundColor: string
    inputBorderColor: string
    inputTextColor: string
    inputFocusBorderColor: string
    buttonBackgroundColor: string
    buttonTextColor: string
    buttonHoverBackgroundColor: string
    buttonHoverTextColor: string
    titleColor: string
    descriptionColor: string
    errorColor: string
    successColor: string
  }
}

export interface PrivacySettings {
  isPublic: boolean
  showEmail: boolean
  showSocialLinks: boolean
}