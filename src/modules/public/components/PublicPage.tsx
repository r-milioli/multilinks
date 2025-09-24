'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Link, SocialLink } from '@prisma/client'
import { PublicLinkItem } from './PublicLinkItem'
import { SocialLinks } from './SocialLinks'
import { ThemeProvider } from './ThemeProvider'
import { TrackingScripts, trackEvent } from '@/shared/components/TrackingScripts'
import { getInitials } from '@/lib/utils'
import { cn } from '@/shared/utils/cn'

interface PublicPageProps {
  user: User & {
    links: Link[]
    socialLinks: SocialLink[]
  }
}

export function PublicPage({ user }: PublicPageProps) {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set())
  const [visitTracked, setVisitTracked] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const visitTrackedRef = useRef(false)
  
  // Separar links por tipo
  const normalLinks = user.links.filter(link => link.type === 'NORMAL')
  const productLinks = user.links.filter(link => link.type === 'PRODUCT')
  const hasProducts = productLinks.length > 0

  // Rastrear visita quando a página é carregada
  useEffect(() => {
    const trackVisit = async () => {
      // Proteção dupla contra execuções múltiplas
      if (visitTracked || visitTrackedRef.current) {
        console.log('🚫 Visita já foi rastreada, ignorando...')
        return
      }
      
      // Marcar como rastreada imediatamente para evitar duplicação
      visitTrackedRef.current = true
      
      console.log('👁️ Rastreando visita da página...')
      
      try {
        const response = await fetch('/api/analytics/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id
          })
        })

        const result = await response.json()
        console.log('✅ Visita registrada:', result)
        
        if (result.success) {
          setVisitTracked(true)
          console.log('🎉 Visita da página registrada com sucesso!')
          
          // Tracking de página visualizada
          trackEvent.pageView(
            `${user.name || user.username || 'MultiLink'} - Links`,
            typeof window !== 'undefined' ? window.location.href : ''
          )
        } else {
          console.log('❌ Erro ao registrar visita:', result.error)
          // Reset em caso de erro para permitir nova tentativa
          visitTrackedRef.current = false
        }
      } catch (error) {
        console.error('❌ Erro ao registrar visita:', error)
        // Reset em caso de erro para permitir nova tentativa
        visitTrackedRef.current = false
      }
    }

    trackVisit()
  }, [user.id]) // Removido visitTracked das dependências

  const handleLinkClick = async (linkId: string) => {
    console.log('🖱️ Clique detectado no link:', linkId)
    
    // Evitar múltiplos cliques no mesmo link
    if (clickedLinks.has(linkId)) {
      console.log('⚠️ Clique duplicado ignorado')
      return
    }
    
    setClickedLinks(prev => new Set(prev).add(linkId))

    // Encontrar o link clicado para tracking
    const clickedLink = user.links.find(link => link.id === linkId)
    
    try {
      console.log('📡 Enviando clique para API...')
      // Registrar clique no analytics
      const response = await fetch(`/api/analytics/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId,
          userId: user.id
        })
      })

      const result = await response.json()
      console.log('✅ Resposta da API:', result)
      
      if (result.success) {
        console.log('🎉 Clique registrado com sucesso!')
        
        // Tracking de eventos externos
        if (clickedLink) {
          trackEvent.linkClick(
            clickedLink.id,
            clickedLink.title || 'Link sem título',
            clickedLink.url
          )
        }
      } else {
        console.log('❌ Erro na API:', result.error)
      }
    } catch (error) {
      console.error('❌ Erro ao registrar clique:', error)
    }
  }

  const themeSettings = user.themeSettings as any || {}
  const privacySettings = user.privacySettings as any || {}
  const integrationSettings = user.integrationSettings as any || {}

  // Aplicar estilos do tema diretamente
  const getBackgroundStyle = () => {
    if (themeSettings.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${themeSettings.backgroundColor || '#FFFFFF'}, ${themeSettings.secondaryColor || '#64748B'})`
      }
    }
    if (themeSettings.backgroundType === 'image' && themeSettings.backgroundImage) {
      const backgroundSettings = themeSettings.backgroundSettings || {
        position: 'center',
        size: 'cover',
        repeat: 'no-repeat',
        attachment: 'scroll'
      }
      
      return {
        backgroundImage: `url(${themeSettings.backgroundImage})`,
        backgroundPosition: backgroundSettings.position,
        backgroundSize: backgroundSettings.size,
        backgroundRepeat: backgroundSettings.repeat,
        backgroundAttachment: backgroundSettings.attachment,
      }
    }
    return { backgroundColor: themeSettings.backgroundColor || '#FFFFFF' }
  }


  return (
    <ThemeProvider themeSettings={themeSettings}>
      {/* Tracking Scripts */}
      <TrackingScripts
        googleAnalytics={integrationSettings.googleAnalytics}
        facebookPixel={integrationSettings.facebookPixel}
        userId={user.id}
        pageTitle={`${user.name || user.username || 'MultiLink'} - Links`}
        pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />
      
      <div 
        className="min-h-screen"
        style={{
          ...getBackgroundStyle(),
          fontFamily: themeSettings.fontFamily || 'Inter',
          color: themeSettings.textColor || '#1E293B'
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-md">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="relative mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'Avatar'}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-semibold text-primary">
                    {getInitials(user.name || user.email)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.name || user.username}
            </h1>
            
            {user.title && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {user.title}
              </p>
            )}

            {/* Email - only show if privacy allows */}
            {privacySettings.showEmail && user.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {user.email}
              </p>
            )}

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          {/* Social Links */}
          {user.socialLinks && user.socialLinks.length > 0 && privacySettings.showSocialLinks !== false && (
            <div className="mb-8">
              <SocialLinks socialLinks={user.socialLinks} themeSettings={themeSettings} />
            </div>
          )}

          {/* Toggle de Links (só aparece se houver produtos) */}
          {hasProducts && (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowProducts(false)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    !showProducts
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  Links
                </button>
                <button
                  onClick={() => setShowProducts(true)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    showProducts
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  Produtos
                </button>
              </div>
            </div>
          )}

          {/* Main Links */}
          <div className="space-y-3">
            {user.links && user.links.length > 0 ? (
              <>
                {/* Links Normais */}
                {!showProducts && normalLinks.map((link) => (
                  <PublicLinkItem
                    key={link.id}
                    link={link}
                    onClick={() => handleLinkClick(link.id)}
                    themeSettings={themeSettings}
                  />
                ))}
                
                {/* Links de Produtos */}
                {showProducts && productLinks.map((link) => (
                  <PublicLinkItem
                    key={link.id}
                    link={link}
                    onClick={() => handleLinkClick(link.id)}
                    themeSettings={themeSettings}
                  />
                ))}
                
                {/* Mensagem quando não há links do tipo selecionado */}
                {((!showProducts && normalLinks.length === 0) || (showProducts && productLinks.length === 0)) && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {showProducts ? 'Nenhum produto disponível' : 'Nenhum link disponível'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {showProducts 
                        ? 'Este usuário ainda não adicionou nenhum produto.'
                        : 'Este usuário ainda não adicionou nenhum link.'
                      }
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum link disponível
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Este usuário ainda não adicionou nenhum link.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Criado com{' '}
              <a
                href="/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                MultiLink
              </a>
            </p>
          </div>
        </div>
      </div>
      
    </ThemeProvider>
  )
}

