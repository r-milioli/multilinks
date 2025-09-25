import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'

export interface AdminStats {
  users: {
    total: number
    active: number
    inactive: number
    suspended: number
    pending: number
    admins: number
    superAdmins: number
    growth: number // % de crescimento
  }
  links: {
    total: number
    active: number
    clicks: number
    growth: number
  }
  forms: {
    total: number
    active: number
    leads: number
    growth: number
  }
  analytics: {
    pageViews: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
  }
  revenue: {
    monthly: number
    yearly: number
    growth: number
    conversionRate: number
  }
}

export interface RecentActivity {
  id: string
  type: 'user_registered' | 'user_login' | 'link_created' | 'form_submitted' | 'payment_received'
  description: string
  user?: {
    id: string
    name: string
    email: string
  }
  timestamp: string
  metadata?: any
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Buscar estatísticas do sistema
      const [statsResponse, activityResponse] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/activity')
      ])

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data)
      } else {
        console.warn('⚠️ API de estatísticas não retornou dados válidos')
        setStats(null)
      }

      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data)
      } else {
        console.warn('⚠️ API de atividades não retornou dados válidos')
        setRecentActivity([])
      }

    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
      setError('Erro ao carregar estatísticas do sistema')
      setStats(null)
      setRecentActivity([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return {
    stats,
    recentActivity,
    isLoading,
    error,
    refetch: loadStats
  }
}
