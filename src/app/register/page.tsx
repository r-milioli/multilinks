'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'
import { LoadingPage } from '@/shared/components/ui/Loading'

export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setIsRedirecting(true)
      // Redirecionamento imediato com replace
      router.replace('/dashboard')
    }
  }, [status, session, router])

  // Mostrar loading durante verificação ou redirecionamento
  if (status === 'loading' || isRedirecting) {
    return <LoadingPage />
  }

  // Se autenticado, não renderizar nada (redirecionamento em andamento)
  if (status === 'authenticated') {
    return <LoadingPage />
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

