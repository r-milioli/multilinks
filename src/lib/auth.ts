import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import { compare } from 'bcryptjs'
import { emailSchema, passwordSchema } from '@/shared/utils/validation'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Habilitado para melhor sincronização
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Validar formato do email (validação simples)
          if (!credentials.email || !credentials.email.includes('@')) {
            return null
          }

          // Buscar usuário no banco
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            return null
          }

          // Verificar senha diretamente do campo password do usuário
          if (!user.password) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            avatar: user.avatar,
            username: user.username,
            role: user.role
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.avatar = (user as any).avatar || (user as any).image
        token.name = (user as any).name
        token.email = (user as any).email
        token.role = (user as any).role
      }
      
      // Buscar avatar atualizado do banco se necessário
      if (token.id && !token.avatar) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { avatar: true }
          })
          if (user?.avatar) {
            token.avatar = user.avatar
          }
        } catch (error) {
          console.error('Erro ao buscar avatar:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        // Verificar se o usuário ainda existe no banco
        try {
          const userExists = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, email: true }
          })
          
          if (!userExists) {
            console.error('Usuário não encontrado no banco, limpando sessão:', token.id)
            // Retornar sessão vazia para forçar logout
            return {
              user: { id: '', email: '', name: '', image: '' },
              expires: new Date().toISOString()
            }
          }
          
          session.user.id = token.id as string
          session.user.username = token.username as string
          session.user.avatar = token.avatar as string
          session.user.name = token.name as string
          session.user.email = token.email as string
          session.user.role = token.role as string
        } catch (error) {
          console.error('Erro ao verificar usuário na sessão:', error)
          // Em caso de erro, retornar sessão vazia
          return {
            user: { id: '', email: '', name: '', image: '' },
            expires: new Date().toISOString()
          }
        }
      }
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      // Se a URL é relativa, usar baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Se a URL é do mesmo domínio, permitir
      else if (new URL(url).origin === baseUrl) return url
      // Caso contrário, redirecionar para dashboard
      return `${baseUrl}/dashboard`
    }
  },
  events: {
    async createSession({ session, user }) {
      console.log('🔍 Nova sessão criada:', { sessionId: session.id, userId: user.id })
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log('🔍 Usuário fez login:', { userId: user.id, email: user.email, isNewUser })
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}
