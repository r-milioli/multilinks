'use client'

import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { LayoutWrapper, DynamicContent } from '@/shared/components/layout'
import { LoadingPage } from '@/shared/components/ui/Loading'

export default function AppPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()

  if (authLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null // Redirecionamento será feito pelo hook
  }

  return (
    <LayoutWrapper>
      <DynamicContent />
    </LayoutWrapper>
  )
}
