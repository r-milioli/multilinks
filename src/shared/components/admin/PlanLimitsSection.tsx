import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Shield, Save, Undo, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { PlanLimitsCard } from './PlanLimitsCard'

interface PlanLimits {
  maxLinks: number
  maxForms: number
  maxWebhooks: number
  themeEditing: boolean
  analytics: boolean
  prioritySupport: boolean
}

interface PlanFeature {
  name: string
  free: boolean
  pro: boolean
  business: boolean
}

interface PlanFeatureCategory {
  category: string
  items: PlanFeature[]
}

const defaultLimits = {
  free: {
    maxLinks: 5,
    maxForms: 0,
    maxWebhooks: 0,
    themeEditing: true,
    analytics: false,
    prioritySupport: false
  },
  pro: {
    maxLinks: 15,
    maxForms: 5,
    maxWebhooks: 0,
    themeEditing: true,
    analytics: true,
    prioritySupport: true
  },
  business: {
    maxLinks: -1,
    maxForms: -1,
    maxWebhooks: 1,
    themeEditing: true,
    analytics: true,
    prioritySupport: true
  }
} as const

const defaultFeatures: PlanFeatureCategory[] = [
  {
    category: 'Gestão de Links',
    items: [
      { name: 'Links ilimitados', free: true, pro: true, business: true },
      { name: 'Drag & drop', free: true, pro: true, business: true }
    ]
  }
]

export function PlanLimitsSection() {
  const [limits, setLimits] = useState<Record<string, PlanLimits>>(defaultLimits)
  const [features, setFeatures] = useState<PlanFeatureCategory[]>(defaultFeatures)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [limitsResponse, featuresResponse] = await Promise.all([
          fetch('/api/admin/system-settings/plan-limits'),
          fetch('/api/admin/system-settings/plan-features')
        ])

        const [limitsData, featuresData] = await Promise.all([
          limitsResponse.json(),
          featuresResponse.json()
        ])

        if (limitsData.success) {
          setLimits(limitsData.data || defaultLimits)
        }

        if (featuresData.success) {
          setFeatures(featuresData.data || defaultFeatures)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast.error('Erro ao carregar configurações. Usando valores padrão.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpdate = (planId: string, newLimits: Partial<PlanLimits>) => {
    setLimits((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        ...newLimits
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Garantir que os números são realmente números
      const sanitizedLimits = Object.entries(limits).reduce((acc, [planId, planLimits]) => {
        acc[planId] = {
          maxLinks: Number(planLimits.maxLinks),
          maxForms: Number(planLimits.maxForms),
          maxWebhooks: Number(planLimits.maxWebhooks),
          themeEditing: Boolean(planLimits.themeEditing),
          analytics: Boolean(planLimits.analytics),
          prioritySupport: Boolean(planLimits.prioritySupport)
        }
        return acc
      }, {} as Record<string, PlanLimits>)

      console.log('📦 Dados a serem enviados:', sanitizedLimits)

      const [limitsResponse, featuresResponse] = await Promise.all([
        fetch('/api/admin/system-settings/plan-limits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedLimits)
        }),
        fetch('/api/admin/system-settings/plan-features', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(features)
        })
      ])

      if (!limitsResponse.ok) {
        const errorData = await limitsResponse.json()
        throw new Error(errorData.error || 'Erro ao salvar limites')
      }

      if (!featuresResponse.ok) {
        const errorData = await featuresResponse.json()
        throw new Error(errorData.error || 'Erro ao salvar recursos')
      }

      const [limitsResult, featuresResult] = await Promise.all([
        limitsResponse.json(),
        featuresResponse.json()
      ])

      if (limitsResult.success && featuresResult.success) {
        toast.success('Configurações salvas com sucesso!')
        setHasChanges(false)
      } else {
        throw new Error('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error(error.message || 'Erro ao salvar configurações. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setLimits(defaultLimits)
    setFeatures(defaultFeatures)
    setHasChanges(true)
    toast.success('Configurações resetadas para valores padrão')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Limites dos Planos</span>
          </CardTitle>
          <CardDescription>Carregando configurações...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Limites Numéricos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Limites dos Planos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isSaving || !hasChanges}
              >
                <Undo className="h-4 w-4 mr-2" />
                Resetar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Configure os limites de cada plano do sistema. Use -1 ou "Ilimitado" para recursos sem limite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(limits).map(([planId, planLimits]) => (
              <PlanLimitsCard
                key={planId}
                planId={planId}
                planName={planId.charAt(0).toUpperCase() + planId.slice(1)}
                limits={planLimits}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recursos por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recursos por Categoria</span>
            <Button onClick={() => {
              setFeatures(prev => [
                ...prev,
                {
                  category: 'Nova Categoria',
                  items: []
                }
              ])
              setHasChanges(true)
            }} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </CardTitle>
          <CardDescription>
            Configure os recursos disponíveis em cada plano, organizados por categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Input
                    value={category.category}
                    onChange={(e) => {
                      setFeatures(prev => {
                        const newFeatures = [...prev]
                        newFeatures[categoryIndex] = {
                          ...newFeatures[categoryIndex],
                          category: e.target.value
                        }
                        return newFeatures
                      })
                      setHasChanges(true)
                    }}
                    className="text-lg font-semibold"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFeatures(prev => prev.filter((_, index) => index !== categoryIndex))
                      setHasChanges(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Recurso</th>
                      <th className="text-center">Free</th>
                      <th className="text-center">Pro</th>
                      <th className="text-center">Business</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((feature, featureIndex) => (
                      <tr key={featureIndex}>
                        <td className="py-2">
                          <Input
                            value={feature.name}
                            onChange={(e) => {
                              setFeatures(prev => {
                                const newFeatures = [...prev]
                                newFeatures[categoryIndex].items[featureIndex] = {
                                  ...newFeatures[categoryIndex].items[featureIndex],
                                  name: e.target.value
                                }
                                return newFeatures
                              })
                              setHasChanges(true)
                            }}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={feature.free}
                            onChange={(e) => {
                              setFeatures(prev => {
                                const newFeatures = [...prev]
                                newFeatures[categoryIndex].items[featureIndex] = {
                                  ...newFeatures[categoryIndex].items[featureIndex],
                                  free: e.target.checked
                                }
                                return newFeatures
                              })
                              setHasChanges(true)
                            }}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={feature.pro}
                            onChange={(e) => {
                              setFeatures(prev => {
                                const newFeatures = [...prev]
                                newFeatures[categoryIndex].items[featureIndex] = {
                                  ...newFeatures[categoryIndex].items[featureIndex],
                                  pro: e.target.checked
                                }
                                return newFeatures
                              })
                              setHasChanges(true)
                            }}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={feature.business}
                            onChange={(e) => {
                              setFeatures(prev => {
                                const newFeatures = [...prev]
                                newFeatures[categoryIndex].items[featureIndex] = {
                                  ...newFeatures[categoryIndex].items[featureIndex],
                                  business: e.target.checked
                                }
                                return newFeatures
                              })
                              setHasChanges(true)
                            }}
                          />
                        </td>
                        <td className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFeatures(prev => {
                                const newFeatures = [...prev]
                                newFeatures[categoryIndex].items.splice(featureIndex, 1)
                                return newFeatures
                              })
                              setHasChanges(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFeatures(prev => {
                      const newFeatures = [...prev]
                      newFeatures[categoryIndex].items.push({
                        name: 'Novo recurso',
                        free: false,
                        pro: false,
                        business: false
                      })
                      return newFeatures
                    })
                    setHasChanges(true)
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Recurso
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}