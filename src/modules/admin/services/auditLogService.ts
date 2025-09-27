import { prisma } from '@/lib/db'

interface AuditLogData {
  userId: string
  action: string
  resource: string
  resourceId: string
  description: string
  newData?: any
  oldData?: any
  ipAddress?: string
  userAgent?: string
}

export class AuditLogService {
  /**
   * Cria um novo registro de auditoria
   */
  static async createLog(data: AuditLogData) {
    try {
      // Converter dados para JSON se necessário
      const newData = data.newData ? JSON.parse(JSON.stringify(data.newData)) : undefined
      const oldData = data.oldData ? JSON.parse(JSON.stringify(data.oldData)) : undefined

      const log = await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          description: data.description,
          newData,
          oldData,
          ipAddress: data.ipAddress || 'unknown',
          userAgent: data.userAgent || 'system'
        }
      })

      return { success: true, data: log }
    } catch (error) {
      console.error('Erro ao criar log de auditoria:', error)
      return { success: false, error: 'Erro ao registrar auditoria' }
    }
  }

  /**
   * Busca logs de auditoria com paginação
   */
  static async getLogs(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit
      const [total, logs] = await Promise.all([
        prisma.auditLog.count(),
        prisma.auditLog.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
      ])

      return {
        success: true,
        data: {
          logs,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            perPage: limit
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error)
      return { success: false, error: 'Erro ao buscar logs' }
    }
  }

  /**
   * Busca logs de auditoria por recurso
   */
  static async getLogsByResource(resource: string, resourceId: string) {
    try {
      const logs = await prisma.auditLog.findMany({
        where: {
          resource,
          resourceId
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return { success: true, data: logs }
    } catch (error) {
      console.error('Erro ao buscar logs do recurso:', error)
      return { success: false, error: 'Erro ao buscar logs' }
    }
  }

  /**
   * Busca logs de auditoria por usuário
   */
  static async getLogsByUser(userId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit
      const [total, logs] = await Promise.all([
        prisma.auditLog.count({
          where: { userId }
        }),
        prisma.auditLog.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        })
      ])

      return {
        success: true,
        data: {
          logs,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            perPage: limit
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar logs do usuário:', error)
      return { success: false, error: 'Erro ao buscar logs' }
    }
  }
}