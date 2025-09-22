'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Trash2, AlertTriangle, X } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string, confirmText: string) => void
  isLoading: boolean
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmText?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { password?: string; confirmText?: string } = {}
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    }
    
    if (confirmText !== 'DELETAR') {
      newErrors.confirmText = 'Deve digitar exatamente "DELETAR"'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onConfirm(password, confirmText)
    }
  }

  const handleClose = () => {
    setPassword('')
    setConfirmText('')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-red-600">Deletar Conta</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Esta ação é irreversível. Você será deslogado e todos os seus dados serão permanentemente removidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Aviso Importante</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Você será deslogado automaticamente</li>
                <li>• Todos os seus links serão deletados</li>
                <li>• Todos os analytics serão perdidos</li>
                <li>• Suas configurações serão removidas</li>
                <li>• Esta ação não pode ser desfeita</li>
              </ul>
            </div>

            <div>
              <Label htmlFor="password">Confirme sua senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmText">
                Digite <span className="font-mono bg-gray-100 px-1 rounded">DELETAR</span> para confirmar
              </Label>
              <Input
                id="confirmText"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETAR"
                disabled={isLoading}
              />
              {errors.confirmText && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmText}</p>
              )}
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isLoading ? 'Deletando...' : 'Deletar Conta'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
