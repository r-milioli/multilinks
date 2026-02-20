import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ThemeSettings } from '@/types/common.types'
import { PlanLimitsService } from '@/shared/services/planLimitsService'
import { revalidatePath } from 'next/cache'

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

    const DEFAULT_THEME = {
      primaryColor: '#3B82F6',
      secondaryColor: '#64748B',
      textColor: '#1E293B',
      backgroundColor: '#FFFFFF',
      backgroundType: 'solid',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      borderRadius: 8,
      nameColor: '#1E293B',
      titleColor: '#64748B',
      bioColor: '#1E293B',
      buttonColors: {
        background: '#FFFFFF',
        text: '#1E293B',
        border: '#E5E7EB',
        hoverBackground: '#F9FAFB',
        hoverText: '#1E293B',
        hoverBorder: '#D1D5DB'
      },
      linkButtonSettings: {
        style: 'default',
        size: 'medium',
        spacing: 'normal',
        alignment: 'center',
        showIcons: true,
        showDescriptions: true,
        hoverEffect: 'scale',
        animationSpeed: 300
      },
      socialButtonsSettings: {
        style: 'default',
        size: 'medium',
        shape: 'circle',
        spacing: 'normal',
        alignment: 'center',
        showLabels: false,
        hoverEffect: 'scale',
        animationSpeed: 300,
        backgroundColor: '#FFFFFF',
        iconColor: '#374151',
        borderColor: '#E5E7EB',
        hoverBackgroundColor: '#F9FAFB',
        hoverIconColor: '#1F2937'
      },
      imageSettings: {
        position: 'left',
        size: 'medium',
        borderRadius: 'rounded',
        spacing: 'normal'
      },
      avatarSettings: {
        size: 'medium',
        shape: 'circle',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadow: 'none',
        position: 'top'
      },
      backgroundSettings: {
        position: 'center',
        size: 'cover',
        repeat: 'no-repeat',
        attachment: 'scroll'
      },
      formModalSettings: {
        backgroundColor: '#FFFFFF',
        textColor: '#1E293B',
        borderColor: '#E5E7EB',
        borderRadius: 8,
        shadow: 'lg',
        backdropBlur: true,
        inputBackgroundColor: '#FFFFFF',
        inputBorderColor: '#E5E7EB',
        inputTextColor: '#1E293B',
        inputFocusBorderColor: '#3B82F6',
        buttonBackgroundColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        buttonHoverBackgroundColor: '#2563EB',
        buttonHoverTextColor: '#FFFFFF',
        titleColor: '#1E293B',
        descriptionColor: '#64748B',
        errorColor: '#EF4444',
        successColor: '#10B981'
      }
    } as const

    // Mesclar tema salvo com defaults para garantir campos como fontFamily
    const saved = (user.themeSettings as any) || {}
    const themeSettings = {
      ...DEFAULT_THEME,
      ...saved,
      buttonColors: { ...DEFAULT_THEME.buttonColors, ...(saved.buttonColors || {}) },
      linkButtonSettings: { ...DEFAULT_THEME.linkButtonSettings, ...(saved.linkButtonSettings || {}) },
      socialButtonsSettings: { ...DEFAULT_THEME.socialButtonsSettings, ...(saved.socialButtonsSettings || {}) },
      imageSettings: { ...DEFAULT_THEME.imageSettings, ...(saved.imageSettings || {}) },
      avatarSettings: { ...DEFAULT_THEME.avatarSettings, ...(saved.avatarSettings || {}) },
      backgroundSettings: { ...DEFAULT_THEME.backgroundSettings, ...(saved.backgroundSettings || {}) },
      formModalSettings: { ...DEFAULT_THEME.formModalSettings, ...(saved.formModalSettings || {}) }
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
    console.log('💾 API Theme - Recebendo dados:', themeSettings)
    console.log('💾 API Theme - linkButtonSettings:', themeSettings.linkButtonSettings)

    // Verificar se o usuário tem acesso ao editor de tema
    const themeAccess = await PlanLimitsService.checkFeatureAccess(session.user.id, 'themeEditing')
    if (!themeAccess.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: themeAccess.message || 'Editor de tema não disponível no seu plano',
          upgradeRequired: themeAccess.upgradeRequired
        },
        { status: 403 }
      )
    }

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
        themeSettings: themeSettings as any
      }
    })

    // Revalidar página pública do usuário para refletir mudanças imediatamente
    try {
      const userWithUsername = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true }
      })
      
      if (userWithUsername?.username) {
        revalidatePath(`/${userWithUsername.username}`)
        console.log(`✅ Página pública revalidada: /${userWithUsername.username}`)
      }
    } catch (error) {
      console.warn('Erro ao revalidar página pública:', error)
    }

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