import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { IntegrationSettings } from '@/types/integrations.types'

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
      select: { integrationSettings: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const integrationSettings = (user.integrationSettings as IntegrationSettings) || {}

    return NextResponse.json({
      success: true,
      data: integrationSettings
    })
  } catch (error) {
    console.error('Erro ao buscar configurações de integração:', error)
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

    const integrationSettings: IntegrationSettings = await request.json()

    // Validar dados de integração (validações mais flexíveis)
    if (integrationSettings.googleAnalytics && integrationSettings.googleAnalytics.trim() !== '') {
      const gaValue = integrationSettings.googleAnalytics.trim()
      if (!gaValue.match(/^UA-\d{4,10}-\d{1,4}$/) && !gaValue.match(/^G-[A-Z0-9]{10}$/)) {
        return NextResponse.json(
          { success: false, error: 'Formato do Google Analytics inválido. Use UA-XXXXXXXXX-X ou G-XXXXXXXXXX' },
          { status: 400 }
        )
      }
    }

    if (integrationSettings.facebookPixel && integrationSettings.facebookPixel.trim() !== '') {
      const pixelValue = integrationSettings.facebookPixel.trim()
      if (!pixelValue.match(/^\d{15,16}$/)) {
        return NextResponse.json(
          { success: false, error: 'Formato do Facebook Pixel inválido. Use 15-16 dígitos numéricos' },
          { status: 400 }
        )
      }
    }

    if (integrationSettings.webhookUrl && integrationSettings.webhookUrl.trim() !== '') {
      const webhookValue = integrationSettings.webhookUrl.trim()
      try {
        new URL(webhookValue)
        if (!webhookValue.startsWith('http://') && !webhookValue.startsWith('https://')) {
          return NextResponse.json(
            { success: false, error: 'URL do webhook deve começar com http:// ou https://' },
            { status: 400 }
          )
        }
      } catch {
        return NextResponse.json(
          { success: false, error: 'URL do webhook inválida' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        integrationSettings: integrationSettings
      }
    })

    return NextResponse.json({
      success: true,
      data: integrationSettings
    })
  } catch (error) {
    console.error('Erro ao salvar configurações de integração:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
