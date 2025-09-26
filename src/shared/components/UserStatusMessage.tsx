'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/shared/components/ui/Button'
import { AlertTriangle, UserX, Clock, Shield } from 'lucide-react'

interface UserStatusMessageProps {
  status: 'INACTIVE' | 'SUSPENDED' | 'PENDING'
}

export function UserStatusMessage({ status }: UserStatusMessageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar mensagem após um pequeno delay para evitar flash
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'INACTIVE':
        return {
          icon: <UserX className="h-5 w-5" />,
          title: 'Conta Inativa',
          message: 'Sua conta foi desativada. Entre em contato com o suporte para mais informações.',
          variant: 'destructive' as const
        }
      case 'SUSPENDED':
        return {
          icon: <Shield className="h-5 w-5" />,
          title: 'Conta Suspensa',
          message: 'Sua conta foi suspensa temporariamente. Entre em contato com o suporte para resolver esta situação.',
          variant: 'destructive' as const
        }
      case 'PENDING':
        return {
          icon: <Clock className="h-5 w-5" />,
          title: 'Conta Pendente',
          message: 'Sua conta está aguardando ativação. Verifique seu email ou entre em contato com o suporte.',
          variant: 'default' as const
        }
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'Status Desconhecido',
          message: 'Seu status de conta não foi reconhecido. Entre em contato com o suporte.',
          variant: 'destructive' as const
        }
    }
  }

  const statusInfo = getStatusInfo()

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className={`flex items-center gap-3 mb-4 ${
          statusInfo.variant === 'destructive' ? 'text-red-600' : 'text-blue-600'
        }`}>
          {statusInfo.icon}
          <h3 className="text-lg font-semibold">{statusInfo.title}</h3>
        </div>
        <p className="text-gray-600 mb-6">
          {statusInfo.message}
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex-1"
          >
            Fazer Logout
          </Button>
          {status === 'PENDING' && (
            <Button 
              onClick={() => window.location.href = '/contact'}
              className="flex-1"
            >
              Contatar Suporte
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
