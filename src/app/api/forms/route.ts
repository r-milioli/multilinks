import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Form, FormField } from '@/types/form.types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const forms = await prisma.form.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Erro ao buscar formulários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      title,
      description,
      uniqueId,
      fields,
      buttonText,
      buttonActive,
      redirectUrl,
      followLinkDestination,
      active,
    } = body;

    // Validação: pelo menos um campo deve estar ativo
    const activeFields = fields.filter((field: FormField) => field.active);
    if (activeFields.length === 0) {
      return NextResponse.json(
        { error: 'Pelo menos um campo deve estar ativo' },
        { status: 400 }
      );
    }

    // Verificar se o uniqueId já existe
    const existingForm = await prisma.form.findUnique({
      where: { uniqueId },
    });

    if (existingForm) {
      return NextResponse.json(
        { error: 'ID único já existe' },
        { status: 400 }
      );
    }

    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        title,
        description,
        uniqueId,
        fields: fields as any,
        buttonText,
        buttonActive,
        redirectUrl,
        followLinkDestination,
        active,
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar formulário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
