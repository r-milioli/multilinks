import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/modules/auth/services/authService'
import { RegisterData } from '@/types/auth.types'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    
    const result = await AuthService.register(body)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

