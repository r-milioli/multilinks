import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
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
  Github
} from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está aqui para você!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Send className="h-6 w-6 text-blue-500" />
                    Envie sua mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Qual o assunto da sua mensagem?"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <select
                        id="category"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      <Label htmlFor="message">Mensagem</Label>
                      <textarea
                        id="message"
                        rows={6}
                        placeholder="Descreva sua dúvida, sugestão ou problema..."
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
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
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">contato@multilink.com.br</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Telefone</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">+55 (11) 9999-9999</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Endereço</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        São Paulo, SP<br/>
                        Brasil
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Horário</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Seg-Sex: 9h às 18h<br/>
                        Sáb: 9h às 14h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Redes Sociais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a href="#" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </a>
                    <a href="#" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Instagram className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </a>
                    <a href="#" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </a>
                    <a href="#" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Github className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Links Úteis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/faq" className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Perguntas Frequentes
                  </Link>
                  <Link href="/help" className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Central de Ajuda
                  </Link>
                  <Link href="/status" className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Status do Sistema
                  </Link>
                  <Link href="/privacy" className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Política de Privacidade
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Response Time Info */}
          <Card className="mt-12 border-0 bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Tempo de Resposta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold">2h</div>
                  <div className="text-sm opacity-90">Suporte técnico</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4h</div>
                  <div className="text-sm opacity-90">Vendas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24h</div>
                  <div className="text-sm opacity-90">Outros assuntos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
