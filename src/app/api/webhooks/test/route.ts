import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WebhookService } from '@/lib/webhooks'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'URL do webhook não fornecida' },
        { status: 400 }
      )
    }

    // Validar URL
    try {
      new URL(webhookUrl)
    } catch {
      return NextResponse.json(
        { success: false, error: 'URL do webhook inválida' },
        { status: 400 }
      )
    }

    // Usar o WebhookService para enviar teste
    const result = await WebhookService.sendTest(
      webhookUrl,
      session.user.id,
      session.user.email || undefined
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook testado com sucesso'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Erro ao testar webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
