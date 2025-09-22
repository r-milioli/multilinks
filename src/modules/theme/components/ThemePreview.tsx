'use client'

import { ThemeSettings } from '@/types/common.types'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'

interface ThemePreviewProps {
  themeSettings: ThemeSettings
  className?: string
}

export function ThemePreview({ themeSettings, className = '' }: ThemePreviewProps) {
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

  const getButtonClasses = () => {
    const baseClasses = 'px-3 py-1.5 text-sm font-medium transition-colors'
    
    switch (themeSettings.buttonStyle) {
      case 'rounded':
        return `${baseClasses} rounded-lg`
      case 'sharp':
        return `${baseClasses} rounded-none`
      case 'outlined':
        return `${baseClasses} rounded-lg border-2 border-current`
      case 'filled':
        return `${baseClasses} rounded-lg bg-current text-white`
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
        <div className="text-center space-y-4">
          {/* Avatar placeholder */}
          <div 
            className="w-16 h-16 rounded-full mx-auto border-2"
            style={{ 
              backgroundColor: themeSettings.primaryColor,
              borderColor: themeSettings.textColor 
            }}
          />
          
          {/* Nome e título */}
          <div>
            <h2 
              className="text-xl font-bold mb-1"
              style={{ 
                color: themeSettings.textColor,
                fontFamily: themeSettings.fontFamily 
              }}
            >
              Seu Nome
            </h2>
            <p 
              className="text-sm opacity-80"
              style={{ 
                color: themeSettings.textColor,
                fontFamily: themeSettings.fontFamily 
              }}
            >
              Seu título ou bio
            </p>
          </div>
          
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
