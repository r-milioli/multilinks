'use client'

import { useState, useRef } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Label } from '@/shared/components/ui/Label'
import { Input } from '@/shared/components/ui/Input'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface LinkImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string | null) => void
  onImageRemove: () => void
  disabled?: boolean
}

export function LinkImageUpload({ 
  currentImage, 
  onImageChange, 
  onImageRemove, 
  disabled = false 
}: LinkImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas')
      return
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo 5MB')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload da imagem
    await uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/link-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      console.log('📋 Resultado do upload:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Erro no upload')
      }

      if (result.success) {
        const imageUrl = result.imageUrl || result.url
        console.log('🖼️ URL da imagem capturada:', imageUrl)
        setPreviewUrl(imageUrl)
        onImageChange(imageUrl)
        toast.success('Imagem enviada com sucesso!')
      } else {
        throw new Error('Upload falhou')
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error(error instanceof Error ? error.message : 'Erro no upload da imagem')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageRemove()
    toast.success('Imagem removida')
  }

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="link-image">Imagem do Link</Label>
      
      {/* Preview da imagem */}
      {previewUrl && (
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Área de upload */}
      <div className="space-y-2">
        <div
          onClick={handleUploadClick}
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${disabled || isUploading 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="w-6 h-6 text-gray-400" />
              <div className="text-sm text-gray-600">
                {previewUrl ? 'Clique para alterar' : 'Clique para enviar uma imagem'}
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG, WEBP até 5MB
              </div>
            </div>
          )}
        </div>

        {/* Botão de upload alternativo */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {previewUrl ? 'Alterar Imagem' : 'Enviar Imagem'}
        </Button>
      </div>

      {/* URL manual */}
      <div className="space-y-2">
        <Label htmlFor="image-url">Ou cole uma URL</Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={previewUrl || ''}
            onChange={(e) => {
              const url = e.target.value
              setPreviewUrl(url || null)
              onImageChange(url || null)
            }}
            disabled={disabled || isUploading}
            className="flex-1"
          />
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
