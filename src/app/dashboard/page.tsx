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

export default function DashboardPage() {
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
    return null // Redirecionamento será feito pelo hook
  }

  const handleAddLink = () => {
    setEditingLink(null)
    setIsEditorOpen(true)
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setIsEditorOpen(true)
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

  const handleViewAnalytics = () => {
    window.location.href = '/analytics'
  }

  const handleViewSettings = () => {
    window.location.href = '/settings'
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)
  const activeLinks = links.filter(link => link.active).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LinkIcon className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/forms">
                  <FileText className="h-4 w-4 mr-2" />
                  Formulários
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewPublicPage}>
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewAnalytics}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                +12% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Ativação
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.length > 0 ? Math.round((activeLinks / links.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Links ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Links Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Meus Links</CardTitle>
                <CardDescription>
                  Gerencie todos os seus links em um só lugar
                </CardDescription>
              </div>
              <Button onClick={handleAddLink} disabled={isCreating}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropList
              links={links}
              onReorder={handleReorder}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
              onToggleStatus={handleToggleStatus}
              onAddLink={handleAddLink}
              isLoading={linksLoading}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              isCreating={isCreating}
            />
          </CardContent>
        </Card>

        {/* Link Editor Modal */}
        <LinkEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSubmit={handleSaveLink}
          link={editingLink}
          isLoading={isCreating || isUpdating}
        />
      </main>
    </div>
  )
}

