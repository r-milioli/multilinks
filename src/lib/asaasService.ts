import { 
  CustomerData, 
  AsaasCustomer, 
  AsaasCharge, 
  PaymentResponse,
  AsaasWebhook 
} from '@/types/payment.types'

export class AsaasService {
  private static readonly API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3'
  private static readonly API_KEY = (() => {
    // Tentar diferentes formas de acessar a variável
    const key1 = process.env.ASAAS_API_KEY
    const key2 = process.env['ASAAS_API_KEY']
    const key3 = process.env['$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjZmMWY2ZDcxLTVkMDYtNDcwNi1iYTE4LTMzNTlkOTUwMTQwNjo6JGFhY2hfNDQyMzEwOGEtMDQyZC00N2FkLTg4MDAtNDUwMzM5NmFkZTNk']
    
    // Se nenhuma funcionar, usar a chave hardcoded temporariamente
    return key1 || key2 || key3 || '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjZmMWY2ZDcxLTVkMDYtNDcwNi1iYTE4LTMzNTlkOTUwMTQwNjo6JGFhY2hfNDQyMzEwOGEtMDQyZC00N2FkLTg4MDAtNDUwMzM5NmFkZTNk'
  })()
  private static readonly WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET

  /**
   * Criar cliente na Asaas
   */
  static async createCustomer(customerData: CustomerData): Promise<AsaasCustomer> {
    // Debug temporário
    console.log('🔍 Debug AsaasService:')
    console.log('process.env.ASAAS_API_KEY:', process.env.ASAAS_API_KEY ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
    console.log('process.env.ASAAS_API_KEY value:', process.env.ASAAS_API_KEY)
    console.log('this.API_KEY:', this.API_KEY ? 'CONFIGURADA' : 'NÃO CONFIGURADA')
    console.log('this.API_KEY value:', this.API_KEY ? this.API_KEY.substring(0, 10) + '...' : 'VAZIA')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    if (!this.API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada')
    }

    try {
      const response = await fetch(`${this.API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.API_KEY
        },
        body: JSON.stringify({
          name: customerData.name,
          email: customerData.email,
          cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''), // Remove formatação
          phone: customerData.phone.replace(/\D/g, ''), // Remove formatação
          externalReference: `user_${Date.now()}`, // Referência externa
          ...(customerData.address && {
            address: customerData.address.street,
            addressNumber: customerData.address.number,
            complement: customerData.address.complement,
            neighborhood: customerData.address.neighborhood,
            city: customerData.address.city,
            state: customerData.address.state,
            zipCode: customerData.address.zipCode.replace(/\D/g, '')
          })
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Erro ao criar cliente: ${error.errors?.[0]?.description || 'Erro desconhecido'}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar cliente na Asaas:', error)
      throw error
    }
  }

  /**
   * Criar cobrança na Asaas
   */
  static async createCharge(data: {
    customerId: string
    amount: number
    description: string
    paymentMethod: string
    dueDate?: string
    installments?: number
  }): Promise<AsaasCharge> {
    if (!this.API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada')
    }

    try {
      const dueDate = data.dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 dias

      const chargeData: any = {
        customer: data.customerId,
        billingType: data.paymentMethod,
        value: data.amount,
        dueDate,
        description: data.description,
        externalReference: `payment_${Date.now()}`
      }

      // Debug: verificar dados da cobrança
      console.log('🔍 Debug createCharge:')
      console.log('data.amount:', data.amount)
      console.log('data.amount type:', typeof data.amount)
      console.log('chargeData.value:', chargeData.value)
      console.log('chargeData completo:', JSON.stringify(chargeData, null, 2))

      // Para cartão de crédito com parcelamento
      if (data.paymentMethod === 'CREDIT_CARD' && data.installments && data.installments > 1) {
        chargeData.installmentCount = data.installments
        chargeData.installmentValue = data.amount / data.installments
      }

      const response = await fetch(`${this.API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.API_KEY
        },
        body: JSON.stringify(chargeData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Erro ao criar cobrança: ${error.errors?.[0]?.description || 'Erro desconhecido'}`)
      }

      const result = await response.json()
      
      // Debug: verificar resposta da Asaas
      console.log('🔍 Debug Asaas response:')
      console.log('Asaas response completo:', JSON.stringify(result, null, 2))
      
      return result
    } catch (error) {
      console.error('Erro ao criar cobrança na Asaas:', error)
      throw error
    }
  }

  /**
   * Buscar status do pagamento
   */
  static async getPaymentStatus(paymentId: string): Promise<AsaasCharge> {
    if (!this.API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada')
    }

    try {
      const response = await fetch(`${this.API_URL}/payments/${paymentId}`, {
        headers: {
          'access_token': this.API_KEY
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Erro ao buscar pagamento: ${error.errors?.[0]?.description || 'Erro desconhecido'}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error)
      throw error
    }
  }

  /**
   * Cancelar pagamento
   */
  static async cancelPayment(paymentId: string): Promise<AsaasCharge> {
    if (!this.API_KEY) {
      throw new Error('ASAAS_API_KEY não configurada')
    }

    try {
      const response = await fetch(`${this.API_URL}/payments/${paymentId}`, {
        method: 'DELETE',
        headers: {
          'access_token': this.API_KEY
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Erro ao cancelar pagamento: ${error.errors?.[0]?.description || 'Erro desconhecido'}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error)
      throw error
    }
  }

  /**
   * Verificar assinatura do webhook
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.WEBHOOK_SECRET) {
      console.warn('ASAAS_WEBHOOK_SECRET não configurada - webhook não verificado')
      return true // Em desenvolvimento, aceitar sem verificação
    }

    try {
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.WEBHOOK_SECRET)
        .update(payload)
        .digest('hex')
      
      return signature === expectedSignature
    } catch (error) {
      console.error('Erro ao verificar assinatura do webhook:', error)
      return false
    }
  }

  /**
   * Processar webhook da Asaas
   */
  static async processWebhook(webhookData: AsaasWebhook): Promise<{
    success: boolean
    action: string
    paymentId: string
  }> {
    try {
      const { event, payment } = webhookData
      
      console.log(`📨 Webhook recebido: ${event} para pagamento ${payment.id}`)

      return {
        success: true,
        action: event,
        paymentId: payment.id
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      return {
        success: false,
        action: 'error',
        paymentId: ''
      }
    }
  }

  /**
   * Gerar link de pagamento para PIX/Boleto
   */
  static generatePaymentUrl(charge: AsaasCharge): string {
    console.log('🔍 Debug generatePaymentUrl:')
    console.log('charge.invoiceUrl:', charge.invoiceUrl)
    console.log('charge.id:', charge.id)
    
    // Priorizar invoiceUrl se existir
    if (charge.invoiceUrl) {
      console.log('Usando invoiceUrl:', charge.invoiceUrl)
      return charge.invoiceUrl
    }
    
    // Remover prefixo 'pay_' do ID se existir
    const cleanId = charge.id.replace(/^pay_/, '')
    console.log('ID limpo (sem pay_):', cleanId)
    
    // Para sandbox, usar URL de pagamento direto
    const isSandbox = this.API_URL.includes('sandbox')
    if (isSandbox) {
      const sandboxUrl = `https://sandbox.asaas.com/i/${cleanId}`
      console.log('Usando sandbox URL:', sandboxUrl)
      return sandboxUrl
    }
    
    // Para produção, usar URL de pagamento direto
    const productionUrl = `https://www.asaas.com/i/${cleanId}`
    console.log('Usando production URL:', productionUrl)
    return productionUrl
  }

  /**
   * Obter dados do PIX
   */
  static getPixData(charge: AsaasCharge): { qrCode: string; qrCodeImage: string } | null {
    console.log('🔍 Debug getPixData:')
    console.log('charge.pixTransaction:', charge.pixTransaction)
    
    if (charge.pixTransaction) {
      const pixData = {
        qrCode: charge.pixTransaction.qrCode,
        qrCodeImage: charge.pixTransaction.qrCodeImage
      }
      console.log('PIX data encontrado:', pixData)
      return pixData
    }
    
    console.log('PIX data não encontrado na resposta da Asaas')
    return null
  }

  /**
   * Obter dados do Boleto
   */
  static getBoletoData(charge: AsaasCharge): { barcode: string; barcodeImage: string } | null {
    if (charge.bankSlipUrl) {
      return {
        barcode: charge.bankSlipUrl,
        barcodeImage: charge.bankSlipUrl
      }
    }
    return null
  }
}
