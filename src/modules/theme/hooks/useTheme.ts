import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ThemeSettings } from '@/types/common.types'
import { PRESET_THEMES, AVAILABLE_FONTS, BUTTON_STYLES, BACKGROUND_TYPES } from '@/shared/utils/constants'

export function useTheme() {
  const { data: session } = useSession()
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(PRESET_THEMES.default)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Carregar tema do usuário
  useEffect(() => {
    if (session?.user?.id) {
      loadUserTheme()
    }
  }, [session?.user?.id])

  const loadUserTheme = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/theme')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setThemeSettings(data.data)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTheme = async (newTheme: ThemeSettings) => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/user/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTheme),
      })

      const result = await response.json()
      if (result.success) {
        setThemeSettings(newTheme)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Erro ao salvar tema:', error)
      return { success: false, error: 'Erro ao salvar tema' }
    } finally {
      setIsSaving(false)
    }
  }

  const applyPresetTheme = async (themeKey: keyof typeof PRESET_THEMES) => {
    const presetTheme = PRESET_THEMES[themeKey]
    return await saveTheme(presetTheme)
  }

  const resetToDefault = async () => {
    return await saveTheme(PRESET_THEMES.default)
  }

  const updateThemeProperty = (property: keyof ThemeSettings, value: any) => {
    const newTheme = { ...themeSettings, [property]: value }
    setThemeSettings(newTheme)
  }

  const getButtonClasses = () => {
    const baseClasses = 'px-4 py-2 font-medium transition-colors'
    
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

  return {
    themeSettings,
    isLoading,
    isSaving,
    saveTheme,
    applyPresetTheme,
    resetToDefault,
    updateThemeProperty,
    getButtonClasses,
    getBackgroundStyle,
    presetThemes: PRESET_THEMES,
    availableFonts: AVAILABLE_FONTS,
    buttonStyles: BUTTON_STYLES,
    backgroundTypes: BACKGROUND_TYPES
  }
}
