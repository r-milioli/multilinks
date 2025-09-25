import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Textarea } from '@/shared/components/ui/Textarea'
import { Select, SelectItem } from '@/shared/components/ui/Select'
import { User, Shield } from 'lucide-react'
import { User as UserType } from '../hooks/useUsers'

interface UserEditModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, userData: Partial<UserType>) => Promise<{ success: boolean; error?: string }>
}

export function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<Partial<UserType>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        bio: user.bio || ''
      })
      setError(null)
    }
  }, [user])

  const handleSave = async () => {
    if (!user?.id) return

    setIsSaving(true)
    setError(null)
    const result = await onSave(user.id, formData)
    if (!result.success) {
      setError(result.error || 'Erro ao salvar alterações.')
    } else {
      onClose()
    }
    setIsSaving(false)
  }

  if (!user) return null

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Usuário - {user.name}
          </ModalTitle>
        </ModalHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Dados Pessoais
            </h3>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          {/* Permissões e Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Permissões e Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={formData.role || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                >
                  <SelectItem value="USER">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Usuário
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Administrador
                    </div>
                  </SelectItem>
                  <SelectItem value="SUPER_ADMIN">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Super Administrador
                    </div>
                  </SelectItem>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                </Select>
              </div>
            </div>
          </div>

          {/* Perfil */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Perfil Público
            </h3>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}