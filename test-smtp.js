// Script para testar conexão SMTP
const { EmailService } = require('./src/lib/emailService.ts')

async function testSMTP() {
  console.log('🧪 Testando conexão SMTP...')
  
  try {
    // Testar conexão
    const connectionResult = await EmailService.verifyConnection()
    
    if (connectionResult.success) {
      console.log('✅ Conexão SMTP OK!')
      
      // Testar envio de email
      console.log('📧 Testando envio de email...')
      
      const emailResult = await EmailService.sendPasswordResetEmail(
        'seu-email@teste.com', // Substitua pelo seu email
        'token-teste-123',
        'Usuário Teste'
      )
      
      if (emailResult.success) {
        console.log('✅ Email enviado com sucesso!')
      } else {
        console.log('❌ Erro ao enviar email:', emailResult.error)
      }
    } else {
      console.log('❌ Erro na conexão SMTP:', connectionResult.error)
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testSMTP()
