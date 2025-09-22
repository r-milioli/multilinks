import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/modules/auth/services/authService'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username é obrigatório' },
        { status: 400 }
      )
    }

    const result = await AuthService.checkUsernameAvailability(username)
    
    return NextResponse.json({
      success: true,
      available: result.available
    })
  } catch (error) {
    console.error('Erro ao verificar username:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

