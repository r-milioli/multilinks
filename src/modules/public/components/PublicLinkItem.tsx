'use client'

import { useState, useCallback } from 'react'
import { Link } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
import { getFaviconUrl, formatUrlForDisplay } from '@/lib/utils'
import { cn } from '@/shared/utils/cn'
import { FormModal } from '@/modules/forms/components/FormModal'
import { usePublicForm } from '@/modules/forms/hooks/usePublicForm'
import { trackEvent } from '@/shared/components/TrackingScripts'

interface PublicLinkItemProps {
  link: Link
  onClick: () => void
  themeSettings?: any
}

export function PublicLinkItem({ link, onClick, themeSettings }: PublicLinkItemProps) {
  const [showForm, setShowForm] = useState(false)
  
  // Só inicializar o hook se o link realmente usa formulário
  const shouldUseForm = Boolean(link.useForm && link.formId)
  const { form, loadForm, loading } = usePublicForm(shouldUseForm ? link.formId : '')

  const handleClick = () => {
    console.log('🔗 Link clicado:', {
      linkId: link.id,
      useForm: link.useForm,
      formId: link.formId,
      shouldUseForm,
      hasForm: !!form,
      loading,
      showForm
    })
    
    onClick()
    
    // Se o link tem formulário, mostrar modal do formulário
    if (shouldUseForm) {
      console.log('📝 Link usa formulário, mostrando modal...')
      setShowForm(true)
      // Só carregar se ainda não foi carregado e não está carregando
      if (!form && !loading) {
        console.log('🔄 Carregando formulário...')
        loadForm()
      } else {
        console.log('✅ Formulário já carregado ou carregando')
      }
    } else {
      console.log('🔗 Link normal, abrindo diretamente...')
      // Abrir link diretamente em nova aba
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleFormSuccess = useCallback((redirectUrl?: string) => {
    setShowForm(false)
    
    // Tracking de submissão de formulário
    if (form) {
      trackEvent.formSubmission(
        form.id,
        form.title || link.title || 'Formulário'
      )
    }
    
    // Aguardar um pouco antes de redirecionar para garantir que o modal foi fechado
    setTimeout(() => {
      // Se há URL de redirecionamento, usar ela, senão usar a URL do link
      const finalUrl = redirectUrl || link.url
      if (finalUrl) {
        window.open(finalUrl, '_blank', 'noopener,noreferrer')
      }
    }, 100)
  }, [link.url, link.title, form])

  const getButtonStyle = () => {
    if (!themeSettings) {
      return cn(
        'w-full p-4 rounded-lg border-2 border-transparent',
        'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md',
        'transition-all duration-200 hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'group'
      )
    }

    const base = 'w-full p-4 border-2 border-transparent transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 group'
    const borderRadius = themeSettings.borderRadius || 8
    const rounded = `rounded-[${borderRadius}px]`

    switch (themeSettings.buttonStyle) {
      case 'rounded':
        return cn(base, rounded, 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md')
      case 'sharp':
        return cn(base, 'rounded-none', 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md')
      case 'outlined':
        return cn(base, rounded, 'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700')
      case 'filled':
        return cn(base, rounded, 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl')
      default:
        return cn(base, rounded, 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md')
    }
  }

  return (
    <>
    <button
      onClick={handleClick}
      className={getButtonStyle()}
      style={{
        borderColor: themeSettings?.primaryColor || undefined,
        focusRingColor: themeSettings?.primaryColor || undefined
      }}
    >
      <div className="flex items-center space-x-4">
        {/* Imagem do Link ou Favicon */}
        <div className="flex-shrink-0">
          {link.image ? (
            <img
              src={link.image}
              alt={link.title}
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = getFaviconUrl(link.url)
                target.className = "h-6 w-6 rounded"
              }}
            />
          ) : (
            <img
              src={getFaviconUrl(link.url)}
              alt=""
              className="h-6 w-6 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/default-favicon.png'
              }}
            />
          )}
        </div>

        {/* Link Info */}
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {link.title}
          </h3>
          {link.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
              {link.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {formatUrlForDisplay(link.url)}
          </p>
        </div>

        {/* External Link Icon */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </button>
    
    {/* Modal do Formulário */}
    {shouldUseForm && form && (
      <FormModal
        form={form}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        linkId={link.id}
        themeSettings={themeSettings}
      />
    )}
  </>
  )
}

