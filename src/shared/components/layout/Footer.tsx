'use client'

import Link from 'next/link'
import { 
  Link as LinkIcon, 
  Heart, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Facebook
} from 'lucide-react'
import { useFooter } from '@/shared/hooks/useFooter'

export function Footer() {
  const { footerData, isLoading } = useFooter()

  // Debug: log dos dados recebidos
  // console.log('🔍 Footer Debug:', JSON.stringify({ footerData, isLoading }, null, 2))

  // Função para renderizar links sociais
  const renderSocialLinks = () => {
    if (isLoading) {
      // Loading state - mostrar ícones estáticos
      console.log('🔄 Footer - Renderizando estado de loading')
      return (
        <div className="flex space-x-4">
          <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      )
    }

    if (!footerData?.socialLinks) {
      // Fallback se não houver dados
      console.log('⚠️ Footer - Usando fallback (sem dados)')
      return (
        <div className="flex space-x-4">
          <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
          <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      )
    }

    // console.log('✅ Footer - Renderizando com dados carregados:', JSON.stringify(footerData.socialLinks, null, 2))
    
    const { socialLinks } = footerData
    
    // Filtrar apenas links que têm URL configurada
    const socialLinksArray = [
      { 
        name: 'Twitter', 
        url: socialLinks.twitter, 
        icon: Twitter 
      },
      { 
        name: 'Instagram', 
        url: socialLinks.instagram, 
        icon: Instagram 
      },
      { 
        name: 'LinkedIn', 
        url: socialLinks.linkedin, 
        icon: Linkedin 
      },
      { 
        name: 'Facebook', 
        url: socialLinks.facebook,
        icon: Facebook
      }
    ].filter(social => social.url && social.url.trim() !== '') // Filtrar apenas links com URL

    return (
      <div className="flex space-x-4">
        {socialLinksArray.map((social, index) => {
          const IconComponent = social.icon
          
          if (!social.url || social.url.trim() === '') {
            // Se não houver URL configurada, mostrar ícone sem link
            return (
              <IconComponent 
                key={index}
                className="h-5 w-5 text-gray-400 cursor-default" 
                title={`${social.name} não configurado`}
              />
            )
          }

          return (
            <Link
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IconComponent 
                className="h-5 w-5" 
                title={`Siga-nos no ${social.name}`}
              />
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <footer className="mt-32 bg-black border-t border-gray-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">MultiLink</span>
                <p className="text-xs text-gray-400">Link in Bio</p>
              </div>
            </div>
            <p className="text-gray-400">
              A plataforma mais completa para gerenciar seus links e crescer online.
            </p>
            {renderSocialLinks()}
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Produto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Suporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} MultiLink. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 mt-4 md:mt-0">
            Feito com <Heart className="inline h-4 w-4 text-red-500" /> Por Robson Milioli
          </p>
        </div>
      </div>
    </footer>
  )
}
