import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'
import { Users, Zap, Crown, LinkIcon, Palette, BarChart3, FileText, Webhook, Shield } from 'lucide-react'

export interface PlanData {
  id: string
  name: string
  price: string
  period: string
  description: string
  icon?: any // LucideIcon
  color?: string
  features: string[]
  limitations: string[]
  popular: boolean
  cta: string
  href: string
}

export interface PricingData {
  plans: PlanData[]
  features: {
    category: string
    icon?: any // LucideIcon
    items: {
      name: string
      free: boolean
      pro: boolean
      business: boolean
    }[]
  }[]
}

export function usePricing() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carregar dados de preços
   */
  const loadPricingData = async () => {
    try {
      setIsLoading(true)
      
      // Usar URL absoluta em produção para evitar problemas de roteamento
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const apiUrl = `${baseUrl}/api/public/pricing`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setPricingData(data.data)
      } else {
        // Fallback para dados padrão se não conseguir carregar
        setPricingData({
          plans: [
            {
              id: 'free',
              name: 'Gratuito',
              price: 'R$ 0',
              period: '/mês',
              description: 'Perfeito para começar',
              features: [
                'Até 10 links',
                'Tema padrão',
                'Analytics básicos',
                '1 formulário',
                'Suporte por email',
                'Subdomínio multilink.com'
              ],
              limitations: [
                'Sem domínio personalizado',
                'Sem webhooks',
                'Sem integrações avançadas',
                'Analytics limitados'
              ],
              popular: false,
              cta: 'Começar grátis',
              href: '/register'
            },
            {
              id: 'pro',
              name: 'Pro',
              price: 'R$ 19',
              period: '/mês',
              description: 'Para profissionais',
              features: [
                'Links ilimitados',
                'Temas personalizados',
                'Analytics avançados',
                'Formulários ilimitados',
                'Webhooks básicos',
                'Domínio personalizado',
                'Suporte prioritário',
                'Exportação de dados'
              ],
              limitations: [
                'Webhooks limitados',
                'Sem integrações premium'
              ],
              popular: true,
              cta: 'Começar Pro',
              href: '/register?plan=pro'
            },
            {
              id: 'business',
              name: 'Business',
              price: 'R$ 49',
              period: '/mês',
              description: 'Para empresas',
              features: [
                'Tudo do Pro',
                'Webhooks ilimitados',
                'Integrações avançadas',
                'API completa',
                'Múltiplos usuários',
                'White-label',
                'Suporte 24/7',
                'SLA 99.9%',
                'Backup automático',
                'Análise de concorrência'
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
                { name: 'Categorização', free: false, pro: true, business: true },
                { name: 'Links programados', free: false, pro: false, business: true },
                { name: 'A/B testing', free: false, pro: false, business: true }
              ]
            },
            {
              category: 'Personalização',
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
              items: [
                { name: 'Email', free: true, pro: true, business: true },
                { name: 'Chat', free: false, pro: true, business: true },
                { name: 'Suporte prioritário', free: false, pro: true, business: true },
                { name: 'Suporte 24/7', free: false, pro: false, business: true },
                { name: 'Gerente de conta', free: false, pro: false, business: true }
              ]
            }
          ]
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados de preços:', error)
      // Fallback para dados padrão em caso de erro
      const fallbackData = {
        plans: [
          {
            id: 'free',
            name: 'Gratuito',
            price: 'R$ 0',
            period: '/mês',
            description: 'Perfeito para começar',
            icon: Users,
            color: 'from-gray-500 to-gray-600',
            features: [
              'Até 10 links',
              'Tema padrão',
              'Analytics básicos',
              '1 formulário',
              'Suporte por email',
              'Subdomínio multilink.com'
            ],
            limitations: [
              'Sem domínio personalizado',
              'Sem webhooks',
              'Sem integrações avançadas',
              'Analytics limitados'
            ],
            popular: false,
            cta: 'Começar grátis',
            href: '/register'
          },
          {
            id: 'pro',
            name: 'Pro',
            price: 'R$ 19',
            period: '/mês',
            description: 'Para profissionais',
            icon: Zap,
            color: 'from-orange-400 to-pink-500',
            features: [
              'Links ilimitados',
              'Temas personalizados',
              'Analytics avançados',
              'Formulários ilimitados',
              'Webhooks básicos',
              'Domínio personalizado',
              'Suporte prioritário',
              'Exportação de dados'
            ],
            limitations: [
              'Webhooks limitados',
              'Sem integrações premium'
            ],
            popular: true,
            cta: 'Começar Pro',
            href: '/register?plan=pro'
          },
          {
            id: 'business',
            name: 'Business',
            price: 'R$ 49',
            period: '/mês',
            description: 'Para empresas',
            icon: Crown,
            color: 'from-orange-400 to-pink-500',
            features: [
              'Tudo do Pro',
              'Webhooks ilimitados',
              'Integrações avançadas',
              'API completa',
              'Múltiplos usuários',
              'White-label',
              'Suporte 24/7',
              'SLA 99.9%',
              'Backup automático',
              'Análise de concorrência'
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
      setPricingData(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Carregar dados quando o hook for montado
   */
  useEffect(() => {
    // Só carregar no lado do cliente
    if (typeof window !== 'undefined') {
      loadPricingData()
    }
  }, [])

  return {
    pricingData,
    isLoading,
    loadPricingData
  }
}
