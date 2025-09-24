export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  backgroundType: 'solid' | 'gradient' | 'image'
  backgroundImage?: string
  fontFamily: string
  buttonStyle: 'rounded' | 'sharp' | 'outlined' | 'filled'
  borderRadius: number
  // Cores individuais para textos
  nameColor?: string
  titleColor?: string
  bioColor?: string
  // Configurações de cores dos botões
  buttonColors?: {
    background: string
    text: string
    border: string
    hoverBackground: string
    hoverText: string
    hoverBorder: string
  }
  // Configurações dos botões de links
  linkButtonSettings?: {
    style: string
    size: string
    spacing: string
    alignment: string
    showIcons: boolean
    showDescriptions: boolean
    hoverEffect: string
    animationSpeed: number
  }
  // Configurações dos botões sociais
  socialButtonsSettings?: {
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
  // Configurações de imagens
  imageSettings?: {
    position: string
    size: string
    borderRadius: string
    spacing: string
  }
  // Configurações do avatar
  avatarSettings?: {
    size: string
    shape: string
    borderWidth: number
    borderColor: string
    shadow: string
    position: string
  }
  // Configurações de background
  backgroundSettings?: {
    position: string
    size: string
    repeat: string
    attachment: string
  }
  // Configurações do modal de formulário
  formModalSettings?: {
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
  showEmail: boolean
  showSocialLinks: boolean
  allowAnalytics: boolean
  isPublic: boolean
}

export interface NotificationSettings {
  emailNotifications: boolean
  weeklyReport: boolean
  newFollower: boolean
  linkClick: boolean
  profileView: boolean
  systemUpdates: boolean
  marketingEmails: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notificationFrequency: 'immediate' | 'daily' | 'weekly' | 'never'
}

export interface SocialPlatform {
  name: string
  icon: string
  placeholder: string
  color: string
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
}

export interface AnalyticsData {
  totalClicks: number
  totalViews: number
  clicksByLink: Array<{
    linkId: string
    title: string
    clicks: number
  }>
  clicksByCountry: Array<{
    country: string
    clicks: number
  }>
  clicksByDevice: Array<{
    device: string
    clicks: number
  }>
  dailyClicks: Array<{
    date: string
    clicks: number
  }>
}

export interface UploadResponse {
  url: string
  publicId: string
  width: number
  height: number
}

