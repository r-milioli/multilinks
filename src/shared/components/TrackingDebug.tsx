'use client'

import { useEffect, useState } from 'react'

interface TrackingDebugProps {
  googleAnalytics?: string
  facebookPixel?: string
}

export function TrackingDebug({ googleAnalytics, facebookPixel }: TrackingDebugProps) {
  const [isClient, setIsClient] = useState(false)
  const [gaLoaded, setGaLoaded] = useState(false)
  const [fbLoaded, setFbLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Verificar se Google Analytics está carregado
    if (googleAnalytics) {
      const checkGA = () => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          setGaLoaded(true)
          console.log('✅ Google Analytics carregado:', googleAnalytics)
        } else {
          setTimeout(checkGA, 1000)
        }
      }
      checkGA()
    }

    // Verificar se Facebook Pixel está carregado
    if (facebookPixel) {
      const checkFB = () => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          setFbLoaded(true)
          console.log('✅ Facebook Pixel carregado:', facebookPixel)
        } else {
          setTimeout(checkFB, 1000)
        }
      }
      checkFB()
    }
  }, [isClient, googleAnalytics, facebookPixel])

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development' || !isClient) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">🔍 Tracking Debug</div>
      {googleAnalytics && (
        <div className={`flex items-center gap-2 ${gaLoaded ? 'text-green-400' : 'text-yellow-400'}`}>
          <span>{gaLoaded ? '✅' : '⏳'}</span>
          <span>GA: {googleAnalytics}</span>
        </div>
      )}
      {facebookPixel && (
        <div className={`flex items-center gap-2 ${fbLoaded ? 'text-green-400' : 'text-yellow-400'}`}>
          <span>{fbLoaded ? '✅' : '⏳'}</span>
          <span>FB: {facebookPixel}</span>
        </div>
      )}
      {!googleAnalytics && !facebookPixel && (
        <div className="text-gray-400">Nenhum tracking configurado</div>
      )}
    </div>
  )
}
