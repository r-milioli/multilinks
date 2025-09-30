/**
 * Script para testar a integração com a Asaas
 * Execute com: node scripts/test-asaas-integration.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAsaasIntegration() {
  console.log('🧪 Testando integração com Asaas...\n')

  try {
    // 1. Verificar configurações
    console.log('1️⃣ Verificando configurações...')
    
    const requiredEnvVars = [
      'ASAAS_API_KEY',
      'ASAAS_API_URL',
      'ASAAS_WEBHOOK_SECRET'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('❌ Variáveis de ambiente ausentes:', missingVars.join(', '))
      console.log('💡 Configure as variáveis no arquivo .env.local')
      return
    }

    console.log('✅ Configurações encontradas')

    // 2. Testar conexão com a API da Asaas
    console.log('\n2️⃣ Testando conexão com API da Asaas...')
    
    const response = await fetch(`${process.env.ASAAS_API_URL}/customers`, {
      method: 'GET',
      headers: {
        'access_token': process.env.ASAAS_API_KEY
      }
    })

    if (response.ok) {
      console.log('✅ Conexão com API da Asaas estabelecida')
    } else {
      const error = await response.json()
      console.error('❌ Erro na conexão com API:', error)
      return
    }

    // 3. Verificar estrutura do banco
    console.log('\n3️⃣ Verificando estrutura do banco...')
    
    const tables = ['User', 'Subscription', 'Payment', 'UserStats']
    
    for (const table of tables) {
      try {
        const count = await prisma[table.toLowerCase()].count()
        console.log(`✅ Tabela ${table}: ${count} registros`)
      } catch (error) {
        console.error(`❌ Erro na tabela ${table}:`, error.message)
      }
    }

    // 4. Testar criação de cliente
    console.log('\n4️⃣ Testando criação de cliente...')
    
    const testCustomer = {
      name: 'Cliente Teste',
      email: 'teste@multilink.com',
      cpfCnpj: '12345678901',
      phone: '11999999999'
    }

    const customerResponse = await fetch(`${process.env.ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY
      },
      body: JSON.stringify({
        ...testCustomer,
        cpfCnpj: testCustomer.cpfCnpj.replace(/\D/g, ''),
        phone: testCustomer.phone.replace(/\D/g, ''),
        externalReference: `test_${Date.now()}`
      })
    })

    if (customerResponse.ok) {
      const customer = await customerResponse.json()
      console.log('✅ Cliente criado com sucesso:', customer.id)
      
      // Limpar cliente de teste
      await fetch(`${process.env.ASAAS_API_URL}/customers/${customer.id}`, {
        method: 'DELETE',
        headers: {
          'access_token': process.env.ASAAS_API_KEY
        }
      })
      console.log('🧹 Cliente de teste removido')
    } else {
      const error = await customerResponse.json()
      console.error('❌ Erro ao criar cliente:', error)
    }

    // 5. Verificar webhook
    console.log('\n5️⃣ Verificando configuração do webhook...')
    
    const webhookUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/webhook/asaas`
    console.log(`📡 URL do webhook: ${webhookUrl}`)
    console.log('💡 Configure esta URL no painel da Asaas')

    // 6. Testar endpoints da API
    console.log('\n6️⃣ Testando endpoints da API...')
    
    const endpoints = [
      '/api/payments/checkout',
      '/api/payments/status',
      '/api/payments/history',
      '/api/payments/cancel',
      '/api/payments/webhook/asaas'
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${endpoint}`, {
          method: endpoint.includes('webhook') ? 'GET' : 'POST'
        })
        
        if (response.status === 401 || response.status === 400) {
          console.log(`✅ Endpoint ${endpoint}: Configurado (${response.status})`)
        } else {
          console.log(`⚠️ Endpoint ${endpoint}: Status ${response.status}`)
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint}: ${error.message}`)
      }
    }

    console.log('\n🎉 Teste de integração concluído!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Configure as credenciais da Asaas no .env.local')
    console.log('2. Configure o webhook no painel da Asaas')
    console.log('3. Teste o fluxo completo de pagamento')
    console.log('4. Configure notificações por email')

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar teste
testAsaasIntegration()
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
