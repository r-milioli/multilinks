'use client'

import { useNavigation } from '@/shared/contexts/NavigationContext'
import { useAdminAuth } from '@/modules/auth/hooks/useAdminAuth'
import { DashboardContent } from './DashboardContent'
import { FormsListContent } from './FormsListContent'
import { FormsCreateContent } from './FormsCreateContent'
import { AnalyticsContent } from './AnalyticsContent'
import { SettingsContent } from './SettingsContent'
import { AdminContent } from './AdminContent'

export function DynamicContent() {
  let currentSection
  try {
    const navigation = useNavigation()
    currentSection = navigation.currentSection
  } catch (error) {
    console.error('❌ DynamicContent: Erro ao usar useNavigation', error)
    return <div>Erro: useNavigation não encontrado</div>
  }

  // Verificar se é uma seção administrativa e se o usuário tem permissão
  const { isAdmin } = useAdminAuth()
  const isAdminSection = currentSection?.startsWith('admin')
  
  if (isAdminSection && !isAdmin) {
    // Redirecionar para dashboard se usuário tentar acessar seção admin sem permissão
    return <DashboardContent />
  }

  switch (currentSection) {
    case 'dashboard':
    case 'dashboard-links':
    case 'dashboard-analytics':
    case 'dashboard-performance':
    case 'dashboard-activity':
      return <DashboardContent />
    
    case 'forms-list':
      return <FormsListContent />
    
    case 'forms-create':
      return <FormsCreateContent />
    
    case 'analytics':
      return <AnalyticsContent />
    
    case 'settings':
    case 'settings-profile':
    case 'settings-notifications':
    case 'settings-appearance':
    case 'settings-security':
    case 'settings-integrations':
    case 'settings-danger':
      return <SettingsContent />
    
    case 'admin-dashboard':
    case 'admin-financial':
    case 'admin-users':
    case 'admin-settings':
      return <AdminContent />
    
    default:
      return <DashboardContent />
  }
}
