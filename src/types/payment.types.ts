export interface PaymentMethod {
  id: string
  name: string
  type: 'CREDIT_CARD' | 'PIX' | 'BOLETO' | 'DEBIT_CARD'
  icon: string
  description: string
  enabled: boolean
}

export interface CustomerData {
  name: string
  email: string
  cpfCnpj: string
  phone: string
  address?: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
}

export interface CheckoutData {
  planId: string
  paymentMethod: string
  customerData: CustomerData
  installments?: number
}

export interface PaymentResponse {
  id: string
  asaasId: string
  status: PaymentStatus
  paymentUrl?: string
  qrCode?: string
  qrCodeImage?: string
  barcode?: string
  barcodeImage?: string
  dueDate?: string
  amount: number
  currency: string
}

export interface AsaasCustomer {
  id: string
  name: string
  email: string
  cpfCnpj: string
  phone: string
  externalReference?: string
}

export interface AsaasCharge {
  id: string
  customer: string
  billingType: string
  value: number
  dueDate: string
  description: string
  status: string
  invoiceUrl?: string
  pixTransaction?: {
    qrCode: string
    qrCodeImage: string
  }
  bankSlipUrl?: string
  externalReference?: string
}

export interface AsaasWebhook {
  event: string
  payment: {
    id: string
    customer: string
    value: number
    netValue: number
    originalValue: number
    interestValue: number
    description: string
    billingType: string
    status: string
    pixTransaction?: any
    bankSlipUrl?: string
    invoiceUrl?: string
    externalReference?: string
    dueDate: string
    originalDueDate: string
    paymentDate?: string
    clientPaymentDate?: string
    installmentNumber?: number
    invoiceNumber?: string
    invoiceUrl?: string
    bankSlipUrl?: string
    transactionReceiptUrl?: string
    invoiceFined?: boolean
    postalService?: boolean
    creditCard?: any
  }
}

export type PaymentStatus = 
  | 'pending'
  | 'received'
  | 'paid'
  | 'overdue'
  | 'canceled'
  | 'refunded'
  | 'failed'

export interface PaymentHistory {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: string
  createdAt: string
  processedAt?: string
  description: string
  invoiceUrl?: string
}

export interface SubscriptionStatus {
  id: string
  planId: string
  planName: string
  status: 'active' | 'inactive' | 'canceled' | 'trial'
  startDate: string
  endDate?: string
  nextPaymentAt?: string
  amount: number
  currency: string
  paymentMethod: string
  trialEndsAt?: string
}
