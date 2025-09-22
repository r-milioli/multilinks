import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { formIds } = await request.json();

    if (!Array.isArray(formIds) || formIds.length === 0) {
      return NextResponse.json({ error: 'IDs de formulários inválidos' }, { status: 400 });
    }

    // Buscar estatísticas de leads para cada formulário
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Promise.all(
      formIds.map(async (formId: string) => {
        // Verificar se o formulário pertence ao usuário
        const form = await prisma.form.findFirst({
          where: {
            id: formId,
            userId: session.user.id,
          },
        });

        if (!form) {
          return {
            formId,
            totalLeads: 0,
            leadsToday: 0,
          };
        }

        // Contar total de leads
        const totalLeads = await prisma.lead.count({
          where: {
            formId: formId,
          },
        });

        // Contar leads de hoje
        const leadsToday = await prisma.lead.count({
          where: {
            formId: formId,
            createdAt: {
              gte: today,
            },
          },
        });

        return {
          formId,
          totalLeads,
          leadsToday,
        };
      })
    );

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos formulários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
