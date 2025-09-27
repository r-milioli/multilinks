import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Lock, Zap } from 'lucide-react'

interface PlanFeatureAccessProps {
  feature: string
  message: string
  className?: string
}

export function PlanFeatureAccess({
  feature,
  message,
  className = ''
}: PlanFeatureAccessProps) {
  return (
    <Card className={`bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-purple-800 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              {feature}
            </h3>
            <p className="text-sm text-purple-600">
              {message}
            </p>
          </div>
          <Link href="/pricing" className="shrink-0">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Fazer Upgrade
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
