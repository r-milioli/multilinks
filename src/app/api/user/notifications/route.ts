import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NotificationSettings } from '@/types/common.types'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationSettings: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const notificationSettings = user.notificationSettings as NotificationSettings || {
      emailNotifications: true,
      weeklyReport: true,
      newFollower: true,
      linkClick: false,
      profileView: false,
      systemUpdates: true,
      marketingEmails: false,
      pushNotifications: true,
      smsNotifications: false,
      notificationFrequency: 'daily'
    }

    return NextResponse.json({
      success: true,
      data: notificationSettings
    })
  } catch (error) {
    console.error('Erro ao buscar configurações de notificação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const notificationSettings: NotificationSettings = await request.json()

    // Validar dados de notificação
    if (typeof notificationSettings.emailNotifications !== 'boolean' || 
        typeof notificationSettings.weeklyReport !== 'boolean' ||
        typeof notificationSettings.newFollower !== 'boolean' ||
        typeof notificationSettings.linkClick !== 'boolean' ||
        typeof notificationSettings.profileView !== 'boolean' ||
        typeof notificationSettings.systemUpdates !== 'boolean' ||
        typeof notificationSettings.marketingEmails !== 'boolean' ||
        typeof notificationSettings.pushNotifications !== 'boolean' ||
        typeof notificationSettings.smsNotifications !== 'boolean' ||
        !['immediate', 'daily', 'weekly', 'never'].includes(notificationSettings.notificationFrequency)) {
      return NextResponse.json(
        { success: false, error: 'Dados de notificação inválidos' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notificationSettings: notificationSettings
      }
    })

    return NextResponse.json({
      success: true,
      data: notificationSettings
    })
  } catch (error) {
    console.error('Erro ao salvar configurações de notificação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

