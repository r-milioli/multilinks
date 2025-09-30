'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { CheckoutData, PaymentResponse, CustomerData } from '@/types/payment.types'
import { CreditCard, Smartphone, Loader2 } from 'lucide-react'

interface CheckoutFormProps {
  plan: {
    id: string
    name: string
    price: number
    description: string
  }
  onSuccess: (payment: PaymentResponse) => void
  onError: (error: string) => void
}

export function CheckoutForm({ plan, onSuccess, onError }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    cpfCnpj: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('PIX')
  const [installments, setInstallments] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const paymentMethods = [
    {
      id: 'CREDIT_CARD',
      name: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Parcelamento em até 12x',
      enabled: true
    },
    {
      id: 'PIX',
      name: 'PIX',
      icon: Smartphone,
      description: 'Pagamento instantâneo',
      enabled: true
    }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.cpfCnpj.trim()) {
      newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório'
    } else {
      const cpfCnpj = formData.cpfCnpj.replace(/\D/g, '')
      if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
        newErrors.cpfCnpj = 'CPF/CNPJ inválido'
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const checkoutData: CheckoutData = {
        planId: plan.id,
        paymentMethod,
        customerData: formData,
        installments: paymentMethod === 'CREDIT_CARD' ? installments : undefined
      }

      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.data)
      } else {
        throw new Error(result.error || 'Erro no checkout')
      }
    } catch (error: any) {
      console.error('Erro no checkout:', error)
      onError(error.message || 'Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Finalizar Assinatura
        </CardTitle>
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {plan.name} - R$ {plan.price.toFixed(2)}/mês
          </Badge>
          <p className="text-gray-600 mt-2">{plan.description}</p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
              <p className="text-sm text-gray-600">Preencha suas informações para finalizar a compra</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={errors.name}
                placeholder="Digite seu nome completo"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                error={errors.email}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="CPF/CNPJ"
                value={formData.cpfCnpj}
                onChange={(e) => setFormData({...formData, cpfCnpj: formatCpfCnpj(e.target.value)})}
                error={errors.cpfCnpj}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                required
              />

              <Input
                label="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                error={errors.phone}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
              <p className="text-sm text-gray-600">Escolha como deseja pagar sua assinatura</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    disabled={!method.enabled}
                    className={`p-6 border-2 rounded-lg transition-all text-left ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={`h-6 w-6 ${
                        paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <h4 className={`font-semibold ${
                        paymentMethod === method.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {method.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    {paymentMethod === method.id && (
                      <div className="mt-3 flex items-center text-blue-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Selecionado</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Parcelamento (apenas para cartão) */}
          {paymentMethod === 'CREDIT_CARD' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h4 className="text-md font-semibold text-gray-900">Parcelamento</h4>
                <p className="text-sm text-gray-600">Escolha em quantas vezes deseja pagar</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setInstallments(num)}
                    className={`p-3 border-2 rounded-lg transition-all text-center ${
                      installments === num
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      {num}x
                    </div>
                    <div className="text-xs text-gray-600">
                      R$ {(plan.price / num).toFixed(2)}
                    </div>
                    {num === 1 && (
                      <div className="text-xs text-green-600 font-medium">
                        à vista
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              `Finalizar Pagamento - R$ ${plan.price.toFixed(2)}`
            )}
          </Button>

          {/* Informações de Segurança */}
          <div className="text-center text-sm text-gray-500">
            <p>🔒 Pagamento 100% seguro e criptografado</p>
            <p>Seus dados estão protegidos pela certificação PCI-DSS</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
