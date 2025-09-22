import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WebhookService } from '@/lib/webhooks'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { date } = await request.json()
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    // Buscar configurações de integração
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        integrationSettings: true,
        email: true
      }
    })

    if (!user || !user.integrationSettings) {
      return NextResponse.json(
        { success: false, error: 'Configurações de integração não encontradas' },
        { status: 404 }
      )
    }

    const integrationSettings = user.integrationSettings as any
    if (!integrationSettings.webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Webhook não configurado' },
        { status: 400 }
      )
    }

    // Buscar estatísticas do dia
    const [
      totalClicks,
      totalLeads,
      totalVisits,
      topLinks,
      topCountries,
      deviceBreakdown
    ] = await Promise.all([
      // Total de cliques
      prisma.analytics.count({
        where: {
          userId: session.user.id,
          linkId: { not: null },
          clickedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      
      // Total de leads
      prisma.lead.count({
        where: {
          form: { userId: session.user.id },
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      
      // Total de visitas
      prisma.analytics.count({
        where: {
          userId: session.user.id,
          clickedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      
      // Top links
      prisma.analytics.groupBy({
        by: ['linkId'],
        where: {
          userId: session.user.id,
          linkId: { not: null },
          clickedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _count: { linkId: true },
        orderBy: { _count: { linkId: 'desc' } },
        take: 5
      }),
      
      // Top países
      prisma.analytics.groupBy({
        by: ['country'],
        where: {
          userId: session.user.id,
          country: { not: null },
          clickedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _count: { country: true },
        orderBy: { _count: { country: 'desc' } },
        take: 5
      }),
      
      // Breakdown por dispositivo
      prisma.analytics.groupBy({
        by: ['device'],
        where: {
          userId: session.user.id,
          device: { not: null },
          clickedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _count: { device: true }
      })
    ])

    // Buscar títulos dos links
    const linkIds = topLinks.map(item => item.linkId).filter(Boolean) as string[]
    const links = await prisma.link.findMany({
      where: { id: { in: linkIds } },
      select: { id: true, title: true }
    })

    // Processar dados
    const topLinksData = topLinks.map(item => {
      const link = links.find(l => l.id === item.linkId)
      return {
        id: item.linkId,
        title: link?.title || 'Link desconhecido',
        clicks: item._count.linkId
      }
    })

    const topCountriesData = topCountries.map(item => ({
      country: item.country || 'Desconhecido',
      clicks: item._count.country
    }))

    const totalDeviceClicks = deviceBreakdown.reduce((sum, item) => sum + item._count.device, 0)
    const deviceBreakdownData = deviceBreakdown.map(item => ({
      device: item.device || 'Desconhecido',
      clicks: item._count.device,
      percentage: totalDeviceClicks > 0 ? Math.round((item._count.device / totalDeviceClicks) * 100) : 0
    }))

    const statsData = {
      date: startOfDay.toISOString().split('T')[0],
      totalClicks,
      totalLeads,
      totalVisits,
      topLinks: topLinksData,
      topCountries: topCountriesData,
      deviceBreakdown: deviceBreakdownData
    }

    // Enviar webhook
    const result = await WebhookService.sendDailyStats(
      integrationSettings,
      statsData,
      session.user.id,
      user.email || undefined
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Relatório diário enviado via webhook',
        data: statsData
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Erro ao enviar relatório diário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
