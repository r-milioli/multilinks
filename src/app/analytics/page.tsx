'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { LoadingPage } from '@/shared/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Globe, 
  Smartphone,
  Calendar,
  ArrowLeft,
  Filter,
  Download,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { useLogin } from '@/modules/auth/hooks/useLogin'
import { MobileMenu } from '@/shared/components/ui/MobileMenu'

interface AnalyticsData {
  totalClicks: number
  totalViews: number
  uniqueVisitors: number
  activeLinks: number
  clickGrowth: number
  visitorGrowth: number
  topLinks: Array<{
    linkId: string
    title: string
    url: string
    clicks: number
  }>
  topCountries: Array<{
    country: string
    clicks: number
  }>
  deviceBreakdown: Array<{
    device: string
    clicks: number
    percentage: number
  }>
  dailyStats: Array<{
    date: string
    clicks: number
    views: number
  }>
  links: Array<{
    id: string
    title: string
    clickCount: number
    active: boolean
  }>
}

export default function AnalyticsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { logout } = useLogin()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30') // últimos 30 dias
  const [selectedLink, setSelectedLink] = useState('all')

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated, dateRange, selectedLink])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('dateRange', dateRange)
      if (selectedLink !== 'all') {
        params.append('linkId', selectedLink)
      }

      const response = await fetch(`/api/analytics/summary?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar analytics')
      }

      setAnalytics(result.data)
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const handleExport = () => {
    if (!analytics) return

    // Criar dados para exportação
    const exportData = {
      periodo: dateRange === 'all' ? 'Todo o período' : `Últimos ${dateRange} dias`,
      dataExportacao: new Date().toLocaleString('pt-BR'),
      metricas: {
        totalClicks: analytics.totalClicks,
        totalViews: analytics.totalViews,
        uniqueVisitors: analytics.uniqueVisitors,
        activeLinks: analytics.activeLinks
      },
      topLinks: analytics.topLinks,
      topCountries: analytics.topCountries,
      deviceBreakdown: analytics.deviceBreakdown,
      dailyStats: analytics.dailyStats,
      recentActivity: analytics.recentActivity
    }

    // Converter para JSON
    const jsonData = JSON.stringify(exportData, null, 2)
    
    // Criar e baixar arquivo
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${dateRange}-dias-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (authLoading || isLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={fetchAnalytics} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Nenhum dado encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Ainda não há dados de analytics disponíveis.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Link>
              </Button>
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Analytics
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="all">Todo o período</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
              <MobileMenu>
                <div className="md:hidden space-y-2 p-2">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 90 dias</option>
                    <option value="all">Todo o período</option>
                  </select>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start md:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </MobileMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totalClicks)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.clickGrowth !== 0 ? (
                  <span className={analytics.clickGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {analytics.clickGrowth > 0 ? '+' : ''}{analytics.clickGrowth}% desde o período anterior
                  </span>
                ) : (
                  'Sem dados de crescimento'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.uniqueVisitors)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.visitorGrowth !== 0 ? (
                  <span className={analytics.visitorGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {analytics.visitorGrowth > 0 ? '+' : ''}{analytics.visitorGrowth}% desde o período anterior
                  </span>
                ) : (
                  'Sem dados de crescimento'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeLinks}</div>
              <p className="text-xs text-muted-foreground">
                de {analytics.links.length} links totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.uniqueVisitors > 0 
                  ? Math.round((analytics.totalClicks / analytics.uniqueVisitors) * 100) / 100
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                cliques por visitante
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links Mais Populares</CardTitle>
              <CardDescription>
                Seus links com mais cliques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topLinks.slice(0, 5).map((link, index) => (
                  <div key={link.linkId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{link.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{link.clicks}</p>
                      <p className="text-xs text-muted-foreground">cliques</p>
                    </div>
                  </div>
                ))}
                {analytics.topLinks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum clique registrado ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Países */}
          <Card>
            <CardHeader>
              <CardTitle>Top Países</CardTitle>
              <CardDescription>
                Distribuição geográfica dos cliques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{country.clicks}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((country.clicks / analytics.totalClicks) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
                {analytics.topCountries.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum dado geográfico disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>
                Distribuição por tipo de dispositivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.deviceBreakdown.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm capitalize">
                        {device.device.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{device.clicks}</p>
                      <p className="text-xs text-muted-foreground">{device.percentage}%</p>
                    </div>
                  </div>
                ))}
                {analytics.deviceBreakdown.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum dado de dispositivo disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Cliques nos últimos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.dailyStats.slice(0, 7).map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{formatDate(day.date)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{day.clicks}</p>
                      <p className="text-xs text-muted-foreground">cliques</p>
                    </div>
                  </div>
                ))}
                {analytics.dailyStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma atividade recente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
