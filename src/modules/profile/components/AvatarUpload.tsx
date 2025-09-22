'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
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
    if (selectedFile) {
      await onUpload(selectedFile, cropData)
      handleClose()
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
        
        {currentAvatar && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpload(new File([], ''), null)}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remover
          </Button>
        )}
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
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {/* Aqui você pode adicionar um componente de crop mais sofisticado */}
                <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg pointer-events-none" />
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

