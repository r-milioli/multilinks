import { prisma } from './db'
import { AsaasService } from './asaasService'
import { EmailService } from './emailService'
import { PlanLimitsService } from '@/shared/services/planLimitsService'
import { 
  CheckoutData, 
  PaymentResponse, 
  PaymentStatus, 
  CustomerData,
  AsaasWebhook 
} from '@/types/payment.types'

export class PaymentService {
  /**
   * Processar checkout completo
   */
  static async processCheckout(
    userId: string,
    checkoutData: CheckoutData
  ): Promise<PaymentResponse> {
    try {
      // 1. Validar plano
      const plan = await PlanLimitsService.getPlanLimits(checkoutData.planId)
      if (!plan) {
        throw new Error('Plano inválido')
      }

      // Debug: verificar dados do plano
      console.log('🔍 Debug PaymentService:')
      console.log('checkoutData.planId:', checkoutData.planId)
      console.log('plan:', JSON.stringify(plan, null, 2))
      console.log('plan.price:', plan.price)
      console.log('plan.price type:', typeof plan.price)

      // 2. Criar cliente na Asaas
      const asaasCustomer = await AsaasService.createCustomer(checkoutData.customerData)

      // 3. Criar cobrança na Asaas
      const charge = await AsaasService.createCharge({
        customerId: asaasCustomer.id,
        amount: plan.price,
        description: `Assinatura ${plan.name} - MultiLink`,
        paymentMethod: checkoutData.paymentMethod,
        installments: checkoutData.installments
      })

      // 4. Criar ou atualizar assinatura no banco
      const subscription = await prisma.subscription.upsert({
        where: { userId },
        update: {
          planId: checkoutData.planId,
          planName: plan.name,
          amount: plan.price,
          status: 'pending',
          startDate: new Date(),
          billingCycle: 'monthly',
          paymentMethod: checkoutData.paymentMethod,
          trialEndsAt: checkoutData.planId === 'free' ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias de trial
        },
        create: {
          userId,
          planId: checkoutData.planId,
          planName: plan.name,
          amount: plan.price,
          status: 'pending',
          startDate: new Date(),
          billingCycle: 'monthly',
          paymentMethod: checkoutData.paymentMethod,
          trialEndsAt: checkoutData.planId === 'free' ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias de trial
        }
      })

      // 5. Criar pagamento no banco
      const payment = await prisma.payment.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          amount: plan.price,
          status: 'pending',
          paymentMethod: checkoutData.paymentMethod,
          transactionId: charge.id,
          gatewayResponse: charge
        }
      })

      // 6. Preparar resposta
      const response: PaymentResponse = {
        id: payment.id,
        asaasId: charge.id,
        status: 'pending',
        amount: plan.price,
        currency: 'BRL'
      }

      // Debug: verificar dados da cobrança
      console.log('🔍 Debug PaymentService - dados da cobrança:')
      console.log('charge:', JSON.stringify(charge, null, 2))
      console.log('checkoutData.paymentMethod:', checkoutData.paymentMethod)

      // 7. Adicionar dados específicos do método de pagamento
      if (checkoutData.paymentMethod === 'PIX') {
        const pixData = AsaasService.getPixData(charge)
        console.log('pixData:', pixData)
        if (pixData) {
          response.qrCode = pixData.qrCode
          response.qrCodeImage = pixData.qrCodeImage
        } else {
          // Se não tem dados PIX específicos, usar URL de pagamento
          const paymentUrl = AsaasService.generatePaymentUrl(charge)
          console.log('PIX sem dados específicos, usando paymentUrl:', paymentUrl)
          response.paymentUrl = paymentUrl
        }
      } else if (checkoutData.paymentMethod === 'BOLETO') {
        const boletoData = AsaasService.getBoletoData(charge)
        console.log('boletoData:', boletoData)
        if (boletoData) {
          response.barcode = boletoData.barcode
          response.barcodeImage = boletoData.barcodeImage
        } else {
          // Se não tem dados boleto específicos, usar URL de pagamento
          const paymentUrl = AsaasService.generatePaymentUrl(charge)
          console.log('Boleto sem dados específicos, usando paymentUrl:', paymentUrl)
          response.paymentUrl = paymentUrl
        }
      } else {
        // Para cartão de crédito, retornar URL de pagamento
        const paymentUrl = AsaasService.generatePaymentUrl(charge)
        console.log('paymentUrl:', paymentUrl)
        response.paymentUrl = paymentUrl
      }
      
      // Garantir que sempre tenha uma URL de pagamento
      if (!response.paymentUrl && !response.qrCode && !response.barcode) {
        const fallbackUrl = AsaasService.generatePaymentUrl(charge)
        console.log('Fallback: usando paymentUrl para todos os métodos:', fallbackUrl)
        response.paymentUrl = fallbackUrl
      }

      console.log('🔍 Debug PaymentService - resposta final:')
      console.log('response:', JSON.stringify(response, null, 2))

      return response

    } catch (error) {
      console.error('Erro no processamento do checkout:', error)
      throw error
    }
  }

  /**
   * Processar webhook da Asaas
   */
  static async processWebhook(webhookData: AsaasWebhook): Promise<void> {
    try {
      const { event, payment } = webhookData

      // Buscar pagamento no banco
      const dbPayment = await prisma.payment.findFirst({
        where: { transactionId: payment.id }
      })

      if (!dbPayment) {
        console.error(`Pagamento não encontrado: ${payment.id}`)
        return
      }

      // Buscar subscription separadamente
      let subscription = null
      if (dbPayment.subscriptionId) {
        subscription = await prisma.subscription.findUnique({
          where: { id: dbPayment.subscriptionId }
        })
      }

      if (!subscription) {
        console.error(`Subscription não encontrada para pagamento: ${payment.id}`)
        return
      }

      // Atualizar status do pagamento
      let paymentStatus: PaymentStatus = 'pending'
      let subscriptionStatus = subscription.status

      switch (event) {
        case 'PAYMENT_CONFIRMED':
          paymentStatus = 'paid'
          subscriptionStatus = 'active'
          break
        case 'PAYMENT_RECEIVED':
          paymentStatus = 'received'
          break
        case 'PAYMENT_OVERDUE':
          paymentStatus = 'overdue'
          break
        case 'PAYMENT_CANCELLED':
          paymentStatus = 'canceled'
          subscriptionStatus = 'canceled'
          break
        case 'PAYMENT_REFUNDED':
          paymentStatus = 'refunded'
          break
        default:
          console.log(`Evento não tratado: ${event}`)
          return
      }

      // Atualizar pagamento
      await prisma.payment.update({
        where: { id: dbPayment.id },
        data: {
          status: paymentStatus,
          processedAt: event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED' ? new Date() : undefined,
          gatewayResponse: payment
        }
      })

      // Atualizar assinatura se necessário
      if (subscriptionStatus !== subscription.status) {
        await prisma.subscription.update({
          where: { id: dbPayment.subscriptionId },
          data: {
            status: subscriptionStatus,
            lastPaymentAt: event === 'PAYMENT_CONFIRMED' ? new Date() : undefined,
            nextPaymentAt: event === 'PAYMENT_CONFIRMED' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
          }
        })

        // Atualizar UserStats
        await prisma.userStats.upsert({
          where: { userId: dbPayment.userId },
          update: {
            subscriptionPlan: subscription.planId,
            subscriptionStatus: subscriptionStatus
          },
          create: {
            userId: dbPayment.userId,
            subscriptionPlan: subscription.planId,
            subscriptionStatus: subscriptionStatus
          }
        })
      }

      // Enviar notificações por email
      if (event === 'PAYMENT_CONFIRMED') {
        await EmailService.sendPaymentConfirmation(dbPayment.userId, {
          planName: subscription.planName,
          amount: dbPayment.amount
        })
      } else if (event === 'PAYMENT_OVERDUE') {
        await EmailService.sendPaymentOverdue(dbPayment.userId, {
          planName: subscription.planName,
          amount: dbPayment.amount
        })
      }

      console.log(`✅ Webhook processado: ${event} para usuário ${dbPayment.userId}`)

    } catch (error) {
      console.error('Erro ao processar webhook:', error)
      throw error
    }
  }

  /**
   * Buscar status do pagamento
   */
  static async getPaymentStatus(paymentId: string, userId: string): Promise<PaymentResponse | null> {
    try {
      const payment = await prisma.payment.findFirst({
        where: { 
          id: paymentId,
          userId 
        }
      })

      if (!payment) {
        return null
      }

      // Buscar subscription separadamente se necessário
      let subscription = null
      if (payment.subscriptionId) {
        subscription = await prisma.subscription.findUnique({
          where: { id: payment.subscriptionId }
        })
      }

      // Buscar status atualizado na Asaas
      const asaasPayment = await AsaasService.getPaymentStatus(payment.transactionId)

      // Atualizar status no banco se necessário
      if (asaasPayment.status !== payment.status) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: asaasPayment.status.toLowerCase(),
            gatewayResponse: asaasPayment
          }
        })
      }

      return {
        id: payment.id,
        asaasId: payment.transactionId,
        status: asaasPayment.status.toLowerCase(),
        amount: payment.amount,
        currency: payment.currency
      }

    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error)
      throw error
    }
  }

  /**
   * Buscar histórico de pagamentos do usuário
   */
  static async getPaymentHistory(userId: string, limit = 10): Promise<any[]> {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        include: { subscription: true },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      return payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
        processedAt: payment.processedAt,
        description: `Assinatura ${subscription?.planName || 'N/A'}`,
        invoiceUrl: (payment.gatewayResponse as any)?.invoiceUrl
      }))

    } catch (error) {
      console.error('Erro ao buscar histórico de pagamentos:', error)
      throw error
    }
  }

  /**
   * Cancelar assinatura
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })

      if (!subscription) {
        throw new Error('Assinatura não encontrada')
      }

      // Cancelar na Asaas se houver pagamento pendente
      if (subscription.status === 'active' || subscription.status === 'pending') {
        try {
          await AsaasService.cancelPayment(subscription.id)
        } catch (error) {
          console.warn('Erro ao cancelar na Asaas:', error)
        }
      }

      // Atualizar no banco
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'canceled',
          endDate: new Date()
        }
      })

      // Atualizar UserStats
      await prisma.userStats.update({
        where: { userId },
        data: {
          subscriptionStatus: 'canceled'
        }
      })

      return true

    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error)
      throw error
    }
  }
}
