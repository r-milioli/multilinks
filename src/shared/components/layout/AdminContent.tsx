'use client'

import { useState } from 'react'
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
  Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Textarea } from '@/shared/components/ui/Textarea'
import { useNavigation } from '@/shared/contexts/NavigationContext'

export function AdminContent() {
  const { currentSection } = useNavigation()

  // Mock data para demonstração
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 1089,
    totalLinks: 8943,
    totalForms: 234,
    monthlyRevenue: 12450,
    conversionRate: 12.5
  }

  const recentUsers = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'USER', status: 'active', joinedAt: '2024-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'ADMIN', status: 'active', joinedAt: '2024-01-14' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'USER', status: 'inactive', joinedAt: '2024-01-13' },
  ]

  const systemSettings = {
    socialLinks: {
      instagram: 'https://instagram.com/multilink',
      facebook: 'https://facebook.com/multilink',
      twitter: 'https://twitter.com/multilink',
      linkedin: 'https://linkedin.com/company/multilink'
    },
    plans: [
      { name: 'Gratuito', price: 0, features: ['5 links', '1 formulário'] },
      { name: 'Pro', price: 29.90, features: ['Links ilimitados', 'Formulários ilimitados'] },
      { name: 'Business', price: 99.90, features: ['Tudo do Pro', 'Analytics avançado'] }
    ],
    contactInfo: {
      email: 'contato@multilink.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo, SP'
    }
  }

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administração</h1>
        <p className="text-gray-600 dark:text-gray-400">Painel de controle do sistema</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((systemStats.activeUsers / systemStats.totalUsers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {systemStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usuários Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Recentes</CardTitle>
          <CardDescription>Últimos usuários cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                    {user.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h1>
        <p className="text-gray-600 dark:text-gray-400">Gerencie as configurações globais do sistema</p>
      </div>

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
                defaultValue={systemSettings.socialLinks.instagram}
                placeholder="https://instagram.com/suaconta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input 
                id="facebook" 
                defaultValue={systemSettings.socialLinks.facebook}
                placeholder="https://facebook.com/suaconta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter" 
                defaultValue={systemSettings.socialLinks.twitter}
                placeholder="https://twitter.com/suaconta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin" 
                defaultValue={systemSettings.socialLinks.linkedin}
                placeholder="https://linkedin.com/company/suaconta"
              />
            </div>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Salvar Configurações
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
                defaultValue={systemSettings.contactInfo.email}
                placeholder="contato@seudominio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-phone">Telefone</Label>
              <Input 
                id="admin-phone" 
                defaultValue={systemSettings.contactInfo.phone}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-address">Endereço Completo</Label>
            <Textarea 
              id="admin-address" 
              defaultValue={systemSettings.contactInfo.address}
              placeholder="Rua, Número - Cidade, Estado"
              rows={3}
            />
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Salvar Informações
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
            {systemSettings.plans.map((plan, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{plan.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">R$ {plan.price}</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Plano
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 dark:text-gray-400">Controle e gerencie todos os usuários do sistema</p>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Buscar por nome ou email..." />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Todos</Button>
              <Button variant="outline">Ativos</Button>
              <Button variant="outline">Inativos</Button>
              <Button variant="outline">Admins</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>Lista completa de usuários com opções de gerenciamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Cadastrado em: {user.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                    {user.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Renderizar conteúdo baseado na seção atual
  switch (currentSection) {
    case 'admin-settings':
      return renderSystemSettings()
    case 'admin-users':
      return renderUserManagement()
    default:
      return renderAdminDashboard()
  }
}
