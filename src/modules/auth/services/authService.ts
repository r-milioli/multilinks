import { prisma } from '@/lib/db'
import { RegisterData, LoginCredentials, ResetPasswordData } from '@/types/auth.types'
import { emailSchema, passwordSchema, nameSchema, usernameSchema } from '@/shared/utils/validation'
import { hash } from 'bcryptjs'
import { signIn } from 'next-auth/react'

export class AuthService {
  static async register(data: RegisterData) {
    try {
      // Validar dados
      const emailValidation = emailSchema.safeParse(data.email)
      if (!emailValidation.success) {
        return { success: false, error: 'Email inválido' }
      }

      const passwordValidation = passwordSchema.safeParse(data.password)
      if (!passwordValidation.success) {
        return { success: false, error: 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número' }
      }

      const nameValidation = nameSchema.safeParse(data.name)
      if (!nameValidation.success) {
        return { success: false, error: 'Nome deve ter entre 2 e 50 caracteres' }
      }

      // Verificar se email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        return { success: false, error: 'Email já está em uso' }
      }

      // Verificar username se fornecido
      if (data.username) {
        const usernameValidation = usernameSchema.safeParse(data.username)
        if (!usernameValidation.success) {
          return { success: false, error: 'Username inválido' }
        }

        const existingUsername = await prisma.user.findUnique({
          where: { username: data.username }
        })

        if (existingUsername) {
          return { success: false, error: 'Username já está em uso' }
        }
      }

      // Hash da senha
      const hashedPassword = await hash(data.password, 12)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          username: data.username,
          password: hashedPassword,
        }
      })

      // Criar conta de credenciais para o NextAuth
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: user.email,
          refresh_token: hashedPassword, // Armazenar senha hasheada aqui também
        }
      })

      return { success: true, data: user }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async login(credentials: LoginCredentials) {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        return { success: false, error: 'Credenciais inválidas' }
      }

      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async checkUsernameAvailability(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      })

      return { available: !user }
    } catch (error) {
      console.error('Erro ao verificar username:', error)
      return { available: false }
    }
  }

  static async generateUsernameSuggestion(name: string) {
    const baseUsername = name.toLowerCase().replace(/\s+/g, '')
    let username = baseUsername
    let counter = 1

    while (true) {
      const isAvailable = await this.checkUsernameAvailability(username)
      if (isAvailable.available) {
        return username
      }
      username = `${baseUsername}${counter}`
      counter++
      
      if (counter > 100) {
        return `${baseUsername}${Date.now()}`
      }
    }
  }

  static async resetPassword(data: ResetPasswordData) {
    try {
      // Verificar se email existe
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (!user) {
        return { success: false, error: 'Email não encontrado' }
      }

      // Aqui você implementaria o envio de email
      // Por enquanto, apenas retornamos sucesso
      return { success: true, message: 'Email de recuperação enviado' }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          links: {
            where: { active: true },
            orderBy: { position: 'asc' }
          },
          socialLinks: true
        }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }
  }

  static async getUserByUsername(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          links: {
            where: { active: true },
            orderBy: { position: 'asc' }
          },
          socialLinks: true
        }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário por username:', error)
      return null
    }
  }
}

