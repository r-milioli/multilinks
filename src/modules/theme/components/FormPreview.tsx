'use client'

import { ThemeSettings } from '@/types/common.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Eye, FileText } from 'lucide-react'

interface FormPreviewProps {
  themeSettings: ThemeSettings
  className?: string
}

export function FormPreview({ themeSettings, className = '' }: FormPreviewProps) {
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

  const getShadowClass = (shadow: string) => {
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
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeSettings.textColor }}>
        <FileText className="w-5 h-5" />
        Preview do Formulário
      </h3>
      
      <div 
        className={`p-4 border-2 border-dashed border-gray-300 ${getBorderRadiusClass(formModalSettings.borderRadius)}`}
        style={{
          backgroundColor: themeSettings.backgroundColor || '#F8FAFC'
        }}
      >
        {/* Simulação do Modal */}
        <div 
          className={`max-w-sm mx-auto ${getShadowClass(formModalSettings.shadow)} ${getBorderRadiusClass(formModalSettings.borderRadius)} overflow-hidden`}
          style={{
            backgroundColor: formModalSettings.backgroundColor,
            border: `1px solid ${formModalSettings.borderColor}`,
            backdropFilter: formModalSettings.backdropBlur ? 'blur(8px)' : 'none'
          }}
        >
          {/* Header do Modal */}
          <div className="p-6 pb-4">
            <h4 
              className="text-xl font-bold mb-2"
              style={{ 
                color: formModalSettings.titleColor,
                fontFamily: themeSettings.fontFamily || 'Inter'
              }}
            >
              Formulário de Contato
            </h4>
            <p 
              className="text-sm mb-4"
              style={{ 
                color: formModalSettings.descriptionColor,
                fontFamily: themeSettings.fontFamily || 'Inter'
              }}
            >
              Preencha os campos abaixo para entrar em contato
            </p>

            {/* Campos do Formulário */}
            <div className="space-y-4">
              {/* Campo Nome */}
              <div>
                <Label 
                  htmlFor="preview-name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: formModalSettings.textColor }}
                >
                  Nome *
                </Label>
                <Input
                  id="preview-name"
                  type="text"
                  placeholder="Digite seu nome"
                  className="w-full"
                  style={{
                    backgroundColor: formModalSettings.inputBackgroundColor,
                    borderColor: formModalSettings.inputBorderColor,
                    color: formModalSettings.inputTextColor,
                    borderRadius: `${Math.min(formModalSettings.borderRadius, 8)}px`
                  }}
                  readOnly
                />
              </div>

              {/* Campo Email */}
              <div>
                <Label 
                  htmlFor="preview-email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: formModalSettings.textColor }}
                >
                  Email *
                </Label>
                <Input
                  id="preview-email"
                  type="email"
                  placeholder="Digite seu email"
                  className="w-full"
                  style={{
                    backgroundColor: formModalSettings.inputBackgroundColor,
                    borderColor: formModalSettings.inputBorderColor,
                    color: formModalSettings.inputTextColor,
                    borderRadius: `${Math.min(formModalSettings.borderRadius, 8)}px`
                  }}
                  readOnly
                />
              </div>

              {/* Campo WhatsApp */}
              <div>
                <Label 
                  htmlFor="preview-whatsapp"
                  className="block text-sm font-medium mb-2"
                  style={{ color: formModalSettings.textColor }}
                >
                  WhatsApp
                </Label>
                <Input
                  id="preview-whatsapp"
                  type="tel"
                  placeholder="Digite seu WhatsApp"
                  className="w-full"
                  style={{
                    backgroundColor: formModalSettings.inputBackgroundColor,
                    borderColor: formModalSettings.inputBorderColor,
                    color: formModalSettings.inputTextColor,
                    borderRadius: `${Math.min(formModalSettings.borderRadius, 8)}px`
                  }}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Footer do Modal */}
          <div className="px-6 pb-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: formModalSettings.borderColor,
                  color: formModalSettings.textColor,
                  borderRadius: `${Math.min(formModalSettings.borderRadius, 8)}px`
                }}
                disabled
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                style={{
                  backgroundColor: formModalSettings.buttonBackgroundColor,
                  color: formModalSettings.buttonTextColor,
                  border: 'none',
                  borderRadius: `${Math.min(formModalSettings.borderRadius, 8)}px`
                }}
                disabled
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        {/* Indicador de Preview */}
        <div className="mt-4 text-center">
          <span 
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: formModalSettings.successColor,
              color: '#FFFFFF'
            }}
          >
            <Eye className="w-3 h-3" />
            Preview do Modal
          </span>
        </div>
      </div>
    </div>
  )
}
