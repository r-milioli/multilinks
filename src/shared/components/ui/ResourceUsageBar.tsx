import React from 'react'
import { Progress } from '@/shared/components/ui/Progress'
import { formatLimit, isUnlimited } from '@/shared/utils/planLimits'

interface ResourceUsageBarProps {
  resource: string
  current: number
  limit: number
  showLabel?: boolean
  className?: string
}

export function ResourceUsageBar({
  resource,
  current,
  limit,
  showLabel = true,
  className = ''
}: ResourceUsageBarProps) {
  // Se for ilimitado, mostra barra cheia em verde
  if (isUnlimited(limit)) {
    return (
      <div className={`space-y-1 ${className}`}>
        {showLabel && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{resource}</span>
            <span className="text-green-600">Ilimitado</span>
          </div>
        )}
        <Progress value={100} className="bg-green-100" indicatorClassName="bg-green-500" />
      </div>
    )
  }

  // Calcular porcentagem
  const percentage = Math.min(Math.round((current / limit) * 100), 100)
  
  // Determinar cor baseada no uso
  const getColorClasses = () => {
    if (percentage >= 90) {
      return {
        text: 'text-red-600',
        bg: 'bg-red-100',
        indicator: 'bg-red-500'
      }
    }
    if (percentage >= 75) {
      return {
        text: 'text-orange-600',
        bg: 'bg-orange-100',
        indicator: 'bg-orange-500'
      }
    }
    return {
      text: 'text-blue-600',
      bg: 'bg-blue-100',
      indicator: 'bg-blue-500'
    }
  }

  const colors = getColorClasses()

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{resource}</span>
          <span className={colors.text}>
            {current} / {formatLimit(limit)}
          </span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className={colors.bg}
        indicatorClassName={colors.indicator}
      />
    </div>
  )
}
