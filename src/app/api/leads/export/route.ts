import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    const whereClause: any = {
      form: {
        userId: session.user.id,
      },
    };

    if (formId) {
      whereClause.formId = formId;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        form: {
          select: {
            title: true,
            uniqueId: true,
          },
        },
        link: {
          select: {
            title: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Gerar CSV
    const headers = [
      'ID',
      'Data de Criação',
      'Formulário',
      'Link',
      'Nome',
      'Email',
      'WhatsApp',
      'Campo Personalizado',
      'IP',
      'User Agent'
    ];

    const csvRows = [headers.join(',')];

    leads.forEach((lead) => {
      const data = lead.data as any;
      const row = [
        lead.id,
        lead.createdAt.toISOString(),
        `"${lead.form.title}"`,
        lead.link ? `"${lead.link.title}"` : '',
        data.name ? `"${data.name}"` : '',
        data.email ? `"${data.email}"` : '',
        data.whatsapp ? `"${data.whatsapp}"` : '',
        data.custom ? `"${data.custom}"` : '',
        lead.ipAddress || '',
        `"${lead.userAgent || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const filename = `leads-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao exportar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
