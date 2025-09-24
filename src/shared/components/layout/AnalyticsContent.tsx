'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { BarChart3, TrendingUp, Users, MousePointer, Globe, Smartphone, Monitor, Calendar, RefreshCw } from 'lucide-react'
import { LoadingPage } from '@/shared/components/ui/Loading'

interface AnalyticsSummary {
  totalClicks: number
  totalViews: number
  uniqueVisitors: number
  activeLinks: number
  clickGrowth: number
  visitorGrowth: number
  topLinks: Array<{
    linkId: string
    title: string
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
  recentActivity: Array<{
    type: 'click' | 'view'
    description: string
    timestamp: string
  }>
}

export function AnalyticsContent() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/summary?dateRange=${dateRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      } else {
        console.error('Erro ao buscar analytics:', data.error)
      }
    } catch (error) {
      console.error('Erro ao buscar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated, dateRange])

  if (authLoading || loading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-gray-600">Acompanhe o desempenho dos seus links</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="all">Todos os tempos</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalClicks || 0}</div>
            <p className={`text-xs ${analytics?.clickGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics ? formatGrowth(analytics.clickGrowth) : '0%'} do período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
            <p className={`text-xs ${analytics?.visitorGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics ? formatGrowth(analytics.visitorGrowth) : '0%'} do período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalViews > 0 ? Math.round((analytics.totalClicks / analytics.totalViews) * 100) : 0}% taxa de clique
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activeLinks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.links?.length || 0} links totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Links */}
      <Card>
        <CardHeader>
          <CardTitle>Top Links</CardTitle>
          <CardDescription>Seus links com melhor desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.topLinks && analytics.topLinks.length > 0 ? (
            <div className="space-y-4">
              {analytics.topLinks.slice(0, 5).map((link, index) => (
                <div key={link.linkId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-0">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{link.title}</p>
                      <p className="text-sm text-gray-500 truncate">ID: {link.linkId}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-lg">{link.clicks}</p>
                    <p className="text-xs text-gray-500">cliques</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum dado de analytics disponível</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Países
            </CardTitle>
            <CardDescription>Distribuição de cliques por país</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.topCountries && analytics.topCountries.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((country.clicks / analytics.topCountries[0].clicks) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{country.clicks}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhum dado de país disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Dispositivos
            </CardTitle>
            <CardDescription>Distribuição de cliques por dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.deviceBreakdown && analytics.deviceBreakdown.length > 0 ? (
              <div className="space-y-3">
                {analytics.deviceBreakdown.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between min-w-0">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      {device.device === 'Mobile' ? (
                        <Smartphone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Monitor className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(device.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10 sm:w-12 text-right">{device.clicks}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Smartphone className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhum dado de dispositivo disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atividade Recente
          </CardTitle>
          <CardDescription>Últimas atividades registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'click' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">Nenhuma atividade recente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
