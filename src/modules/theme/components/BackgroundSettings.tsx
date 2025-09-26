'use client'

import { useState } from 'react'
import { Label } from '@/shared/components/ui/Label'
import { useImageUpload } from '@/modules/profile/hooks/useImageUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Upload, Image as ImageIcon, Info, Monitor, Smartphone, Tablet } from 'lucide-react'

interface BackgroundSettingsProps {
  themeSettings: any
  onUpdate: (property: string, value: any) => void
}

export function BackgroundSettings({ themeSettings, onUpdate }: BackgroundSettingsProps) {
  const [isUploading, setIsUploading] = useState(false)

  const { uploadBackground } = useImageUpload()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      console.log('🔄 BackgroundSettings: Iniciando upload de background')
      const result = await uploadBackground(file)
      console.log('📥 BackgroundSettings: Resultado do upload:', result)

      if (result.success) {
        const imageUrl = result.url
        console.log('🖼️ BackgroundSettings: URL do background capturada:', imageUrl)
        onUpdate('backgroundImage', imageUrl)
      } else {
        console.error('❌ BackgroundSettings: Erro no upload:', result.error)
      }
    } catch (error) {
      console.error('❌ BackgroundSettings: Erro no upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const backgroundSettings = themeSettings.backgroundSettings || {
    position: 'center',
    size: 'cover',
    repeat: 'no-repeat',
    attachment: 'scroll'
  }

  const handleBackgroundSettingChange = (key: string, value: any) => {
    onUpdate('backgroundSettings', {
      ...backgroundSettings,
      [key]: value,
    })
  }

  const getBackgroundStyle = () => {
    if (themeSettings.backgroundType === 'image' && themeSettings.backgroundImage) {
      return {
        backgroundImage: `url(${themeSettings.backgroundImage})`,
        backgroundPosition: backgroundSettings.position,
        backgroundSize: backgroundSettings.size,
        backgroundRepeat: backgroundSettings.repeat,
        backgroundAttachment: backgroundSettings.attachment,
      }
    }
    return {}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Configurações de Background
        </CardTitle>
        <CardDescription>
          Personalize a aparência do fundo da sua página
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload de Imagem */}
        {themeSettings.backgroundType === 'image' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="backgroundImage"
                  type="text"
                  value={themeSettings.backgroundImage || ''}
                  onChange={(e) => onUpdate('backgroundImage', e.target.value)}
                  placeholder="URL da imagem ou faça upload"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('backgroundUpload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
                <input
                  id="backgroundUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Informações sobre tamanho ideal */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Tamanho Ideal da Imagem
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200">
                        <strong>Desktop:</strong> 1920x1080px
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200">
                        <strong>Tablet:</strong> 1024x768px
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 dark:text-blue-200">
                        <strong>Mobile:</strong> 375x667px
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Dica:</strong> Use imagens com proporção 16:9 para melhor compatibilidade. 
                    Formatos recomendados: JPG, PNG, WebP. Tamanho máximo: 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configurações da Imagem */}
        {themeSettings.backgroundType === 'image' && themeSettings.backgroundImage && (
          <div className="space-y-4">
            <h4 className="font-medium">Configurações da Imagem</h4>
            
            {/* Posição */}
            <div>
              <Label className="text-sm font-medium">Posição da Imagem</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'top left', label: 'Superior Esquerda' },
                  { value: 'top center', label: 'Superior Centro' },
                  { value: 'top right', label: 'Superior Direita' },
                  { value: 'center left', label: 'Centro Esquerda' },
                  { value: 'center', label: 'Centro' },
                  { value: 'center right', label: 'Centro Direita' },
                  { value: 'bottom left', label: 'Inferior Esquerda' },
                  { value: 'bottom center', label: 'Inferior Centro' },
                  { value: 'bottom right', label: 'Inferior Direita' }
                ].map((position) => (
                  <button
                    key={position.value}
                    onClick={() => handleBackgroundSettingChange('position', position.value)}
                    className={`p-2 text-xs rounded border transition-all ${
                      backgroundSettings.position === position.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    {position.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div>
              <Label className="text-sm font-medium">Tamanho da Imagem</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'cover', label: 'Cobrir (Cover)', description: 'Cobre toda a tela' },
                  { value: 'contain', label: 'Conter (Contain)', description: 'Mostra imagem completa' },
                  { value: 'auto', label: 'Automático', description: 'Tamanho original' },
                  { value: '100% 100%', label: 'Esticar', description: 'Força o tamanho' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleBackgroundSettingChange('size', size.value)}
                    className={`p-3 text-sm rounded border transition-all text-left ${
                      backgroundSettings.size === size.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-xs opacity-75">{size.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Repetição */}
            <div>
              <Label className="text-sm font-medium">Repetição da Imagem</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'no-repeat', label: 'Não Repetir' },
                  { value: 'repeat', label: 'Repetir' },
                  { value: 'repeat-x', label: 'Repetir Horizontal' },
                  { value: 'repeat-y', label: 'Repetir Vertical' }
                ].map((repeat) => (
                  <button
                    key={repeat.value}
                    onClick={() => handleBackgroundSettingChange('repeat', repeat.value)}
                    className={`p-2 text-sm rounded border transition-all ${
                      backgroundSettings.repeat === repeat.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    {repeat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Anexo */}
            <div>
              <Label className="text-sm font-medium">Comportamento no Scroll</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'scroll', label: 'Rolar com Conteúdo' },
                  { value: 'fixed', label: 'Fixo (Parallax)' }
                ].map((attachment) => (
                  <button
                    key={attachment.value}
                    onClick={() => handleBackgroundSettingChange('attachment', attachment.value)}
                    className={`p-2 text-sm rounded border transition-all ${
                      backgroundSettings.attachment === attachment.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    {attachment.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {themeSettings.backgroundType === 'image' && themeSettings.backgroundImage && (
          <div>
            <Label className="text-sm font-medium">Preview</Label>
            <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div 
                className="w-full h-32 rounded border"
                style={getBackgroundStyle()}
              />
              <p className="text-xs text-gray-500 mt-2">
                Preview da imagem de fundo com as configurações aplicadas
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
