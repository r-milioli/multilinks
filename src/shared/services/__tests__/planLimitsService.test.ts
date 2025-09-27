import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { PlanLimitsService } from '../planLimitsService'
import { prisma } from '@/lib/db'
import { PLAN_LIMITS, UPGRADE_MESSAGES } from '@/shared/utils/planLimits'

// Mock do prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    userStats: {
      findUnique: jest.fn(),
    },
    link: {
      count: jest.fn(),
    },
    form: {
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    systemSettings: {
      findUnique: jest.fn(),
    },
  },
}))

describe('PlanLimitsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserPlan', () => {
    it('deve retornar o plano do usuário', async () => {
      const mockUserStats = {
        subscriptionPlan: 'pro'
      }

      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue(mockUserStats)

      const plan = await PlanLimitsService.getUserPlan('user-123')
      expect(plan).toBe('pro')
    })

    it('deve retornar "free" se não encontrar estatísticas', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue(null)

      const plan = await PlanLimitsService.getUserPlan('user-123')
      expect(plan).toBe('free')
    })
  })

  describe('getPlanLimits', () => {
    it('deve retornar limites do banco se existirem', async () => {
      const mockSettings = {
        value: {
          pro: {
            maxLinks: 20,
            maxForms: 10,
            maxWebhooks: 1,
            themeEditing: true,
            analytics: true,
            prioritySupport: true
          }
        }
      }

      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(mockSettings)

      const limits = await PlanLimitsService.getPlanLimits('pro')
      expect(limits).toEqual(mockSettings.value.pro)
    })

    it('deve retornar limites padrão se não encontrar no banco', async () => {
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const limits = await PlanLimitsService.getPlanLimits('pro')
      expect(limits).toEqual(PLAN_LIMITS.pro)
    })
  })

  describe('checkLinkLimit', () => {
    it('deve permitir criação quando abaixo do limite', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'pro'
      })
      ;(prisma.link.count as jest.Mock).mockResolvedValue(10)
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkLinkLimit('user-123')
      expect(result.allowed).toBe(true)
      expect(result.current).toBe(10)
      expect(result.limit).toBe(15) // limite do plano pro
    })

    it('deve bloquear criação quando limite atingido', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'free'
      })
      ;(prisma.link.count as jest.Mock).mockResolvedValue(5)
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkLinkLimit('user-123')
      expect(result.allowed).toBe(false)
      expect(result.current).toBe(5)
      expect(result.limit).toBe(5) // limite do plano free
      expect(result.upgradeRequired).toBe(true)
      expect(result.message).toBe(UPGRADE_MESSAGES.links.free)
    })

    it('deve permitir sempre se plano tem limite ilimitado', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'business'
      })
      ;(prisma.link.count as jest.Mock).mockResolvedValue(100)
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkLinkLimit('user-123')
      expect(result.allowed).toBe(true)
      expect(result.current).toBe(0)
      expect(result.limit).toBe(-1)
    })
  })

  describe('checkFormLimit', () => {
    it('deve permitir criação quando abaixo do limite', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'pro'
      })
      ;(prisma.form.count as jest.Mock).mockResolvedValue(3)
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkFormLimit('user-123')
      expect(result.allowed).toBe(true)
      expect(result.current).toBe(3)
      expect(result.limit).toBe(5) // limite do plano pro
    })

    it('deve bloquear criação quando limite atingido', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'free'
      })
      ;(prisma.form.count as jest.Mock).mockResolvedValue(0)
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkFormLimit('user-123')
      expect(result.allowed).toBe(false)
      expect(result.current).toBe(0)
      expect(result.limit).toBe(0) // limite do plano free
      expect(result.upgradeRequired).toBe(true)
      expect(result.message).toBe(UPGRADE_MESSAGES.forms.free)
    })
  })

  describe('checkWebhookLimit', () => {
    it('deve permitir configuração quando abaixo do limite', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'business'
      })
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        integrationSettings: { webhookUrl: null }
      })
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkWebhookLimit('user-123')
      expect(result.allowed).toBe(true)
      expect(result.current).toBe(0)
      expect(result.limit).toBe(1) // limite do plano business
    })

    it('deve bloquear configuração quando não disponível', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'free'
      })
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        integrationSettings: { webhookUrl: null }
      })
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkWebhookLimit('user-123')
      expect(result.allowed).toBe(false)
      expect(result.current).toBe(0)
      expect(result.limit).toBe(0) // limite do plano free
      expect(result.upgradeRequired).toBe(true)
      expect(result.message).toBe(UPGRADE_MESSAGES.webhooks.free)
    })
  })

  describe('checkFeatureAccess', () => {
    it('deve permitir acesso a feature disponível no plano', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'pro'
      })
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkFeatureAccess('user-123', 'analytics')
      expect(result.allowed).toBe(true)
      expect(result.feature).toBe('analytics')
    })

    it('deve bloquear acesso a feature não disponível', async () => {
      ;(prisma.userStats.findUnique as jest.Mock).mockResolvedValue({
        subscriptionPlan: 'free'
      })
      ;(prisma.systemSettings.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await PlanLimitsService.checkFeatureAccess('user-123', 'analytics')
      expect(result.allowed).toBe(false)
      expect(result.feature).toBe('analytics')
      expect(result.upgradeRequired).toBe(true)
      expect(result.message).toBe(UPGRADE_MESSAGES.analytics.free)
    })
  })
})
