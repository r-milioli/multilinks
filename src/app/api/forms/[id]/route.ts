import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FormField } from '@/types/form.types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Erro ao buscar formulário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar se o formulário existe e pertence ao usuário
    const existingForm = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
    }

    // Validação: pelo menos um campo deve estar ativo
    const activeFields = fields.filter((field: FormField) => field.active);
    if (activeFields.length === 0) {
      return NextResponse.json(
        { error: 'Pelo menos um campo deve estar ativo' },
        { status: 400 }
      );
    }

    // Verificar se o uniqueId já existe em outro formulário
    if (uniqueId !== existingForm.uniqueId) {
      const formWithSameUniqueId = await prisma.form.findUnique({
        where: { uniqueId },
      });

      if (formWithSameUniqueId) {
        return NextResponse.json(
          { error: 'ID único já existe' },
          { status: 400 }
        );
      }
    }

    const form = await prisma.form.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(form);
  } catch (error) {
    console.error('Erro ao atualizar formulário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o formulário existe e pertence ao usuário
    const existingForm = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
    }

    await prisma.form.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Formulário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar formulário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
