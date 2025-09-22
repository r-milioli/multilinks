'use client'

import { FormBuilder } from '@/modules/forms/components/FormBuilder'
import { useForms } from '@/modules/forms/hooks/useForms'
import { useNavigation } from '@/shared/contexts/NavigationContext'

export function FormsCreateContent() {
  const { createForm } = useForms()
  const { setCurrentSection } = useNavigation()

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
