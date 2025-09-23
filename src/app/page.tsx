import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { 
  ArrowRight, 
  Link as LinkIcon, 
  Palette, 
  BarChart3, 
  Shield, 
  Zap,
  Star,
  Users,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Lock,
  Zap as Lightning,
  Heart,
  Award,
  Clock,
  Download,
  Share2,
  Eye,
  MousePointer,
  FileText,
  Webhook,
  Bot,
  Analytics,
  Settings,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MultiLink
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Link in Bio</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/register">
                <Sparkles className="h-4 w-4 mr-2" />
                Começar grátis
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ✨ Novo: Sistema de Webhooks e Analytics Avançado
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Seus links em um{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              só lugar
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A plataforma mais completa para criar sua página de links. 
            <span className="font-semibold text-gray-900 dark:text-white"> Analytics avançados</span>, 
            <span className="font-semibold text-gray-900 dark:text-white"> formulários inteligentes</span> e 
            <span className="font-semibold text-gray-900 dark:text-white"> integrações poderosas</span> em uma só ferramenta.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/register">
                <Sparkles className="mr-2 h-5 w-5" />
                Começar grátis agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-2">
              <Link href="/demo">
                <Eye className="mr-2 h-5 w-5" />
                Ver exemplo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10k+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Usuários ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">1M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Links criados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Suporte</div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Tudo que você precisa para{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                crescer online
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Desde links simples até analytics avançados e automações. 
              Uma plataforma completa para profissionais e empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Link Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Gestão de Links</CardTitle>
                <CardDescription className="text-base">
                  Organize todos os seus links em uma página personalizada e profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Drag & drop para reordenar
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Temas personalizáveis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Links sociais integrados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Domínio personalizado
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics Avançados</CardTitle>
                <CardDescription className="text-base">
                  Acompanhe o desempenho dos seus links com métricas detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cliques em tempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Geolocalização dos visitantes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Dispositivos e navegadores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Relatórios exportáveis
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Forms */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Formulários Inteligentes</CardTitle>
                <CardDescription className="text-base">
                  Capture leads com formulários personalizáveis e integrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Campos personalizáveis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Validação automática
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Exportação CSV
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Redirecionamento automático
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Webhooks */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Webhook className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Integrações Webhook</CardTitle>
                <CardDescription className="text-base">
                  Conecte com suas ferramentas favoritas via webhooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Eventos em tempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Retry automático
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Dados estruturados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Teste de conectividade
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Segurança & Privacidade</CardTitle>
                <CardDescription className="text-base">
                  Seus dados protegidos com as melhores práticas de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    HTTPS obrigatório
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Autenticação segura
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Backup automático
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    LGPD compliant
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Performance Máxima</CardTitle>
                <CardDescription className="text-base">
                  Carregamento ultrarrápido com CDN global e otimizações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    CDN global
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cache inteligente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Compressão automática
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    99.9% uptime
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Mais de 10.000 profissionais confiam no MultiLink para gerenciar seus links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Incrível! Consegui aumentar minhas conversões em 40% usando os formulários e analytics do MultiLink."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">João Silva</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Empreendedor Digital</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Os webhooks são perfeitos! Integrei com meu CRM e agora tudo é automatizado. Economizo horas por semana."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">MC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Maria Costa</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Interface linda e funcionalidades poderosas. É exatamente o que eu precisava para minha carreira."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Ana Santos</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Influencer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 md:p-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para crescer online?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Junte-se a mais de 10.000 profissionais que já usam o MultiLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                <Link href="/register">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Começar grátis agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                <Link href="/demo">
                  <Eye className="mr-2 h-5 w-5" />
                  Ver exemplo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">MultiLink</span>
                  <p className="text-xs text-gray-400">Link in Bio</p>
                </div>
              </div>
              <p className="text-gray-400">
                A plataforma mais completa para gerenciar seus links e crescer online.
              </p>
              <div className="flex space-x-4">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Preços</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrações</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Política de Privacidade</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
                <li><Link href="/security" className="hover:text-white">Segurança</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} MultiLink. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">
              Feito com <Heart className="inline h-4 w-4 text-red-500" /> no Brasil
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}