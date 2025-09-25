import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'

export interface FooterData {
  socialLinks: {
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
}

export function useFooter() {
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carregar dados do footer
   */
  const loadFooterData = async () => {
    try {
      console.log('🔄 Footer Hook - Iniciando carregamento...')
      setIsLoading(true)
      
      // Fazer requisição direta com fetch para debug
      console.log('📡 Footer Hook - Fazendo requisição para /api/public/footer')
      const response = await fetch('/api/public/footer')
      console.log('📡 Footer Hook - Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // console.log('🔍 Footer Hook - API Response:', JSON.stringify(data, null, 2))
      
      if (data.success && data.data) {
        // console.log('✅ Footer Hook - Dados carregados:', JSON.stringify(data.data, null, 2))
        setFooterData(data.data)
      } else {
        console.log('⚠️ Footer Hook - Resposta sem dados válidos')
        // Fallback para dados padrão se não conseguir carregar
        setFooterData({
          socialLinks: {
            instagram: '',
            facebook: '',
            twitter: '',
            linkedin: ''
          },
          contactInfo: {
            email: '',
            phone: '',
            address: ''
          }
        })
      }
    } catch (error) {
      console.error('❌ Footer Hook - Erro ao carregar dados do footer:', error)
      // Fallback para dados padrão em caso de erro
      const fallbackData = {
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: '',
          linkedin: ''
        },
        contactInfo: {
          email: '',
          phone: '',
          address: ''
        }
      }
      console.log('🔄 Footer Hook - Usando dados de fallback:', fallbackData)
      setFooterData(fallbackData)
    } finally {
      console.log('🏁 Footer Hook - Finalizando carregamento')
      setIsLoading(false)
    }
  }

  /**
   * Carregar dados quando o hook for montado
   */
  useEffect(() => {
    // Só carregar no lado do cliente
    if (typeof window !== 'undefined') {
      loadFooterData()
    }
  }, [])

  return {
    footerData,
    isLoading,
    loadFooterData
  }
}
