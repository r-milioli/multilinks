import { prisma } from '@/lib/db'
import { PLAN_LIMITS, UPGRADE_MESSAGES, isUnlimited } from '@/shared/utils/planLimits'
import type { 
  PlanLimits, 
  LimitCheckResult, 
  PlanFeatureAccess,
  ResourceUsage 
} from '@/types/common.types'

export class PlanLimitsService {
  /**
   * Busca o plano atual do usuário
   */
  static async getUserPlan(userId: string): Promise<string> {
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
      select: { subscriptionPlan: true }
    })
    
    return userStats?.subscriptionPlan || 'free'
  }

  /**
   * Busca os limites configurados para um plano
   */
  static async getPlanLimits(plan: string): Promise<PlanLimits> {
    try {
      // Buscar limites do banco
      const settings = await prisma.systemSettings.findUnique({
        where: { key: 'plan_limits' }
      })

      if (settings?.value) {
        const limits = settings.value as Record<string, PlanLimits>
        if (limits[plan]) {
          return limits[plan]
        }
      }

      // Fallback para limites padrão
      return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
    } catch (error) {
      console.error('Erro ao buscar limites do plano:', error)
      return PLAN_LIMITS.free
    }
  }

  /**
   * Verifica o limite de links do usuário
   */
  static async checkLinkLimit(userId: string): Promise<LimitCheckResult> {
    const plan = await this.getUserPlan(userId)
    const limits = await this.getPlanLimits(plan)
    
    // Se for ilimitado, retorna permitido
    if (isUnlimited(limits.maxLinks)) {
      return {
        allowed: true,
        current: 0,
        limit: -1
      }
    }

    // Contar links do usuário
    const currentCount = await prisma.link.count({
      where: { userId }
    })

    const allowed = currentCount < limits.maxLinks
    
    return {
      allowed,
      current: currentCount,
      limit: limits.maxLinks,
      upgradeRequired: !allowed,
      message: !allowed ? UPGRADE_MESSAGES.links[plan as keyof typeof UPGRADE_MESSAGES.links] : undefined
    }
  }

  /**
   * Verifica o limite de formulários do usuário
   */
  static async checkFormLimit(userId: string): Promise<LimitCheckResult> {
    const plan = await this.getUserPlan(userId)
    const limits = await this.getPlanLimits(plan)
    
    if (isUnlimited(limits.maxForms)) {
      return {
        allowed: true,
        current: 0,
        limit: -1
      }
    }

    const currentCount = await prisma.form.count({
      where: { userId }
    })

    const allowed = currentCount < limits.maxForms
    
    return {
      allowed,
      current: currentCount,
      limit: limits.maxForms,
      upgradeRequired: !allowed,
      message: !allowed ? UPGRADE_MESSAGES.forms[plan as keyof typeof UPGRADE_MESSAGES.forms] : undefined
    }
  }

  /**
   * Verifica o limite de webhooks do usuário
   */
  static async checkWebhookLimit(userId: string): Promise<LimitCheckResult> {
    const plan = await this.getUserPlan(userId)
    const limits = await this.getPlanLimits(plan)
    
    if (isUnlimited(limits.maxWebhooks)) {
      return {
        allowed: true,
        current: 0,
        limit: -1
      }
    }

    // Buscar configurações de integração do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { integrationSettings: true }
    })

    const integrationSettings = user?.integrationSettings as any
    const currentCount = integrationSettings?.webhookUrl ? 1 : 0

    const allowed = currentCount < limits.maxWebhooks
    
    return {
      allowed,
      current: currentCount,
      limit: limits.maxWebhooks,
      upgradeRequired: !allowed,
      message: !allowed ? UPGRADE_MESSAGES.webhooks[plan as keyof typeof UPGRADE_MESSAGES.webhooks] : undefined
    }
  }

  /**
   * Verifica acesso a uma feature específica
   */
  static async checkFeatureAccess(
    userId: string, 
    feature: keyof PlanLimits
  ): Promise<PlanFeatureAccess> {
    const plan = await this.getUserPlan(userId)
    const limits = await this.getPlanLimits(plan)
    
    const allowed = limits[feature] === true

    return {
      feature,
      allowed,
      upgradeRequired: !allowed,
      message: !allowed && feature === 'analytics' 
        ? UPGRADE_MESSAGES.analytics.free 
        : undefined
    }
  }

  /**
   * Busca o uso atual de recursos do usuário
   */
  static async getCurrentUsage(userId: string): Promise<ResourceUsage> {
    const [links, forms, user] = await Promise.all([
      prisma.link.count({ where: { userId } }),
      prisma.form.count({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { integrationSettings: true }
      })
    ])

    const integrationSettings = user?.integrationSettings as any
    const webhooks = integrationSettings?.webhookUrl ? 1 : 0

    return {
      links,
      forms,
      webhooks
    }
  }
}
