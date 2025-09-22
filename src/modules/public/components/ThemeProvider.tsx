'use client'

import { createContext, useContext, useEffect } from 'react'
import { ThemeSettings } from '@/types/common.types'

interface ThemeContextType {
  themeSettings: ThemeSettings
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  themeSettings: ThemeSettings
}

export function ThemeProvider({ children, themeSettings }: ThemeProviderProps) {
  useEffect(() => {
    // Aplicar estilos customizados baseados no tema
    const root = document.documentElement
    
    if (themeSettings.primaryColor) {
      root.style.setProperty('--primary', themeSettings.primaryColor)
    }
    
    if (themeSettings.secondaryColor) {
      root.style.setProperty('--secondary', themeSettings.secondaryColor)
    }
    
    if (themeSettings.textColor) {
      root.style.setProperty('--foreground', themeSettings.textColor)
    }
    
    if (themeSettings.backgroundColor) {
      root.style.setProperty('--background', themeSettings.backgroundColor)
    }

    // Aplicar fonte customizada
    if (themeSettings.fontFamily) {
      root.style.setProperty('--font-family', themeSettings.fontFamily)
    }

    // Aplicar border radius customizado
    if (themeSettings.borderRadius !== undefined) {
      root.style.setProperty('--radius', `${themeSettings.borderRadius}px`)
    }

    // Aplicar background customizado
    if (themeSettings.backgroundType === 'gradient') {
      // Implementar gradientes customizados se necessário
    } else if (themeSettings.backgroundType === 'image' && themeSettings.backgroundImage) {
      root.style.setProperty('--background-image', `url(${themeSettings.backgroundImage})`)
    }

    return () => {
      // Limpar estilos customizados quando o componente for desmontado
      root.style.removeProperty('--primary')
      root.style.removeProperty('--secondary')
      root.style.removeProperty('--foreground')
      root.style.removeProperty('--background')
      root.style.removeProperty('--font-family')
      root.style.removeProperty('--radius')
      root.style.removeProperty('--background-image')
    }
  }, [themeSettings])

  return (
    <ThemeContext.Provider value={{ themeSettings }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}

