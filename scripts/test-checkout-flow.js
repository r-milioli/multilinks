/**
 * Script para testar o fluxo de checkout com dados reais do banco
 */

// Usar fetch nativo do Node.js 18+
const fetch = globalThis.fetch

async function testCheckoutFlow() {
  try {
    console.log('🧪 Testando fluxo de checkout...\n')

    // 1. Buscar dados dos planos da API
    console.log('1️⃣ Buscando dados dos planos...')
    const response = await fetch('http://localhost:3000/api/public/pricing')
    const result = await response.json()

    if (!result.success) {
      console.log('❌ Erro ao buscar dados dos planos:', result.error)
      return
    }

    console.log('✅ Dados dos planos obtidos!')
    console.log('📊 Planos disponíveis:')
    
    result.data.plans.forEach((plan, index) => {
      console.log(`\n📋 Plano ${index + 1}:`)
      console.log(`  ID: ${plan.id}`)
      console.log(`  Nome: ${plan.name}`)
      console.log(`  Preço: ${plan.price}`)
      console.log(`  Descrição: ${plan.description}`)
    })

    // 2. Simular URLs de checkout
    console.log('\n2️⃣ Simulando URLs de checkout...')
    
    result.data.plans.forEach(plan => {
      if (plan.id !== 'gratuito') {
        // Extrair preço numérico
        let price = 0
        if (typeof plan.price === 'string') {
          const priceMatch = plan.price.match(/[\d,]+/)
          if (priceMatch) {
            price = parseFloat(priceMatch[0].replace(',', '.'))
          }
        } else if (typeof plan.price === 'number') {
          price = plan.price
        }

        const checkoutUrl = `/checkout?plan=${plan.id}&price=${price}`
        console.log(`🔗 ${plan.name}: ${checkoutUrl}`)
      }
    })

    // 3. Testar lógica de preço
    console.log('\n3️⃣ Testando lógica de preço...')
    
    const testCases = [
      { planId: 'pro', urlPrice: '25', expected: 25 },
      { planId: 'pro', urlPrice: '0', expected: 25 }, // Deve usar preço do banco
      { planId: 'business', urlPrice: '40', expected: 40 },
      { planId: 'business', urlPrice: '0', expected: 40 }, // Deve usar preço do banco
    ]

    testCases.forEach(test => {
      const urlPrice = parseFloat(test.urlPrice)
      let finalPrice = 0
      
      if (urlPrice > 0) {
        finalPrice = urlPrice
        console.log(`💰 ${test.planId} - URL válida (${urlPrice}): R$ ${finalPrice}`)
      } else {
        // Simular busca no banco
        const planFromDB = result.data.plans.find(p => p.id === test.planId)
        if (planFromDB) {
          if (typeof planFromDB.price === 'string') {
            const priceMatch = planFromDB.price.match(/[\d,]+/)
            if (priceMatch) {
              finalPrice = parseFloat(priceMatch[0].replace(',', '.'))
            }
          } else if (typeof planFromDB.price === 'number') {
            finalPrice = planFromDB.price
          }
          console.log(`💰 ${test.planId} - URL inválida, usando banco: R$ ${finalPrice}`)
        }
      }
      
      const isCorrect = finalPrice === test.expected
      console.log(`   ${isCorrect ? '✅' : '❌'} Esperado: R$ ${test.expected}, Obtido: R$ ${finalPrice}`)
    })

    console.log('\n🎯 Teste concluído!')

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testCheckoutFlow()
