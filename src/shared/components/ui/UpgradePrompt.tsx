import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { ArrowRight, Zap } from 'lucide-react'
import { formatLimit } from '@/shared/utils/planLimits'

interface UpgradePromptProps {
  resource: string
  current: number
  limit: number
  message?: string
  suggestedPlan?: string
  className?: string
}

export function UpgradePrompt({
  resource,
  current,
  limit,
  message,
  suggestedPlan = 'PRO',
  className = ''
}: UpgradePromptProps) {
  return (
    <Card className={`bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-orange-800">
              Limite de {resource} atingido
            </h3>
            <p className="text-sm text-orange-600">
              {message || `Você usou ${current} de ${formatLimit(limit)} ${resource} disponíveis`}
            </p>
          </div>
          <Link href="/pricing" className="shrink-0">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Fazer Upgrade
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
