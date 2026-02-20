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

const DEFAULT_FORM_MODAL_SETTINGS = {
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

export function FormPreview({ themeSettings, className = '' }: FormPreviewProps) {
  const formModalSettings = {
    ...DEFAULT_FORM_MODAL_SETTINGS,
    ...(themeSettings.formModalSettings || {})
  }

  const shadowMap: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  }
  const modalBoxShadow = shadowMap[formModalSettings.shadow] ?? shadowMap.lg

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
        className={`relative p-4 border-2 border-dashed border-gray-300 ${getBorderRadiusClass(formModalSettings.borderRadius)}`}
        style={{
          backgroundColor: themeSettings.backgroundColor || '#F8FAFC'
        }}
      >
        {/* Overlay de blur (atrás do modal) quando ativado */}
        {formModalSettings.backdropBlur && (
          <div
            className="absolute inset-0 z-0"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            aria-hidden
          />
        )}
        {/* Simulação do Modal */}
        <div 
          className={`relative z-10 max-w-sm mx-auto ${getBorderRadiusClass(formModalSettings.borderRadius)} overflow-hidden`}
          style={{
            backgroundColor: formModalSettings.backgroundColor,
            border: `1px solid ${formModalSettings.borderColor}`,
            boxShadow: modalBoxShadow
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
              <div className="form-preview-submit-wrapper flex-1">
                <style>{`
                  .form-preview-submit-wrapper button:hover:not(:disabled) {
                    background-color: ${formModalSettings.buttonHoverBackgroundColor ?? formModalSettings.buttonBackgroundColor} !important;
                    color: ${formModalSettings.buttonHoverTextColor ?? formModalSettings.buttonTextColor} !important;
                  }
                `}</style>
                <Button
                  className="w-full transition-colors"
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
