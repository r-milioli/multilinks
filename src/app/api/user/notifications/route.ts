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
    const validationErrors = []
    
    if (typeof notificationSettings.emailNotifications !== 'boolean') {
      validationErrors.push(`emailNotifications deve ser boolean, recebido: ${typeof notificationSettings.emailNotifications}`)
    }
    if (typeof notificationSettings.weeklyReport !== 'boolean') {
      validationErrors.push(`weeklyReport deve ser boolean, recebido: ${typeof notificationSettings.weeklyReport}`)
    }
    if (typeof notificationSettings.newFollower !== 'boolean') {
      validationErrors.push(`newFollower deve ser boolean, recebido: ${typeof notificationSettings.newFollower}`)
    }
    if (typeof notificationSettings.linkClick !== 'boolean') {
      validationErrors.push(`linkClick deve ser boolean, recebido: ${typeof notificationSettings.linkClick}`)
    }
    if (typeof notificationSettings.profileView !== 'boolean') {
      validationErrors.push(`profileView deve ser boolean, recebido: ${typeof notificationSettings.profileView}`)
    }
    if (typeof notificationSettings.systemUpdates !== 'boolean') {
      validationErrors.push(`systemUpdates deve ser boolean, recebido: ${typeof notificationSettings.systemUpdates}`)
    }
    if (typeof notificationSettings.marketingEmails !== 'boolean') {
      validationErrors.push(`marketingEmails deve ser boolean, recebido: ${typeof notificationSettings.marketingEmails}`)
    }
    if (typeof notificationSettings.pushNotifications !== 'boolean') {
      validationErrors.push(`pushNotifications deve ser boolean, recebido: ${typeof notificationSettings.pushNotifications}`)
    }
    if (typeof notificationSettings.smsNotifications !== 'boolean') {
      validationErrors.push(`smsNotifications deve ser boolean, recebido: ${typeof notificationSettings.smsNotifications}`)
    }
    if (!['immediate', 'daily', 'weekly', 'never'].includes(notificationSettings.notificationFrequency)) {
      validationErrors.push(`notificationFrequency deve ser 'immediate', 'daily', 'weekly' ou 'never', recebido: ${notificationSettings.notificationFrequency}`)
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: `Dados de notificação inválidos: ${validationErrors.join(', ')}` },
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

