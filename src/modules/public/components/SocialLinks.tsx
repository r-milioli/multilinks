'use client'

import { SocialLink } from '@prisma/client'
import { SOCIAL_PLATFORMS } from '@/shared/utils/constants'
import { SocialIcon } from '@/shared/components/ui/SocialIcon'
import { cn } from '@/shared/utils/cn'

interface SocialLinksProps {
  socialLinks: SocialLink[]
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  const getPlatformData = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.name === platform) || {
      name: platform,
      icon: 'link',
      color: '#6B7280'
    }
  }


  const getPlatformColor = (platform: string) => {
    const platformData = getPlatformData(platform)
    return platformData.color
  }

  if (!socialLinks || socialLinks.length === 0) {
    return null
  }

  return (
    <div className="flex justify-center space-x-4">
      {socialLinks.map((socialLink) => (
        <a
          key={socialLink.id}
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'text-white transition-all duration-200',
            'hover:scale-110 hover:shadow-lg',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
          )}
          style={{ backgroundColor: getPlatformColor(socialLink.platform) }}
          title={socialLink.platform}
        >
          <SocialIcon platform={socialLink.platform} className="w-6 h-6" />
        </a>
      ))}
    </div>
  )
}

