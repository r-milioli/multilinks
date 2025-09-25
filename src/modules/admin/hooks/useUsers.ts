import { useState, useEffect } from 'react'
import { apiClient } from '@/shared/services/apiClient'

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'
  createdAt: string
  updatedAt: string
  emailVerified?: boolean
  image?: string
  username?: string
  bio?: string
  stats?: {
    totalLinks: number
    totalClicks: number
    totalForms: number
    lastLogin?: string
  }
}

export interface UsersData {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserFilters {
  search?: string
  role?: string
  status?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLogin'
  sortOrder?: 'asc' | 'desc'
}

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async (newFilters?: UserFilters) => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      const currentFilters = { ...filters, ...newFilters }

      if (currentFilters.search) queryParams.append('search', currentFilters.search)
      if (currentFilters.role) queryParams.append('role', currentFilters.role)
      if (currentFilters.status) queryParams.append('status', currentFilters.status)
      if (currentFilters.page) queryParams.append('page', currentFilters.page.toString())
      if (currentFilters.limit) queryParams.append('limit', currentFilters.limit.toString())
      if (currentFilters.sortBy) queryParams.append('sortBy', currentFilters.sortBy)
      if (currentFilters.sortOrder) queryParams.append('sortOrder', currentFilters.sortOrder)

      const response = await apiClient.get(`/admin/users?${queryParams.toString()}`)

      if (response.success && response.data) {
        setUsers(response.data.users || [])
        setTotal(response.data.total || 0)
        setPage(response.data.page || 1)
        setTotalPages(response.data.totalPages || 0)
      } else {
        setError(response.error || 'Erro ao carregar usuários')
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData)

      if (response.success) {
        // Recarregar a lista de usuários
        await loadUsers()
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`)

      if (response.success) {
        // Recarregar a lista de usuários
        await loadUsers()
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return { success: false, error: 'Usuário não encontrado' }

      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      return await updateUser(userId, { status: newStatus })
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  const changeUserRole = async (userId: string, newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN') => {
    return await updateUser(userId, { role: newRole })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return {
    users,
    total,
    page,
    totalPages,
    isLoading,
    error,
    loadUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole
  }
}
