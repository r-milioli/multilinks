'use client'

import React from 'react'
import { X, LogIn, UserPlus, CreditCard } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onRegister: () => void
  planName: string
  planPrice: number
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  planName, 
  planPrice 
}: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-700 bg-black backdrop-blur-sm">
          <CardHeader className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">
                  Login Necessário
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Para continuar com o pagamento
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                Para efetuar o pagamento, você precisa estar logado em sua conta ou criar uma nova conta.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onLogin}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>

              <Button
                onClick={onRegister}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar Conta Grátis
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Não se preocupe, você manterá o plano selecionado após o login
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
