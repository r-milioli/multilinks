'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type NavigationSection = 
  | 'dashboard' 
  | 'dashboard-links'
  | 'dashboard-analytics'
  | 'dashboard-performance'
  | 'dashboard-activity'
  | 'forms-list' 
  | 'forms-create' 
  | 'analytics' 
  | 'settings'
  | 'settings-profile'
  | 'settings-notifications'
  | 'settings-appearance'
  | 'settings-security'
  | 'settings-integrations'
  | 'settings-danger'

interface NavigationContextType {
  currentSection: NavigationSection
  setCurrentSection: (section: NavigationSection) => void
  title: string
  setTitle: (title: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
  const [title, setTitle] = useState('Dashboard')

  const updateSection = (section: NavigationSection) => {
    console.log('🔄 NavigationContext: Mudando seção de', currentSection, 'para', section)
    setCurrentSection(section)
    
    // Atualizar título baseado na seção
    const titles = {
      'dashboard': 'Visão Geral',
      'dashboard-links': 'Meus Links',
      'dashboard-analytics': 'Analytics do Dashboard',
      'dashboard-performance': 'Performance',
      'dashboard-activity': 'Atividade',
      'forms-list': 'Formulários',
      'forms-create': 'Criar Formulário',
      'analytics': 'Analytics',
      'settings': 'Configurações',
      'settings-profile': 'Perfil',
      'settings-notifications': 'Notificações',
      'settings-appearance': 'Aparência',
      'settings-security': 'Segurança',
      'settings-integrations': 'Integrações',
      'settings-danger': 'Zona de Perigo'
    }
    
    const newTitle = titles[section]
    console.log('📝 NavigationContext: Atualizando título para', newTitle)
    setTitle(newTitle)
  }

  return (
    <NavigationContext.Provider 
      value={{ 
        currentSection, 
        setCurrentSection: updateSection,
        title,
        setTitle
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
