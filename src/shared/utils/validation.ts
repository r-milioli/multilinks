import { z } from 'zod'

// Validação de URL
export const urlSchema = z.string().url('URL inválida')

// Validação de email
export const emailSchema = z.string().email('Email inválido')

// Validação de senha
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')

// Validação de username
export const usernameSchema = z
  .string()
  .min(3, 'Username deve ter pelo menos 3 caracteres')
  .max(20, 'Username deve ter no máximo 20 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username pode conter apenas letras, números, _ e -')

// Validação de nome
export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(50, 'Nome deve ter no máximo 50 caracteres')

// Validação de biografia
export const bioSchema = z
  .string()
  .max(500, 'Biografia deve ter no máximo 500 caracteres')
  .optional()

// Validação de título
export const titleSchema = z
  .string()
  .max(100, 'Título deve ter no máximo 100 caracteres')
  .optional()

// Validação de link
export const linkSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  url: urlSchema,
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')).refine((val) => {
    if (!val || val === '') return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'URL da imagem inválida'),
  type: z.enum(['NORMAL', 'PRODUCT']).default('NORMAL'),
  position: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  useForm: z.boolean().optional(),
  formId: z.string().optional().or(z.literal(''))
})

// Validação de social link
export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Plataforma é obrigatória'),
  url: urlSchema
})

// Validação de tema
export const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor primária inválida'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor secundária inválida'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor do texto inválida'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor de fundo inválida'),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundImage: z.string().url().optional(),
  fontFamily: z.string(),
  buttonStyle: z.enum(['rounded', 'sharp', 'outlined', 'filled']),
  borderRadius: z.number().min(0).max(50)
})

// Validação de configurações de privacidade
export const privacySchema = z.object({
  showEmail: z.boolean(),
  showSocialLinks: z.boolean(),
  allowAnalytics: z.boolean(),
  isPublic: z.boolean()
})

// Função para validar URL e extrair domínio
export function validateAndExtractDomain(url: string): { isValid: boolean; domain?: string; error?: string } {
  try {
    const urlObj = new URL(url)
    return {
      isValid: true,
      domain: urlObj.hostname
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'URL inválida'
    }
  }
}

// Função para validar se URL é segura
export function isSecureUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
  } catch {
    return false
  }
}

// Função para sanitizar input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .substring(0, 1000) // Limita tamanho
}

// Função para validar arquivo de imagem
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.'
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. Máximo 5MB.'
    }
  }

  return { isValid: true }
}

