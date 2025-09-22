'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { useIntegrations } from '@/modules/integrations/hooks/useIntegrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Switch } from '@/shared/components/ui/Switch'
import { WebhookEventsInfo } from '@/shared/components/ui/WebhookEventsInfo'
// import { Textarea } from '@/shared/components/ui/Textarea' // Componente não existe
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select' // Componente não existe
// Ícones removidos - agora usando sidebar principal

type SettingsSection = 'profile' | 'notifications' | 'appearance' | 'security' | 'integrations' | 'danger'

export function SettingsContent() {
  const { data: session } = useSession()
  const { currentSection, setCurrentSection } = useNavigation()
  const { 
    integrationSettings, 
    isLoading: integrationsLoading, 
    isSaving: integrationsSaving,
    saveIntegrationSettings,
    updateIntegrationSetting,
    testWebhook 
  } = useIntegrations()
  
  // Determinar a seção ativa baseada na navegação
  const getActiveSection = (): SettingsSection => {
    switch (currentSection) {
      case 'settings-profile':
        return 'profile'
      case 'settings-notifications':
        return 'notifications'
      case 'settings-appearance':
        return 'appearance'
      case 'settings-security':
        return 'security'
      case 'settings-integrations':
        return 'integrations'
      case 'settings-danger':
        return 'danger'
      default:
        return 'profile'
    }
  }
  
  const [activeSection, setActiveSection] = useState<SettingsSection>(getActiveSection())
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    username: session?.user?.username || '',
    bio: '',
    website: '',
    location: ''
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    newLeads: true,
    linkClicks: false,
    formSubmissions: true
  })

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY'
  })

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false
  })

  // Integrations state - agora gerenciado pelo hook useIntegrations

  useEffect(() => {
    // Carregar dados do usuário quando a sessão estiver disponível
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        username: session.user.username || '',
        bio: '',
        website: '',
        location: ''
      })
    }
  }, [session])

  useEffect(() => {
    // Atualizar seção ativa quando a navegação mudar
    setActiveSection(getActiveSection())
  }, [currentSection])

  const handleSaveProfile = async () => {
    try {
      // Implementar salvamento do perfil
      console.log('Salvando perfil:', profileData)
      alert('Perfil salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil')
    }
  }

  const handleSaveNotifications = async () => {
    try {
      // Implementar salvamento das notificações
      console.log('Salvando notificações:', notifications)
      alert('Configurações de notificação salvas!')
    } catch (error) {
      console.error('Erro ao salvar notificações:', error)
      alert('Erro ao salvar notificações')
    }
  }

  const handleSaveAppearance = async () => {
    try {
      // Implementar salvamento da aparência
      console.log('Salvando aparência:', appearance)
      alert('Configurações de aparência salvas!')
    } catch (error) {
      console.error('Erro ao salvar aparência:', error)
      alert('Erro ao salvar aparência')
    }
  }

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    
    try {
      // Implementar alteração de senha
      console.log('Alterando senha')
      alert('Senha alterada com sucesso!')
      setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      alert('Erro ao alterar senha')
    }
  }

  const handleSaveIntegrations = async () => {
    await saveIntegrationSettings(integrationSettings)
  }

  const handleTestWebhook = async () => {
    await testWebhook()
  }

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível!')) {
      // Implementar exclusão da conta
      console.log('Deletando conta')
      alert('Conta deletada com sucesso!')
    }
  }

  // Removido settingsSections - agora usando sidebar principal

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Informações Pessoais</h3>
        <p className="text-gray-600">Atualize suas informações pessoais</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <Label htmlFor="username">Nome de usuário</Label>
          <Input
            id="username"
            value={profileData.username}
            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
            placeholder="seu-usuario"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={profileData.website}
            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
            placeholder="https://seusite.com"
          />
        </div>
        <div>
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={profileData.location}
            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            placeholder="São Paulo, SP"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="bio">Biografia</Label>
        <textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
          placeholder="Conte um pouco sobre você..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>
      
      <Button onClick={handleSaveProfile}>Salvar Perfil</Button>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Notificação</h3>
        <p className="text-gray-600">Configure como você quer ser notificado</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications">Notificações por Email</Label>
            <p className="text-sm text-gray-500">Receba emails sobre atividades importantes</p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="push-notifications">Notificações Push</Label>
            <p className="text-sm text-gray-500">Receba notificações no navegador</p>
          </div>
          <Switch
            id="push-notifications"
            checked={notifications.push}
            onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
            <p className="text-sm text-gray-500">Receba um resumo semanal do desempenho</p>
          </div>
          <Switch
            id="weekly-reports"
            checked={notifications.weekly}
            onCheckedChange={(checked) => setNotifications({...notifications, weekly: checked})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="new-leads">Novos Leads</Label>
            <p className="text-sm text-gray-500">Seja notificado quando novos leads forem capturados</p>
          </div>
          <Switch
            id="new-leads"
            checked={notifications.newLeads}
            onCheckedChange={(checked) => setNotifications({...notifications, newLeads: checked})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="link-clicks">Cliques em Links</Label>
            <p className="text-sm text-gray-500">Seja notificado sobre cliques nos seus links</p>
          </div>
          <Switch
            id="link-clicks"
            checked={notifications.linkClicks}
            onCheckedChange={(checked) => setNotifications({...notifications, linkClicks: checked})}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="form-submissions">Submissões de Formulário</Label>
            <p className="text-sm text-gray-500">Seja notificado sobre novas submissões</p>
          </div>
          <Switch
            id="form-submissions"
            checked={notifications.formSubmissions}
            onCheckedChange={(checked) => setNotifications({...notifications, formSubmissions: checked})}
          />
        </div>
      </div>
      
      <Button onClick={handleSaveNotifications}>Salvar Notificações</Button>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Aparência</h3>
        <p className="text-gray-600">Personalize a aparência do seu painel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="theme">Tema</Label>
          <select
            id="theme"
            value={appearance.theme}
            onChange={(e) => setAppearance({...appearance, theme: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="system">Sistema</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="language">Idioma</Label>
          <select
            id="language"
            value={appearance.language}
            onChange={(e) => setAppearance({...appearance, language: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="timezone">Fuso Horário</Label>
          <select
            id="timezone"
            value={appearance.timezone}
            onChange={(e) => setAppearance({...appearance, timezone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">Nova York (GMT-5)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="date-format">Formato de Data</Label>
          <select
            id="date-format"
            value={appearance.dateFormat}
            onChange={(e) => setAppearance({...appearance, dateFormat: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
      
      <Button onClick={handleSaveAppearance}>Salvar Aparência</Button>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Segurança da Conta</h3>
        <p className="text-gray-600">Gerencie a segurança da sua conta</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="current-password">Senha Atual</Label>
          <Input
            id="current-password"
            type="password"
            value={security.currentPassword}
            onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
            placeholder="Digite sua senha atual"
          />
        </div>
        <div>
          <Label htmlFor="new-password">Nova Senha</Label>
          <Input
            id="new-password"
            type="password"
            value={security.newPassword}
            onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
            placeholder="Digite sua nova senha"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
          <Input
            id="confirm-password"
            type="password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
            placeholder="Confirme sua nova senha"
          />
        </div>
        <Button onClick={handleChangePassword} variant="outline">Alterar Senha</Button>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
          </div>
          <Switch
            id="two-factor"
            checked={security.twoFactor}
            onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
          />
        </div>
      </div>
    </div>
  )

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Integrações</h3>
        <p className="text-gray-600">Conecte com outras ferramentas e serviços</p>
      </div>
      
      {integrationsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Carregando configurações...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Google Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Google Analytics</CardTitle>
              <CardDescription>
                Configure o rastreamento do Google Analytics para suas páginas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="google-analytics">ID de Rastreamento</Label>
                <Input
                  id="google-analytics"
                  value={integrationSettings.googleAnalytics || ''}
                  onChange={(e) => updateIntegrationSetting('googleAnalytics', e.target.value)}
                  placeholder="UA-XXXXXXXXX-X ou G-XXXXXXXXXX"
                />
                <p className="text-sm text-gray-500">
                  Formato: UA-XXXXXXXXX-X (Universal Analytics) ou G-XXXXXXXXXX (Google Analytics 4)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Facebook Pixel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facebook Pixel</CardTitle>
              <CardDescription>
                Configure o Facebook Pixel para rastreamento de conversões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="facebook-pixel">Pixel ID</Label>
                <Input
                  id="facebook-pixel"
                  value={integrationSettings.facebookPixel || ''}
                  onChange={(e) => updateIntegrationSetting('facebookPixel', e.target.value)}
                  placeholder="123456789012345"
                />
                <p className="text-sm text-gray-500">
                  ID numérico do seu Facebook Pixel (15-16 dígitos)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Webhook */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Webhook</CardTitle>
              <CardDescription>
                Configure um webhook para receber notificações de novos leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    value={integrationSettings.webhookUrl || ''}
                    onChange={(e) => updateIntegrationSetting('webhookUrl', e.target.value)}
                    placeholder="https://seu-servidor.com/webhook"
                  />
                  <p className="text-sm text-gray-500">
                    URL completa onde os dados dos leads serão enviados
                  </p>
                </div>
                
                {integrationSettings.webhookUrl && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleTestWebhook}
                    >
                      Testar Webhook
                    </Button>
                    <p className="text-xs text-gray-500 self-center">
                      Teste se o webhook está funcionando
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações sobre Webhooks */}
          <WebhookEventsInfo />

          {/* 2Captcha */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">2Captcha</CardTitle>
              <CardDescription>
                Configure a chave da API do 2Captcha para resolução automática de captchas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="captcha-key">Chave da API</Label>
                <Input
                  id="captcha-key"
                  type="password"
                  value={integrationSettings.captchaKey || ''}
                  onChange={(e) => updateIntegrationSetting('captchaKey', e.target.value)}
                  placeholder="Sua chave da API do 2Captcha"
                />
                <p className="text-sm text-gray-500">
                  Chave secreta da API do 2Captcha para resolução automática
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleSaveIntegrations}
              disabled={integrationsSaving}
            >
              {integrationsSaving ? 'Salvando...' : 'Salvar Integrações'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const renderDangerSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-600">Zona de Perigo</h3>
        <p className="text-gray-600">Ações irreversíveis para sua conta</p>
      </div>
      
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Deletar Conta</CardTitle>
          <CardDescription>
            Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-100"
            onClick={handleDeleteAccount}
          >
            Deletar Conta Permanentemente
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Configurações</h2>
        <p className="text-gray-600">Gerencie suas preferências e configurações</p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {activeSection === 'profile' && renderProfileSection()}
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'appearance' && renderAppearanceSection()}
          {activeSection === 'security' && renderSecuritySection()}
          {activeSection === 'integrations' && renderIntegrationsSection()}
          {activeSection === 'danger' && renderDangerSection()}
        </CardContent>
      </Card>
    </div>
  )
}
