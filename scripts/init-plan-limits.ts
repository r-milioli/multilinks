const { PrismaClient } = require('@prisma/client')
const { PLAN_LIMITS } = require('../src/shared/utils/planLimits')

const prisma = new PrismaClient()

async function initializePlanLimits() {
  try {
    console.log('🔄 Inicializando limites dos planos...')

    // Verificar se já existe configuração de limites
    const existingLimits = await prisma.systemSettings.findUnique({
      where: { key: 'plan_limits' }
    })

    if (existingLimits) {
      console.log('ℹ️ Configuração de limites já existe. Atualizando...')
      
      await prisma.systemSettings.update({
        where: { key: 'plan_limits' },
        data: {
          value: PLAN_LIMITS,
          updatedAt: new Date()
        }
      })

      console.log('✅ Limites dos planos atualizados com sucesso!')
    } else {
      console.log('ℹ️ Criando nova configuração de limites...')
      
      await prisma.systemSettings.create({
        data: {
          key: 'plan_limits',
          value: PLAN_LIMITS,
          description: 'Limites dos planos do sistema',
          category: 'pricing',
          isPublic: false
        }
      })

      console.log('✅ Limites dos planos criados com sucesso!')
    }

    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        id: `plan-limits-init-${Date.now()}`,
        action: 'INIT_PLAN_LIMITS',
        resource: 'system_settings',
        resourceId: 'plan_limits',
        newData: PLAN_LIMITS
      }
    })

    console.log('📝 Log de auditoria criado')
    
  } catch (error) {
    console.error('❌ Erro ao inicializar limites dos planos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar inicialização
initializePlanLimits()
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
