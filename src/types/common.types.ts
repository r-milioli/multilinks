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

