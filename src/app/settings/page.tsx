'use client'

import React, { useState } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { LoadingPage } from '@/shared/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { 
  Settings, 
  User, 
  Palette, 
  Shield, 
  Bell, 
  Trash2,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Download,
  Key,
  Mail,
  Globe,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useProfile } from '@/modules/profile/hooks/useProfile'
import { ProfileEditor } from '@/modules/profile/components/ProfileEditor'
import { useTheme } from '@/modules/theme/hooks/useTheme'
import { usePrivacy } from '@/modules/privacy/hooks/usePrivacy'
import { useNotifications } from '@/modules/notifications/hooks/useNotifications'
import { ColorPicker } from '@/shared/components/ui/ColorPicker'
import { ThemePreview } from '@/modules/theme/components/ThemePreview'
import { PrivacySettings } from '@/modules/privacy/components/PrivacySettings'
import { NotificationSettings } from '@/modules/notifications/components/NotificationSettings'
import { useLogin } from '@/modules/auth/hooks/useLogin'
import { useSecurity } from '@/modules/security/hooks/useSecurity'
import { useAccount } from '@/modules/account/hooks/useAccount'
import { DeleteAccountModal } from '@/modules/account/components/DeleteAccountModal'
import { MobileMenu } from '@/shared/components/ui/MobileMenu'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { data: session } = useSession()
  const { logout } = useLogin()
  const { changePassword, getActiveSessions, terminateSession, isLoading: securityLoading, error: securityError } = useSecurity()
  const { exportData, deleteAccount, isLoading: accountLoading, error: accountError } = useAccount()
  const { profile, isLoading: profileLoading } = useProfile()
  const { 
    themeSettings,
    isLoading: themeLoading,
    isSaving: themeSaving,
    saveTheme,
    applyPresetTheme,
    resetToDefault,
    updateThemeProperty,
    presetThemes,
    availableFonts,
    buttonStyles,
    backgroundTypes
  } = useTheme()
  
  const {
    privacySettings,
    isLoading: privacyLoading,
    isSaving: privacySaving,
    savePrivacySettings,
    updatePrivacySetting,
    resetToDefault: resetPrivacyToDefault
  } = usePrivacy()
  
  const {
    notificationSettings,
    isLoading: notificationLoading,
    isSaving: notificationSaving,
    saveNotificationSettings,
    updateNotificationSetting,
    resetToDefault: resetNotificationToDefault,
    toggleAllEmailNotifications
  } = useNotifications()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [activeSessions, setActiveSessions] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleChangePassword = async () => {
    const result = await changePassword(passwordData)
    if (result.success) {
      toast.success('Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      toast.error(result.error || 'Erro ao alterar senha.')
    }
  }

  const loadActiveSessions = async () => {
    const sessions = await getActiveSessions()
    setActiveSessions(sessions)
  }

  const handleTerminateSession = async (sessionId: string) => {
    const result = await terminateSession(sessionId)
    if (result.success) {
      toast.success('Sessão encerrada com sucesso!')
      loadActiveSessions() // Recarregar lista
    } else {
      toast.error(result.error || 'Erro ao encerrar sessão.')
    }
  }

  const handleExportData = async () => {
    const result = await exportData()
    if (result.success) {
      toast.success('Dados exportados com sucesso!')
    } else {
      toast.error(result.error || 'Erro ao exportar dados.')
    }
  }

  const handleDeleteAccount = async (password: string, confirmText: string) => {
    const result = await deleteAccount(password, confirmText)
    if (result.success) {
      toast.success('Conta deletada com sucesso!')
      setShowDeleteModal(false)
    } else {
      toast.error(result.error || 'Erro ao deletar conta.')
    }
  }

  // Carregar sessões ativas quando a aba de segurança for ativada
  React.useEffect(() => {
    if (activeTab === 'security') {
      loadActiveSessions()
    }
  }, [activeTab])

  if (authLoading || profileLoading || themeLoading || privacyLoading || notificationLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Key },
    { id: 'account', label: 'Conta', icon: Trash2 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileEditor />
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Temas Pré-definidos */}
            <Card>
              <CardHeader>
                <CardTitle>Temas Pré-definidos</CardTitle>
                <CardDescription>
                  Escolha um tema pronto ou personalize o seu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(presetThemes).map(([key, theme]) => (
                    <div
                      key={key}
                      className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      onClick={() => applyPresetTheme(key as any)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span className="font-medium">{theme.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div
                          className="h-8 rounded"
                          style={{ backgroundColor: theme.backgroundColor }}
                        />
                        <div className="flex space-x-1">
                          <div
                            className="h-4 flex-1 rounded"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <div
                            className="h-4 flex-1 rounded"
                            style={{ backgroundColor: theme.secondaryColor }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configurações */}
              <div className="space-y-6">
                {/* Cores */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cores</CardTitle>
                    <CardDescription>
                      Personalize as cores do seu tema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ColorPicker
                      label="Cor Primária"
                      value={themeSettings.primaryColor}
                      onChange={(color) => updateThemeProperty('primaryColor', color)}
                    />
                    
                    <ColorPicker
                      label="Cor Secundária"
                      value={themeSettings.secondaryColor}
                      onChange={(color) => updateThemeProperty('secondaryColor', color)}
                    />
                    
                    <ColorPicker
                      label="Cor do Texto"
                      value={themeSettings.textColor}
                      onChange={(color) => updateThemeProperty('textColor', color)}
                    />
                    
                    <ColorPicker
                      label="Cor de Fundo"
                      value={themeSettings.backgroundColor}
                      onChange={(color) => updateThemeProperty('backgroundColor', color)}
                    />
                  </CardContent>
                </Card>

                {/* Tipografia */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tipografia</CardTitle>
                    <CardDescription>
                      Escolha a fonte para sua página
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Fonte</label>
                        <select
                          value={themeSettings.fontFamily}
                          onChange={(e) => updateThemeProperty('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {availableFonts.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estilo dos Botões */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estilo dos Botões</CardTitle>
                    <CardDescription>
                      Personalize o visual dos botões
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Estilo</label>
                        <div className="grid grid-cols-2 gap-2">
                          {buttonStyles.map((style) => (
                            <button
                              key={style.value}
                              type="button"
                              onClick={() => updateThemeProperty('buttonStyle', style.value)}
                              className={`p-2 text-sm border rounded transition-colors ${
                                themeSettings.buttonStyle === style.value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {style.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Raio da Borda: {themeSettings.borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={themeSettings.borderRadius}
                          onChange={(e) => updateThemeProperty('borderRadius', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Background */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fundo</CardTitle>
                    <CardDescription>
                      Configure o fundo da sua página
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Fundo</label>
                        <div className="grid grid-cols-3 gap-2">
                          {backgroundTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => updateThemeProperty('backgroundType', type.value)}
                              className={`p-2 text-sm border rounded transition-colors ${
                                themeSettings.backgroundType === type.value
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {type.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {themeSettings.backgroundType === 'image' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                          <input
                            type="url"
                            value={themeSettings.backgroundImage || ''}
                            onChange={(e) => updateThemeProperty('backgroundImage', e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <div>
                <ThemePreview themeSettings={themeSettings} />
              </div>
            </div>

            {/* Ações */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={async () => {
                      const result = await saveTheme(themeSettings)
                      if (result.success) {
                        toast.success('Tema salvo com sucesso!')
                      } else {
                        toast.error(result.error || 'Erro ao salvar tema')
                      }
                    }}
                    disabled={themeSaving}
                    className="flex-1"
                  >
                    {themeSaving ? 'Salvando...' : 'Salvar Tema'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const result = await resetToDefault()
                      if (result.success) {
                        toast.success('Tema resetado para padrão!')
                      } else {
                        toast.error(result.error || 'Erro ao resetar tema')
                      }
                    }}
                    disabled={themeSaving}
                  >
                    Resetar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'privacy':
        return (
          <PrivacySettings
            privacySettings={privacySettings}
            isLoading={privacyLoading}
            isSaving={privacySaving}
            onUpdate={updatePrivacySetting}
            onSave={savePrivacySettings}
            onReset={resetPrivacyToDefault}
          />
        )

      case 'notifications':
        return (
          <NotificationSettings
            notificationSettings={notificationSettings}
            isLoading={notificationLoading}
            isSaving={notificationSaving}
            onUpdate={updateNotificationSetting}
            onSave={saveNotificationSettings}
            onReset={resetNotificationToDefault}
            onToggleAllEmail={toggleAllEmailNotifications}
          />
        )

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha para manter sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Senha Atual</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                      placeholder="Digite sua senha atual"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Digite sua nova senha"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Confirme sua nova senha"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                {securityError && (
                  <div className="text-red-600 text-sm">
                    {securityError}
                  </div>
                )}

                <Button onClick={handleChangePassword} disabled={securityLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {securityLoading ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>
                  Gerencie suas sessões de login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeSessions.length > 0 ? (
                    activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.browser} - {session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • Última atividade: {new Date(session.lastActivity).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.isCurrent && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Atual
                            </span>
                          )}
                          {!session.isCurrent && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTerminateSession(session.id)}
                            >
                              Encerrar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma sessão ativa encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
                <CardDescription>
                  Baixe uma cópia dos seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Você pode baixar todos os seus dados, incluindo links, analytics e configurações.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={accountLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {accountLoading ? 'Exportando...' : 'Baixar Dados'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis para sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Deletar Conta</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={accountLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Link>
              </Button>
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configurações
              </h1>
            </div>
            <MobileMenu>
              <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start md:w-auto">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </MobileMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
          </main>

          {/* Modal de Confirmação de Exclusão */}
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            isLoading={accountLoading}
          />
        </div>
      )
    }
