import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    console.log('👁️ Visita registrada:', { userId })

    if (!userId) {
      console.log('❌ userId obrigatório não fornecido')
      return NextResponse.json(
        { success: false, error: 'userId obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário permite analytics
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { privacySettings: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const privacySettings = user.privacySettings as any || {}
    
    // Se analytics está desabilitado, não coletar dados
    if (privacySettings.allowAnalytics === false) {
      return NextResponse.json({
        success: true,
        data: { message: 'Analytics desabilitado' }
      })
    }

    // Obter informações do request
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || '127.0.0.1'

    // Detectar país (simplificado)
    const country = 'BR' // Por enquanto, fixo

    // Detectar dispositivo (simplificado)
    const device = 'desktop-windows' // Por enquanto, fixo

    // Criar dados de analytics para visita (sem linkId)
    const analyticsData = {
      linkId: null, // Visita da página, não de um link específico
      userId,
      userAgent,
      ipAddress: ip,
      country,
      device
    }

    // Salvar no banco de dados
    const analytics = await prisma.analytics.create({
      data: analyticsData
    })

    console.log('✅ Visita registrada:', analytics.id)

    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Erro ao registrar visita:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

