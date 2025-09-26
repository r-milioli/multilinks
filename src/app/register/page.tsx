'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'
import { LoadingPage } from '@/shared/components/ui/Loading'
import { ArrowLeft, LinkIcon } from 'lucide-react'
import { Footer } from '@/shared/components/layout/Footer'

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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent truncate block">
                MultiLink
              </span>
              <p className="text-xs text-gray-400 hidden sm:block">Link in Bio</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 sm:px-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
                <span className="sm:hidden">Voltar</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">MultiLink</h1>
            <p className="mt-2 text-sm text-gray-300">
              Seus links em um só lugar
            </p>
          </div>
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}