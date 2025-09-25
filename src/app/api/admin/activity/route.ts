import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/admin/activity
 * Buscar atividades recentes do sistema
 */
export async function GET() {
  try {
    console.log('🔍 API Admin Activity - Buscando atividades recentes...')

    // Buscar usuários recentes
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // Buscar links recentes
    const recentLinks = await prisma.link.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Buscar formulários recentes
    const recentForms = await prisma.form.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Buscar leads recentes
    const recentLeads = await prisma.lead.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        form: {
          select: {
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Combinar todas as atividades
    const activities = []

    // Adicionar usuários recentes
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        type: 'user_registered',
        description: 'Novo usuário cadastrado',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        timestamp: user.createdAt.toISOString()
      })
    })

    // Adicionar links recentes
    recentLinks.forEach(link => {
      activities.push({
        id: `link-${link.id}`,
        type: 'link_created',
        description: `Link criado: ${link.title}`,
        user: {
          id: link.user.id,
          name: link.user.name,
          email: link.user.email
        },
        timestamp: link.createdAt.toISOString(),
        metadata: { linkTitle: link.title }
      })
    })

    // Adicionar formulários recentes
    recentForms.forEach(form => {
      activities.push({
        id: `form-${form.id}`,
        type: 'form_submitted',
        description: `Formulário criado: ${form.title}`,
        user: {
          id: form.user.id,
          name: form.user.name,
          email: form.user.email
        },
        timestamp: form.createdAt.toISOString(),
        metadata: { formTitle: form.title }
      })
    })

    // Adicionar leads recentes
    recentLeads.forEach(lead => {
      activities.push({
        id: `lead-${lead.id}`,
        type: 'form_submitted',
        description: `Novo lead em: ${lead.form.title}`,
        user: {
          id: lead.form.user.id,
          name: lead.form.user.name,
          email: lead.form.user.email
        },
        timestamp: lead.createdAt.toISOString(),
        metadata: { formTitle: lead.form.title }
      })
    })

    // Ordenar por timestamp (mais recente primeiro)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Retornar apenas as 10 mais recentes
    const recentActivity = activities.slice(0, 10)

    console.log('✅ API Admin Activity - Atividades encontradas:', recentActivity.length)

    return NextResponse.json({
      success: true,
      data: recentActivity
    })

  } catch (error) {
    console.error('❌ API Admin Activity - Erro ao buscar atividades:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
