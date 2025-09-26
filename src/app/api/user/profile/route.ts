import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProfileService } from '@/modules/profile/services/profileService'
import { UpdateProfileData } from '@/types/profile.types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const result = await ProfileService.getUserProfile(session.user.id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 API /user/profile: Iniciando atualização')
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('❌ API /user/profile: Usuário não autenticado')
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }
    
    // Verificar se o ID do usuário é válido
    if (typeof session.user.id !== 'string' || session.user.id.trim() === '') {
      console.log('❌ API /user/profile: ID do usuário inválido')
      return NextResponse.json(
        { success: false, error: 'ID do usuário inválido' },
        { status: 400 }
      )
    }

    const body: UpdateProfileData = await request.json()
    console.log('🔄 API /user/profile: Dados recebidos:', body)
    console.log('🔄 API /user/profile: ID do usuário:', session.user.id)
    
    const result = await ProfileService.updateProfile(session.user.id, body)
    console.log('🔄 API /user/profile: Resultado do ProfileService:', result)
    
    if (!result.success) {
      console.log('❌ API /user/profile: Erro no ProfileService:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    console.log('✅ API /user/profile: Perfil atualizado com sucesso')
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('❌ API /user/profile: Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

