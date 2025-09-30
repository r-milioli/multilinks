/**
 * Script para testar o redirecionamento do plano gratuito
 */

const fetch = globalThis.fetch

async function testFreePlanRedirect() {
  try {
    console.log('🧪 Testando redirecionamento do plano gratuito...\n')

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
      console.log(`  - ID: ${plan.id}, Nome: ${plan.name}, Preço: ${plan.price}`)
    })

    // 2. Verificar o plano gratuito
    console.log('\n2️⃣ Verificando plano gratuito...')
    
    const freePlan = result.data.plans.find(plan => plan.id === 'free')
    
    if (freePlan) {
      console.log('✅ Plano gratuito encontrado!')
      console.log(`   ID: ${freePlan.id}`)
      console.log(`   Nome: ${freePlan.name}`)
      console.log(`   Preço: ${freePlan.price}`)
    } else {
      console.log('❌ Plano gratuito não encontrado!')
      console.log('🔍 Planos disponíveis:')
      result.data.plans.forEach(plan => {
        console.log(`   - ${plan.id}: ${plan.name}`)
      })
    }

    // 3. Simular lógica de redirecionamento
    console.log('\n3️⃣ Testando lógica de redirecionamento...')
    
    result.data.plans.forEach(plan => {
      const redirectUrl = plan.id === 'free' ? '/register' : `/checkout?plan=${plan.id}&price=${plan.priceValue || 0}`
      console.log(`📋 ${plan.name} (${plan.id}): ${redirectUrl}`)
      
      if (plan.id === 'free') {
        console.log(`   ✅ Redireciona para criação de conta`)
      } else {
        console.log(`   ✅ Redireciona para checkout`)
      }
    })

    // 4. Verificar se a correção funcionou
    console.log('\n4️⃣ Verificando correção...')
    
    const hasCorrectFreeId = result.data.plans.some(plan => plan.id === 'free')
    const hasGratuitoId = result.data.plans.some(plan => plan.id === 'gratuito')
    
    console.log(`✅ ID 'free' encontrado: ${hasCorrectFreeId ? 'Sim' : 'Não'}`)
    console.log(`❌ ID 'gratuito' encontrado: ${hasGratuitoId ? 'Sim (problema)' : 'Não (correto)'}`)
    
    if (hasCorrectFreeId && !hasGratuitoId) {
      console.log('\n🎉 Correção funcionando!')
      console.log('✅ Plano gratuito tem ID correto')
      console.log('✅ Redirecionamento para /register funcionará')
    } else {
      console.log('\n⚠️ Ainda há problemas:')
      if (!hasCorrectFreeId) {
        console.log('❌ ID "free" não encontrado')
      }
      if (hasGratuitoId) {
        console.log('❌ ID "gratuito" ainda existe')
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testFreePlanRedirect()
