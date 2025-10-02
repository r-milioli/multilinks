'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Link, Palette, Layout, Sparkles } from 'lucide-react'

interface LinkButtonSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function LinkButtonSettings({ themeSettings, onUpdate }: LinkButtonSettingsProps) {
  const linkButtonSettings = themeSettings.linkButtonSettings || {
    style: 'default',
    size: 'medium',
    spacing: 'normal',
    alignment: 'center',
    showIcons: true,
    showDescriptions: true,
    hoverEffect: 'scale',
    animationSpeed: 300
  }

  const handleStyleChange = (style: string) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      style
    })
  }

  const handleSizeChange = (size: string) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      size
    })
  }

  const handleSpacingChange = (spacing: string) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      spacing
    })
  }

  const handleAlignmentChange = (alignment: string) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      alignment
    })
  }

  const handleShowIconsChange = (showIcons: boolean) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      showIcons
    })
  }

  const handleShowDescriptionsChange = (showDescriptions: boolean) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      showDescriptions
    })
  }

  const handleHoverEffectChange = (hoverEffect: string) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      hoverEffect
    })
  }

  const handleAnimationSpeedChange = (animationSpeed: number) => {
    onUpdate('linkButtonSettings', {
      ...linkButtonSettings,
      animationSpeed
    })
  }

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'p-2 text-sm'
      case 'medium':
        return 'p-4 text-base'
      case 'large':
        return 'p-6 text-lg'
      default:
        return 'p-4 text-base'
    }
  }

  const getButtonSpacingClasses = (spacing: string) => {
    switch (spacing) {
      case 'tight':
        return 'space-y-2'
      case 'normal':
        return 'space-y-3'
      case 'loose':
        return 'space-y-4'
      default:
        return 'space-y-3'
    }
  }

  const getButtonAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'text-left'
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  const getButtonStyleClasses = (style: string) => {
    switch (style) {
      case 'default':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      case 'minimal':
        return 'bg-transparent border border-gray-200 dark:border-gray-700'
      case 'filled':
        return 'bg-blue-500 text-white border border-blue-500'
      case 'outlined':
        return 'bg-transparent border-2 border-blue-500 text-blue-500'
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0'
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20'
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
  }

  const getHoverEffectClasses = (hoverEffect: string) => {
    switch (hoverEffect) {
      case 'scale':
        return 'hover:scale-105'
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-lg'
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-500/25'
      case 'slide':
        return 'hover:translate-x-2'
      case 'rotate':
        return 'hover:rotate-1'
      case 'none':
        return ''
      default:
        return 'hover:scale-105'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Configurações dos Botões de Links
        </CardTitle>
        <CardDescription>
          Personalize a aparência dos botões de links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estilo dos Botões */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4" />
            Estilo dos Botões
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'default', label: 'Padrão', description: 'Fundo branco com borda' },
              { value: 'minimal', label: 'Minimalista', description: 'Transparente com borda' },
              { value: 'filled', label: 'Preenchido', description: 'Cor sólida' },
              { value: 'outlined', label: 'Contorno', description: 'Borda colorida' },
              { value: 'gradient', label: 'Gradiente', description: 'Gradiente colorido' },
              { value: 'glass', label: 'Vidro', description: 'Efeito glassmorphism' }
            ].map((style) => (
              <button
                key={style.value}
                onClick={() => handleStyleChange(style.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  linkButtonSettings.style === style.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{style.label}</div>
                <div className="text-xs text-gray-500">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tamanho dos Botões */}
        <div>
          <Label className="text-base font-medium mb-3">Tamanho dos Botões</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'small', label: 'Pequeno', size: 'p-2 text-sm' },
              { value: 'medium', label: 'Médio', size: 'p-4 text-base' },
              { value: 'large', label: 'Grande', size: 'p-6 text-lg' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => handleSizeChange(size.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  linkButtonSettings.size === size.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{size.label}</div>
                <div className="text-xs text-gray-500">
                  {size.value === 'small' && 'Compacto'}
                  {size.value === 'medium' && 'Padrão'}
                  {size.value === 'large' && 'Espaçoso'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Espaçamento */}
        <div>
          <Label className="text-base font-medium mb-3">Espaçamento entre Botões</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'tight', label: 'Apertado', description: '2px' },
              { value: 'normal', label: 'Normal', description: '12px' },
              { value: 'loose', label: 'Espaçoso', description: '16px' }
            ].map((spacing) => (
              <button
                key={spacing.value}
                onClick={() => handleSpacingChange(spacing.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  linkButtonSettings.spacing === spacing.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1">{spacing.label}</div>
                <div className="text-xs text-gray-500">{spacing.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Alinhamento */}
        <div>
          <Label className="text-base font-medium mb-3">Alinhamento do Texto</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'left', label: 'Esquerda', icon: '←' },
              { value: 'center', label: 'Centro', icon: '●' },
              { value: 'right', label: 'Direita', icon: '→' }
            ].map((alignment) => (
              <button
                key={alignment.value}
                onClick={() => handleAlignmentChange(alignment.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  linkButtonSettings.alignment === alignment.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">{alignment.icon}</div>
                <div className="font-medium text-sm">{alignment.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Opções de Exibição */}
        <div>
          <Label className="text-base font-medium mb-3">Opções de Exibição</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Mostrar Ícones</div>
                <div className="text-xs text-gray-500">Exibir ícones dos links</div>
              </div>
              <input
                type="checkbox"
                checked={linkButtonSettings.showIcons}
                onChange={(e) => handleShowIconsChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Mostrar Descrições</div>
                <div className="text-xs text-gray-500">Exibir descrições dos links</div>
              </div>
              <input
                type="checkbox"
                checked={linkButtonSettings.showDescriptions}
                onChange={(e) => handleShowDescriptionsChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Efeitos de Hover */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" />
            Efeitos de Hover
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'none', label: 'Nenhum' },
              { value: 'scale', label: 'Escala' },
              { value: 'lift', label: 'Elevação' },
              { value: 'glow', label: 'Brilho' },
              { value: 'slide', label: 'Deslizar' },
              { value: 'rotate', label: 'Rotação' }
            ].map((effect) => (
              <button
                key={effect.value}
                onClick={() => handleHoverEffectChange(effect.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  linkButtonSettings.hoverEffect === effect.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{effect.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Velocidade da Animação */}
        <div>
          <Label htmlFor="animation-speed" className="text-base font-medium mb-3">
            Velocidade da Animação: {linkButtonSettings.animationSpeed}ms
          </Label>
          <input
            id="animation-speed"
            type="range"
            min="100"
            max="1000"
            step="100"
            value={linkButtonSettings.animationSpeed}
            onChange={(e) => handleAnimationSpeedChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Rápido</span>
            <span>Lento</span>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-medium mb-3">Preview</Label>
          <div className={`space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${getButtonSpacingClasses(linkButtonSettings.spacing)}`}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-full rounded-lg border transition-all ${getButtonSizeClasses(linkButtonSettings.size)} ${getButtonStyleClasses(linkButtonSettings.style)} ${getButtonAlignmentClasses(linkButtonSettings.alignment)} ${getHoverEffectClasses(linkButtonSettings.hoverEffect)}`}
                style={{
                  transitionDuration: `${linkButtonSettings.animationSpeed}ms`,
                  borderRadius: themeSettings?.borderRadius ? `${themeSettings.borderRadius}px` : undefined
                }}
              >
                <div className="flex items-center space-x-3">
                  {linkButtonSettings.showIcons && (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">Link {i}</div>
                    {linkButtonSettings.showDescriptions && (
                      <div className="text-sm opacity-75">Descrição do link {i}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
