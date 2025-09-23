import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { LoginCredentials, RegisterData } from '@/types/auth.types'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Credenciais inválidas')
        return { success: false, error: result.error }
      }

      if (result?.ok) {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
        return { success: true }
      } else {
        toast.error('Erro ao fazer login')
        return { success: false, error: 'Erro desconhecido' }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao fazer login')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithProvider = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Erro no login social:', error)
      toast.error('Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  return {
    login,
    loginWithProvider,
    logout,
    isLoading
  }
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (!result.success) {
        toast.error(result.error || 'Erro ao criar conta')
        return { success: false, error: result.error }
      }

      toast.success('Conta criada com sucesso!')
      
      // Fazer login automático após registro
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      console.error('Erro no registro:', error)
      toast.error('Erro ao criar conta')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    isLoading
  }
}

