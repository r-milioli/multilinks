'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Switch } from '@/shared/components/ui/Switch'
import { Label } from '@/shared/components/ui/Label'
import { 
  Eye, 
  EyeOff, 
  Globe, 
  Lock, 
  Mail, 
  Share2, 
  BarChart3, 
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { PrivacySettings as PrivacySettingsType } from '@/types/common.types'
import { toast } from 'react-hot-toast'

interface PrivacySettingsProps {
  privacySettings: PrivacySettingsType
  isLoading: boolean
  isSaving: boolean
  onUpdate: (key: keyof PrivacySettingsType, value: boolean) => void
  onSave: (settings: PrivacySettingsType) => Promise<{ success: boolean; error?: string }>
  onReset: () => Promise<{ success: boolean; error?: string }>
}

export function PrivacySettings({
  privacySettings,
  isLoading,
  isSaving,
  onUpdate,
  onSave,
  onReset
}: PrivacySettingsProps) {
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = (key: keyof PrivacySettingsType, value: boolean) => {
    onUpdate(key, value)
    setHasChanges(true)
  }

  const handleSave = async () => {
    const result = await onSave(privacySettings)
    if (result.success) {
      toast.success('Configurações de privacidade salvas!')
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Visibilidade da Página */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Visibilidade da Página
          </CardTitle>
          <CardDescription>
            Controle quem pode acessar sua página pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Página Pública
              </Label>
              <p className="text-sm text-muted-foreground">
                {privacySettings.isPublic 
                  ? 'Sua página pode ser acessada por qualquer pessoa'
                  : 'Sua página é privada e não pode ser acessada publicamente'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {privacySettings.isPublic ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <Switch
                id="isPublic"
                checked={privacySettings.isPublic}
                onCheckedChange={(checked) => handleToggle('isPublic', checked)}
              />
            </div>
          </div>

          {!privacySettings.isPublic && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Página Privada</p>
                  <p>Quando privada, sua página não aparecerá em buscas e não poderá ser acessada diretamente.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Controle quais informações pessoais são exibidas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="showEmail" className="text-base font-medium">
                Mostrar Email
              </Label>
              <p className="text-sm text-muted-foreground">
                {privacySettings.showEmail 
                  ? 'Seu email será visível na página pública'
                  : 'Seu email permanecerá privado'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className={`h-4 w-4 ${privacySettings.showEmail ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch
                id="showEmail"
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) => handleToggle('showEmail', checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="showSocialLinks" className="text-base font-medium">
                Mostrar Links Sociais
              </Label>
              <p className="text-sm text-muted-foreground">
                {privacySettings.showSocialLinks 
                  ? 'Seus links sociais serão exibidos na página'
                  : 'Seus links sociais permanecerão ocultos'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className={`h-4 w-4 ${privacySettings.showSocialLinks ? 'text-green-600' : 'text-gray-400'}`} />
              <Switch
                id="showSocialLinks"
                checked={privacySettings.showSocialLinks}
                onCheckedChange={(checked) => handleToggle('showSocialLinks', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics e Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics e Dados
          </CardTitle>
          <CardDescription>
            Controle a coleta de dados e analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allowAnalytics" className="text-base font-medium">
                Coletar Analytics
              </Label>
              <p className="text-sm text-muted-foreground">
                {privacySettings.allowAnalytics 
                  ? 'Dados de visitantes serão coletados para analytics'
                  : 'Nenhum dado de visitantes será coletado'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className={`h-4 w-4 ${privacySettings.allowAnalytics ? 'text-blue-600' : 'text-gray-400'}`} />
              <Switch
                id="allowAnalytics"
                checked={privacySettings.allowAnalytics}
                onCheckedChange={(checked) => handleToggle('allowAnalytics', checked)}
              />
            </div>
          </div>

          {privacySettings.allowAnalytics && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Analytics Ativo</p>
                  <p>Coletamos dados anônimos como país, dispositivo e cliques para melhorar sua experiência.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo de Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Resumo de Privacidade
          </CardTitle>
          <CardDescription>
            Visão geral das suas configurações de privacidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${privacySettings.isPublic ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {privacySettings.isPublic ? 'Página Pública' : 'Página Privada'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${privacySettings.showEmail ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">
                  {privacySettings.showEmail ? 'Email Visível' : 'Email Privado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${privacySettings.showSocialLinks ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">
                  {privacySettings.showSocialLinks ? 'Links Sociais Visíveis' : 'Links Sociais Ocultos'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${privacySettings.allowAnalytics ? 'bg-blue-500' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium">
                  {privacySettings.allowAnalytics ? 'Analytics Ativo' : 'Analytics Desativado'}
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

