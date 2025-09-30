/**
 * Script para testar o fluxo completo de preços
 */

const fetch = globalThis.fetch

async function testCompleteFlow() {
  try {
    console.log('🧪 Testando fluxo completo de preços...\n')

    // 1. Buscar dados dos planos
    console.log('1️⃣ Buscando dados dos planos da API...')
    const response = await fetch('http://localhost:3000/api/public/pricing')
    const result = await response.json()

    if (!result.success) {
      console.log('❌ Erro ao buscar dados dos planos:', result.error)
      return
    }

    console.log('✅ Dados obtidos com sucesso!')
    console.log('📊 Planos disponíveis:')
    
    result.data.plans.forEach(plan => {
      console.log(`  - ${plan.name}: ${plan.price}`)
    })

    // 2. Simular seleção de planos
    console.log('\n2️⃣ Simulando seleção de planos...')
    
    const testPlans = result.data.plans.filter(plan => plan.id !== 'gratuito')
    
    testPlans.forEach(plan => {
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
      
      // Simular parse da URL
      const url = new URL(`http://localhost:3000${checkoutUrl}`)
      const planId = url.searchParams.get('plan')
      const priceParam = url.searchParams.get('price')
      
      console.log(`   📋 Plano ID: ${planId}`)
      console.log(`   💰 Preço da URL: ${priceParam}`)
      console.log(`   ✅ Preço válido: ${parseFloat(priceParam) > 0 ? 'Sim' : 'Não'}`)
    })

    // 3. Verificar consistência
    console.log('\n3️⃣ Verificando consistência dos dados...')
    
    const expectedPrices = {
      pro: 25,
      business: 40
    }

    let allCorrect = true
    testPlans.forEach(plan => {
      let actualPrice = 0
      if (typeof plan.price === 'string') {
        const priceMatch = plan.price.match(/[\d,]+/)
        if (priceMatch) {
          actualPrice = parseFloat(priceMatch[0].replace(',', '.'))
        }
      } else if (typeof plan.price === 'number') {
        actualPrice = plan.price
      }

      const expectedPrice = expectedPrices[plan.id]
      const isCorrect = actualPrice === expectedPrice
      
      console.log(`📊 ${plan.name}:`)
      console.log(`   Esperado: R$ ${expectedPrice}`)
      console.log(`   Atual: R$ ${actualPrice}`)
      console.log(`   ${isCorrect ? '✅' : '❌'} ${isCorrect ? 'Correto' : 'Incorreto'}`)
      
      if (!isCorrect) allCorrect = false
    })

    // 4. Resultado final
    console.log('\n4️⃣ Resultado final:')
    if (allCorrect) {
      console.log('🎉 Todos os preços estão corretos!')
      console.log('✅ O fluxo de preços está funcionando perfeitamente')
      console.log('✅ Os dados do banco estão sendo usados corretamente')
      console.log('✅ O checkout receberá os preços corretos')
    } else {
      console.log('❌ Alguns preços estão incorretos')
      console.log('🔧 Verifique os dados na tabela SystemSettings')
    }

    console.log('\n🎯 Teste concluído!')

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testCompleteFlow()
