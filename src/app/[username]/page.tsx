import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProfileService } from '@/modules/profile/services/profileService'
import { PublicPageWrapper } from '@/modules/public/components/PublicPageWrapper'

interface PageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = params
  
  try {
    const result = await ProfileService.getPublicProfile(username)
    
    if (!result.success || !result.data) {
      return {
        title: 'Usuário não encontrado',
        description: 'O usuário solicitado não foi encontrado.'
      }
    }

    const user = result.data
    const title = user.name ? `${user.name} - MultiLink` : `${username} - MultiLink`
    const description = user.bio || `Visite a página de links de ${user.name || username} no MultiLink.`
    
    return {
      title,
      description,
      keywords: [username, 'links', 'social media', 'bio link'],
      authors: [{ name: user.name || username }],
      openGraph: {
        title,
        description,
        type: 'profile',
        url: `/${username}`,
        images: user.avatar ? [
          {
            url: user.avatar,
            width: 400,
            height: 400,
            alt: user.name || username
          }
        ] : [],
        siteName: 'MultiLink'
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: user.avatar ? [user.avatar] : []
      }
    }
  } catch (error) {
    console.error('Erro ao gerar metadata:', error)
    return {
      title: 'MultiLink',
      description: 'Página de links personalizada'
    }
  }
}

export default async function UserPage({ params }: PageProps) {
  const { username } = params
  
  console.log('🔍 Tentando carregar página do usuário:', username)
  
  try {
    const result = await ProfileService.getPublicProfile(username)
    
    if (!result.success || !result.data) {
      console.log('❌ Usuário não encontrado:', username, result.error)
      notFound()
    }

    const user = result.data
    const privacySettings = user.privacySettings as any || {}
    
    console.log('✅ Usuário encontrado:', user.username, user.name)
    
    // Verificar se a página é privada
    if (privacySettings.isPublic === false) {
      console.log('🔒 Página privada para usuário:', username)
      notFound()
    }

    return <PublicPageWrapper user={user as any} />
  } catch (error) {
    console.error('Erro ao carregar página do usuário:', error)
    notFound()
  }
}
