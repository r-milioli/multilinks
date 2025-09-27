import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PLAN_LIMITS } from '@/shared/utils/planLimits'
import type { PlanLimits } from '@/types/common.types'

/**
 * GET /api/admin/system-settings/plan-limits
 * Buscar configuração atual dos limites dos planos
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Buscar limites do banco
    const settings = await prisma.systemSettings.findUnique({
      where: { key: 'plan_limits' }
    })

    // Se não existir, retornar limites padrão
    const limits = settings?.value || PLAN_LIMITS

    return NextResponse.json({
      success: true,
      data: limits
    })
  } catch (error) {
    console.error('Erro ao buscar limites dos planos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/system-settings/plan-limits
 * Atualizar todos os limites dos planos
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Iniciando atualização dos limites dos planos')
    
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    console.log('👤 Sessão:', session?.user?.id)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    console.log('👑 Role do usuário:', user?.role)

    if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Validar dados recebidos
    const body = await request.json()
    console.log('📦 Dados recebidos:', JSON.stringify(body, null, 2))

    // Garantir que os dados são um objeto
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos: deve ser um objeto' },
        { status: 400 }
      )
    }

    // Validar estrutura dos limites
    const validPlans = ['free', 'pro', 'business']
    const requiredFields = ['maxLinks', 'maxForms', 'maxWebhooks', 'themeEditing', 'analytics', 'prioritySupport']
    const updatedLimits: Record<string, PlanLimits> = {}

    // Processar e validar cada plano
    for (const plan of validPlans) {
      console.log(`🔍 Validando plano ${plan}`)
      
      if (!body[plan]) {
        return NextResponse.json(
          { success: false, error: `Plano ${plan} não encontrado nos dados` },
          { status: 400 }
        )
      }

      updatedLimits[plan] = {
        maxLinks: 0,
        maxForms: 0,
        maxWebhooks: 0,
        themeEditing: false,
        analytics: false,
        prioritySupport: false
      }

      for (const field of requiredFields) {
        console.log(`  ✓ Verificando campo ${field}`)
        
        if (typeof body[plan][field] === 'undefined') {
          return NextResponse.json(
            { success: false, error: `Campo ${field} não encontrado no plano ${plan}` },
            { status: 400 }
          )
        }

        // Validar e converter tipos
        if (['maxLinks', 'maxForms', 'maxWebhooks'].includes(field)) {
          const value = Number(body[plan][field])
          if (isNaN(value)) {
            return NextResponse.json(
              { success: false, error: `Campo ${field} do plano ${plan} deve ser um número` },
              { status: 400 }
            )
          }
          updatedLimits[plan][field] = value
        } else {
          const value = Boolean(body[plan][field])
          updatedLimits[plan][field] = value
        }
      }
    }

    console.log('✅ Dados validados:', JSON.stringify(updatedLimits, null, 2))

    // Salvar no banco
    const result = await prisma.systemSettings.upsert({
      where: { key: 'plan_limits' },
      update: {
        value: updatedLimits,
        updatedAt: new Date()
      },
      create: {
        key: 'plan_limits',
        value: updatedLimits,
        description: 'Limites dos planos do sistema',
        category: 'pricing',
        isPublic: false
      }
    })

    console.log('✨ Tudo pronto!')

    return NextResponse.json({
      success: true,
      data: updatedLimits,
      message: 'Limites atualizados com sucesso!'
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar limites dos planos:', error)
    // Retornar mensagem de erro mais detalhada em desenvolvimento
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      { 
        success: false, 
        error: isDev ? `Erro interno do servidor: ${error.message}` : 'Erro interno do servidor'
      },
      { status: 500 }
    )
  }
}