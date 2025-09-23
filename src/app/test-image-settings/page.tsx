'use client'

import { useState } from 'react'
import { PublicLinkItem } from '@/modules/public/components/PublicLinkItem'
import { Link } from '@prisma/client'

export default function TestImageSettingsPage() {
  const [imageSettings, setImageSettings] = useState({
    position: 'left',
    size: 'medium',
    borderRadius: 'rounded',
    spacing: 'normal'
  })
  
  // Mock de um link para teste
  const mockLink: Link = {
    id: 'test-link',
    title: 'Link de Teste',
    description: 'Descrição do link de teste',
    url: 'https://example.com',
    image: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=IMG',
    order: 1,
    userId: 'test-user',
    type: 'NORMAL',
    useForm: false,
    formId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockThemeSettings = {
    buttonStyle: 'rounded',
    borderRadius: 8,
    primaryColor: '#3B82F6',
    secondaryColor: '#64748B',
    textColor: '#1E293B',
    backgroundColor: '#FFFFFF',
    backgroundType: 'solid',
    fontFamily: 'Inter',
    imageSettings: imageSettings
  }

  const positionOptions = [
    { value: 'left', label: 'Esquerda', icon: '←' },
    { value: 'right', label: 'Direita', icon: '→' },
    { value: 'top', label: 'Cima', icon: '↑' },
    { value: 'bottom', label: 'Baixo', icon: '↓' }
  ]

  const sizeOptions = [
    { value: 'small', label: 'Pequeno', size: 'w-6 h-6' },
    { value: 'medium', label: 'Médio', size: 'w-8 h-8' },
    { value: 'large', label: 'Grande', size: 'w-12 h-12' }
  ]

  const borderRadiusOptions = [
    { value: 'rounded-none', label: 'Sem arredondamento' },
    { value: 'rounded-sm', label: 'Pouco arredondado' },
    { value: 'rounded', label: 'Arredondado' },
    { value: 'rounded-lg', label: 'Muito arredondado' },
    { value: 'rounded-full', label: 'Circular' }
  ]

  const spacingOptions = [
    { value: 'tight', label: 'Apertado' },
    { value: 'normal', label: 'Normal' },
    { value: 'loose', label: 'Espaçoso' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Teste de Configurações de Imagem</h1>
          
          {/* Controles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Posição */}
            <div>
              <h3 className="font-medium mb-3">Posição</h3>
              <div className="space-y-2">
                {positionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setImageSettings({...imageSettings, position: option.value})}
                    className={`w-full p-2 rounded border-2 transition-all text-left ${
                      imageSettings.position === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div>
              <h3 className="font-medium mb-3">Tamanho</h3>
              <div className="space-y-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setImageSettings({...imageSettings, size: option.value})}
                    className={`w-full p-2 rounded border-2 transition-all text-center ${
                      imageSettings.size === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <div className={`${option.size} bg-gray-300 rounded`} />
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Arredondamento */}
            <div>
              <h3 className="font-medium mb-3">Arredondamento</h3>
              <div className="space-y-2">
                {borderRadiusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setImageSettings({...imageSettings, borderRadius: option.value})}
                    className={`w-full p-2 rounded border-2 transition-all text-left ${
                      imageSettings.borderRadius === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Espaçamento */}
            <div>
              <h3 className="font-medium mb-3">Espaçamento</h3>
              <div className="space-y-2">
                {spacingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setImageSettings({...imageSettings, spacing: option.value})}
                    className={`w-full p-2 rounded border-2 transition-all text-left ${
                      imageSettings.spacing === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-medium mb-3">Preview</h3>
            <div className="space-y-2">
              <PublicLinkItem
                link={mockLink}
                onClick={() => console.log('Link clicado')}
                themeSettings={mockThemeSettings}
              />
            </div>
          </div>

          {/* Configurações atuais */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Configurações Atuais</h3>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(imageSettings, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
