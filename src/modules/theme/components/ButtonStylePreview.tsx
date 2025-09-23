'use client'

import { cn } from '@/shared/utils/cn'
import { BUTTON_STYLES } from '@/shared/utils/constants'

interface ButtonStylePreviewProps {
  selectedStyle: string
  onStyleSelect: (style: string) => void
  themeSettings: any
}

export function ButtonStylePreview({ selectedStyle, onStyleSelect, themeSettings }: ButtonStylePreviewProps) {
  const getButtonStyle = (style: string) => {
    const base = 'w-full p-3 transition-all duration-300 focus:outline-none group relative overflow-hidden'
    
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

    switch (style) {
      case 'rounded':
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] focus:ring-2 focus:ring-offset-2')
      
      case 'sharp':
        return cn(base, 'rounded-none border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] focus:ring-2 focus:ring-offset-2')
      
      case 'outlined':
        return cn(base, rounded, 'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2')
      
      case 'filled':
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-offset-2')
      
      case 'gradient':
        return cn(
          base, rounded, 'border-0 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        )
      
      case 'neon':
        return cn(
          base, rounded, 'border-2 border-cyan-400 bg-black text-cyan-400 font-medium shadow-lg hover:shadow-cyan-400/50 hover:scale-[1.02] focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:border-cyan-300'
        )
      
      case 'glass':
        return cn(
          base, rounded, 'border border-white/20 bg-white/10 backdrop-blur-md text-gray-900 dark:text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'hover:bg-white/20 dark:hover:bg-white/20'
        )
      
      case '3d':
        return cn(
          base, rounded, 'border-2 border-transparent bg-gradient-to-b from-white to-gray-200 dark:from-gray-700 dark:to-gray-900 text-gray-900 dark:text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'hover:from-gray-50 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-800'
        )
      
      case 'minimal':
        return cn(
          base, 'rounded-none border-0 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.01] focus:ring-2 focus:ring-offset-2',
          'hover:shadow-sm'
        )
      
      case 'pill':
        return cn(
          base, 'rounded-full border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'hover:bg-gray-50 dark:hover:bg-gray-700'
        )
      
      case 'card':
        return cn(
          base, rounded, 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'hover:border-gray-300 dark:hover:border-gray-600'
        )
      
      case 'modern':
        return cn(
          base, rounded, 'border-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-2 focus:ring-offset-2',
          'hover:bg-gray-800 dark:hover:bg-gray-100'
        )
      
      default:
        return cn(base, rounded, 'border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-[1.02] focus:ring-2 focus:ring-offset-2')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Estilos de Botão
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {BUTTON_STYLES.map((style) => (
          <button
            key={style.value}
            onClick={() => onStyleSelect(style.value)}
            className={cn(
              'relative p-3 rounded-lg border-2 transition-all duration-200',
              selectedStyle === style.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {style.label}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {style.description}
                </p>
              </div>
              {selectedStyle === style.value && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Preview do botão */}
            <div className="pointer-events-none">
              <div 
                className={getButtonStyle(style.value)}
                style={{
                  borderRadius: themeSettings?.borderRadius ? `${themeSettings.borderRadius}px` : undefined
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="flex-1 text-left">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
