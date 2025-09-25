import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email é obrigatório'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
