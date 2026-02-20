'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Label } from '@/shared/components/ui/Label'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { FileText, Shield, Mail, Eye, EyeOff, Settings } from 'lucide-react'
import { LegalLinksSettings } from '@/types/profile.types'

interface LegalLinksSettingsProps {
  settings: LegalLinksSettings
  onUpdate: (settings: LegalLinksSettings) => void
}

export function LegalLinksSettingsComponent({ settings, onUpdate }: LegalLinksSettingsProps) {
  const [localSettings, setLocalSettings] = useState<LegalLinksSettings>(settings)

  const handleToggle = (key: keyof LegalLinksSettings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onUpdate(newSettings)
  }

  const handlePositionChange = (position: 'bottom' | 'top' | 'hidden') => {
    const newSettings = { ...localSettings, linksPosition: position }
    setLocalSettings(newSettings)
    onUpdate(newSettings)
  }

  const handleCustomTextChange = (text: string) => {
    const newSettings = { ...localSettings, customFooterText: text }
    setLocalSettings(newSettings)
    onUpdate(newSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Links Legais e Footer
        </CardTitle>
        <CardDescription>
          Configure os links legais que aparecem na sua página pública
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Toggle Principal */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            {localSettings.showLegalLinks ? (
              <Eye className="w-5 h-5 text-green-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <Label className="text-base font-medium">Mostrar Links Legais</Label>
              <p className="text-sm text-gray-500">
                Exibir links legais na página pública
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={localSettings.showLegalLinks}
            onChange={(e) => handleToggle('showLegalLinks', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

        {/* Configurações Específicas */}
        {localSettings.showLegalLinks && (
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações dos Links
            </h3>
            
            {/* Política de Privacidade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium">Política de Privacidade</Label>
                  <p className="text-xs text-gray-500">Link para /privacy</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.showPrivacyPolicy}
                onChange={(e) => handleToggle('showPrivacyPolicy', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {/* Termos de Uso */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium">Termos de Uso</Label>
                  <p className="text-xs text-gray-500">Link para /terms</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.showTermsOfService}
                onChange={(e) => handleToggle('showTermsOfService', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {/* Contato */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium">Contato</Label>
                  <p className="text-xs text-gray-500">Link para /contact</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.showContact}
                onChange={(e) => handleToggle('showContact', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Posição dos Links */}
        {localSettings.showLegalLinks && (
          <div>
            <Label className="text-base font-medium mb-3">Posição dos Links</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'top', label: 'Topo', description: 'Acima do conteúdo' },
                { value: 'bottom', label: 'Rodapé', description: 'Abaixo do conteúdo' },
                { value: 'hidden', label: 'Oculto', description: 'Não exibir' }
              ].map((position) => (
                <button
                  key={position.value}
                  onClick={() => handlePositionChange(position.value as 'bottom' | 'top' | 'hidden')}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    localSettings.linksPosition === position.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{position.label}</div>
                  <div className="text-xs text-gray-500">{position.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fixar footer no fundo da tela */}
        {localSettings.showLegalLinks && localSettings.linksPosition !== 'hidden' && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label className="text-base font-medium">Fixar footer no fundo da tela</Label>
              <p className="text-sm text-gray-500">
                Mantém o rodapé colado na parte inferior da tela em dispositivos com pouco conteúdo
              </p>
            </div>
            <input
              type="checkbox"
              checked={!!localSettings.stickyFooter}
              onChange={(e) => handleToggle('stickyFooter', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        )}

        {/* Texto Personalizado */}
        {localSettings.showLegalLinks && localSettings.linksPosition !== 'hidden' && (
          <div>
            <Label htmlFor="custom-footer-text" className="text-base font-medium mb-2">
              Texto Personalizado do Footer (Opcional)
            </Label>
            <Input
              id="custom-footer-text"
              type="text"
              placeholder="Ex: © 2024 Meu Nome. Todos os direitos reservados."
              value={localSettings.customFooterText || ''}
              onChange={(e) => handleCustomTextChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio para usar o texto padrão
            </p>
          </div>
        )}

        {/* Preview */}
        {localSettings.showLegalLinks && localSettings.linksPosition !== 'hidden' && (
          <div>
            <Label className="text-base font-medium mb-3">Preview do Footer</Label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                {localSettings.showPrivacyPolicy && (
                  <a href="/privacy" className="hover:text-blue-600 hover:underline">
                    Política de Privacidade
                  </a>
                )}
                {localSettings.showTermsOfService && (
                  <a href="/terms" className="hover:text-blue-600 hover:underline">
                    Termos de Uso
                  </a>
                )}
                {localSettings.showContact && (
                  <a href="/contact" className="hover:text-blue-600 hover:underline">
                    Contato
                  </a>
                )}
              </div>
              {localSettings.customFooterText && (
                <p className="text-xs text-gray-500 mt-2">
                  {localSettings.customFooterText}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
