import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        uniqueId: params.uniqueId,
        active: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        uniqueId: true,
        fields: true,
        buttonText: true,
        buttonActive: true,
        redirectUrl: true,
        followLinkDestination: true,
        user: {
          select: {
            themeSettings: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Erro ao buscar formulário público:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
