/**
 * Script para verificar e inicializar dados dos planos na tabela SystemSettings
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPlanData() {
  try {
    console.log('🔍 Verificando dados dos planos na tabela SystemSettings...\n')

    // Verificar se existe a configuração 'plans'
    const plansSetting = await prisma.systemSettings.findUnique({
      where: { key: 'plans' }
    })

    if (plansSetting) {
      console.log('✅ Configuração "plans" encontrada!')
      console.log('📊 Dados dos planos:', JSON.stringify(plansSetting.value, null, 2))
      
      // Verificar se os dados têm preços
      if (Array.isArray(plansSetting.value)) {
        plansSetting.value.forEach((plan, index) => {
          console.log(`\n📋 Plano ${index + 1}:`)
          console.log(`  Nome: ${plan.name}`)
          console.log(`  Preço: ${plan.price}`)
          console.log(`  Descrição: ${plan.description}`)
        })
      }
    } else {
      console.log('❌ Configuração "plans" não encontrada!')
      console.log('🔧 Inicializando dados dos planos...')
      
      // Criar dados dos planos
      const plansData = [
        {
          name: 'Gratuito',
          price: 0,
          description: 'Para começar',
          features: [
            'Até 5 links',
            'Temas básicos',
            'Suporte por email'
          ],
          limitations: [
            'Sem analytics',
            'Sem formulários',
            'Sem webhooks'
          ],
          popular: false,
          cta: 'Começar grátis',
          href: '/register'
        },
        {
          name: 'Pro',
          price: 19,
          description: 'Para profissionais',
          features: [
            'Links ilimitados',
            'Temas personalizados',
            'Analytics avançados',
            'Formulários ilimitados',
            'Webhooks básicos',
            'Domínio personalizado',
            'Suporte prioritário',
            'Exportação de dados'
          ],
          limitations: [
            'Webhooks limitados',
            'Sem integrações premium'
          ],
          popular: true,
          cta: 'Começar Pro',
          href: '/register?plan=pro'
        },
        {
          name: 'Business',
          price: 49,
          description: 'Para empresas',
          features: [
            'Tudo do Pro',
            'Webhooks ilimitados',
            'Integrações avançadas',
            'API completa',
            'Múltiplos usuários',
            'White-label',
            'Suporte 24/7',
            'SLA 99.9%',
            'Backup automático',
            'Análise de concorrência'
          ],
          limitations: [],
          popular: false,
          cta: 'Começar Business',
          href: '/register?plan=business'
        }
      ]

      const createdPlans = await prisma.systemSettings.create({
        data: {
          key: 'plans',
          value: plansData,
          description: 'Planos e preços do sistema',
          category: 'pricing',
          isPublic: true
        }
      })

      console.log('✅ Dados dos planos criados com sucesso!')
      console.log('📊 Planos configurados:', plansData.length)
    }

    // Verificar também a configuração 'plan_limits'
    const limitsSetting = await prisma.systemSettings.findUnique({
      where: { key: 'plan_limits' }
    })

    if (limitsSetting) {
      console.log('\n✅ Configuração "plan_limits" encontrada!')
      console.log('📊 Limites dos planos:', JSON.stringify(limitsSetting.value, null, 2))
    } else {
      console.log('\n❌ Configuração "plan_limits" não encontrada!')
    }

  } catch (error) {
    console.error('❌ Erro ao verificar dados dos planos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPlanData()
