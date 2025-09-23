'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Label } from '@/shared/components/ui/Label'
import { Input } from '@/shared/components/ui/Input'
import { Loader2, Upload, Palette, Type, Layout, Image as ImageIcon, Save, RotateCcw, User } from 'lucide-react'
import { useTheme } from '@/modules/theme/hooks/useTheme'
import { ThemePreview } from '@/modules/theme/components/ThemePreview'
import { toast } from 'react-hot-toast'
import { PRESET_THEMES, AVAILABLE_FONTS, BUTTON_STYLES, BACKGROUND_TYPES } from '@/shared/utils/constants'
import { useImageUpload } from '@/modules/profile/hooks/useImageUpload'
import { AvatarUpload } from '@/modules/profile/components/AvatarUpload'
import { useSession } from 'next-auth/react'

export function ThemeEditorContent() {
  const { data: session, update: updateSession } = useSession()
  const {
    themeSettings,
    isLoading,
    isSaving,
    saveTheme,
    applyPresetTheme,
    updateThemeProperty,
    resetToDefault
  } = useTheme()
  const { uploadAvatar, isUploading } = useImageUpload()

  const [localTheme, setLocalTheme] = useState(themeSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    setLocalTheme(themeSettings)
  }, [themeSettings])

  // Carregar avatar diretamente do banco de dados
  useEffect(() => {
    const loadUserAvatar = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data?.avatar) {
              setCurrentAvatar(data.data.avatar)
            } else {
              setCurrentAvatar('')
            }
          }
        } catch (error) {
          console.error('Erro ao carregar avatar:', error)
        }
      }
    }
    
    loadUserAvatar()
  }, [session?.user?.id])

  const handleUpdateProperty = (property: string, value: any) => {
    const updatedTheme = { ...localTheme, [property]: value }
    setLocalTheme(updatedTheme)
    setHasChanges(true)
  }

  const handleSave = async () => {
    console.log('Salvando tema:', localTheme)
    const result = await saveTheme(localTheme)
    if (result.success) {
      toast.success('Tema salvo com sucesso!')
      setHasChanges(false)
    } else {
      toast.error(result.error || 'Erro ao salvar tema')
    }
  }

  const handleReset = async () => {
    const result = await resetToDefault()
    if (result.success) {
      toast.success('Tema restaurado para o padrão')
      setHasChanges(false)
    }
  }

  const handlePresetSelect = async (presetKey: string) => {
    const preset = PRESET_THEMES[presetKey as keyof typeof PRESET_THEMES]
    if (preset) {
      setLocalTheme(preset)
      setHasChanges(true)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadAvatar(file)
    if (result.success && result.data) {
      console.log('Imagem de background carregada:', result.data.url)
      // Definir tanto a imagem quanto o tipo de background
      const updatedTheme = { 
        ...localTheme, 
        backgroundImage: result.data.url,
        backgroundType: 'image'
      }
      setLocalTheme(updatedTheme)
      setHasChanges(true)
    }
  }

  const handleAvatarUpload = async (file: File, cropData?: any) => {
    setAvatarUploading(true)
    try {
      // Upload de nova imagem
      const result = await uploadAvatar(file, cropData)
      if (result.success && result.data) {
        // Atualizar o avatar no banco de dados
        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatar: result.data.url }),
        })

        if (response.ok) {
          setCurrentAvatar(result.data.url)
          // Forçar atualização da sessão
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              avatar: result.data.url
            }
          })
          toast.success('Foto de perfil atualizada!')
        } else {
          toast.error('Erro ao salvar foto de perfil')
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error)
      toast.error('Erro ao atualizar foto de perfil')
    } finally {
      setAvatarUploading(false)
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Personalização da Página Pública</h2>
        <p className="text-gray-600 mt-2">
          Customize a aparência da sua página pública com cores, fontes, estilos de botão e backgrounds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna de Edição */}
        <div className="space-y-6">
          {/* Foto de Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Foto de Perfil
              </CardTitle>
              <CardDescription>
                Adicione ou altere sua foto de perfil
              </CardDescription>
            </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AvatarUpload
                      onUpload={handleAvatarUpload}
                      isUploading={avatarUploading || isUploading}
                      currentAvatar={currentAvatar}
                    />
                    
                  </div>
                </CardContent>
          </Card>

          {/* Temas Predefinidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Temas Predefinidos
              </CardTitle>
              <CardDescription>
                Escolha um tema pronto ou personalize do zero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PRESET_THEMES).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetSelect(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      JSON.stringify(localTheme) === JSON.stringify(preset)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.secondaryColor }}
                      />
                    </div>
                    <span className="capitalize">{key}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cores
              </CardTitle>
              <CardDescription>
                Defina as cores da sua página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={localTheme.primaryColor}
                      onChange={(e) => handleUpdateProperty('primaryColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.primaryColor}
                      onChange={(e) => handleUpdateProperty('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={localTheme.secondaryColor}
                      onChange={(e) => handleUpdateProperty('secondaryColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.secondaryColor}
                      onChange={(e) => handleUpdateProperty('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={localTheme.textColor}
                      onChange={(e) => handleUpdateProperty('textColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.textColor}
                      onChange={(e) => handleUpdateProperty('textColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={localTheme.backgroundColor}
                      onChange={(e) => handleUpdateProperty('backgroundColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.backgroundColor}
                      onChange={(e) => handleUpdateProperty('backgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipografia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Tipografia
              </CardTitle>
              <CardDescription>
                Escolha a fonte da sua página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="fontFamily">Família da Fonte</Label>
                  <select
                    id="fontFamily"
                    value={localTheme.fontFamily}
                    onChange={(e) => handleUpdateProperty('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                  >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Estilo dos Botões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Estilo dos Botões
              </CardTitle>
              <CardDescription>
                Como os botões devem aparecer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {BUTTON_STYLES.map((style) => (
                  <label
                    key={style.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      localTheme.buttonStyle === style.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="buttonStyle"
                      value={style.value}
                      checked={localTheme.buttonStyle === style.value}
                      onChange={(e) => handleUpdateProperty('buttonStyle', e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-gray-500">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <Label htmlFor="borderRadius">Raio da Borda (px)</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  min="0"
                  max="50"
                  value={localTheme.borderRadius}
                  onChange={(e) => handleUpdateProperty('borderRadius', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Background
              </CardTitle>
              <CardDescription>
                Tipo de fundo da página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {BACKGROUND_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      localTheme.backgroundType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="backgroundType"
                      value={type.value}
                      checked={localTheme.backgroundType === type.value}
                      onChange={() => handleUpdateProperty('backgroundType', type.value)}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {localTheme.backgroundType === 'image' && (
                <div>
                  <Label htmlFor="backgroundImage">Imagem de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundImage"
                      type="text"
                      value={localTheme.backgroundImage || ''}
                      onChange={(e) => handleUpdateProperty('backgroundImage', e.target.value)}
                      placeholder="URL da imagem"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna de Preview */}
        <div className="lg:sticky lg:top-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview ao Vivo</CardTitle>
              <CardDescription>
                Veja como sua página ficará com as configurações atuais
              </CardDescription>
            </CardHeader>
                <CardContent>
                  <ThemePreview 
                    key={`theme-preview-${currentAvatar || 'no-avatar'}`}
                    themeSettings={localTheme} 
                    avatarUrl={currentAvatar} 
                  />
                </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
