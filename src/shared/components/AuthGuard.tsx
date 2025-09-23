'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LoadingPage } from '@/shared/components/ui/Loading'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallbackUrl?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  fallbackUrl = '/login' 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    const isAuthenticated = !!session?.user
    const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated

    if (shouldRedirect) {
      const redirectUrl = requireAuth ? fallbackUrl : '/dashboard'
      router.replace(redirectUrl)
    } else {
      setIsChecking(false)
    }
  }, [status, session, requireAuth, fallbackUrl, router])

  if (status === 'loading' || isChecking) {
    return <LoadingPage />
  }

  return <>{children}</>
}
