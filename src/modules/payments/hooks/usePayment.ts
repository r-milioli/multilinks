import { useState, useEffect } from 'react'
import { PaymentResponse, PaymentHistory } from '@/types/payment.types'

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Processar checkout
   */
  const processCheckout = async (checkoutData: any): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })

      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erro no checkout')
      }
    } catch (error: any) {
      setError(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Buscar status do pagamento
   */
  const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/status?paymentId=${paymentId}`)
      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erro ao buscar status')
      }
    } catch (error: any) {
      setError(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Buscar histórico de pagamentos
   */
  const getPaymentHistory = async (limit = 10): Promise<PaymentHistory[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/history?limit=${limit}`)
      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erro ao buscar histórico')
      }
    } catch (error: any) {
      setError(error.message)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cancelar assinatura
   */
  const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId })
      })

      const result = await response.json()

      if (result.success) {
        return true
      } else {
        throw new Error(result.error || 'Erro ao cancelar assinatura')
      }
    } catch (error: any) {
      setError(error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Buscar informações do plano
   */
  const getPlanInfo = async (planId: string): Promise<any | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/plan-info?planId=${planId}`)
      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erro ao buscar informações do plano')
      }
    } catch (error: any) {
      setError(error.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Polling para verificar status do pagamento
   */
  const pollPaymentStatus = (
    paymentId: string, 
    onStatusChange: (status: PaymentResponse) => void,
    interval = 5000,
    maxAttempts = 60 // 5 minutos
  ) => {
    let attempts = 0
    const poll = async () => {
      if (attempts >= maxAttempts) {
        console.log('Polling timeout')
        return
      }

      const status = await getPaymentStatus(paymentId)
      if (status) {
        onStatusChange(status)
        
        // Parar polling se pagamento foi finalizado
        if (['paid', 'canceled', 'refunded', 'failed'].includes(status.status)) {
          return
        }
      }

      attempts++
      setTimeout(poll, interval)
    }

    poll()
  }

  return {
    isLoading,
    error,
    processCheckout,
    getPaymentStatus,
    getPaymentHistory,
    cancelSubscription,
    getPlanInfo,
    pollPaymentStatus,
    clearError: () => setError(null)
  }
}
