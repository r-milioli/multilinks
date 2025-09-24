'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, LinkIcon, Heart } from 'lucide-react'
import { useState } from 'react'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      category: 'Geral',
      icon: '🤔',
      items: [
        {
          id: 'what-is-multilink',
          question: 'O que é o MultiLink?',
          answer: 'O MultiLink é uma plataforma completa para criar páginas de links personalizadas. Você pode organizar todos os seus links em um só lugar, capturar leads com formulários, acompanhar analytics detalhados e integrar com suas ferramentas favoritas via webhooks.'
        },
        {
          id: 'how-much-costs',
          question: 'Quanto custa usar o MultiLink?',
          answer: 'Oferecemos um plano gratuito com funcionalidades básicas e planos pagos com recursos avançados. Você pode começar gratuitamente e fazer upgrade conforme suas necessidades crescem.'
        },
        {
          id: 'who-can-use',
          question: 'Quem pode usar o MultiLink?',
          answer: 'Qualquer pessoa pode usar o MultiLink! É perfeito para influencers, empreendedores, profissionais, empresas, artistas, coaches, educadores e qualquer pessoa que queira organizar seus links online de forma profissional.'
        }
      ]
    },
    {
      category: 'Funcionalidades',
      icon: '⚡',
      items: [
        {
          id: 'custom-domains',
          question: 'Posso usar meu próprio domínio?',
          answer: 'Sim! Nos planos pagos, você pode conectar seu próprio domínio personalizado (ex: meusite.com) para ter uma página de links ainda mais profissional.'
        },
        {
          id: 'forms-leads',
          question: 'Como funcionam os formulários de captura de leads?',
          answer: 'Você pode criar formulários personalizáveis com campos como nome, email, telefone e WhatsApp. Os leads são capturados automaticamente e você pode exportar os dados em CSV ou receber notificações via webhook.'
        },
        {
          id: 'analytics-detailed',
          question: 'Que tipo de analytics vocês oferecem?',
          answer: 'Nossos analytics incluem cliques em tempo real, geolocalização dos visitantes, dispositivos utilizados, horários de maior tráfego, links mais clicados e muito mais. Tudo em tempo real e exportável.'
        },
        {
          id: 'webhooks-integration',
          question: 'Como funcionam os webhooks?',
          answer: 'Os webhooks permitem integrar o MultiLink com suas ferramentas favoritas (CRM, email marketing, etc.). Recebemos eventos em tempo real como novos leads, cliques em links e visitas na página.'
        }
      ]
    },
    {
      category: 'Configuração',
      icon: '⚙️',
      items: [
        {
          id: 'how-to-start',
          question: 'Como começar a usar o MultiLink?',
          answer: 'É simples! Crie sua conta gratuita, personalize seu perfil, adicione seus links e publique sua página. Você pode começar em menos de 5 minutos.'
        },
        {
          id: 'customize-appearance',
          question: 'Posso personalizar a aparência da minha página?',
          answer: 'Sim! Oferecemos vários temas, cores personalizáveis, fontes, backgrounds com gradientes ou imagens, e layouts responsivos que se adaptam a qualquer dispositivo.'
        },
        {
          id: 'social-media-integration',
          question: 'Posso adicionar links para redes sociais?',
          answer: 'Claro! Você pode adicionar links para Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, WhatsApp, Telegram e qualquer outra plataforma que desejar.'
        },
        {
          id: 'mobile-responsive',
          question: 'Minha página funciona bem no celular?',
          answer: 'Sim! Todas as páginas do MultiLink são totalmente responsivas e otimizadas para dispositivos móveis. Seus visitantes terão uma experiência perfeita em qualquer dispositivo.'
        }
      ]
    },
    {
      category: 'Suporte',
      icon: '🆘',
      items: [
        {
          id: 'getting-help',
          question: 'Como posso obter ajuda?',
          answer: 'Oferecemos suporte por email, chat online e uma base de conhecimento completa. Nossa equipe responde rapidamente e está sempre pronta para ajudar.'
        },
        {
          id: 'data-export',
          question: 'Posso exportar meus dados?',
          answer: 'Sim! Você pode exportar todos os seus dados a qualquer momento, incluindo links, leads capturados, analytics e configurações. Respeitamos sua propriedade sobre seus dados.'
        },
        {
          id: 'account-deletion',
          question: 'Como excluir minha conta?',
          answer: 'Você pode excluir sua conta a qualquer momento nas configurações. Todos os seus dados serão removidos permanentemente em até 30 dias, conforme nossa política de privacidade.'
        },
        {
          id: 'lgpd-compliance',
          question: 'Vocês são compatíveis com a LGPD?',
          answer: 'Sim! Estamos totalmente em conformidade com a Lei Geral de Proteção de Dados (LGPD) brasileira. Seus dados são tratados com máxima segurança e transparência.'
        }
      ]
    }
  ]

  const filteredFAQ = faqData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Encontre respostas para as dúvidas mais comuns sobre o MultiLink
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <span className="text-3xl">{category.icon}</span>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.items.map((item) => {
                    const isOpen = openItems.has(item.id)
                    return (
                      <div key={item.id} className="border border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors rounded-lg"
                        >
                          <span className="font-semibold text-white">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No results */}
          {filteredFAQ.length === 0 && searchTerm && (
            <Card className="border border-gray-700 backdrop-blur-sm bg-black">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-300 mb-6">
                  Não encontramos perguntas relacionadas a "{searchTerm}". 
                  Tente usar termos diferentes ou entre em contato conosco.
                </p>
                <Button asChild className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                  <Link href="/contact">
                    Entrar em contato
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact CTA */}
          <Card className="mt-12 border border-gray-700 backdrop-blur-sm bg-gradient-to-r from-orange-400 to-pink-500">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ainda tem dúvidas?
              </h3>
              <p className="text-lg mb-6 text-gray-100">
                Nossa equipe está pronta para ajudar você a aproveitar ao máximo o MultiLink
              </p>
              <div className="flex justify-center">
                <Button asChild variant="outline" className="border-white text-black hover:bg-white hover:text-black">
                  <Link href="/contact">
                    Entrar em contato
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