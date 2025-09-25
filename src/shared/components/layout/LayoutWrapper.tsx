'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { cn } from '@/shared/utils/cn'
import { NavigationProvider } from '@/shared/contexts/NavigationContext'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
        />

        {/* Main Content */}
        <main className={cn(
          "transition-all duration-300 ease-in-out",
          "md:ml-64", // Margem para a sidebar fixa no desktop
          sidebarOpen && "ml-64" // Margem quando sidebar está aberta no mobile
        )}>
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </NavigationProvider>
  )
}

