'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { LoadingPage } from '@/shared/components/ui/Loading'

export default function AnalyticsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Redirecionar para o SPA na seção de analytics
      router.replace('/app')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null // Redirecionamento será feito pelo hook
  }

  // Mostrar loading enquanto redireciona
  return <LoadingPage />
}