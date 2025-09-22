import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Target,
  Lightbulb,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Star,
  CheckCircle,
  Rocket,
  Code,
  Palette,
  BarChart3,
  Webhook,
  FileText,
  MapPin,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Database
} from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: 'Ana Silva',
      role: 'CEO & Fundadora',
      image: 'AS',
      description: 'Especialista em produto e experiência do usuário com 10+ anos de experiência.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'Carlos Santos',
      role: 'CTO',
      image: 'CS',
      description: 'Desenvolvedor full-stack apaixonado por tecnologia e inovação.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Maria Costa',
      role: 'Designer UX/UI',
      image: 'MC',
      description: 'Criativa e focada em criar experiências visuais excepcionais.',
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Paixão pelo Cliente',
      description: 'Cada decisão é tomada pensando no sucesso dos nossos usuários.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação Constante',
      description: 'Sempre buscando novas formas de simplificar e melhorar a experiência.'
    },
    {
      icon: Shield,
      title: 'Segurança em Primeiro',
      description: 'Protegemos os dados dos nossos usuários com as melhores práticas.'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Velocidade e eficiência são fundamentais em tudo que fazemos.'
    }
  ]

  const timeline = [
    {
      year: '2023',
      title: 'Nascimento da Ideia',
      description: 'Identificamos a necessidade de uma solução simples e eficaz para gerenciar links.'
    },
    {
      year: '2023',
      title: 'Primeira Versão',
      description: 'Lançamos a primeira versão do MultiLink com funcionalidades básicas.'
    },
    {
      year: '2024',
      title: 'Formulários Inteligentes',
      description: 'Adicionamos sistema de captura de leads com formulários personalizáveis.'
    },
    {
      year: '2024',
      title: 'Sistema de Webhooks',
      description: 'Lançamos integrações via webhooks para conectar com ferramentas externas.'
    }
  ]

  const stats = [
    { label: 'Usuários Ativos', value: '10k+', icon: Users },
    { label: 'Links Criados', value: '1M+', icon: Target },
    { label: 'Países Atendidos', value: '50+', icon: Globe },
    { label: 'Uptime', value: '99.9%', icon: Award }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MultiLink
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Sobre o MultiLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Somos uma equipe apaixonada por criar ferramentas que simplificam a vida digital. 
            O MultiLink nasceu da necessidade de ter uma solução elegante e funcional para 
            gerenciar links e capturar leads de forma eficiente.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <Card className="mb-16 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nossa Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Democratizar o acesso a ferramentas profissionais de marketing digital, 
              permitindo que qualquer pessoa ou empresa possa criar uma presença online 
              eficaz sem complicações técnicas ou custos exorbitantes.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nossa Equipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                      {member.image}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <Badge variant="outline" className="mt-1">{member.role}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nossa História
          </h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{item.year}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="mb-16 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tecnologias que Utilizamos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Next.js', icon: Code },
                { name: 'React', icon: Zap },
                { name: 'TypeScript', icon: FileText },
                { name: 'Tailwind CSS', icon: Palette },
                { name: 'Prisma', icon: Database },
                { name: 'PostgreSQL', icon: BarChart3 },
                { name: 'Docker', icon: Rocket },
                { name: 'Vercel', icon: Globe }
              ].map((tech, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <tech.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Entre em Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Tem alguma dúvida ou sugestão? Adoraríamos ouvir de você!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@multilink.com</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Twitter className="h-4 w-4" />
                <span>@multilink</span>
              </Button>
            </div>
            <div className="flex justify-center">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}