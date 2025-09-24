'use client'

import React from 'react'
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
  Database,
  MessageSquare,
  Heart
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
            {plans.map((plan, index) => (
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
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                    <plan.icon className="h-8 w-8 text-white" />
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
                          <category.icon className="h-5 w-5" />
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
      <footer className="mt-32 bg-black border-t border-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">MultiLink</span>
                  <p className="text-xs text-gray-400">Link in Bio</p>
                </div>
              </div>
              <p className="text-gray-400">
                A plataforma mais completa para gerenciar seus links e crescer online.
              </p>
              <div className="flex space-x-4">
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Preços</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} MultiLink. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">
              Feito com <Heart className="inline h-4 w-4 text-red-500" /> Por Robson Milioli
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}