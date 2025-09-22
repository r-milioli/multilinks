import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowRight, Link as LinkIcon, Palette, BarChart3, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">MultiLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Criar conta</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Seus links em um{' '}
            <span className="text-primary">só lugar</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Crie sua página de links personalizada e compartilhe todos os seus perfis sociais, 
            projetos e conteúdo em um só lugar. Simples, rápido e profissional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Ver exemplo</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Links Organizados</CardTitle>
              <CardDescription>
                Organize todos os seus links em uma página limpa e profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Drag & drop para reordenar</li>
                <li>• Ativar/desativar links</li>
                <li>• Validação automática de URLs</li>
                <li>• Ícones automáticos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Totalmente Personalizável</CardTitle>
              <CardDescription>
                Customize cores, fontes, temas e muito mais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 5+ temas pré-definidos</li>
                <li>• Cores personalizadas</li>
                <li>• Múltiplas fontes</li>
                <li>• Backgrounds customizáveis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Analytics Detalhados</CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos seus links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Cliques por link</li>
                <li>• Visualizações de página</li>
                <li>• Dados geográficos</li>
                <li>• Gráficos interativos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Seguro e Confiável</CardTitle>
              <CardDescription>
                Seus dados protegidos com as melhores práticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Autenticação segura</li>
                <li>• Dados criptografados</li>
                <li>• Backup automático</li>
                <li>• GDPR compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Rápido e Responsivo</CardTitle>
              <CardDescription>
                Otimizado para todos os dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Carregamento instantâneo</li>
                <li>• Mobile-first design</li>
                <li>• SEO otimizado</li>
                <li>• PWA ready</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>URL Personalizada</CardTitle>
              <CardDescription>
                Sua própria URL personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• /seuusuario</li>
                <li>• Fácil de lembrar</li>
                <li>• Profissional</li>
                <li>• Compartilhável</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Crie sua página de links em menos de 5 minutos
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Criar conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 MultiLink. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
