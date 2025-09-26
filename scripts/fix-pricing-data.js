const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPricingData() {
  console.log('🔧 Verificando e corrigindo dados de preços...');
  
  try {
    // Verificar se a configuração de planos existe
    const existingPlans = await prisma.systemSettings.findUnique({
      where: { key: 'plans' }
    });

    if (existingPlans) {
      console.log('✅ Configuração de planos já existe:');
      console.log(JSON.stringify(existingPlans.value, null, 2));
    } else {
      console.log('❌ Configuração de planos não encontrada. Criando...');
      
      // Criar configuração de planos com dados completos
      const plansData = [
        {
          name: 'Gratuito',
          price: 0,
          description: 'Perfeito para começar',
          features: [
            'Até 10 links',
            'Tema padrão',
            'Analytics básicos',
            '1 formulário',
            'Suporte por email',
            'Subdomínio multilink.com'
          ],
          limitations: [
            'Sem domínio personalizado',
            'Sem webhooks',
            'Sem integrações avançadas',
            'Analytics limitados'
          ],
          popular: false,
          cta: 'Começar grátis',
          href: '/register'
        },
        {
          name: 'Pro',
          price: 29.90,
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
          price: 99.90,
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
      ];

      const createdPlans = await prisma.systemSettings.create({
        data: {
          key: 'plans',
          value: plansData,
          description: 'Planos e preços do sistema',
          category: 'pricing',
          isPublic: true
        }
      });

      console.log('✅ Configuração de planos criada com sucesso!');
      console.log('📊 Planos configurados:', plansData.length);
    }

    // Verificar outras configurações necessárias
    const socialLinks = await prisma.systemSettings.findUnique({
      where: { key: 'social_links' }
    });

    if (!socialLinks) {
      console.log('📝 Criando configuração de social links...');
      await prisma.systemSettings.create({
        data: {
          key: 'social_links',
          value: {
            instagram: '',
            facebook: '',
            twitter: '',
            linkedin: ''
          },
          description: 'Links das redes sociais do sistema',
          category: 'social',
          isPublic: true
        }
      });
    }

    const contactInfo = await prisma.systemSettings.findUnique({
      where: { key: 'contact_info' }
    });

    if (!contactInfo) {
      console.log('📝 Criando configuração de informações de contato...');
      await prisma.systemSettings.create({
        data: {
          key: 'contact_info',
          value: {
            email: '',
            phone: '',
            address: ''
          },
          description: 'Informações de contato do sistema',
          category: 'contact',
          isPublic: true
        }
      });
    }

    console.log('🎉 Verificação e correção concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao corrigir dados de preços:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixPricingData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { fixPricingData };
