'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowLeft, LinkIcon, Mail, ArrowRight } from 'lucide-react'
import { Footer } from '@/shared/components/layout/Footer'
import { emailSchema } from '@/shared/utils/validation'

const forgotPasswordSchema = z.object({
  email: emailSchema
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
      } else {
        // Mostrar erro ao usuário
        alert(result.error || 'Erro ao enviar email de recuperação')
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
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
            <h1 className="text-3xl font-bold text-white">Recuperar Senha</h1>
            <p className="mt-2 text-sm text-gray-300">
              Digite seu email para receber as instruções
            </p>
          </div>

          <Card className="w-full max-w-md mx-auto border-orange-400" style={{ backgroundColor: '#10151C' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Recuperar Senha</CardTitle>
              <CardDescription className="text-gray-300">
                {isSubmitted 
                  ? 'Verifique seu email para as instruções'
                  : 'Enviaremos um link para redefinir sua senha'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="border-gray-600 focus:border-orange-400 focus:ring-orange-400"
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email Enviado!</h3>
                    <p className="text-gray-300 text-sm">
                      Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                    <Link href="/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Login
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
