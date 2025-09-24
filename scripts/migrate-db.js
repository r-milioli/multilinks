#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function checkColumnExists(tableName, columnName) {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = ${tableName} 
      AND column_name = ${columnName}
    `;
    return result.length > 0;
  } catch (error) {
    console.log(`⚠️ Erro ao verificar coluna ${columnName} na tabela ${tableName}:`, error.message);
    return false;
  }
}

async function migrateDatabase() {
  try {
    console.log('🚀 Iniciando migração do banco de dados...');
    
    // Verificar se a coluna legalLinksSettings existe
    const hasLegalLinksSettings = await checkColumnExists('User', 'legalLinksSettings');
    
    if (!hasLegalLinksSettings) {
      console.log('📝 Coluna legalLinksSettings não encontrada. Aplicando migração...');
      
      try {
        // Aplicar migração usando Prisma
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Migração aplicada com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao aplicar migração:', error.message);
        throw error;
      }
    } else {
      console.log('✅ Coluna legalLinksSettings já existe. Nenhuma migração necessária.');
    }
    
    // Verificar se há outras migrações pendentes
    try {
      execSync('npx prisma migrate status', { stdio: 'pipe' });
      console.log('✅ Todas as migrações estão atualizadas.');
    } catch (error) {
      console.log('⚠️ Há migrações pendentes. Aplicando...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migrações pendentes aplicadas com sucesso!');
      } catch (migrateError) {
        console.log('⚠️ Erro ao aplicar migrações. Tentando db push...');
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('✅ Schema sincronizado com sucesso!');
      }
    }
    
    console.log('🎉 Migração do banco de dados concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração se este script for chamado diretamente
if (require.main === module) {
  migrateDatabase();
}

module.exports = { migrateDatabase };
