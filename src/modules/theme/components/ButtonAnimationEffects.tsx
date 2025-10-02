'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Label } from '@/shared/components/ui/Label'
import { Input } from '@/shared/components/ui/Input'
import { Switch } from '@/shared/components/ui/Switch'
import { Sparkles, Zap, RotateCcw } from 'lucide-react'

interface ButtonAnimationEffectsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function ButtonAnimationEffects({ themeSettings, onUpdate }: ButtonAnimationEffectsProps) {
  const [hoverEffect, setHoverEffect] = useState(themeSettings.hoverEffect || 'scale')
  const [animationSpeed, setAnimationSpeed] = useState(themeSettings.animationSpeed || 300)
  const [enableGlow, setEnableGlow] = useState(themeSettings.enableGlow || false)
  const [enablePulse, setEnablePulse] = useState(themeSettings.enablePulse || false)

  const handleHoverEffectChange = (effect: string) => {
    setHoverEffect(effect)
    onUpdate('hoverEffect', effect)
  }

  const handleAnimationSpeedChange = (speed: number) => {
    setAnimationSpeed(speed)
    onUpdate('animationSpeed', speed)
  }

  const handleGlowToggle = (enabled: boolean) => {
    setEnableGlow(enabled)
    onUpdate('enableGlow', enabled)
  }

  const handlePulseToggle = (enabled: boolean) => {
    setEnablePulse(enabled)
    onUpdate('enablePulse', enabled)
  }

  const hoverEffects = [
    { value: 'scale', label: 'Escala', description: 'Botão cresce ao passar o mouse' },
    { value: 'lift', label: 'Elevação', description: 'Botão se eleva com sombra' },
    { value: 'slide', label: 'Deslizar', description: 'Conteúdo desliza para a direita' },
    { value: 'rotate', label: 'Rotação', description: 'Botão rotaciona levemente' },
    { value: 'glow', label: 'Brilho', description: 'Borda brilha ao passar o mouse' },
    { value: 'none', label: 'Nenhum', description: 'Sem efeitos de hover' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Efeitos de Animação
        </CardTitle>
        <CardDescription>
          Adicione animações e efeitos visuais aos botões
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Efeito de Hover */}
        <div>
          <Label className="text-base font-medium">Efeito de Hover</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {hoverEffects.map((effect) => (
              <button
                key={effect.value}
                onClick={() => handleHoverEffectChange(effect.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  hoverEffect === effect.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-sm">{effect.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{effect.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Velocidade da Animação */}
        <div>
          <Label htmlFor="animationSpeed">Velocidade da Animação (ms)</Label>
          <Input
            id="animationSpeed"
            type="number"
            min="100"
            max="1000"
            step="50"
            value={animationSpeed}
            onChange={(e) => handleAnimationSpeedChange(Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quanto menor o valor, mais rápida a animação
          </p>
        </div>

        {/* Efeitos Especiais */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Efeitos Especiais</Label>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableGlow" className="text-sm font-medium">
                Brilho Neon
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Adiciona um brilho sutil aos botões
              </p>
            </div>
            <Switch
              id="enableGlow"
              checked={enableGlow}
              onCheckedChange={handleGlowToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enablePulse" className="text-sm font-medium">
                Efeito Pulsante
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Botões pulsam suavemente
              </p>
            </div>
            <Switch
              id="enablePulse"
              checked={enablePulse}
              onCheckedChange={handlePulseToggle}
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-medium">Preview</Label>
          <div className="mt-2">
            <div 
              className={`p-4 border-2 border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all ${
                hoverEffect === 'scale' ? 'hover:scale-105' :
                hoverEffect === 'lift' ? 'hover:shadow-lg hover:-translate-y-1' :
                hoverEffect === 'slide' ? 'hover:translate-x-2' :
                hoverEffect === 'rotate' ? 'hover:rotate-1' :
                hoverEffect === 'glow' ? 'hover:shadow-blue-500/50 hover:shadow-lg' :
                ''
              } ${enableGlow ? 'hover:shadow-blue-400/50' : ''} ${enablePulse ? 'animate-pulse' : ''}`}
              style={{
                borderRadius: `${themeSettings?.borderRadius || 8}px`,
                transitionDuration: `${animationSpeed}ms`
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
