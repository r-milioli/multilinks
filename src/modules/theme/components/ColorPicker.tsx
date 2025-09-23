'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { Input } from '@/shared/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Palette } from 'lucide-react'

interface ColorPickerProps {
  label: string
  description?: string
  value: string
  onChange: (color: string) => void
  presetColors?: string[]
}

export function ColorPicker({ label, description, value, onChange, presetColors }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultPresetColors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#A855F7', // Purple
    '#000000', // Black
    '#374151', // Gray
    '#6B7280', // Gray 500
    '#9CA3AF'  // Gray 400
  ]

  const colors = presetColors || defaultPresetColors

  return (
    <div className="space-y-2">
      <Label htmlFor={`color-${label}`} className="text-sm font-medium">
        {label}
      </Label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Input de cor */}
        <div className="relative">
          <Input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        
        {/* Input de texto */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
        />
        
        {/* Preview da cor */}
        <div 
          className="w-10 h-10 rounded border border-gray-300"
          style={{ backgroundColor: value }}
        />
      </div>

      {/* Cores pré-definidas */}
      <div className="grid grid-cols-8 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
              value === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}

interface ButtonColorSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function ButtonColorSettings({ themeSettings, onUpdate }: ButtonColorSettingsProps) {
  const buttonColors = themeSettings.buttonColors || {
    background: '#FFFFFF',
    text: '#1E293B',
    border: '#E5E7EB',
    hoverBackground: '#F9FAFB',
    hoverText: '#1E293B',
    hoverBorder: '#D1D5DB'
  }

  const handleColorChange = (colorType: string, color: string) => {
    const newButtonColors = {
      ...buttonColors,
      [colorType]: color
    }
    onUpdate('buttonColors', newButtonColors)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Cores dos Botões
        </CardTitle>
        <CardDescription>
          Personalize as cores dos botões da sua página
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cores principais */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Cores Principais</h4>
            
            <ColorPicker
              label="Fundo"
              description="Cor de fundo do botão"
              value={buttonColors.background}
              onChange={(color) => handleColorChange('background', color)}
            />
            
            <ColorPicker
              label="Texto"
              description="Cor do texto do botão"
              value={buttonColors.text}
              onChange={(color) => handleColorChange('text', color)}
            />
            
            <ColorPicker
              label="Borda"
              description="Cor da borda do botão"
              value={buttonColors.border}
              onChange={(color) => handleColorChange('border', color)}
            />
          </div>

          {/* Cores de hover */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Cores de Hover</h4>
            
            <ColorPicker
              label="Fundo (Hover)"
              description="Cor de fundo ao passar o mouse"
              value={buttonColors.hoverBackground}
              onChange={(color) => handleColorChange('hoverBackground', color)}
            />
            
            <ColorPicker
              label="Texto (Hover)"
              description="Cor do texto ao passar o mouse"
              value={buttonColors.hoverText}
              onChange={(color) => handleColorChange('hoverText', color)}
            />
            
            <ColorPicker
              label="Borda (Hover)"
              description="Cor da borda ao passar o mouse"
              value={buttonColors.hoverBorder}
              onChange={(color) => handleColorChange('hoverBorder', color)}
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Preview</h4>
          <div className="space-y-2">
            <div 
              className="p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              style={{
                backgroundColor: buttonColors.background,
                color: buttonColors.text,
                borderColor: buttonColors.border
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = buttonColors.hoverBackground
                e.currentTarget.style.color = buttonColors.hoverText
                e.currentTarget.style.borderColor = buttonColors.hoverBorder
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = buttonColors.background
                e.currentTarget.style.color = buttonColors.text
                e.currentTarget.style.borderColor = buttonColors.border
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: buttonColors.text, opacity: 0.3 }}
                />
                <div className="flex-1">
                  <div 
                    className="h-3 rounded mb-1"
                    style={{ backgroundColor: buttonColors.text, opacity: 0.8 }}
                  />
                  <div 
                    className="h-2 rounded w-2/3"
                    style={{ backgroundColor: buttonColors.text, opacity: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temas de cores pré-definidos */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Temas de Cores</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                name: 'Padrão',
                colors: {
                  background: '#FFFFFF',
                  text: '#1E293B',
                  border: '#E5E7EB',
                  hoverBackground: '#F9FAFB',
                  hoverText: '#1E293B',
                  hoverBorder: '#D1D5DB'
                }
              },
              {
                name: 'Escuro',
                colors: {
                  background: '#1F2937',
                  text: '#F9FAFB',
                  border: '#374151',
                  hoverBackground: '#374151',
                  hoverText: '#F9FAFB',
                  hoverBorder: '#4B5563'
                }
              },
              {
                name: 'Azul',
                colors: {
                  background: '#3B82F6',
                  text: '#FFFFFF',
                  border: '#2563EB',
                  hoverBackground: '#2563EB',
                  hoverText: '#FFFFFF',
                  hoverBorder: '#1D4ED8'
                }
              },
              {
                name: 'Verde',
                colors: {
                  background: '#10B981',
                  text: '#FFFFFF',
                  border: '#059669',
                  hoverBackground: '#059669',
                  hoverText: '#FFFFFF',
                  hoverBorder: '#047857'
                }
              }
            ].map((theme) => (
              <button
                key={theme.name}
                onClick={() => onUpdate('buttonColors', theme.colors)}
                className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.text }}
                  />
                </div>
                <div className="text-sm font-medium">{theme.name}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
