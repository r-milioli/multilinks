import { prisma } from '@/lib/db'
import { UpdateProfileData, CreateSocialLinkData, UpdateSocialLinkData } from '@/types/profile.types'
import { nameSchema, usernameSchema, bioSchema, titleSchema } from '@/shared/utils/validation'
import { SOCIAL_PLATFORMS } from '@/shared/utils/constants'

export class ProfileService {
  static async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true }
      })
      
      if (!existingUser) {
        return { success: false, error: 'Usuário não encontrado' }
      }
      
      // Validar dados se fornecidos
      if (data.name) {
        const nameValidation = nameSchema.safeParse(data.name)
        if (!nameValidation.success) {
          return { success: false, error: 'Nome inválido' }
        }
      }

      if (data.username) {
        const usernameValidation = usernameSchema.safeParse(data.username)
        if (!usernameValidation.success) {
          return { success: false, error: 'Username inválido' }
        }

        // Verificar se username já existe
        const existingUser = await prisma.user.findFirst({
          where: {
            username: data.username,
            id: { not: userId }
          }
        })

        if (existingUser) {
          return { success: false, error: 'Username já está em uso' }
        }
      }

      if (data.bio) {
        const bioValidation = bioSchema.safeParse(data.bio)
        if (!bioValidation.success) {
          return { success: false, error: 'Biografia muito longa' }
        }
      }

      if (data.title) {
        const titleValidation = titleSchema.safeParse(data.title)
        if (!titleValidation.success) {
          return { success: false, error: 'Título muito longo' }
        }
      }

      // Atualizar perfil
      console.log('💾 ProfileService: Atualizando perfil do usuário:', userId)
      console.log('💾 ProfileService: Dados recebidos:', data)
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.username && { username: data.username }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.title && { title: data.title }),
          ...(data.avatar && { avatar: data.avatar }),
          ...(data.themeSettings && { themeSettings: data.themeSettings }),
          ...(data.privacySettings && { privacySettings: data.privacySettings }),
          ...(data.legalLinksSettings && { legalLinksSettings: data.legalLinksSettings })
        }
      })

      console.log('✅ ProfileService: Perfil atualizado com sucesso:', user.avatar)
      return { success: true, data: user }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      
      // Tratar erros específicos do Prisma
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'P2025') {
          return { success: false, error: 'Usuário não encontrado no banco de dados' }
        }
        if (error.code === 'P2002') {
          return { success: false, error: 'Username já está em uso' }
        }
      }
      
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          socialLinks: true
        }
      })

      if (!user) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      return { success: true, data: user }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getPublicProfile(username: string) {
    try {
      // Verificar se o username não é um arquivo estático
      if (username.includes('.') || username.includes('favicon') || username.includes('icon')) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          title: true,
          avatar: true,
          themeSettings: true,
          privacySettings: true,
          integrationSettings: true,
          legalLinksSettings: true,
          createdAt: true,
          updatedAt: true,
          links: {
            where: { active: true },
            orderBy: { position: 'asc' }
          },
          socialLinks: true
        }
      })

      if (!user) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      return { success: true, data: user }
    } catch (error) {
      console.error('Erro ao buscar perfil público:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async createSocialLink(userId: string, data: CreateSocialLinkData) {
    try {
      // Verificar se a plataforma é válida
      const validPlatform = SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === data.platform.toLowerCase())
      if (!validPlatform) {
        return { success: false, error: 'Plataforma não suportada' }
      }

      // Verificar se já existe um link para esta plataforma
      const existingLink = await prisma.socialLink.findFirst({
        where: {
          userId,
          platform: data.platform
        }
      })

      if (existingLink) {
        return { success: false, error: 'Já existe um link para esta plataforma' }
      }

      // Criar social link
      const socialLink = await prisma.socialLink.create({
        data: {
          userId,
          platform: data.platform,
          url: data.url
        }
      })

      return { success: true, data: socialLink }
    } catch (error) {
      console.error('Erro ao criar social link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async updateSocialLink(socialLinkId: string, userId: string, data: UpdateSocialLinkData) {
    try {
      // Verificar se o social link pertence ao usuário
      const existingLink = await prisma.socialLink.findFirst({
        where: {
          id: socialLinkId,
          userId
        }
      })

      if (!existingLink) {
        return { success: false, error: 'Social link não encontrado' }
      }

      // Atualizar social link
      const socialLink = await prisma.socialLink.update({
        where: { id: socialLinkId },
        data: {
          url: data.url
        }
      })

      return { success: true, data: socialLink }
    } catch (error) {
      console.error('Erro ao atualizar social link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async deleteSocialLink(socialLinkId: string, userId: string) {
    try {
      // Verificar se o social link pertence ao usuário
      const existingLink = await prisma.socialLink.findFirst({
        where: {
          id: socialLinkId,
          userId
        }
      })

      if (!existingLink) {
        return { success: false, error: 'Social link não encontrado' }
      }

      // Deletar social link
      await prisma.socialLink.delete({
        where: { id: socialLinkId }
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar social link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getUserSocialLinks(userId: string) {
    try {
      const socialLinks = await prisma.socialLink.findMany({
        where: { userId },
        orderBy: { platform: 'asc' }
      })

      return { success: true, data: socialLinks }
    } catch (error) {
      console.error('Erro ao buscar social links:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async checkUsernameAvailability(username: string, excludeUserId?: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
          ...(excludeUserId && { id: { not: excludeUserId } })
        }
      })

      return { available: !user }
    } catch (error) {
      console.error('Erro ao verificar username:', error)
      return { available: false }
    }
  }
}

