'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'

export function useAccount() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/user/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (!result.success) {
        setError(result.error || 'Erro ao exportar dados')
        toast.error(result.error || 'Erro ao exportar dados')
        return { success: false, error: result.error }
      }

      // Criar e baixar arquivo
      const jsonData = JSON.stringify(result.data, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `multilink-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Dados exportados com sucesso!')
      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erro interno do servidor')
      toast.error('Erro ao exportar dados')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async (confirmPassword: string, confirmText: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🗑️ Iniciando processo de exclusão da conta...')
      
      // Primeiro, deletar a conta (com sessão ativa)
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmPassword,
          confirmText
        }),
      })
      
      console.log('📡 Resposta da API:', response.status, response.statusText)
      
      const result = await response.json()
      console.log('📋 Resultado da API:', result)
      
      if (!result.success) {
        console.error('❌ Erro na API:', result.error)
        setError(result.error || 'Erro ao deletar conta')
        toast.error(result.error || 'Erro ao deletar conta')
        return { success: false, error: result.error }
      }

      console.log('✅ Conta deletada com sucesso, fazendo logout...')
      
      // Após deletar com sucesso, fazer logout
      await signOut({ redirect: false })
      
      toast.success('Conta deletada com sucesso!')
      
      // Redirecionar para página inicial após deletar conta
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)

      return { success: true }
    } catch (err: any) {
      setError(err.message || 'Erro interno do servidor')
      toast.error('Erro ao deletar conta')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    exportData,
    deleteAccount,
    isLoading,
    error
  }
}
