'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/ui/Modal'
import { SocialIcon } from '@/shared/components/ui/SocialIcon'
import { useProfile } from '../hooks/useProfile'
import { SOCIAL_PLATFORMS } from '@/shared/utils/constants'
import { urlSchema } from '@/shared/utils/validation'
import { cn } from '@/shared/utils/cn'

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Plataforma é obrigatória'),
  url: urlSchema
})

type SocialLinkFormData = z.infer<typeof socialLinkSchema>

export function SocialLinksEditor() {
  const { profile, createSocialLink, updateSocialLink, deleteSocialLink } = useProfile()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema)
  })

  const watchedPlatform = watch('platform')
  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.name === watchedPlatform)

  const handleAddLink = () => {
    setEditingLink(null)
    reset()
    setIsModalOpen(true)
  }

  const handleEditLink = (link: any) => {
    setEditingLink(link)
    reset({
      platform: link.platform,
      url: link.url
    })
    setIsModalOpen(true)
  }

  const handleDeleteLink = async (linkId: string) => {
    if (confirm('Tem certeza que deseja remover este link social?')) {
      await deleteSocialLink(linkId)
    }
  }

  const onSubmit = async (data: SocialLinkFormData) => {
    try {
      if (editingLink) {
        await updateSocialLink(editingLink.id, { url: data.url })
      } else {
        await createSocialLink(data)
      }
      setIsModalOpen(false)
      reset()
    } catch (error) {
      console.error('Erro ao salvar social link:', error)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingLink(null)
    reset()
  }

  const getPlatformColor = (platform: string) => {
    const platformData = SOCIAL_PLATFORMS.find(p => p.name === platform)
    return platformData?.color || '#6B7280'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Links Sociais</CardTitle>
            <CardDescription>
              Adicione seus perfis em redes sociais
            </CardDescription>
          </div>
          <Button onClick={handleAddLink} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {profile?.socialLinks && profile.socialLinks.length > 0 ? (
          <div className="space-y-3">
            {profile.socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 border rounded-lg min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: getPlatformColor(link.platform) }}
                  >
                    <SocialIcon platform={link.platform} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{link.platform}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {link.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(link.url, '_blank')}
                    className="h-8 w-8"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLink(link)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLink(link.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum link social
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Adicione seus perfis em redes sociais para que as pessoas possam te encontrar
            </p>
            <Button onClick={handleAddLink} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeiro link
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal para adicionar/editar social link */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>
              {editingLink ? 'Editar Link Social' : 'Adicionar Link Social'}
            </ModalTitle>
          </ModalHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <select
                id="platform"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('platform')}
                disabled={!!editingLink}
              >
                <option value="">Selecione uma plataforma</option>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="text-sm text-red-500">{errors.platform.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder={selectedPlatform?.placeholder || 'https://exemplo.com'}
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url.message}</p>
              )}
            </div>

            {selectedPlatform && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preview:
                </p>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedPlatform.color }}
                  >
                    <SocialIcon platform={selectedPlatform.name} className="w-3 h-3" />
                  </div>
                  <span className="text-sm">{selectedPlatform.name}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingLink ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </Card>
  )
}

