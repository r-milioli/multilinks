import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Link, CreateLinkData, UpdateLinkData, ReorderLinkData } from '@/types/link.types'
import { LinkService } from '../services/linkService'
import { apiClient } from '@/shared/services/apiClient'

export function useLinks() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLinks = async () => {
    if (!session?.user?.id) return

    try {
      setIsLoading(true)
      const response = await apiClient.get<Link[]>(`/links`)
      
      if (response.success && response.data) {
        setLinks(response.data)
      } else {
        toast.error('Erro ao carregar links')
      }
    } catch (error) {
      console.error('Erro ao buscar links:', error)
      toast.error('Erro ao carregar links')
    } finally {
      setIsLoading(false)
    }
  }

  const createLink = async (data: CreateLinkData) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      setIsCreating(true)
      const response = await apiClient.post<Link>('/links', data)
      
      if (response.success && response.data) {
        setLinks(prev => [...prev, response.data!])
        toast.success('Link criado com sucesso!')
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || 'Erro ao criar link')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao criar link:', error)
      toast.error('Erro ao criar link')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsCreating(false)
    }
  }

  const updateLink = async (linkId: string, data: UpdateLinkData) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      setIsUpdating(true)
      const response = await apiClient.put<Link>(`/links/${linkId}`, data)
      
      if (response.success && response.data) {
        setLinks(prev => prev.map(link => 
          link.id === linkId ? response.data! : link
        ))
        toast.success('Link atualizado com sucesso!')
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || 'Erro ao atualizar link')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao atualizar link:', error)
      toast.error('Erro ao atualizar link')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteLink = async (linkId: string) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      setIsDeleting(true)
      const response = await apiClient.delete(`/links/${linkId}`)
      
      if (response.success) {
        setLinks(prev => prev.filter(link => link.id !== linkId))
        toast.success('Link removido com sucesso!')
        return { success: true }
      } else {
        toast.error(response.error || 'Erro ao remover link')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error)
      toast.error('Erro ao remover link')
      return { success: false, error: 'Erro interno' }
    } finally {
      setIsDeleting(false)
    }
  }

  const reorderLinks = async (reorderedLinks: ReorderLinkData[]) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      const response = await apiClient.put('/links/reorder', { links: reorderedLinks })
      
      if (response.success) {
        // Atualizar estado local
        const newLinks = [...links]
        reorderedLinks.forEach(({ id, position }) => {
          const linkIndex = newLinks.findIndex(link => link.id === id)
          if (linkIndex !== -1) {
            newLinks[linkIndex] = { ...newLinks[linkIndex], position }
          }
        })
        newLinks.sort((a, b) => a.position - b.position)
        setLinks(newLinks)
        
        toast.success('Links reordenados com sucesso!')
        return { success: true }
      } else {
        toast.error(response.error || 'Erro ao reordenar links')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao reordenar links:', error)
      toast.error('Erro ao reordenar links')
      return { success: false, error: 'Erro interno' }
    }
  }

  const toggleLinkStatus = async (linkId: string) => {
    if (!session?.user?.id) return { success: false, error: 'Não autenticado' }

    try {
      const response = await apiClient.patch<Link>(`/links/${linkId}/toggle`)
      
      if (response.success && response.data) {
        setLinks(prev => prev.map(link => 
          link.id === linkId ? response.data! : link
        ))
        toast.success('Status do link atualizado!')
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || 'Erro ao atualizar status')
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao alternar status:', error)
      toast.error('Erro ao atualizar status')
      return { success: false, error: 'Erro interno' }
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [session?.user?.id])

  return {
    links,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLinkStatus,
    refetch: fetchLinks
  }
}

