import { NextRequest, NextResponse } from 'next/server'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

/**
 * GET /api/public/pricing
 * Endpoint público para buscar dados de preços
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar configurações do sistema
    const settingsResult = await SystemSettingsService.getFormattedSettings()

    if (!settingsResult.success) {
      throw new Error('Erro ao carregar configurações do sistema')
    }

    const settings = settingsResult.data
    // Extrair dados de preços das configurações
    const plansData = settings.plans || []

    // Converter dados do banco para formato da interface
    const plans = plansData.map((plan: any, index: number) => ({
      id: plan.id || `plan-${index}`,
      name: plan.name || 'Plano',
      price: typeof plan.price === 'number' ? `R$ ${plan.price}` : (plan.price || 'R$ 0'),
      period: '/mês',
      description: plan.description || '',
      features: plan.features || [],
      limitations: plan.limitations || [],
      popular: plan.popular || (index === 1), // Pro como popular por padrão
      cta: plan.cta || 'Começar',
      href: plan.href || (index === 0 ? '/register' : index === 1 ? '/register?plan=pro' : '/register?plan=business')
    }))

    // Dados de funcionalidades (pode vir do banco também)
    const features = [
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

    const pricingData = {
      plans,
      features
    }

    return NextResponse.json({
      success: true,
      data: pricingData
    })

  } catch (error) {
    console.error('❌ API Pricing - Erro ao buscar dados de preços:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
