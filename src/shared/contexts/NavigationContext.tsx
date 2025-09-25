'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAdminAuth } from '@/modules/auth/hooks/useAdminAuth'

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
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-settings'

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
  const { isAdmin } = useAdminAuth()

  const updateSection = (section: NavigationSection) => {
    console.log('🔄 NavigationContext: Mudando seção de', currentSection, 'para', section)
    
    // Verificar se é uma seção administrativa e se o usuário tem permissão
    if (section.startsWith('admin') && !isAdmin) {
      console.log('🚫 NavigationContext: Usuário não tem permissão para acessar seção admin:', section)
      return // Não permitir navegação para seções administrativas
    }
    
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
      'settings-danger': 'Zona de Perigo',
      'admin-dashboard': 'Dashboard Admin',
      'admin-users': 'Gerenciar Usuários',
      'admin-settings': 'Configurações do Sistema'
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
