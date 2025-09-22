'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface MobileMenuProps {
  children: React.ReactNode
  className?: string
}

export function MobileMenu({ children, className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      {/* Botão do menu mobile */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Menu desktop - sempre visível em telas grandes */}
      <div className="hidden md:flex items-center space-x-2">
        {children}
      </div>

      {/* Menu mobile - dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 md:hidden">
          <div className="py-2">
            {children}
          </div>
        </div>
      )}

      {/* Overlay para fechar o menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
