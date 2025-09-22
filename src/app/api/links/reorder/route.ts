import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LinkService } from '@/modules/links/services/linkService'
import { ReorderLinkData } from '@/types/link.types'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { links }: { links: ReorderLinkData[] } = await request.json()
    
    if (!links || !Array.isArray(links)) {
      return NextResponse.json(
        { success: false, error: 'Dados de reordenação inválidos' },
        { status: 400 }
      )
    }

    const result = await LinkService.reorderLinks(session.user.id, links)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Erro ao reordenar links:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

