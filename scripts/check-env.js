#!/usr/bin/env node

/**
 * Script para verificar se as variáveis de ambiente estão sendo carregadas
 */

console.log('🔍 Verificando variáveis de ambiente do Asaas...\n')

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

const envVars = {
  'ASAAS_API_KEY': process.env.ASAAS_API_KEY,
  'ASAAS_ENVIRONMENT': process.env.ASAAS_ENVIRONMENT,
  'ASAAS_API_URL': process.env.ASAAS_API_URL,
  'ASAAS_WEBHOOK_SECRET': process.env.ASAAS_WEBHOOK_SECRET,
  'PAYMENT_CURRENCY': process.env.PAYMENT_CURRENCY,
  'PAYMENT_WEBHOOK_URL': process.env.PAYMENT_WEBHOOK_URL
}

console.log('📋 Status das variáveis:')
console.log('=' .repeat(50))

Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅ CONFIGURADA' : '❌ NÃO CONFIGURADA'
  const displayValue = value ? (key.includes('SECRET') || key.includes('KEY') ? '***' + value.slice(-4) : value) : 'undefined'
  
  console.log(`${key}: ${status}`)
  console.log(`   Valor: ${displayValue}`)
  console.log('')
})

console.log('=' .repeat(50))

// Verificar se todas as variáveis obrigatórias estão configuradas
const requiredVars = ['ASAAS_API_KEY', 'ASAAS_ENVIRONMENT', 'ASAAS_API_URL']
const missingVars = requiredVars.filter(key => !process.env[key])

if (missingVars.length === 0) {
  console.log('✅ Todas as variáveis obrigatórias estão configuradas!')
} else {
  console.log('❌ Variáveis obrigatórias faltando:')
  missingVars.forEach(key => console.log(`   - ${key}`))
}

console.log('\n🔧 Se alguma variável não estiver configurada:')
console.log('1. Verifique se o arquivo .env.local existe')
console.log('2. Verifique se as variáveis estão no formato correto')
console.log('3. Reinicie o servidor de desenvolvimento')
