export interface IntegrationSettings {
  googleAnalytics?: string
  facebookPixel?: string
  webhookUrl?: string
  captchaKey?: string
}

export interface IntegrationSettingsResponse {
  success: boolean
  data?: IntegrationSettings
  error?: string
}
