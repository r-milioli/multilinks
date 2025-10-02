'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Label } from '@/shared/components/ui/Label'
import { Input } from '@/shared/components/ui/Input'
import { Loader2, Upload, Palette, Type, Layout, Image as ImageIcon, Save, RotateCcw, User, MousePointer, Settings, Sparkles, Layers, Eye, Link, Share2, FileText } from 'lucide-react'
import { useTheme } from '@/modules/theme/hooks/useTheme'
import { ThemePreview } from '@/modules/theme/components/ThemePreview'
import { toast } from 'react-hot-toast'
import { PRESET_THEMES, AVAILABLE_FONTS, BUTTON_STYLES, BACKGROUND_TYPES } from '@/shared/utils/constants'
import { ButtonStylePreview } from '@/modules/theme/components/ButtonStylePreview'
import { ButtonAnimationEffects } from '@/modules/theme/components/ButtonAnimationEffects'
import { ButtonColorSettings } from '@/modules/theme/components/ColorPicker'
import { ImageSettings } from '@/modules/theme/components/ImageSettings'
import { AvatarSettings } from '@/modules/theme/components/AvatarSettings'
import { LinkButtonSettings } from '@/modules/theme/components/LinkButtonSettings'
import { SocialButtonsSettings } from '@/modules/theme/components/SocialButtonsSettings'
import { BackgroundSettings } from '@/modules/theme/components/BackgroundSettings'
import { FormModalSettings } from '@/modules/theme/components/FormModalSettings'
import { FormPreview } from '@/modules/theme/components/FormPreview'
import { CollapsibleSection } from '@/modules/theme/components/CollapsibleSection'
import { useImageUpload } from '@/modules/profile/hooks/useImageUpload'
import { AvatarUpload } from '@/modules/profile/components/AvatarUpload'
import { useSession } from 'next-auth/react'
import { FeatureGuard } from '@/shared/components/FeatureGuard'

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
    // Se o valor é um objeto, fazer merge. Se não, substituir diretamente
    const updatedTheme = { 
      ...localTheme, 
      [property]: typeof value === 'object' && value !== null && !Array.isArray(value)
        ? {
            ...(localTheme as any)[property],
            ...value
          }
        : value
    }
    setLocalTheme(updatedTheme as any)
    setHasChanges(true)
  }

  const handleThemeUpdate = (property: string, value: any) => {
    const updatedTheme = { ...localTheme, [property]: value }
    setLocalTheme(updatedTheme)
    setHasChanges(true)
  }

  const handleSave = async () => {
    console.log('💾 Salvando tema:', localTheme)
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
      console.log('🔄 ThemeEditorContent: Iniciando upload de avatar')
      // Upload de nova imagem
      const result = await uploadAvatar(file, cropData)
      console.log('📥 ThemeEditorContent: Resultado do upload:', result)

      if (!result) {
        console.error('❌ ThemeEditorContent: uploadAvatar retornou undefined')
        return { success: false, error: 'Erro no upload' }
      }

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
          return result
        } else {
          const errorMessage = 'Erro ao salvar foto de perfil'
          toast.error(errorMessage)
          return { success: false, error: errorMessage }
        }
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar foto de perfil'
      console.error('❌ ThemeEditorContent: Erro ao atualizar avatar:', error)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
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
    <FeatureGuard feature="themeEditing">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Personalização da Página Pública</h2>
          <p className="text-gray-600 mt-2">
            Customize a aparência da sua página pública com cores, fontes, estilos de botão e backgrounds
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna de Configurações - Scrollável no Desktop */}
        <div className="space-y-4 lg:max-h-screen lg:overflow-y-auto lg:pr-4 lg:pb-8">
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

          {/* Seção: Temas Predefinidos */}
          <CollapsibleSection
            title="Temas Predefinidos"
            description="Escolha um tema pronto ou personalize do zero"
            icon={<Palette className="w-5 h-5" />}
            defaultOpen={true}
            badge={Object.keys(PRESET_THEMES).length}
          >
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
          </CollapsibleSection>

          {/* Seção: Cores */}
          <CollapsibleSection
            title="Cores"
            description="Defina as cores da sua página"
            icon={<Palette className="w-5 h-5" />}
            defaultOpen={true}
          >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor" className="text-sm font-medium">
                      Cor Primária
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Usada para gradientes e elementos de destaque
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={localTheme.primaryColor || '#3B82F6'}
                        onChange={(e) => handleUpdateProperty('primaryColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        type="text"
                        value={localTheme.primaryColor || '#3B82F6'}
                        onChange={(e) => handleUpdateProperty('primaryColor', e.target.value)}
                        className="flex-1"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor" className="text-sm font-medium">
                      Cor Secundária
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Usada para gradientes e elementos secundários
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={localTheme.secondaryColor || '#64748B'}
                        onChange={(e) => handleUpdateProperty('secondaryColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        type="text"
                        value={localTheme.secondaryColor || '#64748B'}
                        onChange={(e) => handleUpdateProperty('secondaryColor', e.target.value)}
                        className="flex-1"
                        placeholder="#64748B"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backgroundColor" className="text-sm font-medium">
                      Cor de Fundo Sólida
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Cor de fundo quando usar fundo sólido
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={localTheme.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleUpdateProperty('backgroundColor', e.target.value)}
                        className="h-10 w-20"
                      />
                      <Input
                        type="text"
                        value={localTheme.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleUpdateProperty('backgroundColor', e.target.value)}
                        className="flex-1"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
              </div>
          </CollapsibleSection>

          {/* Seção: Cores de Texto Individual */}
          <CollapsibleSection
            title="Cores de Texto Individual"
            description="Configure cores específicas para cada tipo de texto"
            icon={<Type className="w-5 h-5" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nameColor" className="text-sm font-medium">
                    Cor do Nome
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Cor do nome principal do usuário
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="nameColor"
                      type="color"
                      value={localTheme.nameColor || localTheme.textColor || '#1E293B'}
                      onChange={(e) => handleUpdateProperty('nameColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.nameColor || localTheme.textColor || '#1E293B'}
                      onChange={(e) => handleUpdateProperty('nameColor', e.target.value)}
                      className="flex-1"
                      placeholder="#1E293B"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="titleColor" className="text-sm font-medium">
                    Cor do Título
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Cor do título/subtítulo do usuário
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="titleColor"
                      type="color"
                      value={localTheme.titleColor || localTheme.secondaryColor || '#64748B'}
                      onChange={(e) => handleUpdateProperty('titleColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.titleColor || localTheme.secondaryColor || '#64748B'}
                      onChange={(e) => handleUpdateProperty('titleColor', e.target.value)}
                      className="flex-1"
                      placeholder="#64748B"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bioColor" className="text-sm font-medium">
                    Cor da Biografia
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Cor do texto da biografia/descrição
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="bioColor"
                      type="color"
                      value={localTheme.bioColor || localTheme.textColor || '#1E293B'}
                      onChange={(e) => handleUpdateProperty('bioColor', e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={localTheme.bioColor || localTheme.textColor || '#1E293B'}
                      onChange={(e) => handleUpdateProperty('bioColor', e.target.value)}
                      className="flex-1"
                      placeholder="#1E293B"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Seção: Tipografia */}
          <CollapsibleSection
            title="Tipografia"
            description="Configure a fonte e estilo do texto"
            icon={<Type className="w-5 h-5" />}
            defaultOpen={false}
          >
            <div>
              <Label htmlFor="fontFamily">Família da Fonte</Label>
                <select
                  id="fontFamily"
                  value={localTheme.fontFamily || 'Inter'}
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
          </CollapsibleSection>

          {/* Seção: Estilo dos Botões */}
          <CollapsibleSection
            title="Estilo dos Botões"
            description="Configure o visual dos botões"
            icon={<Layout className="w-5 h-5" />}
            defaultOpen={false}
          >
            <ButtonStylePreview
              selectedStyle={localTheme.buttonStyle || 'rounded'}
              onStyleSelect={(style) => handleUpdateProperty('buttonStyle', style)}
              themeSettings={localTheme}
            />

            <div className="mt-4">
              <Label htmlFor="borderRadius">Raio da Borda (px)</Label>
              <Input
                id="borderRadius"
                type="number"
                min="0"
                max="50"
                value={localTheme.borderRadius || 8}
                onChange={(e) => handleUpdateProperty('borderRadius', parseInt(e.target.value))}
              />
            </div>
          </CollapsibleSection>

          {/* Seção: Efeitos de Animação */}
          <CollapsibleSection
            title="Efeitos de Animação"
            description="Configure animações e transições"
            icon={<Sparkles className="w-5 h-5" />}
            defaultOpen={false}
          >
            <ButtonAnimationEffects
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Cores dos Botões */}
          <CollapsibleSection
            title="Cores dos Botões"
            description="Personalize as cores dos botões"
            icon={<Palette className="w-5 h-5" />}
            defaultOpen={false}
          >
            <ButtonColorSettings
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Configurações da Imagem */}
          <CollapsibleSection
            title="Configurações da Imagem"
            description="Posição e tamanho das imagens"
            icon={<ImageIcon className="w-5 h-5" />}
            defaultOpen={false}
          >
            <ImageSettings
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Configurações do Avatar */}
          <CollapsibleSection
            title="Configurações do Avatar"
            description="Tamanho, forma e estilo do avatar"
            icon={<User className="w-5 h-5" />}
            defaultOpen={false}
          >
            <AvatarSettings
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Configurações dos Botões de Links */}
          <CollapsibleSection
            title="Configurações dos Botões de Links"
            description="Estilo e comportamento dos botões de links"
            icon={<Link className="w-5 h-5" />}
            defaultOpen={false}
          >
            <LinkButtonSettings
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Configurações dos Botões de Redes Sociais */}
          <CollapsibleSection
            title="Configurações dos Botões de Redes Sociais"
            description="Estilo e comportamento dos botões de redes sociais"
            icon={<Share2 className="w-5 h-5" />}
            defaultOpen={false}
          >
            <SocialButtonsSettings
              themeSettings={localTheme}
              onUpdate={handleUpdateProperty}
            />
          </CollapsibleSection>

          {/* Seção: Background */}
          <CollapsibleSection
            title="Background"
            description="Tipo de fundo da página"
            icon={<Layers className="w-5 h-5" />}
            defaultOpen={false}
          >
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
                <BackgroundSettings
                  themeSettings={localTheme}
                  onUpdate={handleUpdateProperty}
                />
              )}
          </CollapsibleSection>

          {/* Configurações dos Botões de Links */}
          <CollapsibleSection
            title="Configurações dos Botões de Links"
            description="Personalize a aparência dos botões de links"
            icon={<Link className="w-5 h-5" />}
            defaultOpen={false}
          >
            <LinkButtonSettings 
              themeSettings={localTheme} 
              onUpdate={handleThemeUpdate} 
            />
          </CollapsibleSection>

          {/* Configurações do Modal de Formulário */}
          <CollapsibleSection
            title="Configurações do Modal de Formulário"
            description="Personalize a aparência dos formulários"
            icon={<FileText className="w-5 h-5" />}
            defaultOpen={false}
          >
            <FormModalSettings 
              themeSettings={localTheme} 
              onUpdate={handleThemeUpdate} 
            />
          </CollapsibleSection>
        </div>

        {/* Coluna de Preview - Fixa no Desktop, Normal no Mobile */}
        <div className="lg:sticky lg:top-4 lg:h-screen lg:overflow-hidden space-y-4">
          <div className="lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2">
          <CollapsibleSection
            title="Preview"
            description="Visualize suas alterações em tempo real"
            icon={<Eye className="w-5 h-5" />}
            defaultOpen={true}
          >
            <ThemePreview 
              key={`theme-preview-${currentAvatar || 'no-avatar'}`}
              themeSettings={localTheme} 
              avatarUrl={currentAvatar} 
            />
          </CollapsibleSection>

          {/* Preview do Formulário */}
          <CollapsibleSection
            title="Preview do Formulário"
            description="Visualize como ficará o modal de formulário"
            icon={<FileText className="w-5 h-5" />}
            defaultOpen={true}
          >
            <FormPreview themeSettings={localTheme} />
          </CollapsibleSection>

          {/* Seção: Ações */}
          <CollapsibleSection
            title="Ações"
            description="Salve ou restaure suas configurações"
            icon={<Settings className="w-5 h-5" />}
            defaultOpen={true}
          >
            <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="w-full sm:flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="w-full sm:flex-1"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
            </div>
          </CollapsibleSection>
          </div>
        </div>
      </div>
      </div>
    </FeatureGuard>
  )
}
