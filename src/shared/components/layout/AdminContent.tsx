'use client'

import React, { useState } from 'react'
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Textarea } from '@/shared/components/ui/Textarea'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { useSystemSettings, SystemSettingsData } from '@/modules/admin/hooks/useSystemSettings'
import { useUsers, User } from '@/modules/admin/hooks/useUsers'
import { useAdminStats } from '@/modules/admin/hooks/useAdminStats'
import { UserEditModal } from '@/modules/admin/components/UserEditModal'
import { AdminGuard } from '@/shared/components/AdminGuard'

export function AdminContent() {
  const { currentSection } = useNavigation()
  const { settings, isLoading, isSaving, saveSocialLinks, saveContactInfo, savePlans } = useSystemSettings()
  const { stats, recentActivity, isLoading: statsLoading } = useAdminStats()
  
  // Estados para gerenciamento de usuários
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { 
    users, 
    total, 
    page, 
    totalPages, 
    isLoading: usersLoading, 
    error: usersError,
    loadUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole
  } = useUsers({
    search: searchTerm,
    role: selectedRole,
    status: selectedStatus
  })

  // Estados para formulários
  const [socialLinksForm, setSocialLinksForm] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: ''
  })

  const [contactInfoForm, setContactInfoForm] = useState({
    email: '',
    phone: '',
    address: ''
  })

  const [plansForm, setPlansForm] = useState<Array<{
    name: string
    price: number
    features: string[]
  }>>([])


  // Carregar dados nos formulários quando as configurações forem carregadas
  React.useEffect(() => {
    if (settings) {
      setSocialLinksForm(settings.socialLinks)
      setContactInfoForm(settings.contactInfo)
      setPlansForm(settings.plans)
    }
  }, [settings])

  const renderAdminDashboard = () => {
    if (statsLoading) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-gray-600 dark:text-gray-400">Carregando dados do sistema...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    if (!stats) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-gray-600 dark:text-gray-400">Painel de controle do sistema</p>
          </div>
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum dado disponível</h3>
              <p className="text-sm mb-4">Não foi possível carregar as estatísticas do sistema.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-gray-600 dark:text-gray-400">Panorama geral do sistema</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.users.growth > 0 ? `+${stats.users.growth}% em relação ao mês passado` : 'Dados históricos não disponíveis'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.active.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.users.active / stats.users.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.links.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.links.active.toLocaleString()} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.revenue.monthly > 0 ? `R$ ${stats.revenue.monthly.toLocaleString()}` : 'R$ 0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.revenue.monthly > 0 ? `+${stats.revenue.growth}% em relação ao mês passado` : 'Sistema de pagamento não implementado'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formulários</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.forms.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.forms.active} ativos • {stats.forms.leads} leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.links.clicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.links.growth > 0 ? `+${stats.links.growth}% este mês` : 'Dados históricos não disponíveis'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.analytics.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.analytics.pageViews.toLocaleString()} visualizações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenue.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.revenue.conversionRate > 0 ? `Bounce rate: ${stats.analytics.bounceRate}%` : 'Analytics não implementado'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição de Usuários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>Status dos usuários no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Ativos</span>
                  </div>
                  <span className="font-medium">{stats.users.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">Inativos</span>
                  </div>
                  <span className="font-medium">{stats.users.inactive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Suspensos</span>
                  </div>
                  <span className="font-medium">{stats.users.suspended}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-medium">{stats.users.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administradores</CardTitle>
              <CardDescription>Usuários com privilégios administrativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Super Administradores</span>
                  </div>
                  <span className="font-medium">{stats.users.superAdmins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Administradores</span>
                  </div>
                  <span className="font-medium">{stats.users.admins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Usuários Comuns</span>
                  </div>
                  <span className="font-medium">{stats.users.total - stats.users.admins - stats.users.superAdmins}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">
                        {activity.type === 'user_registered' && '👤'}
                        {activity.type === 'link_created' && '🔗'}
                        {activity.type === 'form_submitted' && '📝'}
                        {activity.type === 'payment_received' && '💰'}
                        {activity.type === 'user_login' && '🔑'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      {activity.user && (
                        <p className="text-xs text-muted-foreground">
                          {activity.user.name} • {activity.user.email}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhuma atividade recente encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSaveSocialLinks = async () => {
    await saveSocialLinks(socialLinksForm)
  }

  const handleSaveContactInfo = async () => {
    await saveContactInfo(contactInfoForm)
  }

  const handleSavePlans = async () => {
    await savePlans(plansForm)
  }

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações globais do sistema</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando configurações...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Links de Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Links de Redes Sociais</span>
              </CardTitle>
              <CardDescription>Configure os links das redes sociais que aparecem no footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input 
                    id="instagram" 
                    value={socialLinksForm.instagram}
                    onChange={(e) => setSocialLinksForm(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/suaconta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input 
                    id="facebook" 
                    value={socialLinksForm.facebook}
                    onChange={(e) => setSocialLinksForm(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/suaconta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input 
                    id="twitter" 
                    value={socialLinksForm.twitter}
                    onChange={(e) => setSocialLinksForm(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://twitter.com/suaconta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input 
                    id="linkedin" 
                    value={socialLinksForm.linkedin}
                    onChange={(e) => setSocialLinksForm(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/company/suaconta"
                  />
                </div>
              </div>
              <Button onClick={handleSaveSocialLinks} disabled={isSaving}>
                <Settings className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Informações de Contato</span>
              </CardTitle>
              <CardDescription>Configure as informações de contato que aparecem nas páginas públicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">E-mail de Contato</Label>
                  <Input 
                    id="admin-email" 
                    type="email"
                    value={contactInfoForm.email}
                    onChange={(e) => setContactInfoForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@seudominio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Telefone</Label>
                  <Input 
                    id="admin-phone" 
                    value={contactInfoForm.phone}
                    onChange={(e) => setContactInfoForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-address">Endereço Completo</Label>
                <Textarea 
                  id="admin-address" 
                  value={contactInfoForm.address}
                  onChange={(e) => setContactInfoForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, Número - Cidade, Estado"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveContactInfo} disabled={isSaving}>
                <Settings className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </CardContent>
          </Card>

          {/* Planos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Planos e Preços</span>
              </CardTitle>
              <CardDescription>Configure os planos disponíveis e seus preços</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plansForm.map((plan, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...plansForm]
                          newPlans[index].name = e.target.value
                          setPlansForm(newPlans)
                        }}
                        placeholder="Nome do plano"
                        className="font-medium"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const newPlans = [...plansForm]
                            newPlans[index].price = parseFloat(e.target.value) || 0
                            setPlansForm(newPlans)
                          }}
                          placeholder="0.00"
                          className="w-24 text-right font-bold"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const newPlans = plansForm.filter((_, i) => i !== index)
                            setPlansForm(newPlans)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newPlans = [...plansForm]
                              newPlans[index].features[featureIndex] = e.target.value
                              setPlansForm(newPlans)
                            }}
                            placeholder="Recurso do plano"
                            className="text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlans = [...plansForm]
                              newPlans[index].features = newPlans[index].features.filter((_, i) => i !== featureIndex)
                              setPlansForm(newPlans)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPlans = [...plansForm]
                          newPlans[index].features.push('')
                          setPlansForm(newPlans)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Recurso
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setPlansForm([...plansForm, { name: '', price: 0, features: [''] }])
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Plano
                </Button>
                <Button onClick={handleSavePlans} disabled={isSaving} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando Planos...' : 'Salvar Planos'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 dark:text-gray-400">Controle e gerencie todos os usuários do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Links Criados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((acc, user) => acc + (user.stats?.totalLinks || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nome, email ou username..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Button 
                  variant={selectedRole === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole('')}
                  size="sm"
                >
                  Todos os Roles
                </Button>
                <Button 
                  variant={selectedRole === 'USER' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(selectedRole === 'USER' ? '' : 'USER')}
                  size="sm"
                >
                  Usuários
                </Button>
                <Button 
                  variant={selectedRole === 'ADMIN' ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(selectedRole === 'ADMIN' ? '' : 'ADMIN')}
                  size="sm"
                >
                  Admins
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={selectedStatus === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('')}
                  size="sm"
                >
                  Todos
                </Button>
                <Button 
                  variant={selectedStatus === 'ACTIVE' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus(selectedStatus === 'ACTIVE' ? '' : 'ACTIVE')}
                  size="sm"
                >
                  Ativos
                </Button>
                <Button 
                  variant={selectedStatus === 'INACTIVE' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus(selectedStatus === 'INACTIVE' ? '' : 'INACTIVE')}
                  size="sm"
                >
                  Inativos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            {total > 0 ? `${total} usuário(s) encontrado(s)` : 'Nenhum usuário encontrado'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {usersError}
            </div>
          )}
          
          {usersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="space-y-4 min-w-[800px]">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-[750px]">
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          {user.emailVerified && (
                            <Badge variant="outline" className="text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span>{user.stats?.totalLinks || 0} links</span>
                          <span>{user.stats?.totalClicks || 0} cliques</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant={user.role === 'SUPER_ADMIN' ? 'destructive' : user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                        {user.role === 'SUPER_ADMIN' ? 'Super' : user.role === 'ADMIN' ? 'Admin' : 'User'}
                      </Badge>
                      <Badge variant={user.status === 'ACTIVE' ? 'default' : 'outline'} className="text-xs">
                        {user.status === 'ACTIVE' ? 'Ativo' : user.status === 'INACTIVE' ? 'Inativo' : user.status === 'SUSPENDED' ? 'Suspenso' : 'Pendente'}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'ACTIVE' ? 'Desativar usuário' : 'Ativar usuário'}
                          className="h-8 w-8 p-0"
                        >
                          {user.status === 'ACTIVE' ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditModalOpen(true)
                          }}
                          title="Editar usuário"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja deletar o usuário ${user.name}?`)) {
                              deleteUser(user.id)
                            }
                          }}
                          title="Deletar usuário"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              
                {users.length === 0 && !usersLoading && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700">
                Página {page} de {totalPages} ({total} usuários)
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadUsers({ page: page - 1 })}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => loadUsers({ page: page + 1 })}
                  disabled={page >= totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <UserEditModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUser(null)
        }}
        onSave={updateUser}
      />
    </div>
  )

  // Renderizar conteúdo baseado na seção atual
  return (
    <AdminGuard>
      {(() => {
        switch (currentSection) {
          case 'admin-settings':
            return renderSystemSettings()
          case 'admin-users':
            return renderUserManagement()
          default:
            return renderAdminDashboard()
        }
      })()}
    </AdminGuard>
  )
}
