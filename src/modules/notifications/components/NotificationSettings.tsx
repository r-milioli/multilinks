'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Switch } from '@/shared/components/ui/Switch'
import { Label } from '@/shared/components/ui/Label'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer,
  Settings,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react'
import { NotificationSettings as NotificationSettingsType } from '@/types/common.types'
import { toast } from 'react-hot-toast'

interface NotificationSettingsProps {
  notificationSettings: NotificationSettingsType
  isLoading: boolean
  isSaving: boolean
  onUpdate: (key: keyof NotificationSettingsType, value: boolean | string) => void
  onSave: (settings: NotificationSettingsType) => Promise<{ success: boolean; error?: string }>
  onReset: () => Promise<{ success: boolean; error?: string }>
  onToggleAllEmail: (enabled: boolean) => void
}

export function NotificationSettings({
  notificationSettings,
  isLoading,
  isSaving,
  onUpdate,
  onSave,
  onReset,
  onToggleAllEmail
}: NotificationSettingsProps) {
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = (key: keyof NotificationSettingsType, value: boolean | string) => {
    onUpdate(key, value)
    setHasChanges(true)
  }

  const handleSave = async () => {
    const result = await onSave(notificationSettings)
    if (result.success) {
      toast.success('Configurações de notificação salvas!')
      setHasChanges(false)
    } else {
      toast.error(result.error || 'Erro ao salvar configurações')
    }
  }

  const handleReset = async () => {
    const result = await onReset()
    if (result.success) {
      toast.success('Configurações resetadas para padrão!')
      setHasChanges(false)
    } else {
      toast.error(result.error || 'Erro ao resetar configurações')
    }
  }

  const handleToggleAllEmail = (enabled: boolean) => {
    onToggleAllEmail(enabled)
    setHasChanges(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controle Geral de Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notificações por Email
          </CardTitle>
          <CardDescription>
            Controle geral das notificações por email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="emailNotifications" className="text-base font-medium">
                Todas as Notificações por Email
              </Label>
              <p className="text-sm text-muted-foreground">
                {notificationSettings.emailNotifications 
                  ? 'Receber notificações por email'
                  : 'Não receber notificações por email'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {notificationSettings.emailNotifications ? (
                <Volume2 className="h-4 w-4 text-green-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-400" />
              )}
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={handleToggleAllEmail}
              />
            </div>
          </div>

          {!notificationSettings.emailNotifications && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Notificações Desabilitadas</p>
                  <p>Você não receberá nenhuma notificação por email.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificações Específicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações Específicas
          </CardTitle>
          <CardDescription>
            Configure notificações específicas (apenas se email estiver ativado)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="weeklyReport" className="text-base font-medium">
                Resumo Semanal
              </Label>
              <p className="text-sm text-muted-foreground">
                Relatório semanal de analytics e estatísticas
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className={`h-4 w-4 ${notificationSettings.weeklyReport ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch
                id="weeklyReport"
                checked={notificationSettings.weeklyReport}
                onCheckedChange={(checked) => handleToggle('weeklyReport', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="newFollower" className="text-base font-medium">
                Novos Visitantes
              </Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando alguém acessar sua página
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className={`h-4 w-4 ${notificationSettings.newFollower ? 'text-green-600' : 'text-gray-400'}`} />
              <Switch
                id="newFollower"
                checked={notificationSettings.newFollower}
                onCheckedChange={(checked) => handleToggle('newFollower', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="linkClick" className="text-base font-medium">
                Cliques em Links
              </Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando alguém clicar em seus links
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer className={`h-4 w-4 ${notificationSettings.linkClick ? 'text-purple-600' : 'text-gray-400'}`} />
              <Switch
                id="linkClick"
                checked={notificationSettings.linkClick}
                onCheckedChange={(checked) => handleToggle('linkClick', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="profileView" className="text-base font-medium">
                Visualizações de Perfil
              </Label>
              <p className="text-sm text-muted-foreground">
                Notificar quando alguém visualizar seu perfil
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Eye className={`h-4 w-4 ${notificationSettings.profileView ? 'text-orange-600' : 'text-gray-400'}`} />
              <Switch
                id="profileView"
                checked={notificationSettings.profileView}
                onCheckedChange={(checked) => handleToggle('profileView', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="systemUpdates" className="text-base font-medium">
                Atualizações do Sistema
              </Label>
              <p className="text-sm text-muted-foreground">
                Notificar sobre atualizações e melhorias
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Settings className={`h-4 w-4 ${notificationSettings.systemUpdates ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch
                id="systemUpdates"
                checked={notificationSettings.systemUpdates}
                onCheckedChange={(checked) => handleToggle('systemUpdates', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketingEmails" className="text-base font-medium">
                Emails de Marketing
              </Label>
              <p className="text-sm text-muted-foreground">
                Receber ofertas e novidades do MultiLink
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className={`h-4 w-4 ${notificationSettings.marketingEmails ? 'text-pink-600' : 'text-gray-400'}`} />
              <Switch
                id="marketingEmails"
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => handleToggle('marketingEmails', checked)}
                disabled={!notificationSettings.emailNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações Push e SMS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Notificações Push e SMS
          </CardTitle>
          <CardDescription>
            Configure notificações em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="pushNotifications" className="text-base font-medium">
                Notificações Push
              </Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações no navegador
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Bell className={`h-4 w-4 ${notificationSettings.pushNotifications ? 'text-green-600' : 'text-gray-400'}`} />
              <Switch
                id="pushNotifications"
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="smsNotifications" className="text-base font-medium">
                Notificações SMS
              </Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações por SMS (em breve)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className={`h-4 w-4 ${notificationSettings.smsNotifications ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch
                id="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => handleToggle('smsNotifications', checked)}
                disabled={true}
              />
            </div>
          </div>

          {notificationSettings.smsNotifications && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">SMS em Desenvolvimento</p>
                  <p>As notificações por SMS estarão disponíveis em breve.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frequência de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Frequência de Notificações
          </CardTitle>
          <CardDescription>
            Configure com que frequência receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notificationFrequency" className="text-base font-medium">
                Frequência
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Escolha com que frequência receber notificações
              </p>
              <select
                id="notificationFrequency"
                value={notificationSettings.notificationFrequency}
                onChange={(e) => handleToggle('notificationFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="immediate">Imediato</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="never">Nunca</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Imediato:</strong> Receber notificações assim que acontecem<br/>
                <strong>Diário:</strong> Receber um resumo diário<br/>
                <strong>Semanal:</strong> Receber um resumo semanal<br/>
                <strong>Nunca:</strong> Não receber notificações
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Resumo de Notificações
          </CardTitle>
          <CardDescription>
            Visão geral das suas configurações de notificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${notificationSettings.emailNotifications ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {notificationSettings.emailNotifications ? 'Email Ativo' : 'Email Desativado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${notificationSettings.pushNotifications ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">
                  {notificationSettings.pushNotifications ? 'Push Ativo' : 'Push Desativado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${notificationSettings.smsNotifications ? 'bg-blue-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">
                  {notificationSettings.smsNotifications ? 'SMS Ativo' : 'SMS Desativado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">
                  Frequência: {notificationSettings.notificationFrequency}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex-1"
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              Resetar para Padrão
            </Button>
          </div>
          
          {hasChanges && (
            <p className="text-sm text-amber-600 mt-2">
              Você tem alterações não salvas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

