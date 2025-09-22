'use client'

import { LayoutWrapper, DynamicContent } from '@/shared/components/layout'

export default function TestSPAPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Teste SPA</h1>
        <p>Esta é uma página de teste para verificar se o SPA está funcionando.</p>
        <p>Verifique o console do navegador para logs de debug.</p>
      </div>
      <DynamicContent />
    </LayoutWrapper>
  )
}
