'use client'

import { useEffect } from 'react'

/**
 * Carrega uma fonte do Google Fonts quando fontFamily é alterada.
 * Inter já é carregada pelo layout; para as demais, injeta o link dinamicamente.
 */
export function GoogleFontLoader({ fontFamily }: { fontFamily?: string | null }) {
  useEffect(() => {
    if (!fontFamily || typeof document === 'undefined') return
    const family = fontFamily.trim()
    if (!family || family === 'Inter') return // Inter já carregada pelo app

    const id = `google-font-${family.replace(/\s+/g, '-')}`
    if (document.getElementById(id)) return

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    const encoded = family.replace(/ /g, '+')
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`
    document.head.appendChild(link)
    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [fontFamily])

  return null
}
