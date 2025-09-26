import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const { email, testType = 'reset' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    console.log(`🧪 Testando SMTP - Email: ${email}, Tipo: ${testType}`)

    let result

    switch (testType) {
      case 'reset':
        result = await EmailService.sendPasswordResetEmail(
          email,
          'token-teste-123456',
          'Usuário Teste'
        )
        break
      
      case 'welcome':
        result = await EmailService.sendWelcomeEmail(
          email,
          'Usuário Teste',
          'usuario-teste'
        )
        break
      
      case 'notification':
        result = await EmailService.sendNotificationEmail(
          email,
          'Teste de Notificação',
          'Este é um email de teste do sistema MultiLink!',
          'Usuário Teste'
        )
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de teste inválido. Use: reset, welcome ou notification' },
          { status: 400 }
        )
    }

    if (result.success) {
      console.log('✅ Email de teste enviado com sucesso!')
      return NextResponse.json({
        success: true,
        message: `Email de ${testType} enviado com sucesso para ${email}!`,
        type: testType
      })
    } else {
      console.error('❌ Erro ao enviar email:', result.error)
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro ao enviar email: ${result.error}` 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Erro no teste SMTP:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}

// Endpoint GET para testar conexão
export async function GET() {
  try {
    console.log('🧪 Testando conexão SMTP...')
    
    const result = await EmailService.verifyConnection()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Conexão SMTP OK!',
        config: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          user: process.env.EMAIL_SERVER_USER ? 'Configurado' : 'Não configurado'
        }
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro na conexão: ${result.error}`,
          config: {
            host: process.env.EMAIL_SERVER_HOST || 'Não configurado',
            port: process.env.EMAIL_SERVER_PORT || 'Não configurado',
            user: process.env.EMAIL_SERVER_USER || 'Não configurado'
          }
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
