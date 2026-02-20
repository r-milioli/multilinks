'use client'

import { SocialLink } from '@prisma/client'
import { SOCIAL_PLATFORMS } from '@/shared/utils/constants'
import { SocialIcon } from '@/shared/components/ui/SocialIcon'
import { cn } from '@/shared/utils/cn'

interface SocialLinksProps {
  socialLinks: SocialLink[]
  themeSettings?: any
}

export function SocialLinks({ socialLinks, themeSettings }: SocialLinksProps) {
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

  const socialButtonsSettings = themeSettings?.socialButtonsSettings || {
    style: 'default',
    size: 'medium',
    shape: 'circle',
    spacing: 'normal',
    alignment: 'center',
    showLabels: false,
    hoverEffect: 'scale',
    animationSpeed: 300,
    backgroundColor: '#FFFFFF',
    iconColor: '#374151',
    borderColor: '#E5E7EB',
    hoverBackgroundColor: '#F9FAFB',
    hoverIconColor: '#1F2937'
  }

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-8 h-8'
      case 'medium':
        return 'w-10 h-10'
      case 'large':
        return 'w-12 h-12'
      case 'xlarge':
        return 'w-14 h-14'
      default:
        return 'w-10 h-10'
    }
  }

  const getButtonShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full'
      case 'square':
        return 'rounded-lg'
      case 'rounded':
        return 'rounded-xl'
      case 'hexagon':
        return 'rounded-none'
      default:
        return 'rounded-full'
    }
  }

  const getButtonSpacingClasses = (spacing: string) => {
    switch (spacing) {
      case 'tight':
        return 'space-x-2'
      case 'normal':
        return 'space-x-3'
      case 'loose':
        return 'space-x-4'
      default:
        return 'space-x-3'
    }
  }

  const getButtonAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-center'
    }
  }

  const getButtonStyleClasses = (style: string) => {
    switch (style) {
      case 'default':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      case 'minimal':
        return 'bg-transparent border border-gray-200 dark:border-gray-700'
      case 'filled':
        return 'bg-gray-900 text-white border border-gray-900'
      case 'outlined':
        return 'bg-transparent border-2 border-gray-900 text-gray-900'
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0'
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20'
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
  }

  const getHoverEffectClasses = (hoverEffect: string) => {
    switch (hoverEffect) {
      case 'scale':
        return 'hover:scale-110'
      case 'lift':
        return 'hover:-translate-y-1 hover:shadow-lg'
      case 'glow':
        return 'hover:shadow-lg hover:shadow-blue-500/25'
      case 'slide':
        return 'hover:translate-x-1'
      case 'rotate':
        return 'hover:rotate-12'
      case 'none':
        return ''
      default:
        return 'hover:scale-110'
    }
  }

  const getIconSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'medium':
        return 'w-5 h-5'
      case 'large':
        return 'w-6 h-6'
      case 'xlarge':
        return 'w-7 h-7'
      default:
        return 'w-5 h-5'
    }
  }

  return (
    <div className={cn(
      'flex',
      getButtonSpacingClasses(socialButtonsSettings.spacing),
      getButtonAlignmentClasses(socialButtonsSettings.alignment)
    )}>
      {socialLinks.map((socialLink) => {
        const platformData = getPlatformData(socialLink.platform)
        const isCustomStyle = socialButtonsSettings.style === 'default' || 
                             socialButtonsSettings.style === 'filled' ||
                             socialButtonsSettings.style === 'outlined'
        const isMinimal = socialButtonsSettings.style === 'minimal'
        const hoverEffect = themeSettings?.hoverEffect ?? socialButtonsSettings.hoverEffect ?? 'scale'
        const animationSpeed = themeSettings?.animationSpeed ?? socialButtonsSettings.animationSpeed ?? 300
        const showLabels = socialButtonsSettings.showLabels === true
        
        return (
          <a
            key={socialLink.id}
            href={socialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              getButtonShapeClasses(socialButtonsSettings.shape),
              getButtonStyleClasses(socialButtonsSettings.style),
              getHoverEffectClasses(hoverEffect),
              'flex items-center justify-center transition-all',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800',
              showLabels ? 'gap-2 px-3 py-2 min-w-0' : getButtonSizeClasses(socialButtonsSettings.size)
            )}
            style={{
              transitionDuration: `${animationSpeed}ms`,
              ...(isMinimal && {
                backgroundColor: 'transparent',
                borderColor: socialButtonsSettings.borderColor,
                color: socialButtonsSettings.iconColor
              }),
              ...(isCustomStyle && !isMinimal && {
                backgroundColor: socialButtonsSettings.backgroundColor,
                color: socialButtonsSettings.iconColor,
                borderColor: socialButtonsSettings.borderColor
              }),
              ...(socialButtonsSettings.style === 'filled' && {
                backgroundColor: platformData.color,
                color: '#FFFFFF'
              }),
              ...(socialButtonsSettings.style === 'outlined' && {
                borderColor: platformData.color,
                color: platformData.color
              }),
              ...(socialButtonsSettings.style === 'gradient' && {
                background: `linear-gradient(135deg, ${platformData.color}, ${platformData.color}dd)`
              })
            }}
            title={showLabels ? undefined : socialLink.platform}
          >
            <SocialIcon 
              platform={socialLink.platform} 
              className={cn(getIconSizeClasses(socialButtonsSettings.size), showLabels && 'flex-shrink-0')}
            />
            {showLabels && (
              <span 
                className="text-xs font-medium truncate"
                style={{ 
                  color: socialButtonsSettings.style === 'filled' ? '#FFFFFF' : 
                         socialButtonsSettings.style === 'outlined' ? platformData.color :
                         socialButtonsSettings.iconColor || '#374151'
                }}
              >
                {socialLink.platform}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}

