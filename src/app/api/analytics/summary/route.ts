import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Analytics Summary chamada')
    const session = await getServerSession(authOptions)
    console.log('👤 Sessão:', session ? 'Autenticado' : 'Não autenticado')
    
    if (!session?.user?.id) {
      console.log('❌ Usuário não autenticado')
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    console.log('✅ Usuário autenticado:', session.user.email)

    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange')
    const linkId = searchParams.get('linkId')

    // Construir filtros
    const whereClause: any = {
      userId: session.user.id
    }

    const now = new Date()
    let periodStartDate = new Date()

    if (dateRange === '7') {
      periodStartDate.setDate(now.getDate() - 7)
    } else if (dateRange === '30') {
      periodStartDate.setDate(now.getDate() - 30)
    } else if (dateRange === '90') {
      periodStartDate.setDate(now.getDate() - 90)
    } // 'all' means no date filter

    if (dateRange !== 'all') {
      whereClause.clickedAt = {
        gte: periodStartDate
      }
    }

    if (linkId) {
      whereClause.linkId = linkId
    }

    // Buscar dados de analytics
    const analytics = await prisma.analytics.findMany({
      where: whereClause,
      include: {
        link: {
          select: {
            id: true,
            title: true,
            url: true
          }
        }
      },
      orderBy: {
        clickedAt: 'desc'
      }
    })

    // Calcular métricas gerais
    const totalClicks = analytics.filter(a => a.linkId !== null).length // Apenas cliques em links
    const totalViews = analytics.length // Todas as interações (visitas + cliques)
    const uniqueVisitors = new Set(analytics.map(a => a.ipAddress)).size

    // Calcular crescimento comparando com período anterior
    const periodDays = parseInt(dateRange || '30')
    const currentPeriodStart = periodStartDate
    const previousPeriodStart = new Date(currentPeriodStart.getTime() - (periodDays * 24 * 60 * 60 * 1000))
    
    // Cliques no período atual
    const currentClicks = analytics.filter(a => 
      a.linkId !== null && 
      new Date(a.clickedAt) >= currentPeriodStart
    ).length
    
    // Cliques no período anterior
    const previousClicks = analytics.filter(a => 
      a.linkId !== null && 
      new Date(a.clickedAt) >= previousPeriodStart && 
      new Date(a.clickedAt) < currentPeriodStart
    ).length
    
    // Visitantes únicos no período atual
    const currentVisitors = new Set(analytics.filter(a => 
      new Date(a.clickedAt) >= currentPeriodStart
    ).map(a => a.ipAddress)).size
    
    // Visitantes únicos no período anterior
    const previousVisitors = new Set(analytics.filter(a => 
      new Date(a.clickedAt) >= previousPeriodStart && 
      new Date(a.clickedAt) < currentPeriodStart
    ).map(a => a.ipAddress)).size
    
    // Calcular percentual de crescimento
    const clickGrowth = previousClicks > 0 ? Math.round(((currentClicks - previousClicks) / previousClicks) * 100) : 0
    const visitorGrowth = previousVisitors > 0 ? Math.round(((currentVisitors - previousVisitors) / previousVisitors) * 100) : 0

    // Top links
    const linkStats = analytics.reduce((acc, item) => {
      if (item.link) {
        const linkId = item.link.id
        if (!acc[linkId]) {
          acc[linkId] = {
            linkId,
            title: item.link.title,
            url: item.link.url,
            clicks: 0
          }
        }
        acc[linkId].clicks++
      }
      return acc
    }, {} as Record<string, any>)

    const topLinks = Object.values(linkStats)
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 10)

    // Top países
    const countryStats = analytics.reduce((acc, item) => {
      const country = item.country || 'Unknown'
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCountries = Object.entries(countryStats)
      .map(([country, clicks]) => ({ country, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    // Breakdown por dispositivo
    const deviceStats = analytics.reduce((acc, item) => {
      const device = item.device || 'Unknown'
      acc[device] = (acc[device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const deviceBreakdown = Object.entries(deviceStats)
      .map(([device, clicks]) => ({
        device,
        clicks,
        percentage: Math.round((clicks / totalClicks) * 100)
      }))
      .sort((a, b) => b.clicks - a.clicks)

    // Estatísticas diárias (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Buscar todos os analytics dos últimos 30 dias
    const recentAnalytics = await prisma.analytics.findMany({
      where: {
        userId: session.user.id,
        clickedAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        clickedAt: true,
        linkId: true
      }
    })

    // Agrupar por data (sem hora)
    const dailyStatsMap = new Map<string, { clicks: number, views: number }>()
    
    recentAnalytics.forEach(stat => {
      const date = stat.clickedAt.toISOString().split('T')[0]
      
      if (!dailyStatsMap.has(date)) {
        dailyStatsMap.set(date, { clicks: 0, views: 0 })
      }
      
      const dayStats = dailyStatsMap.get(date)!
      dayStats.views++ // Todas as interações são visualizações
      
      if (stat.linkId) {
        dayStats.clicks++ // Apenas cliques em links
      }
    })

    // Converter para array e ordenar por data
    const dailyStatsFormatted = Array.from(dailyStatsMap.entries())
      .map(([date, stats]) => ({
        date,
        clicks: stats.clicks,
        views: stats.views
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Buscar links do usuário para estatísticas
    const userLinks = await prisma.link.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        clickCount: true,
        active: true
      }
    })

    const activeLinks = userLinks.filter(link => link.active).length

    // Atividades recentes baseadas em dados reais
    const recentActivity = analytics.slice(0, 5).map(item => {
      if (item.linkId) {
        return {
          type: 'click' as const,
          description: `Clique no link "${item.link?.title || 'Link desconhecido'}"`,
          timestamp: item.clickedAt.toISOString()
        }
      } else {
        return {
          type: 'view' as const,
          description: 'Visita à página',
          timestamp: item.clickedAt.toISOString()
        }
      }
    })

    const summary = {
      totalClicks,
      totalViews,
      uniqueVisitors,
      activeLinks,
      clickGrowth,
      visitorGrowth,
      topLinks,
      topCountries,
      deviceBreakdown,
      dailyStats: dailyStatsFormatted,
      links: userLinks,
      recentActivity
    }

    // Debug log
    console.log('📊 Analytics Summary:', {
      totalClicks,
      totalViews,
      uniqueVisitors,
      activeLinks,
      clickGrowth,
      visitorGrowth,
      topLinksCount: topLinks.length,
      recentActivityCount: recentActivity.length,
      dailyStatsCount: dailyStatsFormatted.length,
      dailyStatsSample: dailyStatsFormatted.slice(0, 3)
    })

    return NextResponse.json({
      success: true,
      data: summary
    })
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
