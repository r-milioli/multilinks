/**
 * Configuração dos limites por plano
 * Estes são os valores padrão que serão usados como fallback
 * caso não exista configuração no banco de dados
 */
export const PLAN_LIMITS = {
  free: {
    maxLinks: 5,
    maxForms: 0,
    maxWebhooks: 0,
    themeEditing: true,
    analytics: false,
    prioritySupport: false,
    price: 0
  },
  pro: {
    maxLinks: 15,
    maxForms: 5,
    maxWebhooks: 1,
    themeEditing: true,
    analytics: true,
    prioritySupport: true,
    price: 19
  },
  business: {
    maxLinks: -1, // ilimitado
    maxForms: -1, // ilimitado
    maxWebhooks: 3,
    themeEditing: true,
    analytics: true,
    prioritySupport: true,
    price: 49
  }
} as const

/**
 * Tipos de planos disponíveis
 */
export type PlanType = keyof typeof PLAN_LIMITS

/**
 * Mensagens de upgrade por recurso
 */
export const UPGRADE_MESSAGES = {
  links: {
    free: 'Você atingiu o limite de 5 links. Faça upgrade para PRO e tenha 15 links!',
    pro: 'Você atingiu o limite de 15 links. Faça upgrade para BUSINESS e tenha links ilimitados!'
  },
  forms: {
    free: 'Formulários disponíveis apenas no PRO. Faça upgrade para capturar leads!',
    pro: 'Você atingiu o limite de 5 formulários. Faça upgrade para BUSINESS e tenha formulários ilimitados!'
  },
  webhooks: {
    free: 'Webhooks disponíveis no PRO e BUSINESS. Faça upgrade para integrar com outras ferramentas!',
    pro: 'Você atingiu o limite de webhooks. Faça upgrade para BUSINESS e tenha mais webhooks!',
    business: 'Você atingiu o limite de webhooks do seu plano.'
  },
  analytics: {
    free: 'Analytics disponível apenas no PRO e BUSINESS. Faça upgrade para acompanhar suas métricas!'
  }
} as const

/**
 * Verifica se um valor representa "ilimitado"
 */
export function isUnlimited(value: number): boolean {
  return value === -1
}

/**
 * Formata o limite para exibição
 */
export function formatLimit(value: number): string {
  return isUnlimited(value) ? 'Ilimitado' : value.toString()
}

/**
 * Formata o preço para exibição
 */
export function formatPrice(planId: string, price?: number): string {
  if (planId === 'free') return 'Grátis'
  
  const defaultPrices = {
    pro: 19,
    business: 49
  }

  const finalPrice = typeof price === 'number' ? price : defaultPrices[planId as keyof typeof defaultPrices]
  return `R$ ${finalPrice.toFixed(2).replace('.', ',')}`
}