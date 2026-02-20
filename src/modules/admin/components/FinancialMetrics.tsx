'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Percent,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { FinancialStats } from '../hooks/useFinancialData'

interface FinancialMetricsProps {
  stats: FinancialStats
  isLoading?: boolean
}

export function FinancialMetrics({ stats, isLoading }: FinancialMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="font-medium text-muted-foreground">Sem dados</p>
            <p className="text-sm text-muted-foreground mt-1">Não foi possível carregar as métricas financeiras.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: stats.growth.revenue,
      changeLabel: 'vs mês anterior',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: stats.growth.revenue,
      changeLabel: 'crescimento',
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Total de Vendas',
      value: stats.totalSales.toString(),
      change: stats.growth.sales,
      changeLabel: 'vendas',
      icon: ShoppingCart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Vendas Mensais',
      value: stats.monthlySales.toString(),
      change: stats.growth.sales,
      changeLabel: 'este mês',
      icon: ArrowUpRight,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    {
      title: 'Taxa de Conversão',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: stats.growth.conversion,
      changeLabel: 'conversões',
      icon: Percent,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${stats.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: 0,
      changeLabel: 'por venda',
      icon: CreditCard,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      title: 'Reembolsos',
      value: stats.refunds.toString(),
      change: -stats.refundRate,
      changeLabel: 'taxa de reembolso',
      icon: RefreshCw,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      title: 'Taxa de Reembolso',
      value: `${stats.refundRate.toFixed(1)}%`,
      change: 0,
      changeLabel: 'vs anterior',
      icon: TrendingDown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const isPositive = metric.change > 0
        const isNegative = metric.change < 0
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </div>
              <p className={`text-xs flex items-center ${
                isPositive ? 'text-green-600 dark:text-green-400' :
                isNegative ? 'text-red-600 dark:text-red-400' :
                'text-muted-foreground'
              }`}>
                {metric.change !== 0 && (
                  <>
                    {isPositive && <ArrowUpRight className="h-3 w-3 mr-1" />}
                    {isNegative && <ArrowDownRight className="h-3 w-3 mr-1" />}
                    <span>
                      {isPositive ? '+' : ''}{metric.change.toFixed(1)}% {metric.changeLabel}
                    </span>
                  </>
                )}
                {metric.change === 0 && (
                  <span className="text-muted-foreground">Sem dados</span>
                )}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
