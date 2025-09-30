import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/paymentService'
import { CheckoutData } from '@/types/payment.types'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const checkoutData: CheckoutData = await request.json()

    // Validar dados obrigatórios
    if (!checkoutData.planId || !checkoutData.paymentMethod || !checkoutData.customerData) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Validar dados do cliente
    const { customerData } = checkoutData
    if (!customerData.name || !customerData.email || !customerData.cpfCnpj || !customerData.phone) {
      return NextResponse.json(
        { success: false, error: 'Dados do cliente incompletos' },
        { status: 400 }
      )
    }

    // Validar CPF/CNPJ
    const cpfCnpj = customerData.cpfCnpj.replace(/\D/g, '')
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      return NextResponse.json(
        { success: false, error: 'CPF/CNPJ inválido' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Debug: verificar dados do checkout
    console.log('🔍 Debug checkout route:')
    console.log('checkoutData:', JSON.stringify(checkoutData, null, 2))
    console.log('checkoutData.amount:', checkoutData.amount)
    console.log('checkoutData.amount type:', typeof checkoutData.amount)

    // Processar checkout
    const paymentResponse = await PaymentService.processCheckout(
      session.user.id,
      checkoutData
    )

    return NextResponse.json({
      success: true,
      data: paymentResponse
    })

  } catch (error: any) {
    console.error('Erro no checkout:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
