#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function checkDatabaseExists() {
  try {
    // Tentar conectar e fazer uma query simples
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.log('⚠️ Banco de dados não está acessível:', error.message);
    return false;
  }
}

async function checkTableExists(tableName) {
  try {
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      );
    `;
    return result[0].exists;
  } catch (error) {
    console.log(`⚠️ Erro ao verificar tabela ${tableName}:`, error.message);
    return false;
  }
}

async function checkColumnExists(tableName, columnName) {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = ${tableName} 
      AND column_name = ${columnName}
    `;
    return result.length > 0;
  } catch (error) {
    console.log(`⚠️ Erro ao verificar coluna ${columnName} na tabela ${tableName}:`, error.message);
    return false;
  }
}

async function initializeDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados MultiLink...');
    
    // Verificar se o banco está acessível
    if (!await checkDatabaseExists()) {
      console.log('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }
    
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // Verificar se as tabelas principais existem
    const hasUserTable = await checkTableExists('User');
    
    if (!hasUserTable) {
      console.log('📝 Tabelas não encontradas. Aplicando schema completo...');
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Schema aplicado com sucesso!');
        
        // Executar seed se disponível
        try {
          console.log('🌱 Executando seed do banco de dados...');
          execSync('npx prisma db seed', { stdio: 'inherit' });
          console.log('✅ Seed executado com sucesso!');
        } catch (seedError) {
          console.log('⚠️ Seed não executado (normal se não configurado):', seedError.message);
        }
      } catch (error) {
        console.error('❌ Erro ao aplicar schema:', error.message);
        throw error;
      }
    } else {
      console.log('✅ Tabelas principais encontradas');
      
      // Verificar se a coluna legalLinksSettings existe
      const hasLegalLinksSettings = await checkColumnExists('User', 'legalLinksSettings');
      
      if (!hasLegalLinksSettings) {
        console.log('📝 Coluna legalLinksSettings não encontrada. Aplicando migração...');
        try {
          execSync('npx prisma db push', { stdio: 'inherit' });
          console.log('✅ Migração aplicada com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao aplicar migração:', error.message);
          throw error;
        }
      } else {
        console.log('✅ Coluna legalLinksSettings já existe');
      }
      
      // Verificar se há outras migrações pendentes
      try {
        execSync('npx prisma migrate status', { stdio: 'pipe' });
        console.log('✅ Todas as migrações estão atualizadas');
      } catch (error) {
        console.log('⚠️ Verificando migrações pendentes...');
        try {
          execSync('npx prisma migrate deploy', { stdio: 'inherit' });
          console.log('✅ Migrações pendentes aplicadas com sucesso!');
        } catch (migrateError) {
          console.log('⚠️ Erro ao aplicar migrações. Sincronizando schema...');
          execSync('npx prisma db push', { stdio: 'inherit' });
          console.log('✅ Schema sincronizado com sucesso!');
        }
      }
    }
    
    console.log('🎉 Inicialização do banco de dados concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a inicialização:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar inicialização se este script for chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
