'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Footer } from '@/shared/components/layout/Footer'
import { useContact } from '@/shared/hooks/useContact'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send,
  Clock,
  Users,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Facebook
} from 'lucide-react'

export default function ContactPage() {
  const { contactData, isLoading } = useContact()

  // Função para renderizar links sociais
  const renderSocialLinks = () => {
    if (isLoading || !contactData?.socialLinks) {
      // Loading state - mostrar ícones estáticos
      return (
        <div className="flex space-x-4">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <Twitter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <Instagram className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <Linkedin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <Github className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      )
    }

    const { socialLinks } = contactData
    const socialLinksArray = [
      { 
        name: 'Twitter', 
        url: socialLinks.twitter, 
        icon: Twitter 
      },
      { 
        name: 'Instagram', 
        url: socialLinks.instagram, 
        icon: Instagram 
      },
      { 
        name: 'LinkedIn', 
        url: socialLinks.linkedin, 
        icon: Linkedin 
      },
      { 
        name: 'Facebook', 
        url: socialLinks.facebook,
        icon: Facebook
      }
    ].filter(social => social.url && social.url.trim() !== '')

    return (
      <div className="flex space-x-4">
        {socialLinksArray.map((social, index) => {
          const IconComponent = social.icon
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700"
            >
              <IconComponent className="h-5 w-5 text-gray-300 hover:text-orange-400" />
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está aqui para você!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <Send className="h-6 w-6 text-orange-400" />
                    Envie sua mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Nome completo</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-300">Assunto</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Qual o assunto da sua mensagem?"
                        className="mt-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-gray-300">Categoria</Label>
                      <select
                        id="category"
                        className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-800 text-white"
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="support">Suporte técnico</option>
                        <option value="sales">Vendas</option>
                        <option value="partnership">Parceria</option>
                        <option value="feature">Sugestão de funcionalidade</option>
                        <option value="bug">Reportar bug</option>
                        <option value="billing">Cobrança</option>
                        <option value="other">Outros</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-300">Mensagem</Label>
                      <textarea
                        id="message"
                        rows={6}
                        placeholder="Descreva sua dúvida, sugestão ou problema..."
                        className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-800 text-white placeholder-gray-400 resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-orange-400" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Mail className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-sm text-gray-300">
                        {isLoading ? 'Carregando...' : (contactData?.contactInfo?.email || 'contato@multilink.com.br')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Phone className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Telefone</div>
                      <div className="text-sm text-gray-300">
                        {isLoading ? 'Carregando...' : (contactData?.contactInfo?.phone || '+55 (11) 9999-9999')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <MapPin className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Endereço</div>
                      <div className="text-sm text-gray-300">
                        {isLoading ? 'Carregando...' : (
                          contactData?.contactInfo?.address ? (
                            <span dangerouslySetInnerHTML={{ __html: contactData.contactInfo.address.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <>São Paulo, SP<br/>Brasil</>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Horário</div>
                      <div className="text-sm text-gray-300">
                        Seg-Sex: 9h às 18h<br/>
                        Sáb: 9h às 14h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5 text-orange-400" />
                    Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSocialLinks()}
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Response Time Info */}
          <Card className="mt-12 border border-gray-700 backdrop-blur-sm bg-gradient-to-r from-orange-400 to-pink-500">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Tempo de Resposta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white">2h</div>
                  <div className="text-sm text-gray-100">Suporte técnico</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">4h</div>
                  <div className="text-sm text-gray-100">Vendas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24h</div>
                  <div className="text-sm text-gray-100">Outros assuntos</div>
                </div>
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