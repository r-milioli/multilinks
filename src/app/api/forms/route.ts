import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Form, FormField } from '@/types/form.types';
import { PlanLimitsService } from '@/shared/services/planLimitsService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar formulários e limites
    const [forms, limits] = await Promise.all([
      prisma.form.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      PlanLimitsService.checkFormLimit(session.user.id)
    ]);

    return NextResponse.json({
      forms,
      limits: {
        current: limits.current,
        limit: limits.limit,
        isUnlimited: limits.limit === -1
      }
    });
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

    // Verificar limite de formulários
    const formLimit = await PlanLimitsService.checkFormLimit(session.user.id);
    
    if (!formLimit.allowed) {
      return NextResponse.json({
        error: formLimit.message || `Limite de ${formLimit.limit} formulários atingido`,
        upgradeRequired: formLimit.upgradeRequired,
        current: formLimit.current,
        limit: formLimit.limit
      }, { status: 403 });
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

    // Criar formulário em transação com atualização de estatísticas
    const [form] = await prisma.$transaction([
      prisma.form.create({
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
      }),
      prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalForms: {
            increment: 1
          }
        }
      })
    ]);

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar formulário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}