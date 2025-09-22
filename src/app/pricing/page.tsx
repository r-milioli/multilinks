'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
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
  Database
} from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
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
      cta: 'Começar grátis',
      href: '/register',
      popular: false
    },
    {
      name: 'Pro',
      price: 'R$ 19',
      period: '/mês',
      description: 'Para profissionais',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
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
      name: 'Business',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para empresas',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
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

  const features = [
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MultiLink
              </span>
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Escolha seu plano
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Comece gratuitamente e faça upgrade conforme suas necessidades crescem. 
              Todos os planos incluem as funcionalidades essenciais.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button className="px-4 py-2 rounded-md bg-white dark:bg-gray-700 shadow-sm text-sm font-medium text-gray-900 dark:text-white">
                Mensal
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400">
                Anual <Badge className="ml-2 bg-green-500 text-white">-20%</Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 ring-2 ring-blue-500' 
                    : 'bg-white/80 dark:bg-gray-800/80'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center gap-3">
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                      {plan.popular && <Sparkles className="h-4 w-4 ml-2" />}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Comparação detalhada de funcionalidades
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">Funcionalidades</th>
                    <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">Gratuito</th>
                    <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">Pro</th>
                    <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td colSpan={4} className="p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <category.icon className="h-5 w-5" />
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="p-4 pl-8 text-gray-700 dark:text-gray-300">{item.name}</td>
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
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Perguntas frequentes sobre preços
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Posso mudar de plano a qualquer momento?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                    As alterações são aplicadas imediatamente.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Há período de teste gratuito?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sim! Todos os planos pagos incluem 14 dias de teste gratuito. 
                    Você pode cancelar a qualquer momento sem custos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    O que acontece se eu exceder os limites?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Você será notificado e poderá fazer upgrade do plano ou remover conteúdo 
                    para ficar dentro dos limites do plano atual.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Posso cancelar a qualquer momento?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sim! Você pode cancelar sua assinatura a qualquer momento. 
                    Seus dados serão mantidos por 30 dias após o cancelamento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Junte-se a mais de 10.000 profissionais que já usam o MultiLink
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/register">
                    <Users className="h-5 w-5 mr-2" />
                    Começar grátis
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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
    </div>
  )
}
