import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'

export interface FinancialStats {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  totalSales: number
  monthlySales: number
  conversionRate: number
  averageOrderValue: number
  refunds: number
  refundRate: number
  growth: {
    revenue: number
    sales: number
    conversion: number
  }
}

export interface SalesData {
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planName: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
  paidAt?: string
  refundedAt?: string
  paymentId?: string
}

export interface RevenueChartData {
  date: string
  revenue: number
  sales: number
}

export interface PlanPerformance {
  planId: string
  planName: string
  sales: number
  revenue: number
  conversionRate: number
  growth: number
}

export function useFinancialData() {
  const [stats, setStats] = useState<FinancialStats | null>(null)
  const [sales, setSales] = useState<SalesData[]>([])
  const [chartData, setChartData] = useState<RevenueChartData[]>([])
  const [planPerformance, setPlanPerformance] = useState<PlanPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFinancialData = async () => {
    try {
      console.log('🔄 Iniciando carregamento de dados financeiros...')
      setIsLoading(true)
      setError(null)

      // Buscar dados financeiros
      const [statsResponse, salesResponse, chartResponse, plansResponse] = await Promise.all([
        apiClient.get('/admin/financial/stats'),
        apiClient.get('/admin/financial/sales'),
        apiClient.get('/admin/financial/chart'),
        apiClient.get('/admin/financial/plans-performance')
      ])

      if (statsResponse.success && statsResponse.data) {
        console.log('📊 Dados de stats recebidos:', statsResponse.data)
        setStats(statsResponse.data)
      } else {
        console.log('❌ Erro na resposta de stats:', statsResponse)
      }

      if (salesResponse.success && salesResponse.data) {
        setSales(salesResponse.data)
      }

      if (chartResponse.success && chartResponse.data) {
        setChartData(chartResponse.data)
      }

      if (plansResponse.success && plansResponse.data) {
        setPlanPerformance(plansResponse.data)
      }

    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err)
      setError('Erro ao carregar dados financeiros')
      setStats(null)
      setSales([])
      setChartData([])
      setPlanPerformance([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFinancialData()
  }, [])

  return {
    stats,
    sales,
    chartData,
    planPerformance,
    isLoading,
    error,
    refetch: loadFinancialData
  }
}
