import { IntegrationSettings } from '@/types/integrations.types'

export interface WebhookEvent {
  type: 'lead_captured' | 'link_clicked' | 'page_visited' | 'daily_stats' | 'test'
  timestamp: string
  data: any
  userId: string
  userEmail?: string
}

export interface LeadCapturedData {
  leadId: string
  formId: string
  formTitle: string
  linkId?: string
  linkTitle?: string
  linkUrl?: string
  fields: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface LinkClickedData {
  linkId: string
  linkTitle: string
  linkUrl: string
  clickCount: number
  ipAddress?: string
  userAgent?: string
  country?: string
  device?: string
  clickedAt: string
}

export interface PageVisitedData {
  userId: string
  userEmail?: string
  pageUrl: string
  ipAddress?: string
  userAgent?: string
  country?: string
  device?: string
  visitedAt: string
}

export interface DailyStatsData {
  date: string
  totalClicks: number
  totalLeads: number
  totalVisits: number
  topLinks: Array<{
    id: string
    title: string
    clicks: number
  }>
  topCountries: Array<{
    country: string
    clicks: number
  }>
  deviceBreakdown: Array<{
    device: string
    clicks: number
    percentage: number
  }>
}

export class WebhookService {
  private static async sendWebhook(
    webhookUrl: string, 
    event: WebhookEvent,
    retryCount = 0
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Multi-Link-Webhook/1.0',
          'X-Webhook-Event': event.type,
          'X-Webhook-Timestamp': event.timestamp,
          'X-Webhook-User-ID': event.userId,
        },
        body: JSON.stringify(event),
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000)
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorText = await response.text()
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${errorText}` 
        }
      }
    } catch (error: any) {
      // Retry logic para falhas temporárias
      if (retryCount < 2 && this.isRetryableError(error)) {
        console.log(`🔄 Webhook retry ${retryCount + 1}/2 para ${webhookUrl}`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return this.sendWebhook(webhookUrl, event, retryCount + 1)
      }

      if (error.name === 'TimeoutError') {
        return { success: false, error: 'Timeout: Webhook não respondeu em 10 segundos' }
      } else if (error.code === 'ECONNREFUSED') {
        return { success: false, error: 'Conexão recusada: Servidor não está rodando' }
      } else {
        return { success: false, error: `Erro de conexão: ${error.message}` }
      }
    }
  }

  private static isRetryableError(error: any): boolean {
    return error.name === 'TimeoutError' || 
           error.code === 'ECONNREFUSED' ||
           error.code === 'ENOTFOUND' ||
           (error.message && error.message.includes('timeout'))
  }

  static async sendLeadCaptured(
    integrationSettings: IntegrationSettings,
    data: LeadCapturedData,
    userId: string,
    userEmail?: string
  ): Promise<void> {
    if (!integrationSettings.webhookUrl) return

    const event: WebhookEvent = {
      type: 'lead_captured',
      timestamp: new Date().toISOString(),
      data,
      userId,
      userEmail
    }

    const result = await this.sendWebhook(integrationSettings.webhookUrl, event)
    
    if (result.success) {
      console.log('✅ Webhook lead_captured enviado com sucesso')
    } else {
      console.error('❌ Erro ao enviar webhook lead_captured:', result.error)
    }
  }

  static async sendLinkClicked(
    integrationSettings: IntegrationSettings,
    data: LinkClickedData,
    userId: string,
    userEmail?: string
  ): Promise<void> {
    if (!integrationSettings.webhookUrl) return

    const event: WebhookEvent = {
      type: 'link_clicked',
      timestamp: new Date().toISOString(),
      data,
      userId,
      userEmail
    }

    const result = await this.sendWebhook(integrationSettings.webhookUrl, event)
    
    if (result.success) {
      console.log('✅ Webhook link_clicked enviado com sucesso')
    } else {
      console.error('❌ Erro ao enviar webhook link_clicked:', result.error)
    }
  }

  static async sendPageVisited(
    integrationSettings: IntegrationSettings,
    data: PageVisitedData,
    userId: string,
    userEmail?: string
  ): Promise<void> {
    if (!integrationSettings.webhookUrl) return

    const event: WebhookEvent = {
      type: 'page_visited',
      timestamp: new Date().toISOString(),
      data,
      userId,
      userEmail
    }

    const result = await this.sendWebhook(integrationSettings.webhookUrl, event)
    
    if (result.success) {
      console.log('✅ Webhook page_visited enviado com sucesso')
    } else {
      console.error('❌ Erro ao enviar webhook page_visited:', result.error)
    }
  }

  static async sendDailyStats(
    integrationSettings: IntegrationSettings,
    data: DailyStatsData,
    userId: string,
    userEmail?: string
  ): Promise<void> {
    if (!integrationSettings.webhookUrl) return

    const event: WebhookEvent = {
      type: 'daily_stats',
      timestamp: new Date().toISOString(),
      data,
      userId,
      userEmail
    }

    const result = await this.sendWebhook(integrationSettings.webhookUrl, event)
    
    if (result.success) {
      console.log('✅ Webhook daily_stats enviado com sucesso')
    } else {
      console.error('❌ Erro ao enviar webhook daily_stats:', result.error)
    }
  }

  static async sendTest(
    webhookUrl: string,
    userId: string,
    userEmail?: string
  ): Promise<{ success: boolean; error?: string }> {
    const event: WebhookEvent = {
      type: 'test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Teste de webhook do Multi-Link',
        version: '1.0',
        features: [
          'lead_captured',
          'link_clicked', 
          'page_visited',
          'daily_stats'
        ]
      },
      userId,
      userEmail
    }

    return await this.sendWebhook(webhookUrl, event)
  }
}
