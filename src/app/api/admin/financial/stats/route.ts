import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/financial/stats
 * Buscar estatísticas financeiras gerais
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Admin Financial Stats - Iniciando...')
    
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      console.log('❌ API Admin Financial Stats - Erro de autenticação:', authError)
      return authError
    }

    console.log('✅ API Admin Financial Stats - Autenticado, buscando estatísticas...')

    // Verificar se há dados no banco
    const totalPaymentsCheck = await prisma.payment.count()
    console.log(`📊 Total de pagamentos no banco: ${totalPaymentsCheck}`)

    // Buscar dados de pagamentos
    const [
      totalPayments,
      paidPayments,
      pendingPayments,
      failedPayments,
      refundedPayments,
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      totalSubscriptions,
      activeSubscriptions
    ] = await Promise.all([
      // Contadores de pagamentos
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'paid' } }),
      prisma.payment.count({ where: { status: 'pending' } }),
      prisma.payment.count({ where: { status: 'failed' } }),
      prisma.payment.count({ where: { status: 'refunded' } }),
      
      // Receita total (apenas pagos)
      prisma.payment.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      
      // Receita mensal (últimos 30 dias - apenas pagos)
      prisma.payment.aggregate({
        where: {
          status: 'paid',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: { amount: true }
      }),
      
      // Receita anual (últimos 365 dias - apenas pagos)
      prisma.payment.aggregate({
        where: {
          status: 'paid',
          createdAt: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: { amount: true }
      }),
      
      // Assinaturas
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'active' } })
    ])

    // Calcular métricas derivadas
    const totalRevenueValue = totalRevenue._sum.amount || 0
    const monthlyRevenueValue = monthlyRevenue._sum.amount || 0
    const yearlyRevenueValue = yearlyRevenue._sum.amount || 0
    
    // Calcular ticket médio
    const averageOrderValue = paidPayments > 0 ? totalRevenueValue / paidPayments : 0
    
    // Calcular taxa de reembolso
    const refundRate = paidPayments > 0 ? (refundedPayments / paidPayments) * 100 : 0
    
    // Calcular taxa de conversão (simplificada)
    const totalUsers = await prisma.user.count()
    const conversionRate = totalUsers > 0 ? (paidPayments / totalUsers) * 100 : 0

    // Calcular crescimento (comparar com mês anterior)
    const previousMonthStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    const previousMonthEnd = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const previousMonthRevenue = await prisma.payment.aggregate({
      where: {
        status: 'paid',
        processedAt: {
          gte: previousMonthStart,
          lt: previousMonthEnd
        }
      },
      _sum: { amount: true }
    })

    const previousMonthValue = previousMonthRevenue._sum.amount || 0
    const revenueGrowth = previousMonthValue > 0 
      ? ((monthlyRevenueValue - previousMonthValue) / previousMonthValue) * 100 
      : 0

    // Calcular crescimento de vendas
    const previousMonthSales = await prisma.payment.count({
      where: {
        status: 'paid',
        processedAt: {
          gte: previousMonthStart,
          lt: previousMonthEnd
        }
      }
    })

    const salesGrowth = previousMonthSales > 0 
      ? ((paidPayments - previousMonthSales) / previousMonthSales) * 100 
      : 0

    const monthlySalesCount = await prisma.payment.count({
      where: {
        status: 'paid',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const stats = {
      totalRevenue: Number(totalRevenueValue),
      monthlyRevenue: Number(monthlyRevenueValue),
      yearlyRevenue: Number(yearlyRevenueValue),
      totalSales: paidPayments,
      monthlySales: monthlySalesCount,
      conversionRate: Number(conversionRate.toFixed(2)),
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      refunds: refundedPayments,
      refundRate: Number(refundRate.toFixed(2)),
      growth: {
        revenue: Number(revenueGrowth.toFixed(2)),
        sales: Number(salesGrowth.toFixed(2)),
        conversion: 0 // TODO: Implementar cálculo de crescimento de conversão
      }
    }

    console.log('✅ API Admin Financial Stats - Estatísticas calculadas:', JSON.stringify(stats, null, 2))
    console.log(`📊 Detalhes: ${paidPayments} pagamentos pagos, R$ ${totalRevenueValue} receita total`)

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('❌ API Admin Financial Stats - Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
