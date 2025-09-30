/**
 * Script para testar o fluxo de preços
 */

console.log('🧪 Testando fluxo de preços...\n')

// Simular dados dos planos
const plans = [
  { id: 'pro', name: 'Pro', priceValue: 19 },
  { id: 'business', name: 'Business', priceValue: 49 }
]

console.log('📋 Planos configurados:')
plans.forEach(plan => {
  const url = `/checkout?plan=${plan.id}&price=${plan.priceValue}`
  console.log(`- ${plan.name}: ${url}`)
})

console.log('\n🔍 Testando URLs:')
plans.forEach(plan => {
  const url = new URL(`http://localhost:3000/checkout?plan=${plan.id}&price=${plan.priceValue}`)
  const planId = url.searchParams.get('plan')
  const price = url.searchParams.get('price')
  
  console.log(`Plano: ${planId}, Preço: ${price}`)
  
  // Simular lógica do checkout
  const priceNum = parseFloat(price)
  if (priceNum > 0) {
    console.log(`✅ Preço válido: R$ ${priceNum.toFixed(2)}`)
  } else {
    console.log(`❌ Preço inválido: ${price}`)
  }
})

console.log('\n🎯 Teste concluído!')
