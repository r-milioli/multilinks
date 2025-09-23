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
    borderRadius: 8,
    buttonColors: {
      background: '#FFFFFF',
      text: '#1E293B',
      border: '#E5E7EB',
      hoverBackground: '#F9FAFB',
      hoverText: '#1E293B',
      hoverBorder: '#D1D5DB'
    },
    imageSettings: {
      position: 'left',
      size: 'medium',
      borderRadius: 'rounded',
      spacing: 'normal'
    },
    avatarSettings: {
      size: 'medium',
      shape: 'circle',
      borderWidth: 2,
      borderColor: '#E5E7EB',
      shadow: 'none',
      position: 'top'
    },
    linkButtonSettings: {
      style: 'default',
      size: 'medium',
      spacing: 'normal',
      alignment: 'center',
      showIcons: true,
      showDescriptions: true,
      hoverEffect: 'scale',
      animationSpeed: 300
    },
    socialButtonsSettings: {
      style: 'default',
      size: 'medium',
      shape: 'circle',
      spacing: 'normal',
      alignment: 'center',
      showLabels: false,
      hoverEffect: 'scale',
      animationSpeed: 300,
      backgroundColor: '#FFFFFF',
      iconColor: '#374151',
      borderColor: '#E5E7EB',
      hoverBackgroundColor: '#F9FAFB',
      hoverIconColor: '#1F2937'
    }
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
    borderRadius: 8,
    buttonColors: {
      background: '#1F2937',
      text: '#F9FAFB',
      border: '#374151',
      hoverBackground: '#374151',
      hoverText: '#F9FAFB',
      hoverBorder: '#4B5563'
    },
    imageSettings: {
      position: 'left',
      size: 'medium',
      borderRadius: 'rounded',
      spacing: 'normal'
    },
    avatarSettings: {
      size: 'medium',
      shape: 'circle',
      borderWidth: 2,
      borderColor: '#E5E7EB',
      shadow: 'none',
      position: 'top'
    },
    linkButtonSettings: {
      style: 'default',
      size: 'medium',
      spacing: 'normal',
      alignment: 'center',
      showIcons: true,
      showDescriptions: true,
      hoverEffect: 'scale',
      animationSpeed: 300
    },
    socialButtonsSettings: {
      style: 'default',
      size: 'medium',
      shape: 'circle',
      spacing: 'normal',
      alignment: 'center',
      showLabels: false,
      hoverEffect: 'scale',
      animationSpeed: 300,
      backgroundColor: '#1F2937',
      iconColor: '#F9FAFB',
      borderColor: '#374151',
      hoverBackgroundColor: '#374151',
      hoverIconColor: '#F9FAFB'
    }
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
    borderRadius: 0,
    buttonColors: {
      background: 'transparent',
      text: '#374151',
      border: 'transparent',
      hoverBackground: '#F3F4F6',
      hoverText: '#374151',
      hoverBorder: 'transparent'
    }
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
    borderRadius: 12,
    buttonColors: {
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#F3E8FF',
      hoverBackground: '#F3E8FF',
      hoverText: '#1F2937',
      hoverBorder: '#E879F9'
    }
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
    borderRadius: 16,
    buttonColors: {
      background: '#0EA5E9',
      text: '#FFFFFF',
      border: '#0284C7',
      hoverBackground: '#0284C7',
      hoverText: '#FFFFFF',
      hoverBorder: '#0369A1'
    }
  },
  gradient: {
    name: 'Gradiente',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    textColor: '#FFFFFF',
    backgroundColor: '#1F2937',
    backgroundType: 'gradient' as const,
    fontFamily: 'Poppins',
    buttonStyle: 'gradient' as const,
    borderRadius: 12,
    buttonColors: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      text: '#FFFFFF',
      border: 'transparent',
      hoverBackground: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
      hoverText: '#FFFFFF',
      hoverBorder: 'transparent'
    }
  },
  neon: {
    name: 'Neon',
    primaryColor: '#00FFFF',
    secondaryColor: '#FF00FF',
    textColor: '#000000',
    backgroundColor: '#0A0A0A',
    backgroundType: 'solid' as const,
    fontFamily: 'Source Code Pro',
    buttonStyle: 'neon' as const,
    borderRadius: 8,
    buttonColors: {
      background: '#000000',
      text: '#00FFFF',
      border: '#00FFFF',
      hoverBackground: '#00FFFF',
      hoverText: '#000000',
      hoverBorder: '#00FFFF'
    }
  },
  glass: {
    name: 'Vidro',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    textColor: '#1E293B',
    backgroundColor: '#F8FAFC',
    backgroundType: 'gradient' as const,
    fontFamily: 'Inter',
    buttonStyle: 'glass' as const,
    borderRadius: 16,
    buttonColors: {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#1E293B',
      border: 'rgba(255, 255, 255, 0.2)',
      hoverBackground: 'rgba(255, 255, 255, 0.2)',
      hoverText: '#1E293B',
      hoverBorder: 'rgba(255, 255, 255, 0.3)'
    }
  },
  modern: {
    name: 'Moderno',
    primaryColor: '#000000',
    secondaryColor: '#6B7280',
    textColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    backgroundType: 'solid' as const,
    fontFamily: 'Inter',
    buttonStyle: 'modern' as const,
    borderRadius: 8,
    buttonColors: {
      background: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
      hoverBackground: '#F9FAFB',
      hoverText: '#1F2937',
      hoverBorder: '#D1D5DB'
    }
  },
  minimal: {
    name: 'Minimalista',
    primaryColor: '#374151',
    secondaryColor: '#9CA3AF',
    textColor: '#111827',
    backgroundColor: '#FFFFFF',
    backgroundType: 'solid' as const,
    fontFamily: 'Helvetica',
    buttonStyle: 'minimal' as const,
    borderRadius: 4
  }
} as const

// Fontes disponíveis
export const AVAILABLE_FONTS = [
  { label: 'Inter', value: 'Inter', category: 'Sans-serif' },
  { label: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
  { label: 'Poppins', value: 'Poppins', category: 'Sans-serif' },
  { label: 'Open Sans', value: 'Open Sans', category: 'Sans-serif' },
  { label: 'Lato', value: 'Lato', category: 'Sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
  { label: 'Merriweather', value: 'Merriweather', category: 'Serif' },
  { label: 'Source Code Pro', value: 'Source Code Pro', category: 'Monospace' },
  { label: 'Fira Code', value: 'Fira Code', category: 'Monospace' }
] as const

// Estilos de botão
export const BUTTON_STYLES = [
  { label: 'Arredondado', value: 'rounded', description: 'Botões com bordas arredondadas' },
  { label: 'Quadrado', value: 'sharp', description: 'Botões com bordas retas' },
  { label: 'Contorno', value: 'outlined', description: 'Botões apenas com borda' },
  { label: 'Preenchido', value: 'filled', description: 'Botões com fundo preenchido' },
  { label: 'Gradiente', value: 'gradient', description: 'Botões com gradiente de cores' },
  { label: 'Neon', value: 'neon', description: 'Botões com efeito neon/brilho' },
  { label: 'Glass', value: 'glass', description: 'Botões com efeito vidro/transparência' },
  { label: '3D', value: '3d', description: 'Botões com efeito 3D/elevação' },
  { label: 'Minimal', value: 'minimal', description: 'Botões minimalistas sem bordas' },
  { label: 'Pill', value: 'pill', description: 'Botões em formato de pílula' },
  { label: 'Card', value: 'card', description: 'Botões estilo cartão com sombra' },
  { label: 'Modern', value: 'modern', description: 'Botões modernos com design limpo' }
] as const

// Tipos de background
export const BACKGROUND_TYPES = [
  { label: 'Cor Sólida', value: 'solid', description: 'Fundo com cor única' },
  { label: 'Gradiente', value: 'gradient', description: 'Fundo com transição de cores' },
  { label: 'Imagem', value: 'image', description: 'Fundo com imagem personalizada' }
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

