import nodemailer from 'nodemailer'
import { PasswordResetToken } from '@prisma/client'
import { prisma } from './db'

// Configuração do transporter SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

// Interface para dados de email
interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Classe principal do serviço de email
export class EmailService {
  private static transporter = createTransporter()

  // Método genérico para enviar emails
  static async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
        console.warn('Configurações de email não encontradas. Email não enviado.')
        return { success: false, error: 'Configurações de email não definidas' }
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email enviado com sucesso:', result.messageId)
      
      return { success: true }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Enviar email de reset de senha
  static async sendPasswordResetEmail(
    email: string, 
    token: string, 
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    
    const html = this.generatePasswordResetTemplate(resetUrl, userName || email)
    const text = `
      Olá ${userName || ''},
      
      Recebemos uma solicitação para redefinir sua senha.
      
      Para redefinir sua senha, clique no link abaixo:
      ${resetUrl}
      
      Este link expira em 1 hora.
      
      Se você não solicitou esta redefinição, ignore este email.
      
      Atenciosamente,
      Equipe MultiLink
    `

    return await this.sendEmail({
      to: email,
      subject: 'Redefinir sua senha - MultiLink',
      html,
      text,
    })
  }

  // Enviar email de boas-vindas
  static async sendWelcomeEmail(
    email: string, 
    userName: string, 
    username?: string
  ): Promise<{ success: boolean; error?: string }> {
    const profileUrl = username ? `${process.env.NEXTAUTH_URL}/${username}` : `${process.env.NEXTAUTH_URL}/dashboard`
    
    const html = this.generateWelcomeTemplate(userName, profileUrl)
    const text = `
      Olá ${userName}!
      
      Bem-vindo(a) ao MultiLink! 🎉
      
      Sua conta foi criada com sucesso. Agora você pode começar a criar sua página de links personalizada.
      
      Acesse seu painel: ${process.env.NEXTAUTH_URL}/dashboard
      ${username ? `Sua página pública: ${profileUrl}` : ''}
      
      Atenciosamente,
      Equipe MultiLink
    `

    return await this.sendEmail({
      to: email,
      subject: 'Bem-vindo(a) ao MultiLink! 🎉',
      html,
      text,
    })
  }

  // Enviar email de notificação
  static async sendNotificationEmail(
    email: string,
    subject: string,
    message: string,
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    const html = this.generateNotificationTemplate(message, userName || email)
    const text = `
      Olá ${userName || ''},
      
      ${message}
      
      Atenciosamente,
      Equipe MultiLink
    `

    return await this.sendEmail({
      to: email,
      subject: `MultiLink - ${subject}`,
      html,
      text,
    })
  }

  // Template HTML para reset de senha
  private static generatePasswordResetTemplate(resetUrl: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - MultiLink</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { padding: 30px; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
            font-weight: bold;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
          .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 20px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Redefinir Senha</h1>
            <p>MultiLink - Sua plataforma de links</p>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta MultiLink.</p>
            <p>Para criar uma nova senha, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Sua senha atual permanecerá inalterada</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MultiLink. Todos os direitos reservados.</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Template HTML para boas-vindas
  private static generateWelcomeTemplate(userName: string, profileUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao MultiLink</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { padding: 30px; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 5px; 
            font-weight: bold;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
          .features { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 5px; 
          }
          .feature-item { 
            display: flex; 
            align-items: center; 
            margin: 10px 0; 
          }
          .feature-icon { 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin-right: 15px; 
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao MultiLink!</h1>
            <p>Sua jornada digital começa agora</p>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Parabéns! Sua conta no MultiLink foi criada com sucesso. Agora você pode começar a criar sua página de links personalizada e conectar-se com sua audiência de forma única.</p>
            
            <div class="features">
              <h3>🚀 O que você pode fazer:</h3>
              <div class="feature-item">
                <div class="feature-icon">🔗</div>
                <div>Criar e gerenciar links personalizados</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <div>Personalizar sua página com temas únicos</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <div>Acompanhar estatísticas de cliques</div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📱</div>
                <div>Integrar suas redes sociais</div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Acessar Dashboard</a>
              <a href="${profileUrl}" class="button">Ver Minha Página</a>
            </div>
            
            <p>Se você tiver alguma dúvida, nossa equipe de suporte está sempre pronta para ajudar!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MultiLink. Todos os direitos reservados.</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Template HTML para notificações
  private static generateNotificationTemplate(message: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notificação - MultiLink</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #fb923c, #ec4899); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { padding: 30px; }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
          .message-box { 
            background: #f8f9fa; 
            padding: 20px; 
            border-left: 4px solid #fb923c; 
            margin: 20px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Notificação</h1>
            <p>MultiLink</p>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <div class="message-box">
              ${message}
            </div>
            <p>Acesse seu dashboard para mais detalhes: <a href="${process.env.NEXTAUTH_URL}/dashboard">MultiLink Dashboard</a></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MultiLink. Todos os direitos reservados.</p>
            <p>Este é um email automático, não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Enviar confirmação de pagamento
   */
  static async sendPaymentConfirmation(
    userId: string, 
    paymentData: { planName: string; amount: number }
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      })

      if (!user) {
        console.error('Usuário não encontrado para confirmação de pagamento:', userId)
        return false
      }

      const subject = '✅ Pagamento Aprovado - MultiLink'
      const message = `
        <h3>🎉 Parabéns! Seu pagamento foi aprovado!</h3>
        <p><strong>Plano:</strong> ${paymentData.planName}</p>
        <p><strong>Valor:</strong> R$ ${paymentData.amount.toFixed(2)}</p>
        <p>Sua assinatura está ativa e você já pode usar todas as funcionalidades do seu plano.</p>
        <p>Acesse seu dashboard para começar a usar o MultiLink!</p>
      `

      await this.sendEmail({
        to: user.email,
        subject: subject,
        html: message,
        text: `Pagamento aprovado! Plano: ${paymentData.planName}, Valor: R$ ${paymentData.amount.toFixed(2)}`
      })
      console.log(`✅ Email de confirmação de pagamento enviado para ${user.email}`)
      return true

    } catch (error) {
      console.error('Erro ao enviar confirmação de pagamento:', error)
      return false
    }
  }

  /**
   * Enviar notificação de pagamento vencido
   */
  static async sendPaymentOverdue(
    userId: string, 
    paymentData: { planName: string; amount: number }
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      })

      if (!user) {
        console.error('Usuário não encontrado para notificação de vencimento:', userId)
        return false
      }

      const subject = '⚠️ Pagamento Vencido - MultiLink'
      const message = `
        <h3>⚠️ Atenção: Seu pagamento está vencido</h3>
        <p><strong>Plano:</strong> ${paymentData.planName}</p>
        <p><strong>Valor:</strong> R$ ${paymentData.amount.toFixed(2)}</p>
        <p>Para manter sua assinatura ativa, realize o pagamento o quanto antes.</p>
        <p>Acesse seu dashboard para ver as opções de pagamento.</p>
      `

      await this.sendEmail({
        to: user.email,
        subject: subject,
        html: message,
        text: `Pagamento vencido! Plano: ${paymentData.planName}, Valor: R$ ${paymentData.amount.toFixed(2)}`
      })
      console.log(`⚠️ Email de pagamento vencido enviado para ${user.email}`)
      return true

    } catch (error) {
      console.error('Erro ao enviar notificação de vencimento:', error)
      return false
    }
  }

  /**
   * Enviar notificação de cancelamento de assinatura
   */
  static async sendSubscriptionCancelled(
    userId: string, 
    planName: string
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      })

      if (!user) {
        console.error('Usuário não encontrado para notificação de cancelamento:', userId)
        return false
      }

      const subject = '❌ Assinatura Cancelada - MultiLink'
      const message = `
        <h3>❌ Sua assinatura foi cancelada</h3>
        <p><strong>Plano:</strong> ${planName}</p>
        <p>Sua assinatura foi cancelada conforme solicitado.</p>
        <p>Você ainda pode usar o plano gratuito do MultiLink.</p>
        <p>Se mudou de ideia, pode reativar sua assinatura a qualquer momento.</p>
      `

      await this.sendEmail({
        to: user.email,
        subject: subject,
        html: message,
        text: `Assinatura cancelada! Plano: ${paymentData.planName}`
      })
      console.log(`❌ Email de cancelamento enviado para ${user.email}`)
      return true

    } catch (error) {
      console.error('Erro ao enviar notificação de cancelamento:', error)
      return false
    }
  }

  // Verificar configuração do email
  static async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
        return { success: false, error: 'Configurações de email não definidas' }
      }

      await this.transporter.verify()
      return { success: true }
    } catch (error) {
      console.error('Erro na verificação da conexão SMTP:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro na conexão SMTP'
      }
    }
  }
}
