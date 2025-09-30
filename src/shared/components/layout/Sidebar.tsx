'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  AlertTriangle,
  BarChart,
  TrendingUp,
  Eye,
  Activity,
  Crown,
  Users,
  Cog,
  DollarSign
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { useAdminAuth } from '@/modules/auth/hooks/useAdminAuth'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  section?: string
  children?: MenuItem[]
}

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentSection, setCurrentSection } = useNavigation()
  const { isAdmin } = useAdminAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  console.log('🔧 Sidebar: currentSection =', currentSection, 'setCurrentSection =', setCurrentSection)

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      children: [
        {
          id: 'dashboard-overview',
          label: 'Visão Geral',
          icon: LayoutDashboard,
          section: 'dashboard'
        },
        {
          id: 'dashboard-links',
          label: 'Meus Links',
          icon: LinkIcon,
          section: 'dashboard-links'
        },
        {
          id: 'dashboard-analytics',
          label: 'Analytics',
          icon: BarChart,
          section: 'dashboard-analytics'
        },
        {
          id: 'dashboard-performance',
          label: 'Performance',
          icon: TrendingUp,
          section: 'dashboard-performance'
        },
        {
          id: 'dashboard-activity',
          label: 'Atividade',
          icon: Activity,
          section: 'dashboard-activity'
        }
      ]
    },
    {
      id: 'forms',
      label: 'Formulários',
      icon: FileText,
      children: [
        {
          id: 'forms-list',
          label: 'Listar',
          icon: List,
          section: 'forms-list'
        },
        {
          id: 'forms-create',
          label: 'Criar',
          icon: Plus,
          section: 'forms-create'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      section: 'analytics'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      children: [
        {
          id: 'settings-profile',
          label: 'Perfil',
          icon: User,
          section: 'settings-profile'
        },
        {
          id: 'settings-notifications',
          label: 'Notificações',
          icon: Bell,
          section: 'settings-notifications'
        },
        {
          id: 'settings-appearance',
          label: 'Aparência',
          icon: Palette,
          section: 'settings-appearance'
        },
        {
          id: 'settings-security',
          label: 'Segurança',
          icon: Shield,
          section: 'settings-security'
        },
        {
          id: 'settings-integrations',
          label: 'Integrações',
          icon: Globe,
          section: 'settings-integrations'
        },
        {
          id: 'settings-danger',
          label: 'Zona de Perigo',
          icon: AlertTriangle,
          section: 'settings-danger'
        }
      ]
    },
    {
      id: 'admin',
      label: 'Administração',
      icon: Crown,
      children: [
        {
          id: 'admin-dashboard',
          label: 'Dashboard Admin',
          icon: BarChart3,
          section: 'admin-dashboard'
        },
        {
          id: 'admin-financial',
          label: 'Controle Financeiro',
          icon: DollarSign,
          section: 'admin-financial'
        },
        {
          id: 'admin-users',
          label: 'Usuários',
          icon: Users,
          section: 'admin-users'
        },
        {
          id: 'admin-settings',
          label: 'Configurações',
          icon: Cog,
          section: 'admin-settings'
        }
      ]
    }
  ]

  // Filtrar itens do menu baseado nas permissões do usuário
  const filteredMenuItems = menuItems.filter(item => {
    // Se não for o menu de administração, sempre mostrar
    if (item.id !== 'admin') {
      return true
    }
    
    // Menu de administração só é visível para ADMIN e SUPER_ADMIN
    return isAdmin
  })

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleItemClick = (item: MenuItem) => {
    console.log('🔗 Menu item clicado:', item)
    
    if (item.children) {
      console.log('📁 Expandindo submenu:', item.id)
      toggleExpanded(item.id)
    } else if (item.section) {
      console.log('🎯 Mudando para seção:', item.section)
      setCurrentSection(item.section as any)
      onClose?.() // Fechar sidebar no mobile
    } else {
      console.log('❌ Item sem seção ou children:', item)
    }
  }

  const isActive = (section?: string) => {
    return section === currentSection
  }

  const hasActiveChild = (children: MenuItem[]) => {
    return children.some(child => isActive(child.section))
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const isItemActive = isActive(item.section)
    const hasActiveChildItem = hasChildren && hasActiveChild(item.children)

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            level > 0 && "ml-6",
            isItemActive && "bg-primary/10 text-primary",
            hasActiveChildItem && !isItemActive && "bg-gray-50 dark:bg-gray-700"
          )}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={cn(
              "w-5 h-5",
              isItemActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
            )} />
            <span className={cn(
              isItemActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
            )}>
              {item.label}
            </span>
          </div>
          
          {hasChildren && (
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Multi-Link
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sistema de Links
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Multi-Link v1.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
