'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { useLogin } from '../hooks/useLogin'
import { emailSchema } from '@/shared/utils/validation'

// Schema de senha mais simples para login (não exige maiúscula/minúscula/número)
const loginPasswordSchema = z.string().min(1, 'Senha é obrigatória')

const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginWithProvider, isLoading } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data)
    if (result.success && onSuccess) {
      onSuccess()
    }
  }


  return (
    <Card className="w-full max-w-md mx-auto border-orange-400" style={{ backgroundColor: '#10151C' }}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Entrar</CardTitle>
        <CardDescription className="text-gray-300">
          Entre na sua conta para acessar o dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
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
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>


        <div className="text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta? </span>
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="/register">Criar conta</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

