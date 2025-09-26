import { prisma } from '@/lib/db'

export interface SystemSettingsData {
  socialLinks: {
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  plans: Array<{
    name: string
    price: number
    features: string[]
  }>
}

export interface SystemSetting {
  id: string
  key: string
  value: any
  description?: string
  category: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export class SystemSettingsService {
  /**
   * Buscar todas as configurações do sistema
   */
  static async getAllSettings() {
    try {
      const settings = await prisma.systemSettings.findMany({
        orderBy: { category: 'asc' }
      })

      return {
        success: true,
        data: settings
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Buscar configurações por categoria
   */
  static async getSettingsByCategory(category: string) {
    try {
      const settings = await prisma.systemSettings.findMany({
        where: { category },
        orderBy: { key: 'asc' }
      })

      return {
        success: true,
        data: settings
      }
    } catch (error) {
      console.error('Erro ao buscar configurações por categoria:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Buscar configuração específica por chave
   */
  static async getSetting(key: string) {
    try {
      const setting = await prisma.systemSettings.findUnique({
        where: { key }
      })

      return {
        success: true,
        data: setting
      }
    } catch (error) {
      console.error('Erro ao buscar configuração:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Criar ou atualizar configuração
   */
  static async upsertSetting(data: {
    key: string
    value: any
    description?: string
    category?: string
    isPublic?: boolean
  }) {
    try {
      const setting = await prisma.systemSettings.upsert({
        where: { key: data.key },
        update: {
          value: data.value,
          description: data.description,
          category: data.category || 'general',
          isPublic: data.isPublic || false,
          updatedAt: new Date()
        },
        create: {
          key: data.key,
          value: data.value,
          description: data.description,
          category: data.category || 'general',
          isPublic: data.isPublic || false
        }
      })

      return {
        success: true,
        data: setting
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Salvar configurações de redes sociais
   */
  static async saveSocialLinks(socialLinks: SystemSettingsData['socialLinks']) {
    try {
      const result = await this.upsertSetting({
        key: 'social_links',
        value: socialLinks,
        description: 'Links das redes sociais do sistema',
        category: 'social',
        isPublic: true
      })

      return result
    } catch (error) {
      console.error('Erro ao salvar links sociais:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Salvar informações de contato
   */
  static async saveContactInfo(contactInfo: SystemSettingsData['contactInfo']) {
    try {
      const result = await this.upsertSetting({
        key: 'contact_info',
        value: contactInfo,
        description: 'Informações de contato do sistema',
        category: 'contact',
        isPublic: true
      })

      return result
    } catch (error) {
      console.error('Erro ao salvar informações de contato:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Salvar planos
   */
  static async savePlans(plans: SystemSettingsData['plans']) {
    try {
      const result = await this.upsertSetting({
        key: 'plans',
        value: plans,
        description: 'Planos e preços do sistema',
        category: 'pricing',
        isPublic: true
      })

      return result
    } catch (error) {
      console.error('Erro ao salvar planos:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Carregar configurações formatadas para o admin
   */
  static async getFormattedSettings() {
    try {
      // Aguardar um pouco para garantir que o banco esteja totalmente disponível
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const [socialLinksResult, contactInfoResult, plansResult] = await Promise.all([
        this.getSetting('social_links'),
        this.getSetting('contact_info'),
        this.getSetting('plans')
      ])

      const defaultSettings: SystemSettingsData = {
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: '',
          linkedin: ''
        },
        contactInfo: {
          email: '',
          phone: '',
          address: ''
        },
        plans: [
          { name: 'Gratuito', price: 0, features: ['5 links', '1 formulário'] },
          { name: 'Pro', price: 29.90, features: ['Links ilimitados', 'Formulários ilimitados'] },
          { name: 'Business', price: 99.90, features: ['Tudo do Pro', 'Analytics avançado'] }
        ]
      }

      // Extrair dados com verificação mais robusta
      const socialLinks = socialLinksResult.success && socialLinksResult.data?.value 
        ? socialLinksResult.data.value 
        : defaultSettings.socialLinks
      
      const contactInfo = contactInfoResult.success && contactInfoResult.data?.value 
        ? contactInfoResult.data.value 
        : defaultSettings.contactInfo
      
      // Verificação mais robusta para plans
      let plans = defaultSettings.plans
      if (plansResult.success && plansResult.data && plansResult.data.value) {
        plans = plansResult.data.value
      }

      return {
        success: true,
        data: {
          socialLinks,
          contactInfo,
          plans
        }
      }
    } catch (error) {
      console.error('❌ SystemSettingsService - Erro ao carregar configurações formatadas:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Inicializar configurações padrão se não existirem
   */
  static async initializeDefaultSettings() {
    try {
      console.log('🔧 SystemSettingsService - Inicializando configurações padrão...')
      
      const defaultSettings = [
        {
          key: 'social_links',
          value: {
            instagram: '',
            facebook: '',
            twitter: '',
            linkedin: ''
          },
          description: 'Links das redes sociais do sistema',
          category: 'social',
          isPublic: true
        },
        {
          key: 'contact_info',
          value: {
            email: '',
            phone: '',
            address: ''
          },
          description: 'Informações de contato do sistema',
          category: 'contact',
          isPublic: true
        },
        {
          key: 'plans',
          value: [
            { name: 'Gratuito', price: 0, features: ['5 links', '1 formulário'] },
            { name: 'Pro', price: 29.90, features: ['Links ilimitados', 'Formulários ilimitados'] },
            { name: 'Business', price: 99.90, features: ['Tudo do Pro', 'Analytics avançado'] }
          ],
          description: 'Planos e preços do sistema',
          category: 'pricing',
          isPublic: true
        }
      ]

      for (const setting of defaultSettings) {
        await this.upsertSetting(setting)
      }

      console.log('✅ SystemSettingsService - Configurações padrão inicializadas')
      return { success: true }
    } catch (error) {
      console.error('❌ SystemSettingsService - Erro ao inicializar configurações padrão:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Deletar configuração
   */
  static async deleteSetting(key: string) {
    try {
      await prisma.systemSettings.delete({
        where: { key }
      })

      return {
        success: true
      }
    } catch (error) {
      console.error('Erro ao deletar configuração:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }
}
