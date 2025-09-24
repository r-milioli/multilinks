'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Share2, Palette, Layout, Sparkles, Maximize2 } from 'lucide-react'

interface SocialButtonsSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function SocialButtonsSettings({ themeSettings, onUpdate }: SocialButtonsSettingsProps) {
  const socialButtonsSettings = themeSettings.socialButtonsSettings || {
    style: 'default',
    size: 'medium',
    shape: 'circle',
    spacing: 'normal',
    alignment: 'center',
    showLabels: false,
    hoverEffect: 'scale',
    animationSpeed: 300,
    backgroundColor: '#FFFFFF',
    iconColor: '#374151',
    borderColor: '#E5E7EB',
    hoverBackgroundColor: '#F9FAFB',
    hoverIconColor: '#1F2937'
  }

  const handleStyleChange = (style: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      style
    })
  }

  const handleSizeChange = (size: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      size
    })
  }

  const handleShapeChange = (shape: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      shape
    })
  }

  const handleSpacingChange = (spacing: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      spacing
    })
  }

  const handleAlignmentChange = (alignment: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      alignment
    })
  }

  const handleShowLabelsChange = (showLabels: boolean) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      showLabels
    })
  }

  const handleHoverEffectChange = (hoverEffect: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      hoverEffect
    })
  }

  const handleAnimationSpeedChange = (animationSpeed: number) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      animationSpeed
    })
  }

  const handleColorChange = (colorType: string, color: string) => {
    onUpdate('socialButtonsSettings', {
      ...socialButtonsSettings,
      [colorType]: color
    })
  }

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-8 h-8'
      case 'medium':
        return 'w-10 h-10'
      case 'large':
        return 'w-12 h-12'
      case 'xlarge':
        return 'w-14 h-14'
      default:
        return 'w-10 h-10'
    }
  }

  const getButtonShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-lg'
      case 'rounded':
        return 'rounded-xl'
      case 'hexagon':
        return 'rounded-none'
      default:
        return 'rounded-full'
    }
  }

  const getButtonSpacingClasses = (spacing: string) => {
    switch (spacing) {
      case 'tight':
        return 'space-x-2'
      case 'normal':
        return 'space-x-3'
      case 'loose':
        return 'space-x-4'
      default:
        return 'space-x-3'
    }
  }

  const getButtonAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-center'
    }
  }

  const getButtonStyleClasses = (style: string) => {
    switch (style) {
      case 'default':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      case 'minimal':
        return 'bg-transparent border border-gray-200 dark:border-gray-700'
      case 'filled':
        return 'bg-gray-900 text-white border border-gray-900'
      case 'outlined':
        return 'bg-transparent border-2 border-gray-900 text-gray-900'
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
        return 'hover:scale-110'
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-lg'
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-500/25'
      case 'slide':
        return 'hover:translate-x-1'
      case 'rotate':
        return 'hover:rotate-12'
      case 'none':
        return ''
      default:
        return 'hover:scale-110'
    }
  }

  const socialIcons = [
    { name: 'Instagram', icon: '📷', color: '#E4405F' },
    { name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { name: 'Facebook', icon: '📘', color: '#1877F2' },
    { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { name: 'LinkedIn', icon: '💼', color: '#0077B5' },
    { name: 'YouTube', icon: '📺', color: '#FF0000' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Configurações dos Botões de Redes Sociais
        </CardTitle>
        <CardDescription>
          Personalize a aparência dos botões de redes sociais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estilo dos Botões */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4" />
            Estilo dos Botões
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className={`p-3 rounded-lg border-2 transition-all text-left min-w-0 ${
                  socialButtonsSettings.style === style.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm mb-1 truncate">{style.label}</div>
                <div className="text-xs text-gray-500 truncate">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tamanho dos Botões */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4" />
            Tamanho dos Botões
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'small', label: 'Pequeno', size: 'w-8 h-8' },
              { value: 'medium', label: 'Médio', size: 'w-10 h-10' },
              { value: 'large', label: 'Grande', size: 'w-12 h-12' },
              { value: 'xlarge', label: 'Extra Grande', size: 'w-14 h-14' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => handleSizeChange(size.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center min-w-0 ${
                  socialButtonsSettings.size === size.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <div 
                    className={`${size.size} bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0`}
                  />
                </div>
                <div className="font-medium text-sm truncate">{size.label}</div>
                <div className="text-xs text-gray-500 truncate">
                  {size.value === 'small' && '32x32px'}
                  {size.value === 'medium' && '40x40px'}
                  {size.value === 'large' && '48x48px'}
                  {size.value === 'xlarge' && '56x56px'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Forma dos Botões */}
        <div>
          <Label className="text-base font-medium mb-3">Forma dos Botões</Label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'circle', label: 'Circular', shape: 'rounded-full' },
              { value: 'square', label: 'Quadrado', shape: 'rounded-lg' },
              { value: 'rounded', label: 'Arredondado', shape: 'rounded-xl' },
              { value: 'hexagon', label: 'Hexágono', shape: 'rounded-none' }
            ].map((shape) => (
              <button
                key={shape.value}
                onClick={() => handleShapeChange(shape.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  socialButtonsSettings.shape === shape.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <div 
                    className={`w-8 h-8 bg-gray-300 dark:bg-gray-600 ${shape.shape}`}
                  />
                </div>
                <div className="font-medium text-sm">{shape.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Espaçamento */}
        <div>
          <Label className="text-base font-medium mb-3">Espaçamento entre Botões</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'tight', label: 'Apertado', description: '8px' },
              { value: 'normal', label: 'Normal', description: '12px' },
              { value: 'loose', label: 'Espaçoso', description: '16px' }
            ].map((spacing) => (
              <button
                key={spacing.value}
                onClick={() => handleSpacingChange(spacing.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  socialButtonsSettings.spacing === spacing.value
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
          <Label className="text-base font-medium mb-3">Alinhamento</Label>
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
                  socialButtonsSettings.alignment === alignment.value
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
                <div className="font-medium text-sm">Mostrar Labels</div>
                <div className="text-xs text-gray-500">Exibir nomes das redes sociais</div>
              </div>
              <input
                type="checkbox"
                checked={socialButtonsSettings.showLabels}
                onChange={(e) => handleShowLabelsChange(e.target.checked)}
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
                  socialButtonsSettings.hoverEffect === effect.value
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
          <Label htmlFor="social-animation-speed" className="text-base font-medium mb-3">
            Velocidade da Animação: {socialButtonsSettings.animationSpeed}ms
          </Label>
          <input
            id="social-animation-speed"
            type="range"
            min="100"
            max="1000"
            step="100"
            value={socialButtonsSettings.animationSpeed}
            onChange={(e) => handleAnimationSpeedChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Rápido</span>
            <span>Lento</span>
          </div>
        </div>

        {/* Cores Personalizadas */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" />
            Cores Personalizadas
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="social-bg-color" className="text-sm">Cor de Fundo</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="social-bg-color"
                  type="color"
                  value={socialButtonsSettings.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="w-10 h-8 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={socialButtonsSettings.backgroundColor}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="social-icon-color" className="text-sm">Cor do Ícone</Label>
              <div className="flex gap-2 mt-1">
                <input
                  id="social-icon-color"
                  type="color"
                  value={socialButtonsSettings.iconColor}
                  onChange={(e) => handleColorChange('iconColor', e.target.value)}
                  className="w-10 h-8 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={socialButtonsSettings.iconColor}
                  onChange={(e) => handleColorChange('iconColor', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-medium mb-3">Preview</Label>
          <div className={`flex ${getButtonSpacingClasses(socialButtonsSettings.spacing)} ${getButtonAlignmentClasses(socialButtonsSettings.alignment)} p-4 bg-gray-50 dark:bg-gray-800 rounded-lg`}>
            {socialIcons.slice(0, 4).map((social, index) => (
              <div
                key={index}
                className={`${getButtonSizeClasses(socialButtonsSettings.size)} ${getButtonShapeClasses(socialButtonsSettings.shape)} ${getButtonStyleClasses(socialButtonsSettings.style)} ${getHoverEffectClasses(socialButtonsSettings.hoverEffect)} transition-all duration-${socialButtonsSettings.animationSpeed} flex items-center justify-center cursor-pointer`}
                style={{
                  backgroundColor: socialButtonsSettings.backgroundColor,
                  color: socialButtonsSettings.iconColor,
                  borderColor: socialButtonsSettings.borderColor
                }}
              >
                <span className="text-lg">{social.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
