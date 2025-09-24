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
          fontFamily: themeSettings.fontFamily 
        }}
      >
        Seu Nome
      </h2>
      <p 
        className="text-sm opacity-80 mb-2"
        style={{ 
          color: themeSettings.titleColor || themeSettings.secondaryColor,
          fontFamily: themeSettings.fontFamily 
        }}
      >
        Seu título
      </p>
      <p 
        className="text-sm"
        style={{ 
          color: themeSettings.bioColor || themeSettings.textColor,
          fontFamily: themeSettings.fontFamily 
        }}
      >
        Sua biografia ou descrição pessoal
      </p>
    </div>
  )

  const getButtonClasses = () => {
    const linkButtonSettings = themeSettings.linkButtonSettings || {}
    
    // Função para obter classes de tamanho
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

    const baseClasses = `${getButtonSizeClasses(linkButtonSettings.size || 'medium')} font-medium transition-colors`
    
    // Usar linkButtonSettings.style em vez de themeSettings.buttonStyle
    switch (linkButtonSettings.style || 'default') {
      case 'default':
        return `${baseClasses} rounded-lg`
      case 'minimal':
        return `${baseClasses} rounded-none`
      case 'outlined':
        return `${baseClasses} rounded-lg border-2 border-current`
      case 'filled':
        return `${baseClasses} rounded-lg bg-current text-white`
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg`
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-md border border-white/20 rounded-lg`
      default:
        return `${baseClasses} rounded-lg`
    }
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: themeSettings.textColor }}>
        Preview do Tema
      </h3>
      
      <div 
        className="p-6 rounded-lg border-2 border-dashed border-gray-300"
        style={getBackgroundStyle()}
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
            <button
              className={getButtonClasses()}
              style={{ 
                color: themeSettings.buttonStyle === 'filled' ? 'white' : themeSettings.primaryColor,
                backgroundColor: themeSettings.buttonStyle === 'filled' ? themeSettings.primaryColor : 'transparent',
                borderColor: themeSettings.buttonStyle === 'outlined' ? themeSettings.primaryColor : 'transparent'
              }}
            >
              Link Exemplo 1
            </button>
            
            <button
              className={getButtonClasses()}
              style={{ 
                color: themeSettings.buttonStyle === 'filled' ? 'white' : themeSettings.primaryColor,
                backgroundColor: themeSettings.buttonStyle === 'filled' ? themeSettings.primaryColor : 'transparent',
                borderColor: themeSettings.buttonStyle === 'outlined' ? themeSettings.primaryColor : 'transparent'
              }}
            >
              Link Exemplo 2
            </button>
          </div>
          
          {/* Social links */}
          <div className="flex justify-center space-x-3 mt-4">
            {['Instagram', 'Twitter', 'GitHub'].map((platform) => (
              <div
                key={platform}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: themeSettings.secondaryColor }}
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
