'use client'

import Link from 'next/link'
import { LegalLinksSettings } from '@/types/profile.types'

interface LegalFooterProps {
  settings: LegalLinksSettings
  themeSettings?: any
}

export function LegalFooter({ settings, themeSettings }: LegalFooterProps) {
  // Se não deve mostrar links legais, não renderiza nada
  if (!settings.showLegalLinks || settings.linksPosition === 'hidden') {
    return null
  }

  // Se não há nenhum link específico ativado, não renderiza nada
  if (!settings.showPrivacyPolicy && !settings.showTermsOfService && !settings.showContact) {
    return null
  }

  const getTextColor = () => {
    if (themeSettings?.textColor) {
      return themeSettings.textColor
    }
    return themeSettings?.backgroundColor === '#FFFFFF' ? '#6B7280' : '#9CA3AF'
  }

  const getLinkColor = () => {
    if (themeSettings?.primaryColor) {
      return themeSettings.primaryColor
    }
    return '#3B82F6'
  }

  const getHoverColor = () => {
    if (themeSettings?.secondaryColor) {
      return themeSettings.secondaryColor
    }
    return '#64748B'
  }

  return (
    <footer 
      className="w-full py-6 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Links Legais */}
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {settings.showPrivacyPolicy && (
            <Link 
              href="/privacy" 
              className="text-sm hover:underline transition-all duration-200"
              style={{ 
                color: getTextColor(),
                '--hover-color': getHoverColor()
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = getHoverColor()
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = getTextColor()
              }}
            >
              Política de Privacidade
            </Link>
          )}
          
          {settings.showTermsOfService && (
            <Link 
              href="/terms" 
              className="text-sm hover:underline transition-all duration-200"
              style={{ 
                color: getTextColor(),
                '--hover-color': getHoverColor()
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = getHoverColor()
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = getTextColor()
              }}
            >
              Termos de Uso
            </Link>
          )}
          
          {settings.showContact && (
            <Link 
              href="/contact" 
              className="text-sm hover:underline transition-all duration-200"
              style={{ 
                color: getTextColor(),
                '--hover-color': getHoverColor()
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = getHoverColor()
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = getTextColor()
              }}
            >
              Contato
            </Link>
          )}
        </div>

        {/* Texto Personalizado ou Padrão */}
        <div className="text-center">
          <p 
            className="text-xs opacity-75"
            style={{ color: getTextColor() }}
          >
            {settings.customFooterText || '© 2024 MultiLink. Todos os direitos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
