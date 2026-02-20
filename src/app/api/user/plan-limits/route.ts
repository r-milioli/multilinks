import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PlanLimitsService } from '@/shared/services/planLimitsService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar dados do plano do usuário
    const [plan, limits, usage] = await Promise.all([
      PlanLimitsService.getUserPlan(session.user.id),
      PlanLimitsService.getPlanLimits(await PlanLimitsService.getUserPlan(session.user.id)),
      PlanLimitsService.getCurrentUsage(session.user.id)
    ])

    // Verificar acesso às features
    const [analytics, themeEditing, prioritySupport, webhooks] = await Promise.all([
      PlanLimitsService.checkFeatureAccess(session.user.id, 'analytics'),
      PlanLimitsService.checkFeatureAccess(session.user.id, 'themeEditing'),
      PlanLimitsService.checkFeatureAccess(session.user.id, 'prioritySupport'),
      PlanLimitsService.checkWebhookLimit(session.user.id)
    ])

    // Verificar limites de links e formulários
    const [linkCheck, formCheck] = await Promise.all([
      PlanLimitsService.checkLinkLimit(session.user.id),
      PlanLimitsService.checkFormLimit(session.user.id)
    ])

    return NextResponse.json({
      success: true,
      data: {
        plan,
        limits,
        usage,
        featureAccess: {
          analytics,
          themeEditing,
          webhooks: {
            feature: 'maxWebhooks',
            allowed: webhooks.allowed,
            upgradeRequired: webhooks.upgradeRequired,
            message: webhooks.message
          },
          prioritySupport
        },
        linkLimits: {
          current: linkCheck.current,
          limit: linkCheck.limit,
          isUnlimited: linkCheck.limit === -1,
          allowed: linkCheck.allowed,
          upgradeRequired: linkCheck.upgradeRequired || false
        },
        formLimits: {
          current: formCheck.current,
          limit: formCheck.limit,
          isUnlimited: formCheck.limit === -1,
          allowed: formCheck.allowed,
          upgradeRequired: formCheck.upgradeRequired || false
        }
      }
    })

  } catch (error) {
    console.error('Erro ao buscar limites do plano:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
