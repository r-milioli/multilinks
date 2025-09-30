import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'
import { Users, Zap, Crown, LinkIcon, Palette, BarChart3, FileText, Webhook, Shield } from 'lucide-react'

export interface PlanData {
  id: string
  name: string
  price: string
  priceValue?: number
  period: string
  description: string
  icon?: any // LucideIcon
  color?: string
  features: string[]
  limitations: string[]
  popular: boolean
  cta: string
  href: string
}

export interface PricingData {
  plans: PlanData[]
  features: {
    category: string
    icon?: any // LucideIcon
    items: {
      name: string
      free: boolean
      pro: boolean
      business: boolean
    }[]
  }[]
}

export function usePricing() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carregar dados de preços
   */
  const loadPricingData = async () => {
    try {
      setIsLoading(true)
      
      // Usar URL relativa para evitar problemas de domínio em produção
      const apiUrl = '/api/public/pricing'
      
      console.log('🔍 usePricing - Fazendo requisição para:', apiUrl) // Debug log
      
      const response = await fetch(apiUrl)
      
      console.log('📡 usePricing - Response status:', response.status) // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('📦 usePricing - API Response:', data) // Debug log
      
      if (data.success && data.data) {
        console.log('Usando dados da API') // Debug log
        setPricingData(data.data)
      } else {
        console.log('API retornou dados inválidos') // Debug log
        throw new Error('API retornou dados inválidos')
      }
    } catch (error) {
      console.error('Erro ao carregar dados de preços:', error)
      // Repassar o erro para ser tratado pelo componente
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Carregar dados quando o hook for montado
   */
  useEffect(() => {
    // Só carregar no lado do cliente
    if (typeof window !== 'undefined') {
      loadPricingData()
    }
  }, [])

  return {
    pricingData,
    isLoading,
    loadPricingData
  }
}
