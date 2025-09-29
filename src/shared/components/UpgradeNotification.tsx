'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlanFeatureAccess } from '@/types/common.types'

interface UpgradeNotificationProps {
  feature: 'analytics' | 'themeEditing' | 'webhooks' | 'prioritySupport'
  currentPlan: string
  featureInfo: PlanFeatureAccess | null
  showPricing?: boolean
}

export function UpgradeNotification({ 
  feature, 
  currentPlan, 
  featureInfo,
  showPricing = true 
}: UpgradeNotificationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = () => {
    setIsLoading(true)
    router.push('/pricing')
  }

  const getFeatureInfo = () => {
    switch (feature) {
      case 'analytics':
        return {
          title: 'Analytics Avançado',
          description: 'Acesse relatórios detalhados de cliques, visualizações e performance dos seus links.',
          icon: '📊',
          benefits: [
            'Relatórios de cliques em tempo real',
            'Análise de dispositivos e localização',
            'Histórico completo de atividades',
            'Exportação de dados'
          ]
        }
      case 'themeEditing':
        return {
          title: 'Personalização Avançada',
          description: 'Customize completamente a aparência da sua página de links.',
          icon: '🎨',
          benefits: [
            'Editor de tema visual',
            'Cores e fontes personalizadas',
            'Layouts exclusivos',
            'Preview em tempo real'
          ]
        }
      case 'webhooks':
        return {
          title: 'Integrações Automáticas',
          description: 'Conecte seu Multlinks com outras ferramentas via webhooks.',
          icon: '🔗',
          benefits: [
            'Webhooks para notificações',
            'Integração com CRM',
            'Automação de workflows',
            'API completa'
          ]
        }
      case 'prioritySupport':
        return {
          title: 'Suporte Prioritário',
          description: 'Receba atendimento prioritário e suporte especializado.',
          icon: '⚡',
          benefits: [
            'Resposta em até 2 horas',
            'Suporte por chat ao vivo',
            'Atendimento especializado',
            'Prioridade em novas funcionalidades'
          ]
        }
      default:
        return {
          title: 'Funcionalidade Premium',
          description: 'Esta funcionalidade está disponível apenas em planos superiores.',
          icon: '⭐',
          benefits: []
        }
    }
  }

  const getRecommendedPlan = () => {
    switch (currentPlan) {
      case 'free':
        return 'pro'
      case 'pro':
        return 'business'
      default:
        return 'pro'
    }
  }

  const featureData = getFeatureInfo()
  const recommendedPlan = getRecommendedPlan()

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{featureData.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {featureData.title}
        </h2>
        <p className="text-gray-600">
          {featureData.description}
        </p>
      </div>

      {/* Mensagem de upgrade */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Upgrade necessário
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Esta funcionalidade está disponível no plano <strong>{recommendedPlan.toUpperCase()}</strong>.
                {currentPlan === 'free' && ' Faça upgrade para desbloquear todas as funcionalidades!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefícios */}
      {featureData.benefits.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            O que você ganha:
          </h4>
          <ul className="space-y-2">
            {featureData.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Fazer Upgrade
            </>
          )}
        </button>

        {showPricing && (
          <button
            onClick={() => router.push('/pricing')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Ver Planos
          </button>
        )}
      </div>

      {/* Informação adicional */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Plano atual: <span className="font-medium capitalize">{currentPlan}</span>
          {featureInfo?.message && (
            <span className="block mt-1 text-blue-600">{featureInfo.message}</span>
          )}
        </p>
      </div>
    </div>
  )
}
