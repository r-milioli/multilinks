'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { User, Maximize2, Palette, Layers } from 'lucide-react'

interface AvatarSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function AvatarSettings({ themeSettings, onUpdate }: AvatarSettingsProps) {
  const avatarSettings = themeSettings.avatarSettings || {
    size: 'medium',
    shape: 'circle',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadow: 'none',
    position: 'top'
  }

  const handleAvatarSizeChange = (size: string) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      size
    })
  }

  const handleAvatarShapeChange = (shape: string) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      shape
    })
  }

  const handleAvatarBorderChange = (borderWidth: number) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      borderWidth
    })
  }

  const handleAvatarBorderColorChange = (borderColor: string) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      borderColor
    })
  }

  const handleAvatarShadowChange = (shadow: string) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      shadow
    })
  }

  const handleAvatarPositionChange = (position: string) => {
    onUpdate('avatarSettings', {
      ...avatarSettings,
      position
    })
  }

  const getAvatarSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-16 h-16'
      case 'medium':
        return 'w-20 h-20'
      case 'large':
        return 'w-24 h-24'
      case 'xlarge':
        return 'w-32 h-32'
      default:
        return 'w-20 h-20'
    }
  }

  const getAvatarShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-lg'
      case 'rounded':
        return 'rounded-2xl'
      case 'hexagon':
        return 'rounded-none'
      default:
        return 'rounded-full'
    }
  }

  const getAvatarShadowClasses = (shadow: string) => {
    switch (shadow) {
      case 'none':
        return ''
      case 'sm':
        return 'shadow-sm'
      case 'md':
        return 'shadow-md'
      case 'lg':
        return 'shadow-lg'
      case 'xl':
        return 'shadow-xl'
      case 'glow':
        return 'shadow-lg shadow-blue-500/25'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Configurações do Avatar
        </CardTitle>
        <CardDescription>
          Personalize a aparência do seu avatar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tamanho do Avatar */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4" />
            Tamanho do Avatar
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'small', label: 'Pequeno', size: 'w-16 h-16' },
              { value: 'medium', label: 'Médio', size: 'w-20 h-20' },
              { value: 'large', label: 'Grande', size: 'w-24 h-24' },
              { value: 'xlarge', label: 'Extra Grande', size: 'w-32 h-32' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => handleAvatarSizeChange(size.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center min-w-0 ${
                  avatarSettings.size === size.value
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
                  {size.value === 'small' && '64x64px'}
                  {size.value === 'medium' && '80x80px'}
                  {size.value === 'large' && '96x96px'}
                  {size.value === 'xlarge' && '128x128px'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Forma do Avatar */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4" />
            Forma do Avatar
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'circle', label: 'Circular', shape: 'rounded-full' },
              { value: 'square', label: 'Quadrado', shape: 'rounded-lg' },
              { value: 'rounded', label: 'Arredondado', shape: 'rounded-2xl' },
              { value: 'hexagon', label: 'Hexágono', shape: 'rounded-none' }
            ].map((shape) => (
              <button
                key={shape.value}
                onClick={() => handleAvatarShapeChange(shape.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center min-w-0 ${
                  avatarSettings.shape === shape.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <div 
                    className={`w-12 h-12 bg-gray-300 dark:bg-gray-600 ${shape.shape} flex-shrink-0`}
                  />
                </div>
                <div className="font-medium text-sm truncate">{shape.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Borda do Avatar */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" />
            Borda do Avatar
          </Label>
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatar-border-width" className="text-sm">
                Espessura da Borda: {avatarSettings.borderWidth}px
              </Label>
              <input
                id="avatar-border-width"
                type="range"
                min="0"
                max="8"
                value={avatarSettings.borderWidth}
                onChange={(e) => handleAvatarBorderChange(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="avatar-border-color" className="text-sm">
                Cor da Borda
              </Label>
              <div className="flex gap-2 mt-2">
                <input
                  id="avatar-border-color"
                  type="color"
                  value={avatarSettings.borderColor}
                  onChange={(e) => handleAvatarBorderColorChange(e.target.value)}
                  className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={avatarSettings.borderColor}
                  onChange={(e) => handleAvatarBorderColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sombra do Avatar */}
        <div>
          <Label className="text-base font-medium mb-3">Sombra do Avatar</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'none', label: 'Sem Sombra' },
              { value: 'sm', label: 'Pequena' },
              { value: 'md', label: 'Média' },
              { value: 'lg', label: 'Grande' },
              { value: 'xl', label: 'Extra Grande' },
              { value: 'glow', label: 'Brilho' }
            ].map((shadow) => (
              <button
                key={shadow.value}
                onClick={() => handleAvatarShadowChange(shadow.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  avatarSettings.shadow === shadow.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{shadow.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Posição do Avatar */}
        <div>
          <Label className="text-base font-medium mb-3">Posição do Avatar</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'top', label: 'Topo', icon: '↑' },
              { value: 'center', label: 'Centro', icon: '●' }
            ].map((position) => (
              <button
                key={position.value}
                onClick={() => handleAvatarPositionChange(position.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  avatarSettings.position === position.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">{position.icon}</div>
                <div className="font-medium text-sm">{position.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-medium mb-3">Preview</Label>
          <div className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div 
              className={`${getAvatarSizeClasses(avatarSettings.size)} ${getAvatarShapeClasses(avatarSettings.shape)} ${getAvatarShadowClasses(avatarSettings.shadow)} overflow-hidden`}
              style={{
                borderWidth: `${avatarSettings.borderWidth}px`,
                borderColor: avatarSettings.borderColor,
                borderStyle: 'solid'
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
