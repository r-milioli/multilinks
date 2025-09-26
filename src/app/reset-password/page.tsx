'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowLeft, LinkIcon, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Footer } from '@/shared/components/layout/Footer'
import { passwordSchema } from '@/shared/utils/validation'

const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  // Verificar token na URL quando componente carrega
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = urlParams.get('token')
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      validateToken(tokenFromUrl)
    } else {
      setTokenValid(false)
    }
  }, [])

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch(`/api/auth/reset-password?token=${tokenToValidate}`)
      const result = await response.json()
      
      setTokenValid(result.success)
    } catch (error) {
      console.error('Erro ao validar token:', error)
      setTokenValid(false)
    }
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      alert('Token não encontrado')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          password: data.password 
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
      } else {
        alert(result.error || 'Erro ao redefinir senha')
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent truncate block">
                MultiLink
              </span>
              <p className="text-xs text-gray-400 hidden sm:block">Link in Bio</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 sm:px-4">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar ao login</span>
                <span className="sm:hidden">Voltar</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Redefinir Senha</h1>
            <p className="mt-2 text-sm text-gray-300">
              Digite sua nova senha
            </p>
          </div>

          <Card className="w-full max-w-md mx-auto border-orange-400" style={{ backgroundColor: '#10151C' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Nova Senha</CardTitle>
              <CardDescription className="text-gray-300">
                {isSuccess 
                  ? 'Senha redefinida com sucesso!'
                  : 'Crie uma nova senha segura'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokenValid === null ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-500 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                  <p className="text-gray-300">Validando token...</p>
                </div>
              ) : !tokenValid ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Token Inválido</h3>
                    <p className="text-gray-300 text-sm">
                      Este link de recuperação é inválido ou expirou. Solicite um novo link.
                    </p>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                    <Link href="/forgot-password">
                      Solicitar Novo Link
                    </Link>
                  </Button>
                </div>
              ) : !isSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua nova senha"
                        className="border-gray-600 focus:border-orange-400 focus:ring-orange-400"
                        {...register('password')}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua nova senha"
                        className="border-gray-600 focus:border-orange-400 focus:ring-orange-400"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Senha Redefinida!</h3>
                    <p className="text-gray-300 text-sm">
                      Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                    </p>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600">
                    <Link href="/login">
                      Fazer Login
                    </Link>
                  </Button>
                </div>
              )}

              <div className="text-center text-sm">
                <span className="text-gray-400">Lembrou da senha? </span>
                <Button variant="link" className="p-0 h-auto text-orange-400 hover:text-orange-300" asChild>
                  <Link href="/login">Fazer login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
