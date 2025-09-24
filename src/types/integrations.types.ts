export interface IntegrationSettings {
  googleAnalytics?: string
  facebookPixel?: string
  webhookUrl?: string
  customScripts?: string
}

export interface IntegrationSettingsResponse {
  success: boolean
  data?: IntegrationSettings
  error?: string
}
