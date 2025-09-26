'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Camera, Save, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { AvatarUpload } from './AvatarUpload'
import { SocialLinksEditor } from './SocialLinksEditor'
import { useProfile } from '../hooks/useProfile'
import { useImageUpload } from '../hooks/useImageUpload'
import { nameSchema, usernameSchema, bioSchema, titleSchema } from '@/shared/utils/validation'
import { getInitials } from '@/lib/utils'

const profileSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  bio: bioSchema,
  title: titleSchema
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileEditorProps {
  onSave?: () => void
}

export function ProfileEditor({ onSave }: ProfileEditorProps) {
  const { profile, isLoading, isUpdating, updateProfile, refetch } = useProfile()
  const { uploadAvatar, isUploading: isUploadingAvatar } = useImageUpload()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
      title: profile?.title || ''
    }
  })

  const watchedUsername = watch('username')

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        title: profile.title || ''
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data)
      if (result.success) {
        setIsEditing(false)
        onSave?.()
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar perfil</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>
            Adicione uma foto para personalizar seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={`${profile.avatar}?t=${Date.now()}`}
                  alt={profile.name || 'Avatar'}
                  className="h-24 w-24 rounded-full object-cover"
                  key={profile.avatar} // Força re-render quando a URL muda
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">
                    {getInitials(profile.name || profile.email)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <AvatarUpload
                onUpload={async (file, cropData) => {
                  try {
                    console.log('🔄 ProfileEditor: Iniciando upload de avatar')
                    const result = await uploadAvatar(file, cropData)
                    console.log('📥 ProfileEditor: Resultado do upload:', result)
                    
                    if (!result) {
                      console.error('❌ ProfileEditor: uploadAvatar retornou undefined')
                      return { success: false, error: 'Erro no upload' }
                    }
                    
                    return {
                      success: result.success,
                      error: result.error,
                      data: result.data,
                      url: result.url
                    }
                  } catch (error) {
                    console.error('❌ ProfileEditor: Erro no upload:', error)
                    return { success: false, error: 'Erro interno' }
                  }
                }}
                isUploading={isUploadingAvatar}
                currentAvatar={profile.avatar}
              />
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG ou WebP. Máximo 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    disabled={isUpdating}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register('username')}
                    disabled={isUpdating}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                  {watchedUsername && (
                    <p className="text-xs text-gray-500">
                      Seu link será: /{watchedUsername}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex: Desenvolvedor, Designer, etc."
                  {...register('title')}
                  disabled={isUpdating}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Conte um pouco sobre você..."
                  {...register('bio')}
                  disabled={isUpdating}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nome</Label>
                  <p className="text-sm">{profile.name || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Username</Label>
                  <p className="text-sm">/{profile.username || 'não-definido'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Título</Label>
                <p className="text-sm">{profile.title || 'Não informado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Biografia</Label>
                <p className="text-sm">{profile.bio || 'Não informado'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <SocialLinksEditor />
    </div>
  )
}

