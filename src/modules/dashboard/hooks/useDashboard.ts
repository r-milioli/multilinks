'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface DashboardStats {
  totalLinks: number
  activeLinks: number
  totalClicks: number
  totalViews: number
  uniqueVisitors: number
  clickGrowth: number
  topLink: {
    title: string
    clicks: number
  } | null
  recentActivity: Array<{
    type: 'click' | 'view' | 'link_created' | 'link_updated'
    description: string
    timestamp: string
  }>
}

export function useDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    activeLinks: 0,
    totalClicks: 0,
    totalViews: 0,
    uniqueVisitors: 0,
    clickGrowth: 0,
    topLink: null,
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardStats()
    }
  }, [session?.user?.id])

  const fetchDashboardStats = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Buscar dados de analytics (sem cache)
      const analyticsResponse = await fetch('/api/analytics/summary?dateRange=30', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const analyticsData = await analyticsResponse.json()

      // Buscar dados dos links (sem cache)
      const linksResponse = await fetch('/api/links', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const linksData = await linksResponse.json()

      if (analyticsData.success && linksData.success) {
        const analytics = analyticsData.data
        const links = linksData.data

        // Calcular estatísticas
        const totalLinks = links.length
        const activeLinks = links.filter((link: any) => link.active).length
        const totalClicks = analytics.totalClicks || 0
        const totalViews = analytics.totalViews || 0
        const uniqueVisitors = analytics.uniqueVisitors || 0

        // Calcular crescimento baseado em dados reais (comparar com período anterior)
        // Por enquanto, vamos usar 0% se não há dados suficientes
        const clickGrowth = 0 // TODO: Implementar cálculo real de crescimento

        // Top link baseado em dados reais
        const topLink = analytics.topLinks && analytics.topLinks.length > 0 
          ? {
              title: analytics.topLinks[0].title,
              clicks: analytics.topLinks[0].clicks
            }
          : null

        // Atividade recente baseada em dados reais
        const recentActivity = []
        
        // Adicionar atividades reais de analytics
        if (analytics.recentActivity) {
          recentActivity.push(...analytics.recentActivity)
        }
        
        // Se não há atividades reais, mostrar mensagem informativa
        if (recentActivity.length === 0) {
          recentActivity.push({
            type: 'view' as const,
            description: 'Nenhuma atividade recente registrada',
            timestamp: new Date().toISOString()
          })
        }

        setStats({
          totalLinks,
          activeLinks,
          totalClicks,
          totalViews,
          uniqueVisitors,
          clickGrowth,
          topLink,
          recentActivity
        })
      } else {
        setError('Erro ao carregar dados do dashboard')
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas do dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStats = () => {
    console.log('🔄 Atualizando estatísticas do dashboard...')
    fetchDashboardStats()
  }

  return {
    stats,
    isLoading,
    error,
    refreshStats
  }
}
