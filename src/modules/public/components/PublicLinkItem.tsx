'use client'

import { useState, useCallback } from 'react'
import { Link } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
import { getFaviconUrl, formatUrlForDisplay } from '@/lib/utils'
import { cn } from '@/shared/utils/cn'
import { FormModal } from '@/modules/forms/components/FormModal'
import { usePublicForm } from '@/modules/forms/hooks/usePublicForm'
import { trackEvent } from '@/shared/components/TrackingScripts'

interface PublicLinkItemProps {
  link: Link
  onClick: () => void
  themeSettings?: any
}

export function PublicLinkItem({ link, onClick, themeSettings }: PublicLinkItemProps) {
  const [showForm, setShowForm] = useState(false)
  
  // Só inicializar o hook se o link realmente usa formulário
  const shouldUseForm = Boolean(link.useForm && link.formId)
  const { form, loadForm, loading } = usePublicForm(shouldUseForm ? (link.formId || '') : '')

  const handleClick = () => {
    console.log('🔗 Link clicado:', {
      linkId: link.id,
      useForm: link.useForm,
      formId: link.formId,
      shouldUseForm,
      hasForm: !!form,
      loading,
      showForm
    })
    
    onClick()
    
    // Se o link tem formulário, mostrar modal do formulário
    if (shouldUseForm) {
      console.log('📝 Link usa formulário, mostrando modal...')
      setShowForm(true)
      // Só carregar se ainda não foi carregado e não está carregando
      if (!form && !loading) {
        console.log('🔄 Carregando formulário...')
        loadForm()
      } else {
        console.log('✅ Formulário já carregado ou carregando')
      }
    } else {
      console.log('🔗 Link normal, abrindo diretamente...')
      // Abrir link diretamente em nova aba
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleFormSuccess = useCallback((redirectUrl?: string) => {
    setShowForm(false)
    
    // Tracking de submissão de formulário
    if (form) {
      trackEvent.formSubmission(
        form.id,
        form.title || link.title || 'Formulário'
      )
    }
    
    // Aguardar um pouco antes de redirecionar para garantir que o modal foi fechado
    setTimeout(() => {
      // Se há URL de redirecionamento, usar ela, senão usar a URL do link
      const finalUrl = redirectUrl || link.url
      if (finalUrl) {
        window.open(finalUrl, '_blank', 'noopener,noreferrer')
      }
    }, 100)
  }, [link.url, link.title, form])

  // Cores personalizadas dos botões
  const buttonColors = themeSettings?.buttonColors || {
    background: '#FFFFFF',
    text: '#1E293B',
    border: '#E5E7EB',
    hoverBackground: '#F9FAFB',
    hoverText: '#1E293B',
    hoverBorder: '#D1D5DB'
  }

  // Configurações da imagem
  const imageSettings = themeSettings?.imageSettings || {
    position: 'left',
    size: 'medium',
    borderRadius: 'rounded',
    spacing: 'normal'
  }

  // Configurações dos botões de links
  const linkButtonSettings = themeSettings?.linkButtonSettings || {
    style: 'default',
    size: 'medium',
    spacing: 'normal',
    alignment: 'center',
    showIcons: true,
    showDescriptions: true,
    hoverEffect: 'scale',
    animationSpeed: 300
  }

  // Usar o hoverEffect do themeSettings se disponível, senão usar o do linkButtonSettings
  // Converter objeto para string se necessário (para compatibilidade com dados antigos)
  let themeHoverEffect = themeSettings?.hoverEffect
  if (typeof themeHoverEffect === 'object' && themeHoverEffect !== null) {
    // Se for um objeto, converter para string
    themeHoverEffect = Object.values(themeHoverEffect).join('')
  }
  const finalHoverEffect = themeHoverEffect || linkButtonSettings.hoverEffect
  


  // Funções auxiliares para configurações de imagem
  const getImageSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-6 h-6'
      case 'medium':
        return 'w-8 h-8'
      case 'large':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  const getImagePositionClasses = (position: string) => {
    switch (position) {
      case 'left':
        return 'flex-row'
      case 'right':
        return 'flex-row-reverse'
      case 'top':
        return 'flex-col'
      case 'bottom':
        return 'flex-col-reverse'
      default:
        return 'flex-row'
    }
  }

  const getImageSpacingClasses = (position: string, spacing: string) => {
    const spacingMap = {
      tight: { horizontal: 'space-x-2', vertical: 'space-y-1' },
      normal: { horizontal: 'space-x-3', vertical: 'space-y-2' },
      loose: { horizontal: 'space-x-4', vertical: 'space-y-3' }
    }
    
    const currentSpacing = spacingMap[spacing as keyof typeof spacingMap] || spacingMap.normal
    
    switch (position) {
      case 'left':
      case 'right':
        return currentSpacing.horizontal
      case 'top':
      case 'bottom':
        return currentSpacing.vertical
      default:
        return currentSpacing.horizontal
    }
  }

  const getButtonStyle = () => {
    // Função para obter classes de tamanho baseadas nas configurações
    const getButtonSizeClasses = (size: string) => {
      switch (size) {
        case 'small':
          return 'p-2 text-sm'
        case 'medium':
          return 'p-4 text-base'
        case 'large':
          return 'p-6 text-lg'
        default:
          return 'p-4 text-base'
      }
    }

    // Função para obter a classe de border radius correta
    const getBorderRadiusClass = (radius: number) => {
      if (radius === 0) return 'rounded-none'
      if (radius <= 2) return 'rounded-sm'
      if (radius <= 4) return 'rounded'
      if (radius <= 6) return 'rounded-md'
      if (radius <= 8) return 'rounded-lg'
      if (radius <= 12) return 'rounded-xl'
      if (radius <= 16) return 'rounded-2xl'
      if (radius <= 20) return 'rounded-3xl'
      return 'rounded-full'
    }
    
    const borderRadius = themeSettings?.borderRadius || 8
    const rounded = getBorderRadiusClass(borderRadius)
    
    // Efeitos de hover baseados nas configurações
    const hoverEffect = finalHoverEffect || 'scale'
    
    const hoverEffectsMap = {
      'scale': 'hover:scale-[1.02]',
      'lift': 'hover:shadow-lg hover:-translate-y-1',
      'slide': 'hover:translate-x-2',
      'rotate': 'hover:rotate-1',
      'glow': 'hover:shadow-blue-500/50 hover:shadow-lg',
      'none': ''
    } as const
    
    const hoverClasses = hoverEffectsMap[hoverEffect as keyof typeof hoverEffectsMap] || 'hover:scale-[1.02]'
    const enableGlow = themeSettings?.enableGlow === true
    const enablePulse = themeSettings?.enablePulse === true
    const specialEffectClasses = cn(
      enableGlow && 'hover:shadow-blue-400/50',
      enablePulse && 'animate-pulse'
    )
    
    // Base sempre aplicada com tamanho dinâmico
    const base = `w-full ${getButtonSizeClasses(linkButtonSettings.size)} transition-all focus:outline-none group relative overflow-hidden`
    
    // Fallback para estilos pré-definidos se não há tema
    if (!themeSettings) {
      return cn(
        base, rounded, 'border-2 border-transparent',
        'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md',
        'transition-all duration-200 hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'group'
      )
    }

    const primaryColor = themeSettings.primaryColor || '#3B82F6'
    const secondaryColor = themeSettings.secondaryColor || '#64748B'

    // Usar themeSettings.buttonStyle se disponível, senão usar linkButtonSettings.style
    let buttonStyle = themeSettings?.buttonStyle || linkButtonSettings.style
    
    // Converter objeto para string se necessário (para compatibilidade com dados antigos)
    if (typeof buttonStyle === 'object' && buttonStyle !== null) {
      buttonStyle = Object.values(buttonStyle).join('')
    }
    
    // Estilos que têm aparência própria (não usar buttonColors no inline style)
    const isSpecialStyle = ['glass', 'neon', 'gradient', '3d', 'modern'].includes(buttonStyle)
    const hasCustomColors = themeSettings?.buttonColors && Object.keys(themeSettings.buttonColors).length > 0

    if (hasCustomColors && !isSpecialStyle) {
      const radiusClass = buttonStyle === 'sharp' ? 'rounded-none' : buttonStyle === 'pill' ? 'rounded-full' : rounded
      return cn(base, radiusClass, 'border-2 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
    }
    
    // Aplicar estilos específicos
    switch (buttonStyle) {
      case 'rounded':
      case 'default':
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
      
      case 'sharp':
        return cn(base, 'rounded-none border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
      
      case 'outlined':
        return cn(base, rounded, 'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
      
      case 'filled':
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
      
      case 'gradient':
        return cn(
          base, rounded, 'border-0 text-white font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2',
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
          hoverClasses, specialEffectClasses
        )
      
      case 'neon':
        return cn(
          base, rounded, 'border-2 border-cyan-400 bg-black text-cyan-400 font-medium shadow-lg hover:shadow-cyan-400/50 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:border-cyan-300',
          hoverClasses, specialEffectClasses
        )
      
      case 'glass':
        return cn(
          base, rounded, 'border border-white/20 bg-white/10 backdrop-blur-md text-gray-900 dark:text-white shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2',
          'hover:bg-white/20 dark:hover:bg-white/20',
          hoverClasses, specialEffectClasses
        )
      
      case '3d':
        return cn(
          base, rounded, 'border-2 border-transparent bg-gradient-to-b from-white to-gray-200 dark:from-gray-700 dark:to-gray-900 text-gray-900 dark:text-white shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2',
          'hover:from-gray-50 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-800',
          hoverClasses, specialEffectClasses
        )
      
      case 'minimal':
        return cn(
          base, 'rounded-none border-0 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2',
          'hover:shadow-sm',
          hoverClasses, specialEffectClasses
        )
      
      case 'pill':
        return cn(
          base, 'rounded-full border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          hoverClasses, specialEffectClasses
        )
      
      case 'card':
        return cn(
          base, rounded, 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2',
          'hover:border-gray-300 dark:hover:border-gray-600',
          hoverClasses, specialEffectClasses
        )
      
      case 'modern':
        return cn(
          base, rounded, 'border-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-offset-2',
          'hover:bg-gray-800 dark:hover:bg-gray-100',
          hoverClasses, specialEffectClasses
        )
      
      default:
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2', hoverClasses, specialEffectClasses)
    }
  }

  const resolvedButtonStyle = (() => {
    let s = themeSettings?.buttonStyle ?? linkButtonSettings.style
    if (typeof s === 'object' && s !== null) s = Object.values(s).join('')
    return String(s || 'default')
  })()
  const isSpecialButtonStyle = ['glass', 'neon', 'gradient', '3d', 'modern'].includes(resolvedButtonStyle)

  const animationSpeed = themeSettings?.animationSpeed ?? linkButtonSettings.animationSpeed ?? 300
  const buttonInlineStyle: React.CSSProperties = {
    transitionDuration: `${animationSpeed}ms`
  }
  // Raio de borda: pill = fixo (pílula), sharp = 0 (sobrepõe opção de raio), demais = tema
  if (resolvedButtonStyle === 'pill') {
    buttonInlineStyle.borderRadius = '9999px'
  } else if (resolvedButtonStyle === 'sharp') {
    buttonInlineStyle.borderRadius = '0'
  } else if (themeSettings?.borderRadius != null) {
    buttonInlineStyle.borderRadius = `${themeSettings.borderRadius}px`
  }
  if (!isSpecialButtonStyle) {
    buttonInlineStyle.color = buttonColors.text
    if (resolvedButtonStyle === 'outlined') {
      buttonInlineStyle.backgroundColor = 'transparent'
      buttonInlineStyle.borderColor = buttonColors.border
    } else if (resolvedButtonStyle === 'minimal') {
      buttonInlineStyle.backgroundColor = 'transparent'
      buttonInlineStyle.borderWidth = 0
      buttonInlineStyle.borderStyle = 'solid'
      buttonInlineStyle.borderColor = 'transparent'
    } else {
      buttonInlineStyle.backgroundColor = buttonColors.background
      buttonInlineStyle.borderColor = buttonColors.border
    }
  }

  return (
    <>
    <button
      onClick={handleClick}
      className={getButtonStyle()}
      style={buttonInlineStyle}
      onMouseEnter={(e) => {
        if (!isSpecialButtonStyle) {
          if (resolvedButtonStyle !== 'outlined') e.currentTarget.style.backgroundColor = buttonColors.hoverBackground
          else e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = buttonColors.hoverText
          if (resolvedButtonStyle !== 'minimal') e.currentTarget.style.borderColor = buttonColors.hoverBorder
        }
        const titleElement = e.currentTarget.querySelector('h3') as HTMLElement
        const descElement = e.currentTarget.querySelector('p') as HTMLElement
        const urlElement = e.currentTarget.querySelector('p:last-of-type') as HTMLElement
        const iconElement = e.currentTarget.querySelector('svg') as SVGSVGElement
        const hoverText = isSpecialButtonStyle ? undefined : buttonColors.hoverText
        const normalText = isSpecialButtonStyle ? undefined : buttonColors.text
        if (hoverText && (titleElement || descElement || urlElement || iconElement)) {
          if (titleElement) titleElement.style.color = hoverText
          if (descElement) descElement.style.color = hoverText
          if (urlElement) urlElement.style.color = hoverText
          if (iconElement) iconElement.style.color = hoverText
        }
      }}
      onMouseLeave={(e) => {
        if (!isSpecialButtonStyle) {
          if (resolvedButtonStyle !== 'outlined') e.currentTarget.style.backgroundColor = buttonColors.background
          else e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = buttonColors.text
          if (resolvedButtonStyle !== 'minimal') e.currentTarget.style.borderColor = buttonColors.border
        }
        const titleElement = e.currentTarget.querySelector('h3') as HTMLElement
        const descElement = e.currentTarget.querySelector('p') as HTMLElement
        const urlElement = e.currentTarget.querySelector('p:last-of-type') as HTMLElement
        const iconElement = e.currentTarget.querySelector('svg') as SVGSVGElement
        const textColor = isSpecialButtonStyle ? undefined : buttonColors.text
        if (textColor != null && (titleElement || descElement || urlElement || iconElement)) {
          if (titleElement) titleElement.style.color = textColor
          if (descElement) descElement.style.color = textColor
          if (urlElement) urlElement.style.color = textColor
          if (iconElement) iconElement.style.color = textColor
        }
      }}
    >
      <div className={`flex items-center ${getImagePositionClasses(imageSettings.position)} ${getImageSpacingClasses(imageSettings.position, imageSettings.spacing)}`}>
        {/* Imagem do Link ou Favicon */}
        <div className="flex-shrink-0">
          {link.image ? (
            <img
              src={link.image}
              alt={link.title || 'Link'}
              className={`${getImageSizeClasses(imageSettings.size)} ${imageSettings.borderRadius} object-cover`}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = getFaviconUrl(link.url)
                target.className = `${getImageSizeClasses(imageSettings.size)} ${imageSettings.borderRadius}`
              }}
            />
          ) : (
            <img
              src={getFaviconUrl(link.url)}
              alt=""
              className={`${getImageSizeClasses(imageSettings.size)} ${imageSettings.borderRadius}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/default-favicon.png'
              }}
            />
          )}
        </div>

        {/* Link Info */}
        <div className="flex-1 text-left min-w-0">
          <h3 
            className="font-semibold truncate"
            style={isSpecialButtonStyle ? undefined : { color: buttonColors.text }}
          >
            {link.title}
          </h3>
          {link.description && (
            <p 
              className="text-sm truncate mb-1"
              style={isSpecialButtonStyle ? { opacity: 0.8 } : { color: buttonColors.text, opacity: 0.8 }}
            >
              {link.description}
            </p>
          )}
          <p 
            className="text-sm truncate"
            style={isSpecialButtonStyle ? { opacity: 0.6 } : { color: buttonColors.text, opacity: 0.6 }}
          >
            {formatUrlForDisplay(link.url)}
          </p>
        </div>

        {/* External Link Icon */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink 
            className="h-5 w-5" 
            style={isSpecialButtonStyle ? { opacity: 0.7 } : { color: buttonColors.text, opacity: 0.7 }}
          />
        </div>
      </div>
    </button>
    
    {/* Modal do Formulário */}
    {shouldUseForm && form && (
      <FormModal
        form={form}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        linkId={link.id}
        themeSettings={themeSettings}
      />
    )}
  </>
  )
}

