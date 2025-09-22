'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Algo deu errado!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Ocorreu um erro inesperado. Tente novamente ou entre em contato conosco se o problema persistir.
        </p>
        
        <div className="space-y-4">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
          
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID do erro: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

