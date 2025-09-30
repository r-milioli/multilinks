'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Footer } from '@/shared/components/layout/Footer'
import { useContact } from '@/shared/hooks/useContact'
import { usePricing } from '@/shared/hooks/usePricing'
import { 
  ArrowLeft, 
  DollarSign, 
  Check, 
  X, 
  Star,
  Zap,
  Crown,
  Sparkles,
  Users,
  Link as LinkIcon,
  BarChart3,
  FileText,
  Webhook,
  Shield,
  Clock,
  Globe,
  Palette,
  Database,
  MessageSquare
} from 'lucide-react'

export default function PricingPage() {
  const { contactData, isLoading: contactLoading } = useContact()
  const { pricingData, isLoading: pricingLoading } = usePricing()
  
  // Dados estáticos para fallback
  const staticPlans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      priceValue: 0,
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
      cta: 'Começar grátis',
      href: '/register',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 25',
      priceValue: 25,
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
      cta: 'Começar Pro',
      href: '/register?plan=pro',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 'R$ 40',
      priceValue: 40,
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
      cta: 'Começar Business',
      href: '/register?plan=business',
      popular: false
    }
  ]

  // Usar dados dinâmicos ou fallback
  const plans = pricingData?.plans || staticPlans
  const features = pricingData?.features || [
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent truncate block">
                MultiLink
              </span>
              <p className="text-xs text-gray-400 hidden sm:block">Link in Bio</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 sm:px-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
                <span className="sm:hidden">Voltar</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Escolha seu plano
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comece gratuitamente e faça upgrade conforme suas necessidades crescem. 
              Todos os planos incluem as funcionalidades essenciais.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
              <button className="px-4 py-2 rounded-md bg-gray-700 shadow-sm text-sm font-medium text-white">
                Mensal
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-400">
                Anual <Badge className="ml-2 bg-green-500 text-white">-20%</Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border border-gray-700 backdrop-blur-sm bg-black">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-2xl animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse mb-4"></div>
                    <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
                        </div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'ring-2 ring-orange-400' 
                    : 'bg-black'
                }`}
                style={plan.popular ? { backgroundColor: '#10151C' } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color || 'from-orange-400 to-pink-500'} rounded-2xl flex items-center justify-center`}>
                    {(() => {
                      switch(plan.id) {
                        case 'free':
                          return <Users className="h-8 w-8 text-white" />;
                        case 'pro':
                          return <Zap className="h-8 w-8 text-white" />;
                        case 'business':
                          return <Crown className="h-8 w-8 text-white" />;
                        default:
                          return <DollarSign className="h-8 w-8 text-white" />;
                      }
                    })()}
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-700">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center gap-3">
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.id === 'free' ? '/register' : `/checkout?plan=${plan.id}&price=${(plan as any).priceValue || 0}`} onClick={() => console.log(`🔗 Link clicado - Plano: ${plan.id}, Preço: ${(plan as any).priceValue || 0}`)}>
                      {plan.cta}
                      {plan.popular && <Sparkles className="h-4 w-4 ml-2" />}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Comparação detalhada de funcionalidades
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-black border border-gray-700 backdrop-blur-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-6 font-semibold text-white">Funcionalidades</th>
                    <th className="text-center p-6 font-semibold text-white">Gratuito</th>
                    <th className="text-center p-6 font-semibold text-white">Pro</th>
                    <th className="text-center p-6 font-semibold text-white">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-800/50">
                        <td colSpan={4} className="p-4 font-semibold text-white flex items-center gap-2">
                          {(() => {
                            switch(category.category) {
                              case 'Gestão de Links':
                                return <LinkIcon className="h-5 w-5" />;
                              case 'Personalização':
                                return <Palette className="h-5 w-5" />;
                              case 'Analytics':
                                return <BarChart3 className="h-5 w-5" />;
                              case 'Formulários':
                                return <FileText className="h-5 w-5" />;
                              case 'Integrações':
                                return <Webhook className="h-5 w-5" />;
                              case 'Suporte':
                                return <Shield className="h-5 w-5" />;
                              default:
                                return <Database className="h-5 w-5" />;
                            }
                          })()}
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-gray-700">
                          <td className="p-4 pl-8 text-gray-300">{item.name}</td>
                          <td className="text-center p-4">
                            {item.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-4">
                            {item.pro ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-4">
                            {item.business ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Perguntas frequentes sobre preços
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    Posso mudar de plano a qualquer momento?
                  </h3>
                  <p className="text-gray-300">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                    As alterações são aplicadas imediatamente.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    Há período de teste gratuito?
                  </h3>
                  <p className="text-gray-300">
                    Sim! Todos os planos pagos incluem 14 dias de teste gratuito. 
                    Você pode cancelar a qualquer momento sem custos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    O que acontece se eu exceder os limites?
                  </h3>
                  <p className="text-gray-300">
                    Você será notificado e poderá fazer upgrade do plano ou remover conteúdo 
                    para ficar dentro dos limites do plano atual.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">
                    Posso cancelar a qualquer momento?
                  </h3>
                  <p className="text-gray-300">
                    Sim! Você pode cancelar sua assinatura a qualquer momento. 
                    Seus dados serão mantidos por 30 dias após o cancelamento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="border border-gray-700 backdrop-blur-sm bg-gradient-to-r from-orange-400 to-pink-500">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Pronto para começar?
              </h2>
              <p className="text-xl mb-8 text-gray-100">
                Junte-se a mais de 10.000 profissionais que já usam o MultiLink
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-black">
                  <Link href="/contact">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Falar com vendas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}