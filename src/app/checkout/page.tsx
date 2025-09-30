'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckoutForm } from '@/modules/payments/components/CheckoutForm'
import { PaymentStatus } from '@/modules/payments/components/PaymentStatus'
import { usePayment } from '@/modules/payments/hooks/usePayment'
import { PaymentResponse } from '@/types/payment.types'
import { PlanLimitsService } from '@/shared/services/planLimitsService'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { processCheckout, getPaymentStatus, pollPaymentStatus, getPlanInfo, isLoading, error } = usePayment()
  
  const [currentStep, setCurrentStep] = useState<'checkout' | 'payment' | 'success' | 'error'>('checkout')
  const [payment, setPayment] = useState<PaymentResponse | null>(null)
  const [plan, setPlan] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Buscar plano selecionado
  useEffect(() => {
    const planId = searchParams.get('plan')
    const priceParam = searchParams.get('price')
    
    if (!planId) {
      router.push('/pricing')
      return
    }

    const loadPlan = async () => {
      try {
        console.log(`🔍 Carregando plano: ${planId}, preço da URL: ${priceParam}`)
        
        // Buscar dados dos planos da tabela SystemSettings
        const response = await fetch('/api/public/pricing')
        const result = await response.json()
        
        console.log(`📊 Dados de preços recebidos:`, result)

        if (result.success && result.data?.plans) {
          // Encontrar o plano específico
          const planFromDB = result.data.plans.find((p: any) => 
            p.id === planId || p.name.toLowerCase() === planId
          )
          
          if (planFromDB) {
            console.log(`✅ Plano encontrado no banco:`, planFromDB)
            
            // Extrair preço numérico do formato "R$ 19,00" ou usar priceValue se disponível
            let dbPrice = 0
            if (planFromDB.priceValue) {
              dbPrice = planFromDB.priceValue
            } else if (typeof planFromDB.price === 'string') {
              // Extrair número de "R$ 19,00" ou "R$ 19"
              const priceMatch = planFromDB.price.match(/[\d,]+/)
              if (priceMatch) {
                dbPrice = parseFloat(priceMatch[0].replace(',', '.'))
              }
            } else if (typeof planFromDB.price === 'number') {
              dbPrice = planFromDB.price
            }

            // Determinar preço final
            let finalPrice = dbPrice
            if (priceParam && parseFloat(priceParam) > 0) {
              finalPrice = parseFloat(priceParam)
              console.log(`💰 Usando preço da URL: ${finalPrice}`)
            } else {
              console.log(`💰 Usando preço do banco: ${finalPrice}`)
            }

            const planData = {
              id: planId,
              name: planFromDB.name,
              price: finalPrice,
              description: planFromDB.description || `Plano ${planFromDB.name} do MultiLink`
            }

            console.log(`📊 Plano final:`, planData)
            setPlan(planData)
            return
          }
        }

        // Fallback: usar dados básicos se não encontrar no banco
        console.log(`⚠️ Plano não encontrado no banco, usando fallback`)
        const defaultPrices: Record<string, number> = {
          pro: 19,
          business: 49,
          free: 0
        }
        
        const planNames: Record<string, string> = {
          pro: 'Pro',
          business: 'Business',
          free: 'Gratuito'
        }

        const finalPrice = (priceParam && parseFloat(priceParam) > 0) ? 
          parseFloat(priceParam) : (defaultPrices[planId] || 0)

        const planData = {
          id: planId,
          name: planNames[planId] || planId.charAt(0).toUpperCase() + planId.slice(1),
          price: finalPrice,
          description: `Plano ${planNames[planId] || planId} do MultiLink`
        }

        console.log(`📊 Plano fallback:`, planData)
        setPlan(planData)

      } catch (error) {
        console.error('Erro ao carregar plano:', error)
        setErrorMessage('Erro ao carregar plano')
        setCurrentStep('error')
      }
    }

    loadPlan()
  }, [searchParams, router])

  // Verificar se há pagamento em andamento
  useEffect(() => {
    const paymentId = searchParams.get('payment')
    if (paymentId && currentStep === 'checkout') {
      setCurrentStep('payment')
      loadPaymentStatus(paymentId)
    }
  }, [searchParams, currentStep])

  const loadPaymentStatus = async (paymentId: string) => {
    const status = await getPaymentStatus(paymentId)
    if (status) {
      setPayment(status)
      
      // Iniciar polling para atualizações
      pollPaymentStatus(paymentId, (updatedStatus) => {
        setPayment(updatedStatus)
        
        if (updatedStatus.status === 'paid') {
          setCurrentStep('success')
        } else if (['canceled', 'failed'].includes(updatedStatus.status)) {
          setCurrentStep('error')
          setErrorMessage('Pagamento não foi processado')
        }
      })
    }
  }

  const handleCheckoutSuccess = (paymentData: PaymentResponse) => {
    setPayment(paymentData)
    setCurrentStep('payment')
    
    // Atualizar URL com ID do pagamento
    const url = new URL(window.location.href)
    url.searchParams.set('payment', paymentData.id)
    window.history.replaceState({}, '', url.toString())
    
    // Iniciar polling
    pollPaymentStatus(paymentData.id, (updatedStatus) => {
      setPayment(updatedStatus)
      
      if (updatedStatus.status === 'paid') {
        setCurrentStep('success')
      } else if (['canceled', 'failed'].includes(updatedStatus.status)) {
        setCurrentStep('error')
        setErrorMessage('Pagamento não foi processado')
      }
    })
  }

  const handleCheckoutError = (error: string) => {
    setErrorMessage(error)
    setCurrentStep('error')
  }

  const handleRefreshPayment = async () => {
    if (payment) {
      const updatedStatus = await getPaymentStatus(payment.id)
      if (updatedStatus) {
        setPayment(updatedStatus)
      }
    }
  }

  const handleBackToPricing = () => {
    router.push('/pricing')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  if (!plan && currentStep !== 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando plano...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToPricing}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar aos Planos</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <h1 className="text-xl font-semibold">
                {currentStep === 'checkout' && 'Finalizar Assinatura'}
                {currentStep === 'payment' && 'Status do Pagamento'}
                {currentStep === 'success' && 'Pagamento Aprovado'}
                {currentStep === 'error' && 'Erro no Pagamento'}
              </h1>
            </div>
            
            <div className="text-sm text-gray-500">
              MultiLink
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'checkout' && plan && (
          <CheckoutForm
            plan={plan}
            onSuccess={handleCheckoutSuccess}
            onError={handleCheckoutError}
          />
        )}

        {currentStep === 'payment' && payment && (
          <PaymentStatus
            payment={payment}
            onRefresh={handleRefreshPayment}
          />
        )}

        {currentStep === 'success' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Pagamento Aprovado!
              </h2>
              
              <p className="text-green-700 mb-6">
                Sua assinatura foi ativada com sucesso. Você já pode usar todas as funcionalidades do seu plano.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={handleGoToDashboard}
                  className="w-full"
                >
                  Ir para Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBackToPricing}
                  className="w-full"
                >
                  Ver Outros Planos
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'error' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Erro no Pagamento
              </h2>
              
              <p className="text-red-700 mb-6">
                {errorMessage || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.'}
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setCurrentStep('checkout')}
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBackToPricing}
                  className="w-full"
                >
                  Voltar aos Planos
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Processando...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
