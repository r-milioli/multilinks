import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'

export interface ContactData {
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

export function useContact() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carregar dados de contato
   */
  const loadContactData = async () => {
    try {
      setIsLoading(true)
      
      // Fazer requisição direta com fetch para debug
      const response = await fetch('/api/public/footer')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setContactData(data.data)
      } else {
        // Fallback para dados padrão se não conseguir carregar
        setContactData({
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
      console.error('❌ Contact Hook - Erro ao carregar dados de contato:', error)
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
      setContactData(fallbackData)
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
      loadContactData()
    }
  }, [])

  return {
    contactData,
    isLoading,
    loadContactData
  }
}
