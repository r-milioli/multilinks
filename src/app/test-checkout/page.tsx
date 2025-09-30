'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutForm } from '@/modules/payments/components/CheckoutForm'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'

export default function TestCheckoutPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const testPlans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      description: 'Plano Pro para profissionais'
    },
    {
      id: 'business',
      name: 'Business',
      price: 49,
      description: 'Plano Business para empresas'
    }
  ]

  const handleCheckoutSuccess = (payment: any) => {
    console.log('Checkout realizado com sucesso:', payment)
    alert('Checkout realizado com sucesso! Verifique o console para detalhes.')
  }

  const handleCheckoutError = (error: string) => {
    console.error('Erro no checkout:', error)
    alert(`Erro no checkout: ${error}`)
  }

  if (selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedPlan(null)}
            >
              ← Voltar para seleção de planos
            </Button>
          </div>
          
          <CheckoutForm
            plan={selectedPlan}
            onSuccess={handleCheckoutSuccess}
            onError={handleCheckoutError}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Teste de Checkout</h1>
          <p className="text-gray-600">
            Selecione um plano para testar o fluxo de checkout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testPlans.map((plan) => (
            <Card key={plan.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  R$ {plan.price.toFixed(2)}/mês
                </div>
                <Button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full"
                >
                  Testar Checkout
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/pricing')}
          >
            Ir para página de preços
          </Button>
        </div>
      </div>
    </div>
  )
}
