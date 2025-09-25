import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Footer } from '@/shared/components/layout/Footer'
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
  MapPin
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 sm:px-4">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white text-sm sm:text-base px-2 sm:px-4">
              <Link href="/register">
                <Sparkles className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Começar grátis</span>
                <span className="sm:hidden">Grátis</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-black border border-gray-700 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">
              ✨ Novo: Sistema de Webhooks e Analytics Avançado
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Seus links em um{' '}
            <span className="bg-gradient-to-r from-orange-300 via-pink-400 to-orange-500 bg-clip-text text-transparent">
              só lugar
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A plataforma mais completa para criar sua página de links. 
            <span className="font-semibold text-white"> Analytics avançados</span>, 
            <span className="font-semibold text-white"> formulários inteligentes</span> e 
            <span className="font-semibold text-white"> integrações poderosas</span> em uma só ferramenta.
          </p>
          
          <div className="flex justify-center mb-12">
            <Button size="lg" asChild className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
              <Link href="/register">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Começar grátis agora</span>
                <span className="sm:hidden">Começar grátis</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10k+</div>
              <div className="text-sm text-gray-400">Usuários ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-sm text-gray-400">Links criados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Suporte</div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tudo que você precisa para{' '}
              <span className="bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent">
                crescer online
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desde links simples até analytics avançados e automações. 
              Uma plataforma completa para profissionais e empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Link Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Gestão de Links</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Organize todos os seus links em uma página personalizada e profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Analytics Avançados</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Acompanhe o desempenho dos seus links com métricas detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Formulários Inteligentes</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Capture leads com formulários personalizáveis e integrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Webhook className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Integrações Webhook</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Conecte com suas ferramentas favoritas via webhooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Segurança & Privacidade</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Seus dados protegidos com as melhores práticas de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Performance Máxima</CardTitle>
                <CardDescription className="text-base text-gray-300">
                  Carregamento ultrarrápido com CDN global e otimizações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mais de 10.000 profissionais confiam no MultiLink para gerenciar seus links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Incrível! Consegui aumentar minhas conversões em 40% usando os formulários e analytics do MultiLink."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">João Silva</div>
                    <div className="text-sm text-gray-400">Empreendedor Digital</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Os webhooks são perfeitos! Integrei com meu CRM e agora tudo é automatizado. Economizo horas por semana."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">MC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Maria Costa</div>
                    <div className="text-sm text-gray-400">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-black border border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Interface linda e funcionalidades poderosas. É exatamente o que eu precisava para minha carreira."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Ana Santos</div>
                    <div className="text-sm text-gray-400">Influencer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-12 md:p-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para crescer online?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Junte-se a mais de 10.000 profissionais que já usam o MultiLink
            </p>
            <div className="flex justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                <Link href="/register">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Começar grátis agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}