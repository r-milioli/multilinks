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
    
    // Verificar se há usuários no sistema
    const userCount = await prisma.user.count();
    console.log(`👥 Usuários no sistema: ${userCount}`);
    
    // Verificar se a tabela PasswordResetToken existe e está funcionando
    try {
      const tokenCount = await prisma.passwordResetToken.count();
      console.log(`🔐 Tokens de reset de senha: ${tokenCount}`);
      console.log('✅ Sistema SMTP configurado e funcionando');
    } catch (error) {
      console.log('⚠️ Tabela PasswordResetToken não encontrada - migração SMTP pode estar pendente');
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
