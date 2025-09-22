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
  Github
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
      role: 'Head of Design',
      image: 'MC',
      description: 'Designer criativo focada em interfaces intuitivas e experiências memoráveis.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      name: 'João Oliveira',
      role: 'Head of Growth',
      image: 'JO',
      description: 'Especialista em marketing digital e crescimento de produtos.',
      color: 'from-green-500 to-emerald-600'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Paixão',
      description: 'Amamos o que fazemos e acreditamos no poder de conectar pessoas através de links.'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Acreditamos que as melhores soluções nascem da colaboração e do trabalho em equipe.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Estamos sempre buscando novas formas de melhorar e inovar nossa plataforma.'
    },
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Mantemos transparência total em nossos processos e comunicação com os usuários.'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Lançamento do MultiLink',
      description: 'Nossa plataforma foi lançada com funcionalidades básicas de gestão de links.'
    },
    {
      year: '2024',
      title: 'Analytics Avançados',
      description: 'Implementamos sistema completo de analytics em tempo real.'
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
            </div>
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
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sobre o MultiLink
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Somos uma equipe apaixonada por tecnologia, dedicada a criar a melhor plataforma 
              para gerenciamento de links e crescimento online.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-16">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Nossa Missão
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                    Democratizar o acesso a ferramentas profissionais de gestão de links, 
                    permitindo que qualquer pessoa ou empresa tenha uma presença online 
                    profissional e eficaz, independentemente do tamanho ou orçamento.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
                      <Target className="h-4 w-4 mr-2" />
                      Foco no usuário
                    </Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2">
                      <Zap className="h-4 w-4 mr-2" />
                      Inovação constante
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
                      <Shield className="h-4 w-4 mr-2" />
                      Segurança em primeiro lugar
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Nossa Equipe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl font-bold text-white">{member.image}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Nossa Jornada
            </h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <Card key={index} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{milestone.year}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology */}
          <div className="mb-16">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Tecnologias que Utilizamos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Code className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next.js</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Framework React</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PostgreSQL</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Banco de dados</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Palette className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tailwind CSS</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Estilização</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vercel</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Hospedagem</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Vamos conversar?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Estamos sempre abertos para feedback, sugestões e parcerias
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Entre em contato
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/careers">
                    <Users className="h-4 w-4 mr-2" />
                    Trabalhe conosco
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
