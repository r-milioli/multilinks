import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SystemSettingsService } from '@/modules/admin/services/systemSettingsService'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar dados recebidos
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const { email, phone, address } = body

    // Validar campos obrigatórios (mesmo que vazios, devem ser strings)
    const contactInfo = {
      email: email || '',
      phone: phone || '',
      address: address || ''
    }

    const result = await SystemSettingsService.saveContactInfo(contactInfo)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Informações de contato salvas com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao salvar informações de contato:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
