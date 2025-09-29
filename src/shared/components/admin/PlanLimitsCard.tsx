import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Switch } from '@/shared/components/ui/Switch'
import { Shield } from 'lucide-react'

interface PlanLimits {
  maxLinks: number
  maxForms: number
  maxWebhooks: number
  themeEditing: boolean
  analytics: boolean
  prioritySupport: boolean
  price?: number // Novo campo
}

interface PlanLimitsCardProps {
  planId: string
  planName: string
  limits: PlanLimits
  onUpdate: (planId: string, limits: Partial<PlanLimits>) => void
}

export function PlanLimitsCard({ planId, planName, limits, onUpdate }: PlanLimitsCardProps) {
  const isUnlimited = (value: number): boolean => value === -1
  const formatLimit = (value: number): string => (isUnlimited(value) ? 'Ilimitado' : value.toString())

  const handleNumberChange = (field: keyof PlanLimits, value: string) => {
    const numValue = value.toLowerCase() === 'ilimitado' ? -1 : parseInt(value)
    if (!isNaN(numValue)) {
      onUpdate(planId, { [field]: numValue })
    }
  }

  const handlePriceChange = (value: string) => {
    // Remover caracteres não numéricos, exceto ponto decimal
    const cleanValue = value.replace(/[^\d.]/g, '')
    const numValue = parseFloat(cleanValue)
    if (!isNaN(numValue)) {
      onUpdate(planId, { price: numValue })
    }
  }

  const handleBooleanChange = (field: keyof PlanLimits, checked: boolean) => {
    onUpdate(planId, { [field]: checked })
  }

  const renderNumericInput = (field: keyof PlanLimits, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={`${planId}-${field}`}>{label}</Label>
      <Input
        id={`${planId}-${field}`}
        value={formatLimit(limits[field] as number)}
        onChange={(e) => handleNumberChange(field, e.target.value)}
        placeholder="Número ou 'Ilimitado'"
      />
    </div>
  )

  const renderFeatureToggle = (field: keyof PlanLimits, label: string) => (
    <div className="flex items-center justify-between">
      <Label htmlFor={`${planId}-${field}`}>{label}</Label>
      <Switch
        id={`${planId}-${field}`}
        checked={limits[field] as boolean}
        onCheckedChange={(checked) => handleBooleanChange(field, checked)}
      />
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Plano {planName}</span>
        </CardTitle>
        <CardDescription>Configure os limites deste plano</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">

          {/* Limites numéricos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderNumericInput('maxLinks', 'Máximo de Links')}
            {renderNumericInput('maxForms', 'Máximo de Formulários')}
            {renderNumericInput('maxWebhooks', 'Máximo de Webhooks')}
          </div>

          {/* Features booleanas */}
          <div className="space-y-4">
            {renderFeatureToggle('themeEditing', 'Edição de Tema')}
            {renderFeatureToggle('analytics', 'Analytics')}
            {renderFeatureToggle('prioritySupport', 'Suporte Prioritário')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}