'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { useForms } from '@/modules/forms/hooks/useForms'
import { useFormStats } from '@/modules/forms/hooks/useFormStats'
import { FormBuilder } from '@/modules/forms/components/FormBuilder'
import { LeadsDashboard } from '@/modules/forms/components/LeadsDashboard'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/ui/Modal'
import { Loading } from '@/shared/components/ui/Loading'
import { Plus, FileText, BarChart3 } from 'lucide-react'
import { useNavigation } from '@/shared/contexts/NavigationContext'

type ViewMode = 'list' | 'create' | 'edit' | 'leads'

export function FormsListContent() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { setCurrentSection } = useNavigation()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [showFormBuilder, setShowFormBuilder] = useState(false)

  const {
    forms,
    loading,
    createForm,
    updateForm,
    deleteForm,
    getFormById,
  } = useForms()

  const formIds = forms.map(form => form.id)
  const { getFormStats: getFormStatsFromHook, refreshStats } = useFormStats(formIds)

  // Atualizar estatísticas quando a página ganha foco
  useEffect(() => {
    const handleFocus = () => {
      refreshStats()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshStats])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading className="w-8 h-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleCreateForm = async (formData: any) => {
    try {
      await createForm(formData)
      setShowFormBuilder(false)
      setViewMode('list')
      setCurrentSection('forms-list')
    } catch (error) {
      console.error('Erro ao criar formulário:', error)
    }
  }

  const handleUpdateForm = async (formData: any) => {
    if (!selectedForm) return
    
    try {
      await updateForm(selectedForm, formData)
      setShowFormBuilder(false)
      setViewMode('list')
      setSelectedForm(null)
      setCurrentSection('forms-list')
    } catch (error) {
      console.error('Erro ao atualizar formulário:', error)
    }
  }

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este formulário?')) {
      return
    }

    try {
      await deleteForm(id)
    } catch (error) {
      console.error('Erro ao deletar formulário:', error)
    }
  }

  const handleEditForm = (id: string) => {
    setSelectedForm(id)
    setShowFormBuilder(true)
    setViewMode('edit')
  }

  const handleCreateNew = () => {
    setSelectedForm(null)
    setShowFormBuilder(true)
    setViewMode('create')
    setCurrentSection('forms-create')
  }

  const getFormStats = (form: any) => {
    return getFormStatsFromHook(form.id)
  }

  if (viewMode === 'leads') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Leads Capturados</h2>
          <Button onClick={() => setViewMode('list')}>
            Voltar para Formulários
          </Button>
        </div>
        <LeadsDashboard forms={forms} />
      </div>
    )
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {viewMode === 'create' ? 'Criar Formulário' : 'Editar Formulário'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowFormBuilder(false)
            setViewMode('list')
            setCurrentSection('forms-list')
          }}>
            Voltar
          </Button>
        </div>
        <FormBuilder
          form={selectedForm ? getFormById(selectedForm) : undefined}
          onSubmit={selectedForm ? handleUpdateForm : handleCreateForm}
          onCancel={() => {
            setShowFormBuilder(false)
            setViewMode('list')
            setCurrentSection('forms-list')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Formulários</h2>
          <p className="text-gray-600">Gerencie seus formulários de captura</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode('leads')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Leads
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Formulário
          </Button>
        </div>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum formulário criado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando seu primeiro formulário de captura
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Formulário
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => {
            const stats = getFormStats(form)
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
                    <div className="text-2xl font-bold text-blue-600">{stats.totalLeads}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.leadsToday}</div>
                    <div className="text-xs text-gray-500">Hoje</div>
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
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    Deletar
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
