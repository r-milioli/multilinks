'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ImageIcon, Move, Maximize2 } from 'lucide-react'

interface ImageSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function ImageSettings({ themeSettings, onUpdate }: ImageSettingsProps) {
  const imageSettings = themeSettings.imageSettings || {
    position: 'left',
    size: 'medium'
  }

  const handleImagePositionChange = (position: string) => {
    onUpdate('imageSettings', {
      ...imageSettings,
      position
    })
  }

  const handleImageSizeChange = (size: string) => {
    onUpdate('imageSettings', {
      ...imageSettings,
      size
    })
  }

  const getImageSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-6 h-6'
      case 'medium':
        return 'w-8 h-8'
      case 'large':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  const getImagePositionClasses = (position: string) => {
    switch (position) {
      case 'left':
        return 'flex-row'
      case 'right':
        return 'flex-row-reverse'
      case 'top':
        return 'flex-col'
      case 'bottom':
        return 'flex-col-reverse'
      default:
        return 'flex-row'
    }
  }

  const getImageSpacingClasses = (position: string) => {
    switch (position) {
      case 'left':
      case 'right':
        return 'space-x-3'
      case 'top':
      case 'bottom':
        return 'space-y-2'
      default:
        return 'space-x-3'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Configurações da Imagem
        </CardTitle>
        <CardDescription>
          Personalize a posição e tamanho das imagens nos botões
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Posição da Imagem */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Move className="w-4 h-4" />
            Posição da Imagem
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'left', label: 'Esquerda', icon: '←' },
              { value: 'right', label: 'Direita', icon: '→' },
              { value: 'top', label: 'Cima', icon: '↑' },
              { value: 'bottom', label: 'Baixo', icon: '↓' }
            ].map((position) => (
              <button
                key={position.value}
                onClick={() => handleImagePositionChange(position.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left min-w-0 ${
                  imageSettings.position === position.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg flex-shrink-0">{position.icon}</span>
                  <span className="font-medium truncate">{position.label}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {position.value === 'left' && 'Imagem à esquerda do texto'}
                  {position.value === 'right' && 'Imagem à direita do texto'}
                  {position.value === 'top' && 'Imagem acima do texto'}
                  {position.value === 'bottom' && 'Imagem abaixo do texto'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tamanho da Imagem */}
        <div>
          <Label className="text-base font-medium flex items-center gap-2 mb-3">
            <Maximize2 className="w-4 h-4" />
            Tamanho da Imagem
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'small', label: 'Pequeno', size: 'w-6 h-6' },
              { value: 'medium', label: 'Médio', size: 'w-8 h-8' },
              { value: 'large', label: 'Grande', size: 'w-12 h-12' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => handleImageSizeChange(size.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  imageSettings.size === size.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-2">
                  <div 
                    className={`${size.size} bg-gray-300 dark:bg-gray-600 rounded`}
                  />
                </div>
                <div className="font-medium text-sm">{size.label}</div>
                <div className="text-xs text-gray-500">
                  {size.value === 'small' && '24x24px'}
                  {size.value === 'medium' && '32x32px'}
                  {size.value === 'large' && '48x48px'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-medium mb-3">Preview</Label>
          <div className="space-y-2">
            <div 
              className={`p-4 rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 shadow-sm transition-all hover:scale-[1.02] ${getImagePositionClasses(imageSettings.position)} ${getImageSpacingClasses(imageSettings.position)}`}
            >
              {/* Imagem */}
              <div className="flex-shrink-0">
                <div 
                  className={`${getImageSizeClasses(imageSettings.size)} bg-gray-300 dark:bg-gray-600 rounded`}
                />
              </div>
              
              {/* Conteúdo do texto */}
              <div className="flex-1 min-w-0">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações Avançadas */}
        <div>
          <Label className="text-base font-medium mb-3">Configurações Avançadas</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="image-border-radius" className="text-sm">
                Arredondamento da Imagem
              </Label>
              <select
                id="image-border-radius"
                value={imageSettings.borderRadius || 'rounded'}
                onChange={(e) => onUpdate('imageSettings', {
                  ...imageSettings,
                  borderRadius: e.target.value
                })}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="rounded-none">Sem arredondamento</option>
                <option value="rounded-sm">Pouco arredondado</option>
                <option value="rounded">Arredondado</option>
                <option value="rounded-lg">Muito arredondado</option>
                <option value="rounded-full">Circular</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="image-spacing" className="text-sm">
                Espaçamento
              </Label>
              <select
                id="image-spacing"
                value={imageSettings.spacing || 'normal'}
                onChange={(e) => onUpdate('imageSettings', {
                  ...imageSettings,
                  spacing: e.target.value
                })}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="tight">Apertado</option>
                <option value="normal">Normal</option>
                <option value="loose">Espaçoso</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
