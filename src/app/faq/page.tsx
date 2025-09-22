'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-white" />
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <span className="text-3xl">{category.icon}</span>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.items.map((item) => {
                    const isOpen = openItems.has(item.id)
                    return (
                      <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Não encontramos perguntas relacionadas a "{searchTerm}". 
                  Tente usar termos diferentes ou entre em contato conosco.
                </p>
                <Button asChild>
                  <Link href="/contact">
                    Entrar em contato
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact CTA */}
          <Card className="mt-12 border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Nossa equipe está pronta para ajudar você a aproveitar ao máximo o MultiLink
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/contact">
                    Entrar em contato
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/help">
                    Central de ajuda
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
