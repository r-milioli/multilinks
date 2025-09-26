'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/shared/services/apiClient'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'

interface UserStatusData {
  status: UserStatus
  isLoading: boolean
  error: string | null
}

export function useUserStatus(): UserStatusData {
  const { data: session, status } = useSession()
  const [userStatus, setUserStatus] = useState<UserStatus>('ACTIVE')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUserStatus = async () => {
      if (status === 'loading') return
      
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await apiClient.get('/user/status')
        
        if (response.success && response.data) {
          setUserStatus(response.data.status)
        } else {
          setError(response.error || 'Erro ao verificar status do usuário')
        }
      } catch (error) {
        console.error('Erro ao verificar status do usuário:', error)
        setError('Erro interno do servidor')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [session, status])

  return {
    status: userStatus,
    isLoading,
    error
  }
}
