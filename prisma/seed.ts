import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário de exemplo
  const user = await prisma.user.upsert({
    where: { email: 'admin@multilink.com' },
    update: {},
    create: {
      email: 'admin@multilink.com',
      name: 'Admin MultiLink',
      username: 'admin',
      bio: 'Administrador do sistema MultiLink',
      title: 'Desenvolvedor',
      emailVerified: new Date(),
    },
  })

  // Criar usuário de teste com senha
  const testUser = await prisma.user.upsert({
    where: { email: 'teste@multilink.com' },
    update: {},
    create: {
      email: 'teste@multilink.com',
      name: 'Usuário Teste',
      username: 'teste',
      bio: 'Usuário de teste do MultiLink',
      title: 'Tester',
      emailVerified: new Date(),
    },
  })

  // Criar links de exemplo
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com',
      position: 0,
      userId: user.id,
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com',
      position: 1,
      userId: user.id,
    },
    {
      title: 'Portfolio',
      url: 'https://portfolio.com',
      position: 2,
      userId: user.id,
    },
  ]

  for (const link of links) {
    await prisma.link.upsert({
      where: { id: `${user.id}-${link.position}` },
      update: {},
      create: link,
    })
  }

  // Criar social links de exemplo
  const socialLinks = [
    {
      platform: 'GitHub',
      url: 'https://github.com/admin',
      userId: user.id,
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/admin',
      userId: user.id,
    },
  ]

  for (const socialLink of socialLinks) {
    await prisma.socialLink.upsert({
      where: {
        userId_platform: {
          userId: user.id,
          platform: socialLink.platform
        }
      },
      update: {},
      create: socialLink,
    })
  }

  // Informações básicas dos planos (Configurações > Admin > Informações básicas dos planos)
  const defaultPlans = [
    { name: 'Gratuito', price: 0, description: 'Gratuito' },
    { name: 'Pro', price: 20, description: 'Pro' },
    { name: 'Business', price: 40, description: 'Business' },
  ]

  await prisma.systemSettings.upsert({
    where: { key: 'plans' },
    update: { value: defaultPlans, description: 'Informações básicas dos planos', category: 'pricing', isPublic: true, updatedAt: new Date() },
    create: {
      key: 'plans',
      value: defaultPlans,
      description: 'Informações básicas dos planos',
      category: 'pricing',
      isPublic: true,
    },
  })

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

