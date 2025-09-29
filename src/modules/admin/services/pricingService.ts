import { prisma } from '@/lib/db'
import { SystemSettingsService } from './systemSettingsService'
import { formatLimit } from '@/shared/utils/planLimits'
import { Users, Zap, Crown, Link as LinkIcon, Palette, BarChart3, FileText, Webhook, Shield } from 'lucide-react'

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
        icon: LinkIcon,
        items: [
          { name: 'Links ilimitados', free: true, pro: true, business: true },
          { name: 'Drag & drop', free: true, pro: true, business: true },
          { name: 'Categorização', free: false, pro: true, business: true },
          { name: 'Links programados', free: false, pro: false, business: true },
          { name: 'A/B testing', free: false, pro: false, business: true }
        ]
      },
      {
        category: 'Personalização',
        icon: Palette,
        items: [
          { name: 'Temas básicos', free: true, pro: true, business: true },
          { name: 'Temas premium', free: false, pro: true, business: true },
          { name: 'Editor visual', free: false, pro: true, business: true },
          { name: 'CSS customizado', free: false, pro: false, business: true },
          { name: 'Branding personalizado', free: false, pro: false, business: true }
        ]
      },
      {
        category: 'Analytics',
        icon: BarChart3,
        items: [
          { name: 'Cliques básicos', free: true, pro: true, business: true },
          { name: 'Geolocalização', free: false, pro: true, business: true },
          { name: 'Dispositivos', free: false, pro: true, business: true },
          { name: 'Relatórios avançados', free: false, pro: true, business: true },
          { name: 'API de analytics', free: false, pro: false, business: true }
        ]
      },
      {
        category: 'Formulários',
        icon: FileText,
        items: [
          { name: '1 formulário', free: true, pro: false, business: false },
          { name: 'Formulários ilimitados', free: false, pro: true, business: true },
          { name: 'Campos personalizados', free: false, pro: true, business: true },
          { name: 'Validação avançada', free: false, pro: false, business: true },
          { name: 'Automações', free: false, pro: false, business: true }
        ]
      },
      {
        category: 'Integrações',
        icon: Webhook,
        items: [
          { name: 'Webhooks básicos', free: false, pro: true, business: true },
          { name: 'Webhooks ilimitados', free: false, pro: false, business: true },
          { name: 'API completa', free: false, pro: false, business: true },
          { name: 'Integrações nativas', free: false, pro: false, business: true },
          { name: 'Webhooks customizados', free: false, pro: false, business: true }
        ]
      },
      {
        category: 'Suporte',
        icon: Shield,
        items: [
          { name: 'Email', free: true, pro: true, business: true },
          { name: 'Chat', free: false, pro: true, business: true },
          { name: 'Suporte prioritário', free: false, pro: true, business: true },
          { name: 'Suporte 24/7', free: false, pro: false, business: true },
          { name: 'Gerente de conta', free: false, pro: false, business: true }
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

    // Se tiver features e limitations no banco, usar elas
    if (limits.features && limits.limitations) {
      return {
        ...baseData,
        features: limits.features,
        limitations: limits.limitations
      }
    }

    // Caso contrário, usar os limites padrão
    const features = []
    const limitations = []

    // Links
    if (limits.maxLinks === -1) {
      features.push('Links ilimitados')
    } else if (limits.maxLinks > 0) {
      features.push(`Até ${limits.maxLinks} links`)
    } else {
      features.push('Até 5 links')
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
  /**
   * Salva todas as configurações de preços
   */
  static async savePricingData(data: {
    plans: Array<{
      name: string
      price: number
      description: string
    }>,
    limits: {
      [key: string]: {
        features: string[]
        limitations: string[]
      }
    },
    features: PlanFeatureCategory[]
  }) {
    try {
      console.log('🔄 PricingService - Salvando dados no banco...')

      // Salvar informações básicas dos planos
      await SystemSettingsService.upsertSetting({
        key: 'plans',
        value: data.plans,
        description: 'Informações básicas dos planos',
        category: 'pricing',
        isPublic: true
      })

      // Salvar limites e features de cada plano
      await SystemSettingsService.upsertSetting({
        key: 'plan_limits',
        value: data.limits,
        description: 'Features e limitações de cada plano',
        category: 'pricing',
        isPublic: true
      })

      // Salvar tabela de comparação
      await SystemSettingsService.upsertSetting({
        key: 'plan_features',
        value: data.features,
        description: 'Tabela de comparação de funcionalidades',
        category: 'pricing',
        isPublic: true
      })

      return { success: true }
    } catch (error) {
      console.error('❌ PricingService - Erro ao salvar dados:', error)
      return { success: false, error: 'Erro ao salvar dados' }
    }
  }

  static async getPricingData(): Promise<PricingData> {
    try {
      console.log('🔄 PricingService - Buscando dados do banco...')

      // Buscar todas as configurações
      const [plansResult, limitsResult, featuresResult] = await Promise.all([
        SystemSettingsService.getSetting('plans'),
        SystemSettingsService.getSetting('plan_limits'),
        SystemSettingsService.getSetting('plan_features')
      ])

      console.log('📦 PricingService - Resultados das consultas:', {
        plans: { success: plansResult.success, hasData: !!plansResult?.data?.value, data: plansResult?.data?.value },
        limits: { success: limitsResult.success, hasData: !!limitsResult?.data?.value, data: limitsResult?.data?.value },
        features: { success: featuresResult.success, hasData: !!featuresResult?.data?.value, data: featuresResult?.data?.value }
      })

      // Verificar cada conjunto de dados
      const dbPlans = plansResult.success && plansResult.data?.value ? plansResult.data.value : []
      const dbLimits = limitsResult.success && limitsResult.data?.value ? limitsResult.data.value : {}
      const dbFeatures = featuresResult.success && featuresResult.data?.value ? featuresResult.data.value : []

      // Se não tiver NENHUM dado no banco, usar fallback completo
      if (dbPlans.length === 0 && Object.keys(dbLimits).length === 0 && dbFeatures.length === 0) {
        console.log('⚠️ PricingService - Nenhum dado encontrado no banco, usando fallback completo')
        console.log('📊 PricingService - Contadores:', {
          dbPlansLength: dbPlans.length,
          dbLimitsKeys: Object.keys(dbLimits).length,
          dbFeaturesLength: dbFeatures.length
        })
        return this.defaultPricing
      }

      console.log('✅ PricingService - Dados encontrados no banco, processando...')

      // Usar dados do banco ou fallback para cada parte
      const features = dbFeatures.length > 0 ? dbFeatures : this.defaultPricing.features

      // Construir os planos combinando dados básicos com limites
      const plans = (dbPlans.length > 0 ? dbPlans : this.defaultPricing.plans).map(plan => {
        const planId = plan.name.toLowerCase()
        const planLimits = dbLimits[planId] || {}

        // Formatar os limites do plano
        const formattedPlan = this.formatPlanLimits(planId, {
          ...planLimits,
          price: plan.price
        })

        return {
          ...formattedPlan,
          name: plan.name,
          description: plan.description || formattedPlan.description,
          price: planId === 'free' ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`
        }
      })

      return { 
        plans, 
        features: dbFeatures 
      }
    } catch (error) {
      console.error('Erro ao buscar dados de preços:', error)
      return this.defaultPricing
    }
  }
}