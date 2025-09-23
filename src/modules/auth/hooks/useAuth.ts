import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user && !!session?.user?.id
  const user = session?.user

  // Verificar se a sessão é válida
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !session.user.id) {
      console.error('❌ Sessão inválida detectada, fazendo logout')
      signOut({ callbackUrl: '/login' })
    }
  }, [status, session])

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

  const forceLogout = async () => {
    try {
      // Limpar sessão no servidor
      await fetch('/api/auth/clear-session', { method: 'POST' })
      // Fazer logout
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Erro ao fazer logout forçado:', error)
      // Fallback: logout normal
      await signOut({ callbackUrl: '/login' })
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    requireAuth,
    requireGuest,
    forceLogout
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
  const router = useRouter()

  useEffect(() => {
    // Só redirecionar se não estiver carregando e estiver autenticado
    if (!isLoading && isAuthenticated) {
      // Usar replace para evitar histórico de navegação
      router.replace('/dashboard')
    }
  }, [isLoading, isAuthenticated, router])

  return {
    isLoading,
    isAuthenticated
  }
}

