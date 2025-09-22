import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar todos os dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        links: {
          orderBy: { position: 'asc' }
        },
        socialLinks: true,
        analytics: {
          orderBy: { clickedAt: 'desc' },
          take: 1000 // Limitar para não sobrecarregar
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para exportação
    const exportData = {
      usuario: {
        id: user.id,
        nome: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        titulo: user.title,
        avatar: user.avatar,
        dataCriacao: user.createdAt,
        ultimaAtualizacao: user.updatedAt
      },
      configuracoes: {
        tema: user.themeSettings,
        privacidade: user.privacySettings,
        notificacoes: user.notificationSettings
      },
      links: user.links.map(link => ({
        id: link.id,
        titulo: link.title,
        url: link.url,
        ativo: link.active,
        posicao: link.position,
        cliques: link.clickCount,
        dataCriacao: link.createdAt,
        ultimaAtualizacao: link.updatedAt
      })),
      linksSociais: user.socialLinks.map(social => ({
        id: social.id,
        plataforma: social.platform,
        url: social.url
      })),
      analytics: user.analytics.map(analytics => ({
        id: analytics.id,
        tipo: analytics.linkId ? 'clique' : 'visita',
        linkId: analytics.linkId,
        ip: analytics.ipAddress,
        userAgent: analytics.userAgent,
        pais: analytics.country,
        dispositivo: analytics.device,
        data: analytics.clickedAt
      })),
      estatisticas: {
        totalLinks: user.links.length,
        linksAtivos: user.links.filter(l => l.active).length,
        totalCliques: user.links.reduce((sum, link) => sum + link.clickCount, 0),
        totalAnalytics: user.analytics.length,
        dataExportacao: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: exportData
    })
  } catch (error) {
    console.error('Erro ao exportar dados:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
