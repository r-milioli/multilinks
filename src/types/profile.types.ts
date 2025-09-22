import { User, SocialLink } from '@prisma/client'
import { ThemeSettings, PrivacySettings } from './common.types'

export interface UpdateProfileData {
  name?: string
  username?: string
  bio?: string
  title?: string
  avatar?: string
  themeSettings?: ThemeSettings
  privacySettings?: PrivacySettings
}

export interface CreateSocialLinkData {
  platform: string
  url: string
}

export interface UpdateSocialLinkData {
  url: string
}

export interface ProfileWithSocialLinks extends User {
  socialLinks: SocialLink[]
}

export interface UsernameAvailability {
  available: boolean
  suggestion?: string
}

export interface AvatarUploadData {
  file: File
  cropData?: {
    x: number
    y: number
    width: number
    height: number
  }
}

