'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { useIntegrations } from '@/modules/integrations/hooks/useIntegrations'
import { useNotifications } from '@/modules/notifications/hooks/useNotifications'
import { useSecurity } from '@/modules/security/hooks/useSecurity'
import { useAccount } from '@/modules/account/hooks/useAccount'
import { DeleteAccountModal } from '@/modules/account/components/DeleteAccountModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Switch } from '@/shared/components/ui/Switch'
import { Textarea } from '@/shared/components/ui/Textarea'
import { WebhookEventsInfo } from '@/shared/components/ui/WebhookEventsInfo'
import { ThemeEditorContent } from './ThemeEditorContent'
import { SocialLinksEditor } from '@/modules/profile/components/SocialLinksEditor'
import { LegalLinksSettingsComponent } from '@/modules/profile/components/LegalLinksSettings'
import { LegalLinksSettings } from '@/types/profile.types'
import { toast } from 'react-hot-toast'
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

  const {
    notificationSettings,
    isLoading: notificationsLoading,
    isSaving: notificationsSaving,
    saveNotificationSettings,
    updateNotificationSetting
  } = useNotifications()

  const {
    changePassword,
    getActiveSessions,
    terminateSession,
    isLoading: securityLoading,
    error: securityError
  } = useSecurity()

  const {
    deleteAccount,
    isLoading: accountLoading,
    error: accountError
  } = useAccount()
  
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
    username: (session?.user as any)?.username || '',
    bio: '',
    title: ''
  })

  // Legal Links state
  const [legalLinksSettings, setLegalLinksSettings] = useState<LegalLinksSettings>({
    showLegalLinks: false,
    showPrivacyPolicy: true,
    showTermsOfService: true,
    showContact: true,
    customFooterText: '',
    linksPosition: 'bottom'
  })

  // Notifications state - agora gerenciado pelo hook useNotifications

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    // Configurações de fonte
    fontFamily: 'Inter',
    fontSize: 'medium',
    fontWeight: 'normal',
    // Configurações de cores
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    // Configurações de layout
    sidebarWidth: 'default',
    headerHeight: 'default',
    borderRadius: 'medium',
    spacing: 'comfortable',
    // Configurações de animações
    animations: true,
    transitions: true,
    // Templates
    template: 'modern',
    // Configurações avançadas
    customCSS: '',
    customJS: '',
    // Configurações de páginas públicas
    publicPageStyle: 'default',
    publicPageColors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      background: '#FFFFFF',
      text: '#111827'
    },
    publicPageFont: {
      family: 'Inter',
      size: 'medium'
    }
  })

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false
  })

  // Active sessions state
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Integrations state - agora gerenciado pelo hook useIntegrations

  useEffect(() => {
    // Carregar dados do usuário quando a sessão estiver disponível
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        username: (session.user as any)?.username || '',
        bio: '',
        title: ''
      })
    }
  }, [session])

  useEffect(() => {
    // Atualizar seção ativa quando a navegação mudar
    setActiveSection(getActiveSection())
  }, [currentSection])

  useEffect(() => {
    // Carregar sessões ativas quando a seção de segurança for ativada
    if (activeSection === 'security') {
      loadActiveSessions()
    }
  }, [activeSection])

  // Carregar dados do perfil quando o componente for montado
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        console.log('🔄 Carregando dados do perfil...')
        const response = await fetch('/api/user/profile')
        const result = await response.json()
        
        console.log('📥 Resposta da API:', result)
        
        if (result.success && result.data) {
          setProfileData({
            name: result.data.name || '',
            email: result.data.email || '',
            username: result.data.username || '',
            bio: result.data.bio || '',
            title: result.data.title || ''
          })
          
          // Carregar configurações de links legais se existirem
          if (result.data.legalLinksSettings) {
            console.log('🔗 Carregando configurações de links legais:', result.data.legalLinksSettings)
            setLegalLinksSettings(result.data.legalLinksSettings)
          } else {
            console.log('⚠️ Nenhuma configuração de links legais encontrada')
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do perfil:', error)
      }
    }

    if ((session?.user as any)?.id) {
      loadProfileData()
    }
  }, [(session?.user as any)?.id])

  const handleSaveProfile = async () => {
    try {
      console.log('Salvando perfil:', profileData)
      console.log('Salvando configurações de links legais:', legalLinksSettings)
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          title: profileData.title,
          legalLinksSettings
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Perfil salvo com sucesso:', result.data)
        toast.success('Perfil salvo com sucesso!')
      } else {
        console.error('❌ Erro ao salvar perfil:', result.error)
        toast.error(`Erro ao salvar perfil: ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar perfil')
    }
  }

  const handleSaveNotifications = async () => {
    try {
      console.log('Salvando notificações:', notificationSettings)
      const result = await saveNotificationSettings(notificationSettings)
      
      if (result.success) {
        toast.success('Configurações de notificação salvas!')
      } else {
        toast.error(result.error || 'Erro ao salvar notificações')
      }
    } catch (error) {
      console.error('Erro ao salvar notificações:', error)
      toast.error('Erro ao salvar notificações')
    }
  }

  const handleSaveAppearance = async () => {
    try {
      // Implementar salvamento da aparência
      console.log('Salvando aparência:', appearance)
      toast.success('Configurações de aparência salvas!')
    } catch (error) {
      console.error('Erro ao salvar aparência:', error)
      toast.error('Erro ao salvar aparência')
    }
  }

  const handleChangePassword = async () => {
    const result = await changePassword({
      currentPassword: security.currentPassword,
      newPassword: security.newPassword,
      confirmPassword: security.confirmPassword
    })

    if (result.success) {
      toast.success('Senha alterada com sucesso!')
      setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      toast.error(result.error || 'Erro ao alterar senha')
    }
  }

  const handleSaveIntegrations = async () => {
    await saveIntegrationSettings(integrationSettings)
  }

  const handleTestWebhook = async () => {
    await testWebhook()
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async (password: string, confirmText: string) => {
    const result = await deleteAccount(password, confirmText)
    if (result.success) {
      setShowDeleteModal(false)
      // O hook já faz o logout e redirecionamento
    }
  }

  const loadActiveSessions = async () => {
    setSessionsLoading(true)
    try {
      const sessions = await getActiveSessions()
      setActiveSessions(sessions)
    } catch (error) {
      console.error('Erro ao carregar sessões:', error)
      toast.error('Erro ao carregar sessões ativas')
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    if (confirm('Tem certeza que deseja encerrar esta sessão?')) {
      const result = await terminateSession(sessionId)
      if (result.success) {
        toast.success('Sessão encerrada com sucesso!')
        loadActiveSessions() // Recarregar lista
      } else {
        toast.error(result.error || 'Erro ao encerrar sessão')
      }
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
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={profileData.title}
            onChange={(e) => setProfileData({...profileData, title: e.target.value})}
            placeholder="Desenvolvedor, Designer, Empreendedor..."
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
      
      {/* Links Sociais */}
      <div className="mt-8">
        <SocialLinksEditor />
      </div>
      
      {/* Links Legais */}
      <div className="mt-8">
        <LegalLinksSettingsComponent 
          settings={legalLinksSettings}
          onUpdate={(settings) => {
            setLegalLinksSettings(settings)
          }}
        />
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Configurações de Notificação</h3>
        <p className="text-gray-600">Configure como você quer ser notificado</p>
      </div>
      
      {notificationsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <p className="text-sm text-gray-500">Receba emails sobre atividades importantes</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-gray-500">Receba notificações no navegador</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
              <p className="text-sm text-gray-500">Receba um resumo semanal do desempenho</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={notificationSettings.weeklyReport}
              onCheckedChange={(checked) => updateNotificationSetting('weeklyReport', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-followers">Novos Seguidores</Label>
              <p className="text-sm text-gray-500">Seja notificado quando alguém seguir seu perfil</p>
            </div>
            <Switch
              id="new-followers"
              checked={notificationSettings.newFollower}
              onCheckedChange={(checked) => updateNotificationSetting('newFollower', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="link-clicks">Cliques em Links</Label>
              <p className="text-sm text-gray-500">Seja notificado sobre cliques nos seus links</p>
            </div>
            <Switch
              id="link-clicks"
              checked={notificationSettings.linkClick}
              onCheckedChange={(checked) => updateNotificationSetting('linkClick', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-views">Visualizações do Perfil</Label>
              <p className="text-sm text-gray-500">Seja notificado sobre visualizações do seu perfil</p>
            </div>
            <Switch
              id="profile-views"
              checked={notificationSettings.profileView}
              onCheckedChange={(checked) => updateNotificationSetting('profileView', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-updates">Atualizações do Sistema</Label>
              <p className="text-sm text-gray-500">Receba notificações sobre atualizações e novidades</p>
            </div>
            <Switch
              id="system-updates"
              checked={notificationSettings.systemUpdates}
              onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-emails">Emails de Marketing</Label>
              <p className="text-sm text-gray-500">Receba emails promocionais e dicas</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={notificationSettings.marketingEmails}
              onCheckedChange={(checked) => updateNotificationSetting('marketingEmails', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">Notificações SMS</Label>
              <p className="text-sm text-gray-500">Receba notificações por SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={notificationSettings.smsNotifications}
              onCheckedChange={(checked) => updateNotificationSetting('smsNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notification-frequency">Frequência de Notificações</Label>
              <p className="text-sm text-gray-500">Com que frequência você quer receber notificações</p>
            </div>
            <select
              id="notification-frequency"
              value={notificationSettings.notificationFrequency}
              onChange={(e) => updateNotificationSetting('notificationFrequency', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="immediate">Imediato</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="never">Nunca</option>
            </select>
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleSaveNotifications}
        disabled={notificationsSaving}
      >
        {notificationsSaving ? 'Salvando...' : 'Salvar Notificações'}
      </Button>
    </div>
  )

  const renderAppearanceSection = () => {
    return <ThemeEditorContent />
  }

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Segurança da Conta</h3>
        <p className="text-gray-600">Gerencie a segurança da sua conta</p>
      </div>
      
      {/* Alteração de Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alterar Senha</CardTitle>
          <CardDescription>
            Mantenha sua conta segura com uma senha forte
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <Button 
              onClick={handleChangePassword} 
              variant="outline"
              disabled={securityLoading}
            >
              {securityLoading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Sessões Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessões Ativas</CardTitle>
          <CardDescription>
            Gerencie suas sessões ativas em diferentes dispositivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma sessão ativa encontrada</p>
              ) : (
                activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.device}</span>
                        {session.isCurrent && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {session.browser} • {session.location}
                      </p>
                      <p className="text-xs text-gray-400">
                        Última atividade: {new Date(session.lastActivity).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Encerrar
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Autenticação de Dois Fatores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Autenticação de Dois Fatores
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
              🚧 Em Desenvolvimento
            </span>
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">2FA Ativado</Label>
              <p className="text-sm text-gray-500">
                {security.twoFactor 
                  ? 'Autenticação de dois fatores está ativada' 
                  : 'Autenticação de dois fatores está desativada'
                }
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={security.twoFactor}
              onCheckedChange={(checked) => {
                setSecurity({...security, twoFactor: checked})
                toast('Funcionalidade de 2FA em desenvolvimento', {
                  icon: 'ℹ️',
                  duration: 3000
                })
              }}
            />
          </div>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>🚧 Em Desenvolvimento:</strong> A funcionalidade de autenticação de dois fatores está sendo desenvolvida e será disponibilizada em breve.
            </p>
          </div>
        </CardContent>
      </Card>
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

          {/* Scripts Customizados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scripts Customizados</CardTitle>
              <CardDescription>
                Adicione HTML, CSS ou JavaScript customizado à sua página pública
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-scripts">Código Customizado</Label>
                  <Textarea
                    id="custom-scripts"
                    value={integrationSettings.customScripts || ''}
                    onChange={(e) => updateIntegrationSetting('customScripts', e.target.value)}
                    placeholder="<!-- Exemplo: Botão do WhatsApp -->
<a href='https://wa.me/5511999999999' target='_blank' style='position: fixed; bottom: 20px; right: 20px; background: #25D366; color: white; padding: 15px; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000;'>
  <i class='fab fa-whatsapp'></i> WhatsApp
</a>"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Exemplos de uso:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Botões do WhatsApp, Telegram, etc.</li>
                      <li>Widgets de chat (Intercom, Zendesk)</li>
                      <li>Scripts de analytics adicionais</li>
                      <li>Elementos HTML customizados</li>
                    </ul>
                    <p className="mt-2 text-xs text-amber-600">
                      ⚠️ Use com cuidado: scripts maliciosos podem afetar a segurança
                    </p>
                  </div>
                </div>
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

      {/* Modal de Exclusão de Conta */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isLoading={accountLoading}
      />
    </div>
  )
}
