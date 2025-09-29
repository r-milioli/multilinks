'use client'

import { FormBuilder } from '@/modules/forms/components/FormBuilder'
import { useForms } from '@/modules/forms/hooks/useForms'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { usePlanLimits } from '@/shared/hooks/usePlanLimits'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'

export function FormsCreateContent() {
  const { createForm } = useForms()
  const { setCurrentSection } = useNavigation()
  const { canCreateForm, plan } = usePlanLimits()

  const handleCreateForm = async (formData: any) => {
    try {
      await createForm(formData)
      setCurrentSection('forms-list')
    } catch (error) {
      console.error('Erro ao criar formulário:', error)
    }
  }

  const handleCancel = () => {
    setCurrentSection('forms-list')
  }

  // Se não pode criar formulários, mostrar mensagem de bloqueio
  if (!canCreateForm()) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Criar Formulário</h2>
        </div>
        
        <Card className="p-8 text-center border-orange-200 bg-orange-50">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-800">Formulários Bloqueados</h3>
              <p className="text-orange-600">Formulários disponíveis apenas no PRO</p>
            </div>
          </div>
          
          <p className="text-orange-700 mb-6 max-w-md mx-auto">
            Faça upgrade para capturar leads e criar formulários de contato personalizados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Fazer Upgrade
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentSection('forms-list')}
              className="border-orange-300 text-orange-700"
            >
              Voltar para Lista
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Criar Formulário</h2>
      </div>
      
      <FormBuilder
        onSubmit={handleCreateForm}
        onCancel={handleCancel}
      />
    </div>
  )
}
