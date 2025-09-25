import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/stats
 * Buscar estatísticas gerais do sistema
 */
export async function GET() {
  try {
    console.log('🔍 API Admin Stats - Buscando estatísticas do sistema...')

    // Buscar estatísticas de usuários
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      pendingUsers,
      admins,
      superAdmins,
      totalLinks,
      activeLinks,
      totalForms,
      activeForms,
      totalLeads
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'INACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
      prisma.link.count(),
      prisma.link.count({ where: { active: true } }),
      prisma.form.count(),
      prisma.form.count({ where: { active: true } }),
      prisma.lead.count()
    ])

    // Buscar estatísticas de cliques (simulado por enquanto)
    const totalClicks = await prisma.analytics.count()

    // Calcular crescimento (simulado - TODO: implementar cálculo real)
    const userGrowth = 0 // Por enquanto, sem dados históricos
    const linkGrowth = 0
    const formGrowth = 0
    const revenueGrowth = 0

    // Receita (simulada - TODO: implementar sistema de pagamento)
    const monthlyRevenue = 0 // Por enquanto, sem sistema de pagamento
    const yearlyRevenue = 0
    const conversionRate = 0

    // Analytics (simulados - TODO: implementar analytics real)
    const pageViews = totalClicks // Usando cliques como proxy
    const uniqueVisitors = Math.floor(totalClicks * 0.3) // Estimativa
    const bounceRate = 0 // Sem dados suficientes
    const avgSessionDuration = 0 // Sem dados suficientes

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        suspended: suspendedUsers,
        pending: pendingUsers,
        admins,
        superAdmins,
        growth: userGrowth
      },
      links: {
        total: totalLinks,
        active: activeLinks,
        clicks: totalClicks,
        growth: linkGrowth
      },
      forms: {
        total: totalForms,
        active: activeForms,
        leads: totalLeads,
        growth: formGrowth
      },
      analytics: {
        pageViews,
        uniqueVisitors,
        bounceRate,
        avgSessionDuration
      },
      revenue: {
        monthly: monthlyRevenue,
        yearly: yearlyRevenue,
        growth: revenueGrowth,
        conversionRate
      }
    }

    console.log('✅ API Admin Stats - Estatísticas calculadas:', stats)

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('❌ API Admin Stats - Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
