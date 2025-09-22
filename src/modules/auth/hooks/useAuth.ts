import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user
  const user = session?.user

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }

  const requireGuest = () => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    requireAuth,
    requireGuest
  }
}

export function useRequireAuth() {
  const { requireAuth, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  return {
    isLoading,
    isAuthenticated
  }
}

export function useRequireGuest() {
  const { isLoading, isAuthenticated } = useAuth()

  // Removido o redirecionamento automático para evitar conflito
  // com o redirecionamento manual do hook useLogin

  return {
    isLoading,
    isAuthenticated
  }
}

