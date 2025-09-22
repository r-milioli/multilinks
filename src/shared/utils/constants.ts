// Cores padrão do sistema
export const DEFAULT_COLORS = {
  primary: '#3B82F6',
  secondary: '#64748B',
  text: '#1E293B',
  background: '#FFFFFF',
  accent: '#F1F5F9'
} as const

// Temas pré-definidos
export const PRESET_THEMES = {
  default: {
    name: 'Padrão',
    primaryColor: '#3B82F6',
    secondaryColor: '#64748B',
    textColor: '#1E293B',
    backgroundColor: '#FFFFFF',
    backgroundType: 'solid' as const,
    fontFamily: 'Inter',
    buttonStyle: 'rounded' as const,
    borderRadius: 8
  },
  dark: {
    name: 'Escuro',
    primaryColor: '#60A5FA',
    secondaryColor: '#94A3B8',
    textColor: '#F8FAFC',
    backgroundColor: '#0F172A',
    backgroundType: 'solid' as const,
    fontFamily: 'Inter',
    buttonStyle: 'rounded' as const,
    borderRadius: 8
  },
  minimal: {
    name: 'Minimalista',
    primaryColor: '#000000',
    secondaryColor: '#6B7280',
    textColor: '#374151',
    backgroundColor: '#FFFFFF',
    backgroundType: 'solid' as const,
    fontFamily: 'Helvetica',
    buttonStyle: 'sharp' as const,
    borderRadius: 0
  },
  vibrant: {
    name: 'Vibrante',
    primaryColor: '#EC4899',
    secondaryColor: '#8B5CF6',
    textColor: '#1F2937',
    backgroundColor: '#FEF3C7',
    backgroundType: 'gradient' as const,
    fontFamily: 'Poppins',
    buttonStyle: 'filled' as const,
    borderRadius: 12
  },
  ocean: {
    name: 'Oceano',
    primaryColor: '#0EA5E9',
    secondaryColor: '#06B6D4',
    textColor: '#FFFFFF',
    backgroundColor: '#0C4A6E',
    backgroundType: 'gradient' as const,
    fontFamily: 'Inter',
    buttonStyle: 'outlined' as const,
    borderRadius: 16
  }
} as const

// Fontes disponíveis
export const AVAILABLE_FONTS = [
  { name: 'Inter', value: 'Inter', category: 'Sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'Sans-serif' },
  { name: 'Open Sans', value: 'Open Sans', category: 'Sans-serif' },
  { name: 'Lato', value: 'Lato', category: 'Sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
  { name: 'Merriweather', value: 'Merriweather', category: 'Serif' },
  { name: 'Source Code Pro', value: 'Source Code Pro', category: 'Monospace' },
  { name: 'Fira Code', value: 'Fira Code', category: 'Monospace' }
] as const

// Estilos de botão
export const BUTTON_STYLES = [
  { name: 'Arredondado', value: 'rounded' },
  { name: 'Quadrado', value: 'sharp' },
  { name: 'Contorno', value: 'outlined' },
  { name: 'Preenchido', value: 'filled' }
] as const

// Tipos de background
export const BACKGROUND_TYPES = [
  { name: 'Cor Sólida', value: 'solid' },
  { name: 'Gradiente', value: 'gradient' },
  { name: 'Imagem', value: 'image' }
] as const

// Plataformas sociais
export const SOCIAL_PLATFORMS = [
  {
    name: 'Instagram',
    icon: 'instagram',
    placeholder: 'https://instagram.com/seuusuario',
    color: '#E4405F'
  },
  {
    name: 'Twitter',
    icon: 'twitter',
    placeholder: 'https://twitter.com/seuusuario',
    color: '#1DA1F2'
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    placeholder: 'https://linkedin.com/in/seuusuario',
    color: '#0077B5'
  },
  {
    name: 'GitHub',
    icon: 'github',
    placeholder: 'https://github.com/seuusuario',
    color: '#333333'
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    placeholder: 'https://youtube.com/@seucanal',
    color: '#FF0000'
  },
  {
    name: 'TikTok',
    icon: 'tiktok',
    placeholder: 'https://tiktok.com/@seuusuario',
    color: '#000000'
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    placeholder: 'https://facebook.com/seuusuario',
    color: '#1877F2'
  },
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    placeholder: 'https://wa.me/5511999999999',
    color: '#25D366'
  }
] as const

// Limites do sistema
export const LIMITS = {
  MAX_LINKS_PER_USER: 20,
  MAX_BIO_LENGTH: 500,
  MAX_TITLE_LENGTH: 100,
  MAX_LINK_TITLE_LENGTH: 100,
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
  MAX_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_BACKGROUND_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ANALYTICS_RETENTION_DAYS: 365
} as const

// Configurações de upload
export const UPLOAD_CONFIG = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  AVATAR_DIMENSIONS: {
    width: 400,
    height: 400
  },
  BACKGROUND_DIMENSIONS: {
    width: 1920,
    height: 1080
  }
} as const

// Configurações de analytics
export const ANALYTICS_CONFIG = {
  CLICK_COOLDOWN_MS: 1000, // 1 segundo entre cliques do mesmo usuário
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutos
  MAX_ANALYTICS_ENTRIES_PER_DAY: 1000
} as const

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  USER_NOT_FOUND: 'Usuário não encontrado',
  EMAIL_ALREADY_EXISTS: 'Email já está em uso',
  USERNAME_ALREADY_EXISTS: 'Username já está em uso',
  INVALID_EMAIL: 'Email inválido',
  WEAK_PASSWORD: 'Senha muito fraca',
  INVALID_URL: 'URL inválida',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_FILE_TYPE: 'Tipo de arquivo não suportado',
  UNAUTHORIZED: 'Não autorizado',
  FORBIDDEN: 'Acesso negado',
  NOT_FOUND: 'Recurso não encontrado',
  SERVER_ERROR: 'Erro interno do servidor',
  RATE_LIMIT_EXCEEDED: 'Muitas tentativas. Tente novamente mais tarde'
} as const

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Conta criada com sucesso',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso',
  LINK_CREATED: 'Link criado com sucesso',
  LINK_UPDATED: 'Link atualizado com sucesso',
  LINK_DELETED: 'Link removido com sucesso',
  LINKS_REORDERED: 'Links reordenados com sucesso',
  PASSWORD_RESET_SENT: 'Email de recuperação enviado',
  PASSWORD_CHANGED: 'Senha alterada com sucesso',
  IMAGE_UPLOADED: 'Imagem enviada com sucesso',
  THEME_APPLIED: 'Tema aplicado com sucesso'
} as const

// Configurações de SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'MultiLink - Seus links em um só lugar',
  DEFAULT_DESCRIPTION: 'Crie sua página de links personalizada e compartilhe todos os seus perfis sociais em um só lugar.',
  DEFAULT_KEYWORDS: ['links', 'social media', 'bio link', 'linktree', 'perfil'],
  SITE_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000'
} as const

