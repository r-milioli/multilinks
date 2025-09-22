import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FormSubmission } from '@/types/form.types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const whereClause: any = {
      form: {
        userId: session.user.id,
      },
    };

    if (formId) {
      whereClause.formId = formId;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        include: {
          form: {
            select: {
              id: true,
              title: true,
              uniqueId: true,
            },
          },
          link: {
            select: {
              id: true,
              title: true,
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.lead.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmission = await request.json();
    const { formId, data, linkId } = body;

    // Buscar informações do formulário
    const form = await prisma.form.findUnique({
      where: { uniqueId: formId },
      include: {
        user: {
          select: {
            id: true,
            themeSettings: true,
          },
        },
      },
    });

    if (!form || !form.active) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou inativo' },
        { status: 404 }
      );
    }

    // Buscar link se fornecido
    let link = null;
    if (linkId) {
      link = await prisma.link.findUnique({
        where: { id: linkId },
      });
    }

    // Capturar informações do cliente
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Criar o lead
    const lead = await prisma.lead.create({
      data: {
        formId: form.id,
        linkId: linkId || null,
        data: data as any,
        ipAddress,
        userAgent,
      },
      include: {
        form: {
          select: {
            title: true,
            redirectUrl: true,
            followLinkDestination: true,
          },
        },
        link: {
          select: {
            url: true,
          },
        },
      },
    });

    // Determinar URL de redirecionamento
    let redirectUrl = null;
    if (form.followLinkDestination && link) {
      redirectUrl = link.url;
    } else if (form.redirectUrl) {
      redirectUrl = form.redirectUrl;
    }

    return NextResponse.json({
      success: true,
      lead,
      redirectUrl,
    });
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
