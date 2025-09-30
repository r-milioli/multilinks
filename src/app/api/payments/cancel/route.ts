import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/paymentService'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'ID da assinatura não fornecido' },
        { status: 400 }
      )
    }

    const success = await PaymentService.cancelSubscription(session.user.id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Erro ao cancelar assinatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Assinatura cancelada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
