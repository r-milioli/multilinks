'use client'

import { useState } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { useLinks } from '@/modules/links/hooks/useLinks'
import { DragDropList } from '@/modules/links/components/DragDropList'
import { LinkEditor } from '@/modules/links/components/LinkEditor'
import { Link } from '@/types/link.types'
import { LoadingPage } from '@/shared/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Plus, Link as LinkIcon, BarChart3, Settings, Eye, FileText } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function DashboardContent() {
  const { isLoading: authLoading, isAuthenticated } = useRequireAuth()
  const { data: session } = useSession()
  const {
    links,
    isLoading: linksLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLinkStatus
  } = useLinks()

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)

  if (authLoading || linksLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return null
  }

  const handleSaveLink = async (data: any) => {
    if (editingLink) {
      return await updateLink(editingLink.id, data)
    } else {
      return await createLink(data)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    return await deleteLink(linkId)
  }

  const handleToggleStatus = async (linkId: string) => {
    return await toggleLinkStatus(linkId)
  }

  const handleReorder = async (reorderedLinks: any[]) => {
    return await reorderLinks(reorderedLinks)
  }

  const handleViewPublicPage = () => {
    if (session?.user?.username) {
      window.open(`/${session.user.username}`, '_blank', 'noopener,noreferrer')
    } else {
      alert('Nome de usuário não encontrado. Configure seu perfil primeiro.')
    }
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)
  const activeLinks = links.filter(link => link.active).length

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Links
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeLinks} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Cliques
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Todos os tempos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Links Ativos
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLinks}</div>
            <p className="text-xs text-muted-foreground">
              {links.length - activeLinks} inativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsEditorOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
          <Button variant="outline" onClick={handleViewPublicPage}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar Página
          </Button>
          <Button variant="outline" asChild>
            <a href="/forms">
              <FileText className="h-4 w-4 mr-2" />
              Formulários
            </a>
          </Button>
        </div>
      </div>

      {/* Links List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Links</CardTitle>
          <CardDescription>
            Gerencie seus links e acompanhe o desempenho
          </CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum link criado
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando seu primeiro link
              </p>
              <Button onClick={() => setIsEditorOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Link
              </Button>
            </div>
          ) : (
            <DragDropList
              links={links}
              onReorder={handleReorder}
              onEdit={(link) => {
                setEditingLink(link)
                setIsEditorOpen(true)
              }}
              onDelete={handleDeleteLink}
              onToggleStatus={handleToggleStatus}
              isLoading={isDeleting}
            />
          )}
        </CardContent>
      </Card>

      {/* Link Editor Modal */}
      <LinkEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setEditingLink(null)
        }}
        onSubmit={handleSaveLink}
        link={editingLink}
        isLoading={isCreating || isUpdating}
      />
    </>
  )
}
