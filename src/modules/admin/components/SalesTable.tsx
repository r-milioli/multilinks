'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal,
  Calendar,
  CreditCard,
  User
} from 'lucide-react'
import { SalesData } from '../hooks/useFinancialData'

interface SalesTableProps {
  sales: SalesData[]
  isLoading?: boolean
}

export function SalesTable({ sales, isLoading }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
    const matchesPlan = planFilter === 'all' || sale.planId === planFilter
    
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: 'bg-green-500', text: 'Pago' },
      pending: { color: 'bg-yellow-500', text: 'Pendente' },
      failed: { color: 'bg-red-500', text: 'Falhou' },
      refunded: { color: 'bg-gray-500', text: 'Reembolsado' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    )
  }

  const getPlanBadge = (planId: string) => {
    const planConfig = {
      free: { color: 'bg-gray-600', text: 'Gratuito' },
      pro: { color: 'bg-blue-600', text: 'Pro' },
      business: { color: 'bg-purple-600', text: 'Business' }
    }
    
    const config = planConfig[planId as keyof typeof planConfig] || planConfig.free
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
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
        <div className="flex items-center justify-between">
          <CardTitle>Histórico de Vendas</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou ID do pagamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="failed">Falhou</option>
            <option value="refunded">Reembolsado</option>
          </select>
          
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos os Planos</option>
            <option value="free">Gratuito</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plano</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pagamento</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Data</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{sale.userName}</div>
                      <div className="text-muted-foreground text-sm">{sale.userEmail}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getPlanBadge(sale.planId)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">
                      {formatCurrency(sale.amount)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(sale.status)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-muted-foreground">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {sale.paymentMethod}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-muted-foreground text-sm">
                      {formatDate(sale.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">Nenhuma venda encontrada</div>
            <div className="text-muted-foreground text-sm">
              {searchTerm || statusFilter !== 'all' || planFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há vendas registradas ainda'
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
