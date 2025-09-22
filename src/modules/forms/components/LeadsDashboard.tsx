'use client';

import { useState, useEffect } from 'react';
import { Lead, Form } from '@/types/form.types';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Loading } from '@/shared/components/ui/Loading';

interface LeadsDashboardProps {
  forms: Form[];
}

interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function LeadsDashboard({ forms }: LeadsDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [exporting, setExporting] = useState(false);

  const fetchLeads = async (page = 1, formId?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });

      if (formId) {
        params.append('formId', formId);
      }

      const response = await fetch(`/api/leads?${params}`);
      const data: LeadsResponse = await response.json();

      if (response.ok) {
        setLeads(data.leads);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1, selectedFormId || undefined);
  }, [selectedFormId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedFormId) {
        params.append('formId', selectedFormId);
      }

      const response = await fetch(`/api/leads/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao exportar leads:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldValue = (lead: Lead, fieldId: string) => {
    const data = lead.data as any;
    return data[fieldId] || '-';
  };

  const getTotalLeads = () => {
    return pagination.total;
  };

  const getLeadsToday = () => {
    const today = new Date().toDateString();
    return leads.filter(lead => 
      new Date(lead.createdAt).toDateString() === today
    ).length;
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{getTotalLeads()}</p>
            <p className="text-sm text-gray-600">Total de Leads</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{getLeadsToday()}</p>
            <p className="text-sm text-gray-600">Hoje</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{forms.length}</p>
            <p className="text-sm text-gray-600">Formulários</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {forms.filter(f => f.active).length}
            </p>
            <p className="text-sm text-gray-600">Ativos</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <Label htmlFor="formFilter">Filtrar por Formulário</Label>
            <select
              id="formFilter"
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os formulários</option>
              {forms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.title}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="outline"
          >
            {exporting ? (
              <>
                <Loading className="w-4 h-4 mr-2" />
                Exportando...
              </>
            ) : (
              'Exportar CSV'
            )}
          </Button>
        </div>
      </Card>

      {/* Lista de Leads */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Data</th>
                <th className="text-left p-2">Formulário</th>
                <th className="text-left p-2">Link</th>
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">WhatsApp</th>
                <th className="text-left p-2">Customizado</th>
                <th className="text-left p-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-sm">{formatDate(lead.createdAt)}</td>
                  <td className="p-2 text-sm">
                    {lead.form?.title || 'Formulário'}
                  </td>
                  <td className="p-2 text-sm">
                    {lead.link?.title || '-'}
                  </td>
                  <td className="p-2 text-sm">{getFieldValue(lead, 'name')}</td>
                  <td className="p-2 text-sm">{getFieldValue(lead, 'email')}</td>
                  <td className="p-2 text-sm">{getFieldValue(lead, 'whatsapp')}</td>
                  <td className="p-2 text-sm">{getFieldValue(lead, 'custom')}</td>
                  <td className="p-2 text-sm font-mono text-xs">
                    {lead.ipAddress || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </div>

        {/* Paginação */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} leads
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLeads(currentPage - 1, selectedFormId || undefined)}
                disabled={currentPage === 1 || loading}
              >
                Anterior
              </Button>
              
              <span className="px-3 py-1 text-sm">
                {currentPage} de {pagination.pages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchLeads(currentPage + 1, selectedFormId || undefined)}
                disabled={currentPage === pagination.pages || loading}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
