import { NextRequest, NextResponse } from 'next/server'
import { AsaasService } from '@/lib/asaasService'
import { PaymentService } from '@/lib/paymentService'
import { AsaasWebhook } from '@/types/payment.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('asaas-signature') || request.headers.get('x-asaas-signature')

    console.log('📨 Webhook Asaas recebido:', {
      signature: signature ? 'presente' : 'ausente',
      bodyLength: body.length
    })

    // Verificar assinatura do webhook
    if (signature && !AsaasService.verifyWebhookSignature(body, signature)) {
      console.error('❌ Assinatura do webhook inválida')
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      )
    }

    // Parse do JSON
    let webhookData: AsaasWebhook
    try {
      webhookData = JSON.parse(body)
    } catch (error) {
      console.error('❌ Erro ao fazer parse do webhook:', error)
      return NextResponse.json(
        { error: 'JSON inválido' },
        { status: 400 }
      )
    }

    // Validar estrutura do webhook
    if (!webhookData.event || !webhookData.payment) {
      console.error('❌ Estrutura do webhook inválida:', webhookData)
      return NextResponse.json(
        { error: 'Estrutura inválida' },
        { status: 400 }
      )
    }

    console.log(`🔄 Processando webhook: ${webhookData.event} para pagamento ${webhookData.payment.id}`)

    // Processar webhook
    await PaymentService.processWebhook(webhookData)

    console.log(`✅ Webhook processado com sucesso: ${webhookData.event}`)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error)
    
    // Retornar 200 para evitar reenvios da Asaas
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      },
      { status: 200 }
    )
  }
}

// Endpoint para teste de webhook
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook Asaas ativo',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}
