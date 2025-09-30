import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminAuth } from '@/lib/adminAuth'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/financial/sales
 * Buscar histórico de vendas com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    console.log('🔍 API Admin Financial Sales - Buscando histórico de vendas...')

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const planId = searchParams.get('planId')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Construir filtros
    const whereClause: any = {}

    // Filtro por status (padrão: todos)
    if (status && status !== 'all') {
      whereClause.status = status
    }
    // Se não especificar status, mostrar todos (incluindo pending)

    // Filtro por plano (através da subscription)
    if (planId && planId !== 'all') {
      whereClause.subscription = {
        planId: planId
      }
    }

    // Filtro por datas
    if (dateFrom || dateTo) {
      whereClause.processedAt = {}
      if (dateFrom) {
        whereClause.processedAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        whereClause.processedAt.lte = new Date(dateTo)
      }
    }

    // Filtro por busca (nome ou email do usuário)
    if (search) {
      whereClause.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    // Buscar vendas com informações do usuário
    const sales = await prisma.payment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Buscar usuários e subscriptions separadamente
    const userIds = [...new Set(sales.map(s => s.userId))]
    const subscriptionIds = sales.map(s => s.subscriptionId).filter(Boolean)

    const [users, subscriptions] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true }
      }),
      subscriptionIds.length > 0 ? prisma.subscription.findMany({
        where: { id: { in: subscriptionIds } },
        select: { id: true, planId: true, planName: true }
      }) : Promise.resolve([])
    ])

    const userMap = new Map(users.map(u => [u.id, u]))
    const subscriptionMap = new Map(subscriptions.map(s => [s.id, s]))

    // Contar total para paginação
    const total = await prisma.payment.count({
      where: whereClause
    })

    // Transformar dados para o formato esperado pelo frontend
    const formattedSales = sales.map(payment => {
      const user = userMap.get(payment.userId)
      const subscription = payment.subscriptionId ? subscriptionMap.get(payment.subscriptionId) : null

      // Determinar plano baseado no valor do pagamento se não houver subscription
      let planId = subscription?.planId || 'unknown'
      let planName = subscription?.planName || 'Plano desconhecido'
      
      if (!subscription && payment.amount) {
        const amount = Number(payment.amount)
        if (amount === 25) {
          planId = 'pro'
          planName = 'Pro'
        } else if (amount === 40) {
          planId = 'business'
          planName = 'Business'
        } else if (amount === 0) {
          planId = 'free'
          planName = 'Gratuito'
        }
      }

      return {
        id: payment.id,
        userId: payment.userId,
        userName: user?.name || 'Usuário sem nome',
        userEmail: user?.email || 'Email não disponível',
        planId,
        planName,
        amount: Number(payment.amount),
        status: payment.status === 'confirmed' ? 'paid' : payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt.toISOString(),
        paidAt: payment.processedAt?.toISOString(),
        refundedAt: payment.status === 'refunded' ? payment.updatedAt.toISOString() : undefined,
        paymentId: payment.transactionId || payment.id
      }
    })

    console.log(`✅ API Admin Financial Sales - ${formattedSales.length} vendas encontradas`)
    console.log('📊 Primeiras 3 vendas:', formattedSales.slice(0, 3).map(s => ({
      id: s.id,
      amount: s.amount,
      status: s.status,
      planName: s.planName,
      userName: s.userName
    })))

    return NextResponse.json({
      success: true,
      data: formattedSales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('❌ API Admin Financial Sales - Erro ao buscar vendas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
