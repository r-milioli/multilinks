'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { FileText, Palette, Layout, Eye, Settings } from 'lucide-react'

interface FormModalSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function FormModalSettings({ themeSettings, onUpdate }: FormModalSettingsProps) {
  const formModalSettings = themeSettings.formModalSettings || {
    backgroundColor: '#FFFFFF',
    textColor: '#1E293B',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadow: 'lg',
    backdropBlur: true,
    inputBackgroundColor: '#FFFFFF',
    inputBorderColor: '#E5E7EB',
    inputTextColor: '#1E293B',
    inputFocusBorderColor: '#3B82F6',
    buttonBackgroundColor: '#3B82F6',
    buttonTextColor: '#FFFFFF',
    buttonHoverBackgroundColor: '#2563EB',
    buttonHoverTextColor: '#FFFFFF',
    titleColor: '#1E293B',
    descriptionColor: '#64748B',
    errorColor: '#EF4444',
    successColor: '#10B981'
  }

  const handleFormModalSettingChange = (setting: string, value: any) => {
    onUpdate('formModalSettings', {
      ...formModalSettings,
      [setting]: value
    })
  }

  const getShadowClasses = (shadow: string) => {
    switch (shadow) {
      case 'none': return ''
      case 'sm': return 'shadow-sm'
      case 'md': return 'shadow-md'
      case 'lg': return 'shadow-lg'
      case 'xl': return 'shadow-xl'
      case '2xl': return 'shadow-2xl'
      default: return 'shadow-lg'
    }
  }

  const getBorderRadiusClass = (radius: number) => {
    if (radius === 0) return 'rounded-none'
    if (radius <= 2) return 'rounded-sm'
    if (radius <= 4) return 'rounded'
    if (radius <= 6) return 'rounded-md'
    if (radius <= 8) return 'rounded-lg'
    if (radius <= 12) return 'rounded-xl'
    if (radius <= 16) return 'rounded-2xl'
    if (radius <= 20) return 'rounded-3xl'
    return 'rounded-full'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Configurações do Modal de Formulário
        </CardTitle>
        <CardDescription>
          Personalize a aparência do modal de formulários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Configurações do Modal */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4" />
            Configurações do Modal
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modal-background" className="text-sm">Cor de Fundo</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="modal-background"
                  type="color"
                  value={formModalSettings.backgroundColor}
                  onChange={(e) => handleFormModalSettingChange('backgroundColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.backgroundColor}
                  onChange={(e) => handleFormModalSettingChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="modal-text" className="text-sm">Cor do Texto</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="modal-text"
                  type="color"
                  value={formModalSettings.textColor}
                  onChange={(e) => handleFormModalSettingChange('textColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.textColor}
                  onChange={(e) => handleFormModalSettingChange('textColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="modal-border" className="text-sm">Cor da Borda</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="modal-border"
                  type="color"
                  value={formModalSettings.borderColor}
                  onChange={(e) => handleFormModalSettingChange('borderColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.borderColor}
                  onChange={(e) => handleFormModalSettingChange('borderColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="modal-radius" className="text-sm">Arredondamento (px)</Label>
              <input
                id="modal-radius"
                type="range"
                min="0"
                max="20"
                value={formModalSettings.borderRadius}
                onChange={(e) => handleFormModalSettingChange('borderRadius', parseInt(e.target.value))}
                className="w-full mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formModalSettings.borderRadius}px
              </div>
            </div>

            <div>
              <Label htmlFor="modal-shadow" className="text-sm">Sombra</Label>
              <select
                id="modal-shadow"
                value={formModalSettings.shadow}
                onChange={(e) => handleFormModalSettingChange('shadow', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
              >
                <option value="none">Nenhuma</option>
                <option value="sm">Pequena</option>
                <option value="md">Média</option>
                <option value="lg">Grande</option>
                <option value="xl">Extra Grande</option>
                <option value="2xl">Muito Grande</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="modal-blur"
                type="checkbox"
                checked={formModalSettings.backdropBlur}
                onChange={(e) => handleFormModalSettingChange('backdropBlur', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="modal-blur" className="text-sm">Efeito Blur no Fundo</Label>
            </div>
          </div>
        </div>

        {/* Configurações dos Campos */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4" />
            Configurações dos Campos
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="input-background" className="text-sm">Fundo dos Campos</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="input-background"
                  type="color"
                  value={formModalSettings.inputBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('inputBackgroundColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.inputBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('inputBackgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="input-border" className="text-sm">Borda dos Campos</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="input-border"
                  type="color"
                  value={formModalSettings.inputBorderColor}
                  onChange={(e) => handleFormModalSettingChange('inputBorderColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.inputBorderColor}
                  onChange={(e) => handleFormModalSettingChange('inputBorderColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="input-text" className="text-sm">Texto dos Campos</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="input-text"
                  type="color"
                  value={formModalSettings.inputTextColor}
                  onChange={(e) => handleFormModalSettingChange('inputTextColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.inputTextColor}
                  onChange={(e) => handleFormModalSettingChange('inputTextColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="input-focus" className="text-sm">Borda em Foco</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="input-focus"
                  type="color"
                  value={formModalSettings.inputFocusBorderColor}
                  onChange={(e) => handleFormModalSettingChange('inputFocusBorderColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.inputFocusBorderColor}
                  onChange={(e) => handleFormModalSettingChange('inputFocusBorderColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações dos Botões */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" />
            Configurações dos Botões
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="button-background" className="text-sm">Fundo do Botão</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="button-background"
                  type="color"
                  value={formModalSettings.buttonBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('buttonBackgroundColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.buttonBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('buttonBackgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="button-text" className="text-sm">Texto do Botão</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="button-text"
                  type="color"
                  value={formModalSettings.buttonTextColor}
                  onChange={(e) => handleFormModalSettingChange('buttonTextColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.buttonTextColor}
                  onChange={(e) => handleFormModalSettingChange('buttonTextColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="button-hover-bg" className="text-sm">Hover - Fundo</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="button-hover-bg"
                  type="color"
                  value={formModalSettings.buttonHoverBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('buttonHoverBackgroundColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.buttonHoverBackgroundColor}
                  onChange={(e) => handleFormModalSettingChange('buttonHoverBackgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="button-hover-text" className="text-sm">Hover - Texto</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="button-hover-text"
                  type="color"
                  value={formModalSettings.buttonHoverTextColor}
                  onChange={(e) => handleFormModalSettingChange('buttonHoverTextColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.buttonHoverTextColor}
                  onChange={(e) => handleFormModalSettingChange('buttonHoverTextColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Texto */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4" />
            Configurações de Texto
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-color" className="text-sm">Cor do Título</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="title-color"
                  type="color"
                  value={formModalSettings.titleColor}
                  onChange={(e) => handleFormModalSettingChange('titleColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.titleColor}
                  onChange={(e) => handleFormModalSettingChange('titleColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description-color" className="text-sm">Cor da Descrição</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="description-color"
                  type="color"
                  value={formModalSettings.descriptionColor}
                  onChange={(e) => handleFormModalSettingChange('descriptionColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.descriptionColor}
                  onChange={(e) => handleFormModalSettingChange('descriptionColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="error-color" className="text-sm">Cor de Erro</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="error-color"
                  type="color"
                  value={formModalSettings.errorColor}
                  onChange={(e) => handleFormModalSettingChange('errorColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.errorColor}
                  onChange={(e) => handleFormModalSettingChange('errorColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="success-color" className="text-sm">Cor de Sucesso</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  id="success-color"
                  type="color"
                  value={formModalSettings.successColor}
                  onChange={(e) => handleFormModalSettingChange('successColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formModalSettings.successColor}
                  onChange={(e) => handleFormModalSettingChange('successColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
