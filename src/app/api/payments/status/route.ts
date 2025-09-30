import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/paymentService'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'ID do pagamento não fornecido' },
        { status: 400 }
      )
    }

    const paymentStatus = await PaymentService.getPaymentStatus(paymentId, session.user.id)

    if (!paymentStatus) {
      return NextResponse.json(
        { success: false, error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentStatus
    })

  } catch (error: any) {
    console.error('Erro ao buscar status do pagamento:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
