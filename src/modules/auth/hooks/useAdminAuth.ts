import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user && !!session?.user?.id
  const user = session?.user
  const userRole = (user as any)?.role as UserRole

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
  const isSuperAdmin = userRole === 'SUPER_ADMIN'

  const requireAdmin = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return false
    }
    
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push('/dashboard')
      return false
    }
    
    return true
  }

  const requireSuperAdmin = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return false
    }
    
    if (!isLoading && isAuthenticated && !isSuperAdmin) {
      router.push('/dashboard')
      return false
    }
    
    return true
  }

  const hasPermission = (requiredRole: UserRole) => {
    if (!isAuthenticated) return false
    
    switch (requiredRole) {
      case 'SUPER_ADMIN':
        return isSuperAdmin
      case 'ADMIN':
        return isAdmin
      case 'USER':
        return isAuthenticated
      default:
        return false
    }
  }

  return {
    user,
    userRole,
    isLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    requireAdmin,
    requireSuperAdmin,
    hasPermission
  }
}

export function useRequireAdmin() {
  const { requireAdmin, isLoading, isAuthenticated, isAdmin } = useAdminAuth()

  useEffect(() => {
    requireAdmin()
  }, [requireAdmin])

  return {
    isLoading,
    isAuthenticated,
    isAdmin
  }
}

export function useRequireSuperAdmin() {
  const { requireSuperAdmin, isLoading, isAuthenticated, isSuperAdmin } = useAdminAuth()

  useEffect(() => {
    requireSuperAdmin()
  }, [requireSuperAdmin])

  return {
    isLoading,
    isAuthenticated,
    isSuperAdmin
  }
}
