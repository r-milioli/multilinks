import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function useAuthRedirect(redirectTo: string, requireAuth = true) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasRedirected) {
        console.warn('Redirecionamento de autenticação com timeout')
        router.replace(redirectTo)
        setHasRedirected(true)
      }
    }, 3000) // 3 segundos de timeout

    if (status === 'loading') return

    const shouldRedirect = requireAuth 
      ? !session?.user 
      : !!session?.user

    if (shouldRedirect && !hasRedirected) {
      router.replace(redirectTo)
      setHasRedirected(true)
    }

    return () => clearTimeout(timeout)
  }, [status, session, router, redirectTo, requireAuth, hasRedirected])

  return {
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    hasRedirected
  }
}
