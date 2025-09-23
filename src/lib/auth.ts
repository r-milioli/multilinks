import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from './db'
import { compare } from 'bcryptjs'
import { emailSchema, passwordSchema } from '@/shared/utils/validation'

export const authOptions: NextAuthOptions = {
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
            username: user.username
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
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.avatar = token.avatar as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}
