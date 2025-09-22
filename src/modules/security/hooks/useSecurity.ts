'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ActiveSession {
  id: string
  device: string
  browser: string
  location: string
  lastActivity: string
  isCurrent: boolean
}

export function useSecurity() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changePassword = async (data: ChangePasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validar senhas
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      if (data.newPassword.length < 8) {
        throw new Error('A nova senha deve ter pelo menos 8 caracteres')
      }

      // Chamar API para alterar senha
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao alterar senha')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const getActiveSessions = async (): Promise<ActiveSession[]> => {
    try {
      const response = await fetch('/api/user/sessions')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar sessões')
      }

      return result.data || []
    } catch (err) {
      console.error('Erro ao buscar sessões:', err)
      return []
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/user/terminate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao encerrar sessão')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao encerrar sessão'
      return { success: false, error: errorMessage }
    }
  }

  return {
    changePassword,
    getActiveSessions,
    terminateSession,
    isLoading,
    error,
  }
}

