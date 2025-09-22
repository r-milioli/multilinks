'use client'

import { User, Link, SocialLink } from '@prisma/client'
import { PublicPage } from './PublicPage'

interface PublicPageWrapperProps {
  user: User & {
    links: Link[]
    socialLinks: SocialLink[]
  }
}

export function PublicPageWrapper({ user }: PublicPageWrapperProps) {
  return <PublicPage user={user} />
}

