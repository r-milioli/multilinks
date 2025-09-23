import { prisma } from '@/lib/db'
import { CreateLinkData, UpdateLinkData, ReorderLinkData } from '@/types/link.types'
import { linkSchema } from '@/shared/utils/validation'
import { LIMITS } from '@/shared/utils/constants'

export class LinkService {
  static async createLink(userId: string, data: CreateLinkData) {
    try {
      console.log('🔗 LinkService.createLink - Dados recebidos:', data)
      
      // Validar dados
      const validation = linkSchema.safeParse(data)
      if (!validation.success) {
        console.error('❌ Validação falhou:', validation.error.issues)
        return { 
          success: false, 
          error: `Dados inválidos: ${validation.error.issues.map(i => i.message).join(', ')}` 
        }
      }
      
      console.log('✅ Validação passou')

      // Verificar limite de links
      const linkCount = await prisma.link.count({
        where: { userId }
      })

      if (linkCount >= LIMITS.MAX_LINKS_PER_USER) {
        return { 
          success: false, 
          error: `Limite máximo de ${LIMITS.MAX_LINKS_PER_USER} links atingido` 
        }
      }

      // Determinar posição se não fornecida
      let position = data.position
      if (position === undefined) {
        const lastLink = await prisma.link.findFirst({
          where: { userId },
          orderBy: { position: 'desc' }
        })
        position = lastLink ? lastLink.position + 1 : 0
      }

      // Criar link
      const link = await prisma.link.create({
        data: {
          title: data.title,
          url: data.url,
          description: data.description && data.description.trim() !== '' ? data.description : null,
          image: data.image && data.image.trim() !== '' ? data.image : null,
          type: data.type || 'NORMAL',
          position,
          userId,
          active: data.active ?? true,
          useForm: data.useForm ?? false,
          formId: data.formId && data.formId.trim() !== '' ? data.formId : null
        }
      })

      return { success: true, data: link }
    } catch (error) {
      console.error('Erro ao criar link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async updateLink(linkId: string, userId: string, data: UpdateLinkData) {
    try {
      // Verificar se o link pertence ao usuário
      const existingLink = await prisma.link.findFirst({
        where: { id: linkId, userId }
      })

      if (!existingLink) {
        return { success: false, error: 'Link não encontrado' }
      }

      // Validar dados se fornecidos
      if (data.title || data.url) {
        const validation = linkSchema.safeParse({
          title: data.title || existingLink.title,
          url: data.url || existingLink.url
        })
        if (!validation.success) {
          return { success: false, error: 'Dados inválidos' }
        }
      }

      // Atualizar link
      const link = await prisma.link.update({
        where: { id: linkId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.url && { url: data.url }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.type && { type: data.type }),
          ...(data.position !== undefined && { position: data.position }),
          ...(data.active !== undefined && { active: data.active }),
          ...(data.useForm !== undefined && { useForm: data.useForm }),
          ...(data.formId !== undefined && { formId: data.formId })
        }
      })

      return { success: true, data: link }
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async deleteLink(linkId: string, userId: string) {
    try {
      // Verificar se o link pertence ao usuário
      const existingLink = await prisma.link.findFirst({
        where: { id: linkId, userId }
      })

      if (!existingLink) {
        return { success: false, error: 'Link não encontrado' }
      }

      // Deletar link
      await prisma.link.delete({
        where: { id: linkId }
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async reorderLinks(userId: string, links: ReorderLinkData[]) {
    try {
      // Verificar se todos os links pertencem ao usuário
      const linkIds = links.map(link => link.id)
      const userLinks = await prisma.link.findMany({
        where: { 
          id: { in: linkIds },
          userId 
        }
      })

      if (userLinks.length !== linkIds.length) {
        return { success: false, error: 'Alguns links não foram encontrados' }
      }

      // Atualizar posições em transação
      await prisma.$transaction(
        links.map(link => 
          prisma.link.update({
            where: { id: link.id },
            data: { position: link.position }
          })
        )
      )

      return { success: true }
    } catch (error) {
      console.error('Erro ao reordenar links:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getUserLinks(userId: string) {
    try {
      const links = await prisma.link.findMany({
        where: { userId },
        orderBy: { position: 'asc' }
      })

      return { success: true, data: links }
    } catch (error) {
      console.error('Erro ao buscar links:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getPublicUserLinks(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      })

      if (!user) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      const links = await prisma.link.findMany({
        where: { 
          userId: user.id,
          active: true 
        },
        orderBy: { position: 'asc' }
      })

      // Agrupar links por tipo
      const normalLinks = links.filter(link => link.type === 'NORMAL')
      const productLinks = links.filter(link => link.type === 'PRODUCT')

      return { 
        success: true, 
        data: {
          normalLinks,
          productLinks,
          hasProducts: productLinks.length > 0
        }
      }
    } catch (error) {
      console.error('Erro ao buscar links públicos:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async incrementClickCount(linkId: string) {
    try {
      await prisma.link.update({
        where: { id: linkId },
        data: {
          clickCount: {
            increment: 1
          }
        }
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao incrementar cliques:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async toggleLinkStatus(linkId: string, userId: string) {
    try {
      const link = await prisma.link.findFirst({
        where: { id: linkId, userId }
      })

      if (!link) {
        return { success: false, error: 'Link não encontrado' }
      }

      const updatedLink = await prisma.link.update({
        where: { id: linkId },
        data: { active: !link.active }
      })

      return { success: true, data: updatedLink }
    } catch (error) {
      console.error('Erro ao alternar status do link:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }
}

