'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { RevenueChartData, PlanPerformance } from '../hooks/useFinancialData'
import { TrendingUp, BarChart3, PieChart } from 'lucide-react'

interface FinancialChartsProps {
  chartData: RevenueChartData[]
  planPerformance: PlanPerformance[]
  isLoading?: boolean
}

export function FinancialCharts({ chartData, planPerformance, isLoading }: FinancialChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Gráfico de Receita Simples (mock)
  const renderRevenueChart = () => {
    const maxRevenue = Math.max(...chartData.map(d => d.revenue))
    // Limitar a 7 dias mais recentes para tornar mais compacto
    const recentData = chartData.slice(-7)
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Últimos 7 dias</h3>
          <div className="flex items-center text-green-600 dark:text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className="text-xs">+15.2%</span>
          </div>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentData.map((data, index) => {
            const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-12 text-muted-foreground text-xs">
                  {new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </div>
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-xs font-medium text-right">
                  R$ {data.revenue.toLocaleString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Gráfico de Performance dos Planos
  const renderPlanPerformance = () => {
    const totalRevenue = planPerformance.reduce((sum, plan) => sum + plan.revenue, 0)
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Performance por Plano</h3>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="text-sm">Total: R$ {totalRevenue.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {planPerformance.map((plan, index) => {
            const revenuePercentage = (plan.revenue / totalRevenue) * 100
            const colors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600']
            const color = colors[index % colors.length]
            
            return (
              <div key={plan.planId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${color} rounded-full`} />
                    <span className="font-medium">{plan.planName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {plan.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {plan.sales} vendas
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${revenuePercentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{revenuePercentage.toFixed(1)}% da receita</span>
                  <span className="text-green-600 dark:text-green-400">+{plan.growth.toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Receita */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-orange-400" />
            Receita Diária
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderRevenueChart()}
        </CardContent>
      </Card>

      {/* Performance dos Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-400" />
            Performance dos Planos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderPlanPerformance()}
        </CardContent>
      </Card>
    </div>
  )
}
