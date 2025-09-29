import { prisma } from '../src/lib/db'

async function main() {
  console.log('🔄 Inicializando configurações de planos...')

  // Configurar limites dos planos
  const planLimits = {
    free: {
      price: 0,
      maxLinks: 10,
      maxForms: 1,
      maxWebhooks: 0,
      themeEditing: false,
      analytics: false,
      prioritySupport: false
    },
    pro: {
      price: 19,
      maxLinks: -1, // ilimitado
      maxForms: -1, // ilimitado
      maxWebhooks: 1,
      themeEditing: true,
      analytics: true,
      prioritySupport: true
    },
    business: {
      price: 49,
      maxLinks: -1, // ilimitado
      maxForms: -1, // ilimitado
      maxWebhooks: -1, // ilimitado
      themeEditing: true,
      analytics: true,
      prioritySupport: true
    }
  }

  // Configurar features dos planos
  const planFeatures = [
    {
      category: 'Gestão de Links',
      items: [
        { name: 'Links ilimitados', free: true, pro: true, business: true },
        { name: 'Drag & drop', free: true, pro: true, business: true },
        { name: 'Categorização', free: false, pro: true, business: true },
        { name: 'Links programados', free: false, pro: false, business: true },
        { name: 'A/B testing', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Personalização',
      items: [
        { name: 'Temas básicos', free: true, pro: true, business: true },
        { name: 'Temas premium', free: false, pro: true, business: true },
        { name: 'Editor visual', free: false, pro: true, business: true },
        { name: 'CSS customizado', free: false, pro: false, business: true },
        { name: 'Branding personalizado', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Analytics',
      items: [
        { name: 'Cliques básicos', free: true, pro: true, business: true },
        { name: 'Geolocalização', free: false, pro: true, business: true },
        { name: 'Dispositivos', free: false, pro: true, business: true },
        { name: 'Relatórios avançados', free: false, pro: true, business: true },
        { name: 'API de analytics', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Formulários',
      items: [
        { name: '1 formulário', free: true, pro: false, business: false },
        { name: 'Formulários ilimitados', free: false, pro: true, business: true },
        { name: 'Campos personalizados', free: false, pro: true, business: true },
        { name: 'Validação avançada', free: false, pro: false, business: true },
        { name: 'Automações', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Integrações',
      items: [
        { name: 'Webhooks básicos', free: false, pro: true, business: true },
        { name: 'Webhooks ilimitados', free: false, pro: false, business: true },
        { name: 'API completa', free: false, pro: false, business: true },
        { name: 'Integrações nativas', free: false, pro: false, business: true },
        { name: 'Webhooks customizados', free: false, pro: false, business: true }
      ]
    },
    {
      category: 'Suporte',
      items: [
        { name: 'Email', free: true, pro: true, business: true },
        { name: 'Chat', free: false, pro: true, business: true },
        { name: 'Suporte prioritário', free: false, pro: true, business: true },
        { name: 'Suporte 24/7', free: false, pro: false, business: true },
        { name: 'Gerente de conta', free: false, pro: false, business: true }
      ]
    }
  ]

  // Salvar no banco
  await prisma.systemSettings.upsert({
    where: { key: 'plan_limits' },
    update: {
      value: planLimits,
      description: 'Limites e configurações dos planos',
      category: 'pricing',
      isPublic: true
    },
    create: {
      key: 'plan_limits',
      value: planLimits,
      description: 'Limites e configurações dos planos',
      category: 'pricing',
      isPublic: true
    }
  })

  await prisma.systemSettings.upsert({
    where: { key: 'plan_features' },
    update: {
      value: planFeatures,
      description: 'Funcionalidades disponíveis em cada plano',
      category: 'pricing',
      isPublic: true
    },
    create: {
      key: 'plan_features',
      value: planFeatures,
      description: 'Funcionalidades disponíveis em cada plano',
      category: 'pricing',
      isPublic: true
    }
  })

  console.log('✅ Configurações de planos inicializadas com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao inicializar configurações:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
