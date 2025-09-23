// Script de debug para verificar o usuário
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugUser() {
  try {
    console.log('🔍 Verificando usuários no banco...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true
      }
    })
    
    console.log(`📊 Total de usuários: ${users.length}`)
    
    users.forEach((user, index) => {
      console.log(`\n👤 Usuário ${index + 1}:`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Username: ${user.username || 'NÃO DEFINIDO'}`)
      console.log(`   Nome: ${user.name || 'NÃO DEFINIDO'}`)
      console.log(`   Criado em: ${user.createdAt}`)
    })
    
    // Verificar usuário específico que fez login
    const loginUser = await prisma.user.findFirst({
      where: { email: 'robson.milioli@gmail.com' }
    })
    
    if (loginUser) {
      console.log('\n🎯 Usuário que fez login:')
      console.log(`   Username: ${loginUser.username || 'NÃO DEFINIDO'}`)
      console.log(`   Nome: ${loginUser.name || 'NÃO DEFINIDO'}`)
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugUser()
