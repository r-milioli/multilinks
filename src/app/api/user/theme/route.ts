import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ThemeSettings } from '@/types/common.types'

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
      select: { themeSettings: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const themeSettings = user.themeSettings as ThemeSettings || {
      primaryColor: '#3B82F6',
      secondaryColor: '#64748B',
      textColor: '#1E293B',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      borderRadius: 8
    }

    return NextResponse.json({
      success: true,
      data: themeSettings
    })
  } catch (error) {
    console.error('Erro ao buscar tema:', error)
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

    const themeSettings: ThemeSettings = await request.json()

    // Validar dados do tema
    if (!themeSettings.primaryColor || !themeSettings.fontFamily) {
      return NextResponse.json(
        { success: false, error: 'Dados do tema inválidos' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        themeSettings: themeSettings
      }
    })

    return NextResponse.json({
      success: true,
      data: themeSettings
    })
  } catch (error) {
    console.error('Erro ao salvar tema:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}