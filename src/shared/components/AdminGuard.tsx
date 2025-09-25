'use client'

import { useRequireAdmin } from '@/modules/auth/hooks/useAdminAuth'
import { useEffect } from 'react'
import { Loader2, ShieldX } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireSuperAdmin?: boolean
}

export function AdminGuard({ children, fallback, requireSuperAdmin = false }: AdminGuardProps) {
  const { isLoading, isAuthenticated, isAdmin } = useRequireAdmin()

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Usuário não autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <ShieldX className="h-16 w-16 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Negado</h3>
            <p className="text-sm text-gray-600 mt-2">
              Você precisa fazer login para acessar esta área.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  // Usuário não tem permissões de admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <ShieldX className="h-16 w-16 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Permissões Insuficientes</h3>
            <p className="text-sm text-gray-600 mt-2">
              Você não tem permissões de administrador para acessar esta área.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Renderizar children ou fallback personalizado
  return <>{fallback || children}</>
}

interface SuperAdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SuperAdminGuard({ children, fallback }: SuperAdminGuardProps) {
  const { isLoading, isAuthenticated, isSuperAdmin } = useRequireAdmin()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <ShieldX className="h-16 w-16 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Restrito</h3>
            <p className="text-sm text-gray-600 mt-2">
              Apenas Super Administradores podem acessar esta área.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{fallback || children}</>
}
