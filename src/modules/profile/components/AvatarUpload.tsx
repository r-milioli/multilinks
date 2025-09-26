'use client'

import { useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/ui/Modal'
import { cn } from '@/shared/utils/cn'

interface AvatarUploadProps {
  onUpload: (file: File, cropData?: any) => Promise<any>
  isUploading?: boolean
  currentAvatar?: string | null
}

export function AvatarUpload({ onUpload, isUploading = false, currentAvatar }: AvatarUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cropData, setCropData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      setIsModalOpen(true)
    }
  }

  const handleCrop = (crop: any) => {
    setCropData(crop)
  }

  const handleUpload = async () => {
    console.log('🔄 AvatarUpload: Iniciando upload...')
    console.log('📁 AvatarUpload: Arquivo selecionado:', selectedFile)
    console.log('✂️ AvatarUpload: Dados de crop:', cropData)
    
    if (!selectedFile) {
      console.log('❌ AvatarUpload: Nenhum arquivo selecionado')
      return
    }

    try {
      console.log('📤 AvatarUpload: Chamando onUpload...')
      const result = await onUpload(selectedFile, cropData)
      console.log('📥 AvatarUpload: Resultado do onUpload:', result)

      if (!result) {
        console.error('❌ AvatarUpload: onUpload retornou undefined')
        return
      }

      if (result.success) {
        console.log('✅ AvatarUpload: Upload concluído com sucesso')
        handleClose()
      } else {
        console.error('❌ AvatarUpload: Upload falhou:', result.error)
      }
    } catch (error) {
      console.error('❌ AvatarUpload: Erro no onUpload:', error)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
    setPreview(null)
    setCropData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Preview da imagem atual */}
        {currentAvatar ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={`${currentAvatar}?t=${Date.now()}`}
                alt="Avatar atual"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
                key={currentAvatar} // Força re-render quando a URL muda
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Foto atual
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Nenhuma foto selecionada
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            {currentAvatar ? 'Alterar' : 'Adicionar'}
          </Button>
          
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>Editar Avatar</ModalTitle>
          </ModalHeader>
          
          <div className="space-y-4">
            {preview && (
              <div className="relative">
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview da nova imagem"
                    className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    Preview da nova foto de perfil
                  </p>
                  <p className="text-xs text-gray-500">
                    A imagem será redimensionada automaticamente para 400x400px
                  </p>
                </div>
                {/* Overlay indicando área de crop */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 border-2 border-primary border-dashed rounded-full" />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

