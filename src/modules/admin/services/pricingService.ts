import { SystemSettingsService } from './systemSettingsService'
import { formatLimit } from '@/shared/utils/planLimits'

interface PlanData {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  limitations: string[]
  popular: boolean
  cta: string
  href: string
}

interface PlanFeature {
  name: string
  free: boolean
  pro: boolean
  business: boolean
}

interface PlanFeatureCategory {
  category: string
  items: PlanFeature[]
}

interface PricingData {
  plans: PlanData[]
  features: PlanFeatureCategory[]
}

export class PricingService {
  private static readonly PLAN_PRICES = {
    free: 0,
    pro: 19,
    business: 49
  }

  private static readonly defaultPricing: PricingData = {
    plans: [
      {
        id: 'free',
        name: 'Gratuito',
        price: 'Grátis',
        period: '/mês',
        description: 'Perfeito para começar',
        features: [
          'Até 5 links',
          'Tema padrão',
          'Analytics básicos',
          'Suporte por email'
        ],
        limitations: [
          'Sem formulários',
          'Sem webhooks',
          'Sem integrações avançadas'
        ],
        popular: false,
        cta: 'Começar grátis',
        href: '/register'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 'R$ 19,00',
        period: '/mês',
        description: 'Para profissionais',
        features: [
          'Até 15 links',
          'Até 5 formulários',
          'Temas personalizados',
          'Analytics avançados',
          'Suporte prioritário'
        ],
        limitations: [
          'Sem webhooks',
          'Sem integrações premium'
        ],
        popular: true,
        cta: 'Começar Pro',
        href: '/register?plan=pro'
      },
      {
        id: 'business',
        name: 'Business',
        price: 'R$ 49,00',
        period: '/mês',
        description: 'Para empresas',
        features: [
          'Links ilimitados',
          'Formulários ilimitados',
          '1 webhook',
          'Temas personalizados',
          'Analytics avançados',
          'Suporte prioritário'
        ],
        limitations: [],
        popular: false,
        cta: 'Começar Business',
        href: '/register?plan=business'
      }
    ],
    features: [
      {
        category: 'Gestão de Links',
        items: [
          { name: 'Links ilimitados', free: true, pro: true, business: true },
          { name: 'Drag & drop', free: true, pro: true, business: true },
          { name: 'Categorização', free: false, pro: true, business: true }
        ]
      },
      {
        category: 'Analytics',
        items: [
          { name: 'Cliques básicos', free: true, pro: true, business: true },
          { name: 'Geolocalização', free: false, pro: true, business: true },
          { name: 'Relatórios avançados', free: false, pro: true, business: true }
        ]
      }
    ]
  }

  /**
   * Formata preço para exibição
   */
  private static formatPrice(planId: string, price?: number): string {
    if (planId === 'free') return 'Grátis'
    
    const finalPrice = typeof price === 'number' ? price : this.PLAN_PRICES[planId as keyof typeof this.PLAN_PRICES]
    return `R$ ${finalPrice.toFixed(2).replace('.', ',')}`
  }

  /**
   * Formata os limites do plano para exibição
   */
  private static formatPlanLimits(planId: string, limits: any): PlanData {
    console.log(`Formatando plano ${planId}:`, limits) // Debug

    const baseData = {
      id: planId,
      name: planId.charAt(0).toUpperCase() + planId.slice(1),
      price: this.formatPrice(planId, limits.price),
      period: '/mês',
      description: planId === 'free' ? 'Perfeito para começar' : 
                  planId === 'pro' ? 'Para profissionais' : 
                  'Para empresas',
      popular: planId === 'pro',
      cta: `Começar ${planId === 'free' ? 'grátis' : planId.charAt(0).toUpperCase() + planId.slice(1)}`,
      href: `/register${planId !== 'free' ? `?plan=${planId}` : ''}`
    }

    const features = []
    const limitations = []

    // Links
    if (limits.maxLinks === -1) {
      features.push('Links ilimitados')
    } else {
      features.push(`Até ${limits.maxLinks} links`)
    }

    // Formulários
    if (limits.maxForms === -1) {
      features.push('Formulários ilimitados')
    } else if (limits.maxForms > 0) {
      features.push(`Até ${limits.maxForms} formulários`)
    } else {
      limitations.push('Sem formulários')
    }

    // Webhooks
    if (limits.maxWebhooks === -1) {
      features.push('Webhooks ilimitados')
    } else if (limits.maxWebhooks > 0) {
      features.push(`${limits.maxWebhooks} webhook${limits.maxWebhooks > 1 ? 's' : ''}`)
    } else {
      limitations.push('Sem webhooks')
    }

    // Tema
    if (limits.themeEditing) {
      features.push('Temas personalizados')
    } else {
      features.push('Tema padrão')
    }

    // Analytics
    if (limits.analytics) {
      features.push('Analytics avançados')
    } else {
      features.push('Analytics básicos')
    }

    // Suporte
    if (limits.prioritySupport) {
      features.push('Suporte prioritário')
    } else {
      features.push('Suporte por email')
    }

    // Adicionar limitações específicas
    if (planId === 'free') {
      limitations.push('Sem integrações avançadas')
    } else if (planId === 'pro') {
      limitations.push('Sem integrações premium')
    }

    return {
      ...baseData,
      features,
      limitations
    }
  }

  /**
   * Busca e formata os dados de preços
   */
  static async getPricingData(): Promise<PricingData> {
    try {
      const [limitsResult, featuresResult] = await Promise.all([
        SystemSettingsService.getSetting('plan_limits'),
        SystemSettingsService.getSetting('plan_features')
      ])

      let plans = this.defaultPricing.plans
      let features = this.defaultPricing.features

      // Formatar planos se existirem no banco
      if (limitsResult.success && limitsResult.data?.value) {
        const limits = limitsResult.data.value
        console.log('Limites do banco:', limits) // Debug
        plans = Object.keys(limits).map(planId => 
          this.formatPlanLimits(planId, limits[planId])
        )
      }

      // Usar recursos do banco se existirem
      if (featuresResult.success && featuresResult.data?.value) {
        features = featuresResult.data.value
      }

      console.log('Planos formatados:', plans) // Debug

      return { plans, features }
    } catch (error) {
      console.error('Erro ao buscar dados de preços:', error)
      return this.defaultPricing
    }
  }
}