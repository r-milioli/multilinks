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
      
      // Se erro de autenticação, mostrar dados mock temporariamente
      if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
        console.log('⚠️ Usuário não autenticado, mostrando dados mock')
        
        setStats({
          totalRevenue: 240.00,
          monthlyRevenue: 240.00,
          yearlyRevenue: 240.00,
          totalSales: 9,
          monthlySales: 9,
          conversionRate: 4.5,
          averageOrderValue: 26.67,
          refunds: 0,
          refundRate: 0,
          growth: {
            revenue: 0,
            sales: 0,
            conversion: 0
          }
        })

        setSales([
          {
            id: '1',
            userId: 'user1',
            userName: 'Robson Milioli',
            userEmail: 'robson.milioli@gmail.com',
            planId: 'business',
            planName: 'Business',
            amount: 40.00,
            status: 'pending',
            paymentMethod: 'CREDIT_CARD',
            createdAt: new Date().toISOString(),
            paidAt: undefined,
            paymentId: 'pay_001'
          }
        ])

        setChartData([
          { date: new Date().toISOString().split('T')[0], revenue: 240, sales: 9 }
        ])

        setPlanPerformance([
          {
            planId: 'business',
            planName: 'Business',
            sales: 1,
            revenue: 40.00,
            conversionRate: 50.0,
            growth: 0
          },
          {
            planId: 'pro',
            planName: 'Pro',
            sales: 8,
            revenue: 200.00,
            conversionRate: 44.4,
            growth: 0
          }
        ])
      } else {
        // Limpar dados em caso de outro erro
        setStats(null)
        setSales([])
        setChartData([])
        setPlanPerformance([])
      }

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
