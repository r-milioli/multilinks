'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExternalLink, Plus, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Switch } from '@/shared/components/ui/Switch'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/shared/components/ui/Modal'
import { linkSchema } from '@/shared/utils/validation'
import { Link, CreateLinkData, UpdateLinkData } from '@/types/link.types'
import { formatUrlForDisplay, getFaviconUrl, isValidUrl } from '@/lib/utils'
import { useForms } from '@/modules/forms/hooks/useForms'

const linkFormSchema = linkSchema

type LinkFormData = z.infer<typeof linkFormSchema>

interface LinkEditorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateLinkData | UpdateLinkData) => Promise<any>
  link?: Link | null
  isLoading?: boolean
}

export function LinkEditor({ isOpen, onClose, onSubmit, link, isLoading = false }: LinkEditorProps) {
  const [urlPreview, setUrlPreview] = useState<string>('')
  const [faviconUrl, setFaviconUrl] = useState<string>('')
  
  // Só carregar formulários quando o modal estiver aberto
  const { forms, loading: formsLoading, refreshForms } = useForms(isOpen)
  
  console.log('LinkEditor: isOpen:', isOpen);
  console.log('LinkEditor: forms:', forms);
  console.log('LinkEditor: formsLoading:', formsLoading);
  
  // Carregar formulários quando o modal abrir
  useEffect(() => {
    if (isOpen && forms.length === 0 && !formsLoading) {
      console.log('LinkEditor: Carregando formulários...');
      refreshForms();
    }
  }, [isOpen, forms.length, formsLoading, refreshForms]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      title: link?.title || '',
      url: link?.url || '',
      description: link?.description || '',
      image: link?.image || '',
      type: link?.type || 'NORMAL',
      active: link?.active ?? true,
      useForm: link?.useForm ?? false,
      formId: link?.formId || ''
    }
  })

  const watchedUrl = watch('url')
  const watchedTitle = watch('title')
  const watchedImage = watch('image')
  const watchedDescription = watch('description')
  const watchedUseForm = watch('useForm')

  // Reset form when link changes
  useEffect(() => {
    if (link) {
      reset({
        title: link.title,
        url: link.url,
        description: link.description || '',
        image: link.image || '',
        type: link.type || 'NORMAL',
        active: link.active,
        useForm: link.useForm || false,
        formId: link.formId || ''
      })
    } else {
      reset({
        title: '',
        url: '',
        description: '',
        image: '',
        type: 'NORMAL',
        active: true,
        useForm: false,
        formId: ''
      })
    }
  }, [link, reset])

  // Update preview when URL changes
  useEffect(() => {
    if (watchedUrl && isValidUrl(watchedUrl)) {
      setUrlPreview(formatUrlForDisplay(watchedUrl))
      setFaviconUrl(getFaviconUrl(watchedUrl))
    } else {
      setUrlPreview('')
      setFaviconUrl('')
    }
  }, [watchedUrl])

  // Auto-generate title from URL if empty
  useEffect(() => {
    if (!watchedTitle && watchedUrl && isValidUrl(watchedUrl)) {
      try {
        const url = new URL(watchedUrl)
        const domain = url.hostname.replace('www.', '')
        setValue('title', domain)
      } catch {
        // Ignore invalid URLs
      }
    }
  }, [watchedTitle, watchedUrl, setValue])

  const handleFormSubmit = async (data: LinkFormData) => {
    try {
      await onSubmit(data)
      onClose()
      reset()
    } catch (error) {
      console.error('Erro ao salvar link:', error)
    }
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <ModalHeader className="flex-shrink-0">
          <ModalTitle>
            {link ? 'Editar Link' : 'Adicionar Link'}
          </ModalTitle>
          <ModalDescription>
            {link ? 'Atualize as informações do seu link' : 'Adicione um novo link à sua página'}
          </ModalDescription>
        </ModalHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <form id="link-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 pb-4">
          <div className="space-y-1">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://exemplo.com"
                {...register('url')}
                disabled={isLoading}
                className="pr-10"
              />
              {watchedUrl && isValidUrl(watchedUrl) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => window.open(watchedUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
            {urlPreview && (
              <p className="text-xs text-gray-500">
                Preview: {urlPreview}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Nome do link"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="Breve descrição do link"
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">URL da Imagem (opcional)</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              {...register('image')}
              disabled={isLoading}
            />
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
            <div className="text-xs text-gray-500">
              <p>💡 Imagem quadrada (400x400px) - JPG, PNG, WebP</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="type">Tipo do Link</Label>
            <select
              id="type"
              {...register('type')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="NORMAL">Link Normal</option>
              <option value="PRODUCT">Produto</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Switch
                id="useForm"
                checked={watchedUseForm}
                onCheckedChange={(checked) => setValue('useForm', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="useForm">Usar formulário</Label>
            </div>
            <p className="text-xs text-gray-500">
              Exibir formulário antes de redirecionar
            </p>
          </div>

          {watchedUseForm && (
            <div className="space-y-1">
              <Label htmlFor="formId">Formulário</Label>
              <div className="text-xs text-gray-500 mb-2">
                Debug: watchedUseForm={String(watchedUseForm)}, forms.length={forms.length}, formsLoading={String(formsLoading)}
              </div>
              <select
                id="formId"
                {...register('formId')}
                disabled={isLoading || forms.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um formulário</option>
                {forms.filter(form => form.active).map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.title}
                  </option>
                ))}
              </select>
              {errors.formId && (
                <p className="text-sm text-red-500">{errors.formId.message}</p>
              )}
              {forms.length === 0 && !formsLoading && (
                <p className="text-xs text-gray-500">
                  Nenhum formulário ativo encontrado. 
                  <a href="/forms" className="text-blue-600 hover:underline ml-1">
                    Criar formulário
                  </a>
                </p>
              )}
              {formsLoading && (
                <p className="text-xs text-gray-500">
                  Carregando formulários...
                </p>
              )}
            </div>
          )}

            {/* Preview */}
            {watchedUrl && watchedTitle && isValidUrl(watchedUrl) && (
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preview:
                </p>
                <div className="flex items-center space-x-2">
                  {/* Imagem personalizada ou favicon */}
                  {watchedImage && isValidUrl(watchedImage) ? (
                    <img
                      src={watchedImage}
                      alt={watchedTitle}
                      className="h-8 w-8 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        // Fallback para favicon se a imagem personalizada falhar
                        if (faviconUrl) {
                          target.src = faviconUrl
                          target.className = "h-4 w-4 rounded"
                        } else {
                          target.style.display = 'none'
                        }
                      }}
                    />
                  ) : faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt=""
                      className="h-4 w-4 rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <ExternalLink className="h-2 w-2 text-gray-500" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{watchedTitle}</p>
                    {watchedDescription && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {watchedDescription}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 truncate">{urlPreview}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer com botões - sempre visível */}
        <div className="flex-shrink-0 flex justify-end space-x-2 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="link-form"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (link ? 'Atualizar' : 'Adicionar')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

interface AddLinkButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function AddLinkButton({ onClick, disabled = false }: AddLinkButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
      variant="ghost"
    >
      <Plus className="h-5 w-5 mr-2" />
      Adicionar Link
    </Button>
  )
}

