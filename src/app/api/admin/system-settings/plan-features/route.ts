import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'
import { AuditLogService } from '@/modules/admin/services/auditLogService'

interface PlanFeature {
  name: string
  free: boolean
  pro: boolean
  business: boolean
}

interface PlanFeatureCategory {
  category: string
  items: PlanFeature[]
}

const defaultFeatures: PlanFeatureCategory[] = [
  {
    category: 'Gestão de Links',
    items: [
      { name: 'Links ilimitados', free: true, pro: true, business: true },
      { name: 'Drag & drop', free: true, pro: true, business: true },
      { name: 'Categorização', free: false, pro: true, business: true },
      { name: 'Links programados', free: false, pro: false, business: true },
      { name: 'A/B testing', free: false, pro: false, business: true }
    ]
  },
  {
    category: 'Personalização',
    items: [
      { name: 'Temas básicos', free: true, pro: true, business: true },
      { name: 'Temas premium', free: false, pro: true, business: true },
      { name: 'Editor visual', free: false, pro: true, business: true },
      { name: 'CSS customizado', free: false, pro: false, business: true },
      { name: 'Branding personalizado', free: false, pro: false, business: true }
    ]
  },
  {
    category: 'Analytics',
    items: [
      { name: 'Cliques básicos', free: true, pro: true, business: true },
      { name: 'Geolocalização', free: false, pro: true, business: true },
      { name: 'Dispositivos', free: false, pro: true, business: true },
      { name: 'Relatórios avançados', free: false, pro: true, business: true },
      { name: 'API de analytics', free: false, pro: false, business: true }
    ]
  },
  {
    category: 'Formulários',
    items: [
      { name: '1 formulário', free: true, pro: false, business: false },
      { name: 'Formulários ilimitados', free: false, pro: true, business: true },
      { name: 'Campos personalizados', free: false, pro: true, business: true },
      { name: 'Validação avançada', free: false, pro: false, business: true },
      { name: 'Automações', free: false, pro: false, business: true }
    ]
  },
  {
    category: 'Integrações',
    items: [
      { name: 'Webhooks básicos', free: false, pro: true, business: true },
      { name: 'Webhooks ilimitados', free: false, pro: false, business: true },
      { name: 'API completa', free: false, pro: false, business: true },
      { name: 'Integrações nativas', free: false, pro: false, business: true },
      { name: 'Webhooks customizados', free: false, pro: false, business: true }
    ]
  },
  {
    category: 'Suporte',
    items: [
      { name: 'Email', free: true, pro: true, business: true },
      { name: 'Chat', free: false, pro: true, business: true },
      { name: 'Suporte prioritário', free: false, pro: true, business: true },
      { name: 'Suporte 24/7', free: false, pro: false, business: true },
      { name: 'Gerente de conta', free: false, pro: false, business: true }
    ]
  }
]

/**
 * GET /api/admin/system-settings/plan-features
 * Busca os recursos configurados para cada plano
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const settingsResult = await SystemSettingsService.getSetting('plan_features')

    let currentFeatures = defaultFeatures

    if (settingsResult.success && settingsResult.data && typeof settingsResult.data.value === 'object') {
      currentFeatures = settingsResult.data.value as PlanFeatureCategory[]
    }

    return NextResponse.json({
      success: true,
      data: currentFeatures
    })
  } catch (error) {
    console.error('Erro ao buscar recursos dos planos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/system-settings/plan-features
 * Atualiza os recursos configurados para cada plano
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 403 }
      )
    }

    const features = await request.json()

    // Validar estrutura dos dados
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { success: false, error: 'Formato de dados inválido' },
        { status: 400 }
      )
    }

    // Validar cada categoria e seus recursos
    for (const category of features) {
      if (!category.category || !Array.isArray(category.items)) {
        return NextResponse.json(
          { success: false, error: 'Estrutura de categoria inválida' },
          { status: 400 }
        )
      }

      for (const item of category.items) {
        if (!item.name || typeof item.free !== 'boolean' || typeof item.pro !== 'boolean' || typeof item.business !== 'boolean') {
          return NextResponse.json(
            { success: false, error: 'Estrutura de recurso inválida' },
            { status: 400 }
          )
        }
      }
    }

    const result = await SystemSettingsService.upsertSetting({
      key: 'plan_features',
      value: features,
      description: 'Recursos disponíveis em cada plano',
      category: 'pricing',
      isPublic: true
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Registrar auditoria
    await AuditLogService.createLog({
      userId: session.user.id,
      action: 'system_setting_updated',
      resource: 'plan_features',
      resourceId: 'plan_features',
      newData: features,
      description: 'Recursos dos planos atualizados pelo admin'
    })

    return NextResponse.json({
      success: true,
      data: features,
      message: 'Recursos dos planos salvos com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao salvar recursos dos planos:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
