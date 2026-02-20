import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Label } from '@/shared/components/ui/Label'
import { toast } from 'react-hot-toast'

type PlanBasicData = {
  name: string;
  price: number;
  description: string;
}

type PlanBasicDataArray = Array<PlanBasicData>;

/** Valores padrão (fallback local) – devem coincidir com o seed e a API */
const defaultPlans: PlanBasicDataArray = [
  { name: 'Gratuito', price: 0, description: 'Gratuito' },
  { name: 'Pro', price: 20, description: 'Pro' },
  { name: 'Business', price: 40, description: 'Business' },
]

export function PlanBasicSection() {
  const [plans, setPlans] = useState<PlanBasicData[]>(defaultPlans)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/system-settings/plans')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar planos')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setPlans(data.data)
      } else {
        setPlans(defaultPlans)
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
      toast.error('Erro ao carregar planos')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePriceChange = (index: number, value: string) => {
    const newPlans = [...plans]
    newPlans[index] = {
      ...newPlans[index],
      price: Number(value) || 0
    }
    setPlans(newPlans)
    setHasChanges(true)
  }

  const handleDescriptionChange = (index: number, value: string) => {
    const newPlans = [...plans]
    newPlans[index] = {
      ...newPlans[index],
      description: value
    }
    setPlans(newPlans)
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch('/api/admin/system-settings/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plans)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar planos')
      }

      const result = await response.json()

      if (result.success) {
        toast.success('Planos salvos com sucesso!')
        setHasChanges(false)
      } else {
        throw new Error(result.error || 'Erro ao salvar planos')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar planos')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas dos Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas dos Planos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {plans.map((plan, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold mb-2">{plan.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preço (R$)
                    </label>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      min={0}
                      step={0.01}
                      disabled={plan.name === 'Gratuito'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <Input
                      type="text"
                      value={plan.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
