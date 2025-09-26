'use client'

import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useUserStatus } from '@/shared/hooks/useUserStatus'
import { UserStatusMessage } from '@/shared/components/UserStatusMessage'

interface UserStatusGuardProps {
  children: React.ReactNode
}

export function UserStatusGuard({ children }: UserStatusGuardProps) {
  const { data: session, status } = useSession()
  const { status: userStatus, isLoading } = useUserStatus()

  useEffect(() => {
    // Se o usuário não está ativo, fazer logout automático
    if (status === 'authenticated' && session?.user && !isLoading && userStatus !== 'ACTIVE') {
      console.log(`Usuário com status ${userStatus}, fazendo logout automático`)
      signOut({ callbackUrl: '/login' })
    }
  }, [session, status, userStatus, isLoading])

  // Se não está autenticado ou está carregando, mostrar conteúdo normal
  if (status !== 'authenticated' || isLoading) {
    return <>{children}</>
  }

  // Se o usuário não está ativo, mostrar mensagem de status
  if (userStatus !== 'ACTIVE') {
    return <UserStatusMessage status={userStatus as 'INACTIVE' | 'SUSPENDED' | 'PENDING'} />
  }

  // Se está tudo ok, mostrar conteúdo normal
  return <>{children}</>
}
