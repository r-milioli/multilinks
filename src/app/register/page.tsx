'use client'

import { useEffect } from 'react'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'
import { useRequireGuest } from '@/modules/auth/hooks/useAuth'
import { LoadingPage } from '@/shared/components/ui/Loading'

export default function RegisterPage() {
  const { isLoading, isAuthenticated } = useRequireGuest()

  if (isLoading) {
    return <LoadingPage />
  }

  if (isAuthenticated) {
    return null // Redirecionamento será feito pelo hook
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">MultiLink</h1>
          <p className="mt-2 text-sm text-gray-600">
            Seus links em um só lugar
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

