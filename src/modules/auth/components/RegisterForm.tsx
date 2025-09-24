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
import { useRegister } from '../hooks/useLogin'
import { emailSchema, passwordSchema, nameSchema, usernameSchema } from '@/shared/utils/validation'

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  username: usernameSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const watchedUsername = watch('username')

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data
    const result = await registerUser(registerData)
    if (result.success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-orange-400" style={{ backgroundColor: '#10151C' }}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
        <CardDescription className="text-gray-300">
          Crie sua conta para começar a usar o MultiLink
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className="border-gray-600 focus:border-orange-400 focus:ring-orange-400"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
            <Label htmlFor="username" className="text-white">Username (opcional)</Label>
            <Input
              id="username"
              type="text"
              placeholder="seuusuario"
              className="border-gray-600 focus:border-orange-400 focus:ring-orange-400"
              {...register('username')}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
            {watchedUsername && (
              <p className="text-xs text-muted-foreground">
                Seu link será: /{watchedUsername}
              </p>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
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
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
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
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>


        <div className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Button variant="link" className="p-0 h-auto" asChild>
            <a href="/login">Entrar</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
