'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/modules/auth/hooks/useAuth';
import { useForms } from '@/modules/forms/hooks/useForms';
import { useFormStats } from '@/modules/forms/hooks/useFormStats';
import { FormBuilder } from '@/modules/forms/components/FormBuilder';
import { LeadsDashboard } from '@/modules/forms/components/LeadsDashboard';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/ui/Modal';
import { Loading } from '@/shared/components/ui/Loading';
import { FileText, Link as LinkIcon, BarChart3, Settings, Eye, Plus } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit' | 'leads';

export default function FormsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);

  const {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getFormById,
  } = useForms();

  const formIds = forms.map(form => form.id);
  const { getFormStats: getFormStatsFromHook, refreshStats } = useFormStats(formIds);

  // Atualizar estatísticas quando a página ganha foco (para capturar novos leads)
  useEffect(() => {
    const handleFocus = () => {
      refreshStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshStats]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <Loading className="w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecionamento será feito pelo hook
  }

  const handleCreateForm = async (formData: any) => {
    try {
      await createForm(formData);
      setShowFormBuilder(false);
      setViewMode('list');
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
    }
  };

  const handleUpdateForm = async (formData: any) => {
    if (!selectedForm) return;
    
    try {
      await updateForm(selectedForm, formData);
      setShowFormBuilder(false);
      setViewMode('list');
      setSelectedForm(null);
    } catch (error) {
      console.error('Erro ao atualizar formulário:', error);
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este formulário?')) {
      return;
    }

    try {
      await deleteForm(id);
    } catch (error) {
      console.error('Erro ao deletar formulário:', error);
    }
  };

  const handleEditForm = (id: string) => {
    setSelectedForm(id);
    setShowFormBuilder(true);
    setViewMode('edit');
  };

  const handleCreateNew = () => {
    setSelectedForm(null);
    setShowFormBuilder(true);
    setViewMode('create');
  };

  const getFormStats = (form: any) => {
    return getFormStatsFromHook(form.id);
  };


  if (viewMode === 'leads') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Leads Capturados
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  Voltar para Formulários
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LeadsDashboard forms={forms} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Formulários
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('leads')}
              >
                Ver Leads
              </Button>
              <Button onClick={handleCreateNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Criar Formulário
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {forms.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Nenhum formulário criado</h3>
            <p className="mb-4">Crie seu primeiro formulário para começar a capturar leads.</p>
            <Button onClick={handleCreateNew}>
              Criar Primeiro Formulário
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => {
            const stats = getFormStats(form);
            return (
              <Card key={form.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{form.title}</h3>
                    <p className="text-sm text-gray-600">{form.uniqueId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      form.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {form.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {form.description && (
                  <p className="text-gray-600 text-sm mb-4">{form.description}</p>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Campos ativos:</p>
                  <div className="flex flex-wrap gap-1">
                    {form.fields
                      .filter(field => field.active)
                      .map(field => (
                        <span
                          key={field.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {field.label}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.leadsToday}</p>
                    <p className="text-xs text-gray-600">Hoje</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditForm(form.id)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Deletar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal do FormBuilder */}
      <Modal
        open={showFormBuilder}
        onOpenChange={(open) => {
          if (!open) {
            setShowFormBuilder(false);
            setSelectedForm(null);
            setViewMode('list');
          }
        }}
      >
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>
              {viewMode === 'create' ? 'Criar Formulário' : 'Editar Formulário'}
            </ModalTitle>
          </ModalHeader>
          <div className="p-6">
            <FormBuilder
              form={selectedForm ? getFormById(selectedForm) : undefined}
              onSubmit={viewMode === 'create' ? handleCreateForm : handleUpdateForm}
              onCancel={() => {
                setShowFormBuilder(false);
                setSelectedForm(null);
                setViewMode('list');
              }}
            />
          </div>
        </ModalContent>
      </Modal>
      </main>
    </div>
  );
}
