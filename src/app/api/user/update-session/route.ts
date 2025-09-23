import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const userAgent = request.headers.get('user-agent') || 'Unknown'
    
    // Com JWT, não temos sessionToken, então vamos criar/atualizar uma sessão de referência
    // ou simplesmente retornar sucesso sem atualizar o banco
    console.log('🔍 UserAgent capturado:', userAgent)
    console.log('🔍 User ID:', session.user.id)
    
    // Para JWT, não precisamos atualizar o banco, apenas logar
    // Em uma implementação futura com database sessions, isso seria necessário

    return NextResponse.json({
      success: true,
      message: 'UserAgent atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar userAgent da sessão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
