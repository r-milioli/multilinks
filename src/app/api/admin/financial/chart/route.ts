import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/financial/chart
 * Buscar dados para gráficos de receita e vendas
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    console.log('🔍 API Admin Financial Chart - Buscando dados para gráficos...')

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // dias
    const chartType = searchParams.get('type') || 'daily' // daily, weekly, monthly

    const days = parseInt(period)
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const endDate = new Date()

    let chartData: Array<{ date: string; revenue: number; sales: number }> = []

    if (chartType === 'daily') {
      // Dados diários
      const dailyData = await prisma.payment.groupBy({
        by: ['createdAt'],
        where: {
          // Incluir todos os status para mostrar atividade
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: {
          amount: true
        },
        _count: {
          id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      // Criar um mapa de datas para preencher lacunas
      const dateMap = new Map()
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        dateMap.set(dateStr, { revenue: 0, sales: 0 })
      }

      // Preencher com dados reais
      dailyData.forEach(item => {
        if (item.createdAt) {
          const dateStr = item.createdAt.toISOString().split('T')[0]
          dateMap.set(dateStr, {
            revenue: Number(item._sum.amount || 0),
            sales: item._count.id
          })
        }
      })

      // Converter para array
      chartData = Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        sales: data.sales
      }))

    } else if (chartType === 'weekly') {
      // Dados semanais (últimas 12 semanas)
      const weeklyData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('week', "createdAt") as week,
          SUM(amount) as revenue,
          COUNT(*) as sales
        FROM "Payment"
        WHERE "createdAt" >= ${startDate}
          AND "createdAt" <= ${endDate}
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY week ASC
      ` as Array<{ week: Date; revenue: number; sales: number }>

      chartData = weeklyData.map(item => ({
        date: item.week.toISOString().split('T')[0],
        revenue: Number(item.revenue),
        sales: Number(item.sales)
      }))

    } else if (chartType === 'monthly') {
      // Dados mensais (últimos 12 meses)
      const monthlyData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM(amount) as revenue,
          COUNT(*) as sales
        FROM "Payment"
        WHERE "createdAt" >= ${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
          AND "createdAt" <= ${endDate}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      ` as Array<{ month: Date; revenue: number; sales: number }>

      chartData = monthlyData.map(item => ({
        date: item.month.toISOString().split('T')[0],
        revenue: Number(item.revenue),
        sales: Number(item.sales)
      }))
    }

    // Se não há dados suficientes, retornar dados mock para desenvolvimento
    if (chartData.length === 0) {
      console.log('⚠️ API Admin Financial Chart - Sem dados reais, retornando dados mock')
      chartData = [
        { date: '2024-01-01', revenue: 1200, sales: 12 },
        { date: '2024-01-02', revenue: 1500, sales: 15 },
        { date: '2024-01-03', revenue: 800, sales: 8 },
        { date: '2024-01-04', revenue: 2000, sales: 20 },
        { date: '2024-01-05', revenue: 1700, sales: 17 }
      ]
    }

    console.log(`✅ API Admin Financial Chart - ${chartData.length} pontos de dados gerados`)

    return NextResponse.json({
      success: true,
      data: chartData
    })

  } catch (error) {
    console.error('❌ API Admin Financial Chart - Erro ao buscar dados de gráfico:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
