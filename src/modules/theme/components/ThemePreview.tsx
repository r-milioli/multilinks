'use client'

import { ThemeSettings } from '@/types/common.types'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { cn } from '@/shared/utils/cn'

interface ThemePreviewProps {
  themeSettings: ThemeSettings
  className?: string
  avatarUrl?: string
}

export function ThemePreview({ themeSettings, className = '', avatarUrl }: ThemePreviewProps) {
  const getBackgroundStyle = () => {
    switch (themeSettings.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        }
      case 'image':
        return {
          backgroundImage: `url(${themeSettings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      default:
        return {
          backgroundColor: themeSettings.backgroundColor
        }
    }
  }

  const getAvatarClasses = () => {
    const avatarSettings = themeSettings.avatarSettings || {}
    
    // Tamanho
    const getSizeClass = (size: string) => {
      switch (size) {
        case 'small': return 'w-16 h-16'
        case 'medium': return 'w-20 h-20'
        case 'large': return 'w-24 h-24'
        case 'xlarge': return 'w-32 h-32'
        default: return 'w-20 h-20'
      }
    }

    // Forma
    const getShapeClass = (shape: string) => {
      switch (shape) {
        case 'circle': return 'rounded-full'
        case 'square': return 'rounded-lg'
        case 'rounded': return 'rounded-2xl'
        case 'hexagon': return 'rounded-none'
        default: return 'rounded-full'
      }
    }

    // Sombra
    const getShadowClass = (shadow: string) => {
      switch (shadow) {
        case 'none': return ''
        case 'sm': return 'shadow-sm'
        case 'md': return 'shadow-md'
        case 'lg': return 'shadow-lg'
        case 'xl': return 'shadow-xl'
        case 'glow': return 'shadow-lg shadow-blue-500/25'
        default: return 'shadow-lg'
      }
    }

    return `${getSizeClass(avatarSettings.size || 'medium')} ${getShapeClass(avatarSettings.shape || 'circle')} ${getShadowClass(avatarSettings.shadow || 'lg')}`
  }

  const getAvatarPositionClasses = (position: string) => {
    switch (position) {
      case 'top':
        return 'flex-col items-center text-center'
      case 'center':
        return 'flex-col-reverse items-center text-center'
      default:
        return 'flex-col items-center text-center'
    }
  }

  const renderAvatarPreview = () => (
    <div className="relative">
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="Avatar" 
          className={`mx-auto object-cover ${getAvatarClasses()}`}
          style={{ 
            borderWidth: `${themeSettings.avatarSettings?.borderWidth || 2}px`,
            borderColor: themeSettings.avatarSettings?.borderColor || themeSettings.primaryColor,
            borderStyle: 'solid'
          }}
        />
      ) : (
        <div 
          className={`mx-auto flex items-center justify-center ${getAvatarClasses()}`}
          style={{ 
            backgroundColor: themeSettings.primaryColor,
            borderWidth: `${themeSettings.avatarSettings?.borderWidth || 2}px`,
            borderColor: themeSettings.avatarSettings?.borderColor || themeSettings.textColor,
            borderStyle: 'solid'
          }}
        >
          <span className="text-3xl font-bold" style={{ color: 'white' }}>
            U
          </span>
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
        <span className="text-white text-xs">✓</span>
      </div>
    </div>
  )

  const renderProfileInfoPreview = () => (
    <div>
      <h2 
        className="text-xl font-bold mb-1"
        style={{ 
          color: themeSettings.nameColor || themeSettings.textColor,
          fontFamily: themeSettings.fontFamily || 'Inter'
        }}
      >
        Seu Nome
      </h2>
      <p 
        className="text-sm opacity-80 mb-2"
        style={{ 
          color: themeSettings.titleColor || themeSettings.secondaryColor,
          fontFamily: themeSettings.fontFamily || 'Inter'
        }}
      >
        Seu título
      </p>
      <p 
        className="text-sm"
        style={{ 
          color: themeSettings.bioColor || themeSettings.textColor,
          fontFamily: themeSettings.fontFamily || 'Inter'
        }}
      >
        Sua biografia ou descrição pessoal
      </p>
    </div>
  )

  const getHoverEffectClasses = (effect: string) => {
    const map: Record<string, string> = {
      scale: 'hover:scale-[1.02]',
      lift: 'hover:shadow-lg hover:-translate-y-1',
      slide: 'hover:translate-x-2',
      rotate: 'hover:rotate-1',
      glow: 'hover:shadow-blue-500/50 hover:shadow-lg',
      none: ''
    }
    return map[effect] || 'hover:scale-[1.02]'
  }

  const getButtonClasses = () => {
    const linkButtonSettings = themeSettings.linkButtonSettings || {}
    const effectiveStyle = themeSettings.buttonStyle || linkButtonSettings.style || 'default'
    const hoverEffect = themeSettings.hoverEffect || linkButtonSettings.hoverEffect || 'scale'
    const hoverClasses = getHoverEffectClasses(hoverEffect)
    const enableGlow = themeSettings.enableGlow === true
    const enablePulse = themeSettings.enablePulse === true
    const specialEffects = cn(
      enableGlow && 'hover:shadow-blue-400/50',
      enablePulse && 'animate-pulse'
    )

    const getButtonSizeClasses = (size: string) => {
      switch (size) {
        case 'small':
          return 'px-2 py-1 text-sm'
        case 'medium':
          return 'px-3 py-1.5 text-sm'
        case 'large':
          return 'px-4 py-2 text-base'
        default:
          return 'px-3 py-1.5 text-sm'
      }
    }

    const baseClasses = `${getButtonSizeClasses(linkButtonSettings.size || 'medium')} font-medium transition-colors w-full`
    const rounded = 'rounded-lg'

    switch (effectiveStyle) {
      case 'rounded':
      case 'default':
        return cn(baseClasses, rounded, 'border-2 border-transparent shadow-sm hover:shadow-md', hoverClasses, specialEffects)
      case 'sharp':
        return cn(baseClasses, 'rounded-none border-2 border-transparent shadow-sm hover:shadow-md', hoverClasses, specialEffects)
      case 'outlined':
        return cn(baseClasses, rounded, 'border-2 bg-transparent', hoverClasses, specialEffects)
      case 'filled':
        return cn(baseClasses, rounded, 'border-2 border-transparent shadow-lg hover:shadow-xl', hoverClasses, specialEffects)
      case 'gradient':
        return cn(
          baseClasses, rounded, 'border-0 text-white font-medium shadow-lg hover:shadow-xl',
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
          hoverClasses, specialEffects
        )
      case 'neon':
        return cn(
          baseClasses, rounded, 'border-2 border-cyan-400 bg-black text-cyan-400 font-medium shadow-lg',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:border-cyan-300',
          hoverClasses, specialEffects
        )
      case 'glass':
        return cn(
          baseClasses, rounded, 'border border-white/20 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl',
          'hover:bg-white/20',
          hoverClasses, specialEffects
        )
      case '3d':
        return cn(
          baseClasses, rounded, 'border-2 border-transparent shadow-lg hover:shadow-xl',
          'bg-gradient-to-b from-white to-gray-200 dark:from-gray-700 dark:to-gray-900 dark:text-white',
          'hover:from-gray-50 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-800',
          hoverClasses, specialEffects
        )
      case 'minimal':
        return cn(
          baseClasses, 'rounded-none border-0 bg-transparent',
          'hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm',
          hoverClasses, specialEffects
        )
      case 'pill':
        return cn(
          baseClasses, 'rounded-full border-2 border-transparent shadow-sm hover:shadow-md',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          hoverClasses, specialEffects
        )
      case 'card':
        return cn(
          baseClasses, rounded, 'border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg',
          'hover:border-gray-300 dark:hover:border-gray-600',
          hoverClasses, specialEffects
        )
      case 'modern':
        return cn(
          baseClasses, rounded, 'border-0 font-medium shadow-lg hover:shadow-xl',
          'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
          'hover:bg-gray-800 dark:hover:bg-gray-100',
          hoverClasses, specialEffects
        )
      default:
        return cn(baseClasses, rounded, 'border-2 border-transparent shadow-sm hover:shadow-md', hoverClasses, specialEffects)
    }
  }

  const isSpecialButtonStyle = (style: string) =>
    ['gradient', 'neon', 'glass', '3d', 'modern'].includes(style)

  const getEffectiveButtonStyle = () =>
    themeSettings.buttonStyle || themeSettings.linkButtonSettings?.style || 'default'

  const fontFamily = themeSettings.fontFamily || 'Inter'

  return (
    <div className={`${className}`} style={{ fontFamily }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeSettings.textColor, fontFamily }}>
        Preview do Tema
      </h3>
      
      <div 
        className="p-6 rounded-lg border-2 border-dashed border-gray-300"
        style={{ ...getBackgroundStyle(), fontFamily }}
      >
        <div className={cn("space-y-4", getAvatarPositionClasses(themeSettings.avatarSettings?.position || 'top'))}>
          {themeSettings.avatarSettings?.position === 'top' ? (
            <>
              {renderAvatarPreview()}
              {renderProfileInfoPreview()}
            </>
          ) : (
            <>
              {renderProfileInfoPreview()}
              {renderAvatarPreview()}
            </>
          )}
          
          {/* Botões de exemplo */}
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            {(() => {
              const effectiveStyle = getEffectiveButtonStyle()
              const special = isSpecialButtonStyle(effectiveStyle)
              const animationSpeed = themeSettings.animationSpeed ?? themeSettings.linkButtonSettings?.animationSpeed ?? 300
              const baseStyle: React.CSSProperties = {
                fontFamily,
                transitionDuration: `${animationSpeed}ms`
              }
              if (effectiveStyle === 'pill') baseStyle.borderRadius = '9999px'
              else if (effectiveStyle === 'sharp') baseStyle.borderRadius = 0
              else if (themeSettings.borderRadius != null) baseStyle.borderRadius = `${themeSettings.borderRadius}px`
              if (!special) {
                baseStyle.color = effectiveStyle === 'filled' ? 'white' : themeSettings.primaryColor
                if (effectiveStyle === 'outlined') {
                  baseStyle.backgroundColor = 'transparent'
                  baseStyle.borderColor = themeSettings.primaryColor
                } else if (effectiveStyle === 'minimal') {
                  baseStyle.backgroundColor = 'transparent'
                  baseStyle.borderWidth = 0
                  baseStyle.borderColor = 'transparent'
                } else {
                  baseStyle.backgroundColor = effectiveStyle === 'filled' ? themeSettings.primaryColor : 'transparent'
                  baseStyle.borderColor = effectiveStyle === 'outlined' ? themeSettings.primaryColor : 'transparent'
                }
              }
              return (
                <>
                  <button className={getButtonClasses()} style={baseStyle}>
                    Link Exemplo 1
                  </button>
                  <button className={getButtonClasses()} style={baseStyle}>
                    Link Exemplo 2
                  </button>
                </>
              )
            })()}
          </div>
          
          {/* Social links */}
          <div className="flex justify-center space-x-3 mt-4">
            {['Instagram', 'Twitter', 'GitHub'].map((platform) => (
              <div
                key={platform}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: themeSettings.secondaryColor, fontFamily }}
              >
                {platform[0]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
