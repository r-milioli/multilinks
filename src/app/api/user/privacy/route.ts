import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PrivacySettings } from '@/types/common.types'

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
      select: { privacySettings: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const privacySettings = user.privacySettings as PrivacySettings || {
      showEmail: false,
      showSocialLinks: true,
      allowAnalytics: true,
      isPublic: true
    }

    return NextResponse.json({
      success: true,
      data: privacySettings
    })
  } catch (error) {
    console.error('Erro ao buscar configurações de privacidade:', error)
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

    const privacySettings: PrivacySettings = await request.json()

    // Validar dados de privacidade
    if (typeof privacySettings.showEmail !== 'boolean' || 
        typeof privacySettings.showSocialLinks !== 'boolean' ||
        typeof privacySettings.allowAnalytics !== 'boolean' ||
        typeof privacySettings.isPublic !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Dados de privacidade inválidos' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        privacySettings: privacySettings
      }
    })

    return NextResponse.json({
      success: true,
      data: privacySettings
    })
  } catch (error) {
    console.error('Erro ao salvar configurações de privacidade:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

