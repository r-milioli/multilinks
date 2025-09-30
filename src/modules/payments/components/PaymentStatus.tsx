'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { PaymentResponse } from '@/types/payment.types'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  QrCode, 
  FileText, 
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react'

interface PaymentStatusProps {
  payment: PaymentResponse
  onRefresh?: () => void
}

export function PaymentStatus({ payment, onRefresh }: PaymentStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(payment.status)

  // Debug: verificar dados do pagamento
  console.log('🔍 Debug PaymentStatus - dados recebidos:')
  console.log('payment:', JSON.stringify(payment, null, 2))
  console.log('payment.paymentUrl:', payment.paymentUrl)
  console.log('payment.qrCode:', payment.qrCode)
  console.log('payment.barcode:', payment.barcode)

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Aguardando Pagamento',
      description: 'Seu pagamento está sendo processado'
    },
    received: {
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Pagamento Recebido',
      description: 'Pagamento confirmado, processando assinatura'
    },
    paid: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Pagamento Aprovado',
      description: 'Sua assinatura está ativa!'
    },
    overdue: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Pagamento Vencido',
      description: 'O prazo para pagamento expirou'
    },
    canceled: {
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      label: 'Pagamento Cancelado',
      description: 'Este pagamento foi cancelado'
    },
    refunded: {
      icon: XCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      label: 'Pagamento Estornado',
      description: 'Este pagamento foi estornado'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Pagamento Falhou',
      description: 'Ocorreu um erro no processamento'
    }
  }

  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = config.icon

  const handleRefresh = async () => {
    if (!onRefresh) return
    
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  const openPaymentUrl = () => {
    if (payment.paymentUrl) {
      window.open(payment.paymentUrl, '_blank')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Status do Pagamento</CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Principal */}
        <div className={`p-6 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}>
          <div className="flex items-center space-x-4">
            <StatusIcon className={`h-12 w-12 ${config.color}`} />
            <div>
              <h3 className={`text-xl font-semibold ${config.color}`}>
                {config.label}
              </h3>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Informações do Pagamento */}
        <div className="space-y-4">
          <h4 className="font-semibold">Detalhes do Pagamento</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Valor:</span>
              <p className="font-semibold">R$ {Number(payment.amount).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-600">Moeda:</span>
              <p className="font-semibold">{payment.currency}</p>
            </div>
            <div>
              <span className="text-gray-600">ID do Pagamento:</span>
              <p className="font-mono text-xs">{payment.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <Badge variant="outline" className={config.color}>
                {currentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* PIX QR Code */}
        {payment.qrCode && (
          <div className="space-y-4">
            <h4 className="font-semibold">PIX - Pagamento Instantâneo</h4>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600 mb-4">
                  Escaneie o QR Code com seu app do banco
                </p>
                
                {payment.qrCodeImage && (
                  <div className="mb-4">
                    <img 
                      src={payment.qrCodeImage} 
                      alt="QR Code PIX" 
                      className="mx-auto border rounded"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Código PIX:</p>
                  <div className="bg-white p-2 rounded border font-mono text-xs break-all">
                    {payment.qrCode}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(payment.qrCode!)}
                  >
                    Copiar Código
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boleto Bancário */}
        {payment.barcode && (
          <div className="space-y-4">
            <h4 className="font-semibold">Boleto Bancário</h4>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-600 mb-4">
                  Pague em qualquer banco ou lotérica
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Código de Barras:</p>
                  <div className="bg-white p-2 rounded border font-mono text-xs break-all">
                    {payment.barcode}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(payment.barcode!)}
                  >
                    Copiar Código
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão de Pagamento - Sempre mostrar */}
        <div className="space-y-4">
          <h4 className="font-semibold">Finalizar Pagamento</h4>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="text-center">
              <ExternalLink className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-blue-800 mb-4">
                Clique no botão abaixo para finalizar seu pagamento
              </p>
              
              {payment.paymentUrl ? (
                <Button
                  onClick={openPaymentUrl}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Finalizar Pagamento - R$ {Number(payment.amount).toFixed(2)}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // Gerar URL de pagamento baseada no ID da Asaas (removendo prefixo pay_)
                    const cleanId = payment.asaasId.replace(/^pay_/, '')
                    const paymentUrl = `https://sandbox.asaas.com/i/${cleanId}`
                    window.open(paymentUrl, '_blank')
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Finalizar Pagamento - R$ {Number(payment.amount).toFixed(2)}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-4">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar Status
                </>
              )}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1"
          >
            Ir para Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
