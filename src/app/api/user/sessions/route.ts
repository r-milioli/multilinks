import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

function getUserAgentBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

function getUserAgentDevice(userAgent: string): string {
  if (userAgent.includes('Mobile')) return 'Mobile'
  if (userAgent.includes('Tablet')) return 'Tablet'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iPhone')) return 'iPhone'
  if (userAgent.includes('iPad')) return 'iPad'
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'Mac'
  if (userAgent.includes('Linux')) return 'Linux'
  return 'Desktop'
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar sessões ativas do usuário
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expires: {
          gt: new Date()
        }
      },
      orderBy: {
        expires: 'desc'
      }
    })

    // Formatar dados das sessões
    const activeSessions = sessions.map(sessionData => {
      // Extrair informações do userAgent se disponível
      const userAgent = sessionData.userAgent || 'Unknown'
      const browser = getUserAgentBrowser(userAgent)
      const device = getUserAgentDevice(userAgent)
      const location = 'Brasil' // TODO: Implementar detecção de localização por IP
      
      return {
        id: sessionData.id,
        device,
        browser,
        location,
        lastActivity: sessionData.expires.toISOString(),
        isCurrent: sessionData.id === session.sessionToken
      }
    })

    return NextResponse.json({
      success: true,
      data: activeSessions
    })
  } catch (error) {
    console.error('Erro ao buscar sessões:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
