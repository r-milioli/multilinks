export enum LinkType {
  NORMAL = 'NORMAL',
  PRODUCT = 'PRODUCT'
}

export interface Link {
  id: string
  title: string
  url: string
  description?: string
  image?: string
  type: LinkType
  position: number
  active: boolean
  clickCount: number
  userId: string
  useForm?: boolean
  formId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateLinkData {
  title: string
  url: string
  description?: string
  image?: string
  type: LinkType
  useForm?: boolean
  formId?: string
}

export interface UpdateLinkData {
  title?: string
  url?: string
  description?: string
  image?: string
  type?: LinkType
  active?: boolean
  useForm?: boolean
  formId?: string
}

export interface LinkFormData {
  title: string
  url: string
  description: string
  image: string
  type: LinkType
}