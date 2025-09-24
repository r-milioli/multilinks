const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeDatabase() {
  console.log('🔄 Inicializando banco de dados...');
  
  try {
    // Verificar se as configurações padrão do sistema existem
    const systemSettings = await prisma.systemSettings.findMany();
    
    if (systemSettings.length === 0) {
      console.log('📝 Criando configurações padrão do sistema...');
      
      // Criar configurações padrão
      await prisma.systemSettings.createMany({
        data: [
          {
            id: 'social_links',
            key: 'social_links',
            value: {
              instagram: '',
              facebook: '',
              twitter: '',
              linkedin: ''
            },
            description: 'Links das redes sociais do sistema',
            category: 'contact',
            isPublic: false
          },
          {
            id: 'contact_info',
            key: 'contact_info',
            value: {
              email: '',
              phone: '',
              address: ''
            },
            description: 'Informações de contato do sistema',
            category: 'contact',
            isPublic: false
          },
          {
            id: 'plans',
            key: 'plans',
            value: [],
            description: 'Planos disponíveis no sistema',
            category: 'billing',
            isPublic: false
          }
        ]
      });
      
      console.log('✅ Configurações padrão criadas');
    }
    
    // Verificar se os planos padrão existem
    const plans = await prisma.plan.findMany();
    
    if (plans.length === 0) {
      console.log('📋 Criando planos padrão...');
      
      await prisma.plan.createMany({
        data: [
          {
            id: 'plan_free',
            name: 'Gratuito',
            description: 'Plano gratuito com funcionalidades básicas',
            price: 0,
            currency: 'BRL',
            billingCycle: 'monthly',
            features: ['5 links', '1 formulário', 'Analytics básico'],
            limits: { links: 5, forms: 1, clicks: 1000 },
            active: true
          },
          {
            id: 'plan_pro',
            name: 'Pro',
            description: 'Plano profissional com funcionalidades avançadas',
            price: 29.90,
            currency: 'BRL',
            billingCycle: 'monthly',
            features: ['Links ilimitados', 'Formulários ilimitados', 'Analytics avançado', 'Suporte prioritário'],
            limits: { links: -1, forms: -1, clicks: -1 },
            active: true
          },
          {
            id: 'plan_business',
            name: 'Business',
            description: 'Plano empresarial para equipes',
            price: 99.90,
            currency: 'BRL',
            billingCycle: 'monthly',
            features: ['Tudo do Pro', 'Múltiplos usuários', 'API access', 'Suporte 24/7'],
            limits: { links: -1, forms: -1, clicks: -1, users: 10 },
            active: true
          }
        ]
      });
      
      console.log('✅ Planos padrão criados');
    }
    
    console.log('🎉 Inicialização do banco concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na inicialização do banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
