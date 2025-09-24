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
  Github,
  LinkIcon,
  Heart
} from 'lucide-react'

export default function ContactPage() {
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
                      <div className="text-sm text-gray-300">contato@multilink.com.br</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Phone className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Telefone</div>
                      <div className="text-sm text-gray-300">+55 (11) 9999-9999</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <MapPin className="h-5 w-5 text-orange-400" />
                    <div>
                      <div className="font-medium text-white">Endereço</div>
                      <div className="text-sm text-gray-300">
                        São Paulo, SP<br/>
                        Brasil
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
                  <div className="flex space-x-4">
                    <a href="#" className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700">
                      <Twitter className="h-5 w-5 text-gray-300 hover:text-orange-400" />
                    </a>
                    <a href="#" className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700">
                      <Instagram className="h-5 w-5 text-gray-300 hover:text-orange-400" />
                    </a>
                    <a href="#" className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700">
                      <Linkedin className="h-5 w-5 text-gray-300 hover:text-orange-400" />
                    </a>
                    <a href="#" className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-700">
                      <Github className="h-5 w-5 text-gray-300 hover:text-orange-400" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border border-gray-700 backdrop-blur-sm bg-black">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Links Úteis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/faq" className="block text-orange-400 hover:text-orange-300">
                    Perguntas Frequentes
                  </Link>
                  <Link href="/help" className="block text-orange-400 hover:text-orange-300">
                    Central de Ajuda
                  </Link>
                  <Link href="/status" className="block text-orange-400 hover:text-orange-300">
                    Status do Sistema
                  </Link>
                  <Link href="/privacy" className="block text-orange-400 hover:text-orange-300">
                    Política de Privacidade
                  </Link>
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