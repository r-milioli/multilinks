'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/modules/auth/hooks/useAuth'
import { useLinks } from '@/modules/links/hooks/useLinks'
import { DragDropList } from '@/modules/links/components/DragDropList'
import { LinkEditor } from '@/modules/links/components/LinkEditor'
import { Link } from '@/types/link.types'
import { LoadingPage } from '@/shared/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Plus, Link as LinkIcon, BarChart3, Settings, Eye, FileText, TrendingUp, Activity } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useNavigation } from '@/shared/contexts/NavigationContext'
import { toast } from 'react-hot-toast'

type DashboardSection = 'overview' | 'links' | 'analytics' | 'performance' | 'activity'

export function DashboardContent() {
  const { currentSection } = useNavigation()
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

  // Determinar a seção ativa baseada na navegação
  const getActiveSection = (): DashboardSection => {
    switch (currentSection) {
      case 'dashboard':
        return 'overview'
      case 'dashboard-links':
        return 'links'
      case 'dashboard-analytics':
        return 'analytics'
      case 'dashboard-performance':
        return 'performance'
      case 'dashboard-activity':
        return 'activity'
      default:
        return 'overview'
    }
  }

  const [activeSection, setActiveSection] = useState<DashboardSection>(getActiveSection())

  useEffect(() => {
    setActiveSection(getActiveSection())
  }, [currentSection])

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
    if (session?.user && (session.user as any)?.username) {
      window.open(`/${(session.user as any).username}`, '_blank', 'noopener,noreferrer')
    } else {
      toast.error('Nome de usuário não encontrado. Configure seu perfil primeiro.')
    }
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)
  const activeLinks = links.filter(link => link.active).length

  // Renderizar seção Visão Geral
  const renderOverviewSection = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{links.length}</div>
            <p className="text-xs text-muted-foreground">{activeLinks} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">Todos os tempos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLinks}</div>
            <p className="text-xs text-muted-foreground">{links.length - activeLinks} inativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <Button onClick={() => setIsEditorOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
          <Button variant="outline" onClick={handleViewPublicPage} className="w-full sm:w-auto">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar Página
          </Button>
          {/* <Button variant="outline" asChild>
            <a href="/forms">
              <FileText className="h-4 w-4 mr-2" />
              Formulários
            </a>
          </Button> */}
        </div>
      </div>

      {/* Links List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Links</CardTitle>
          <CardDescription>Gerencie seus links e acompanhe o desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum link criado</h3>
              <p className="text-gray-500 mb-4">Comece criando seu primeiro link</p>
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
    </>
  )

  // Renderizar seção Meus Links
  const renderLinksSection = () => (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold">Meus Links</h3>
            <p className="text-gray-600">Gerencie todos os seus links</p>
          </div>
          <Button onClick={() => setIsEditorOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum link criado</h3>
              <p className="text-gray-500 mb-6">Comece criando seu primeiro link</p>
              <Button onClick={() => setIsEditorOpen(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
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
    </>
  )

  // Renderizar seção Analytics
  const renderAnalyticsSection = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Analytics do Dashboard</h3>
        <p className="text-gray-600">Análise detalhada do desempenho dos seus links</p>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum dado de analytics</h3>
          <p className="text-gray-500 mb-6">Crie links para começar a ver analytics</p>
          <Button onClick={() => setIsEditorOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Link
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.reduce((sum, link) => sum + link.clickCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Todos os links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.filter(link => link.active).length}</div>
              <p className="text-xs text-muted-foreground">de {links.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Link Mais Popular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.length > 0 ? Math.max(...links.map(link => link.clickCount)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">cliques no top link</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ativação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.length > 0 ? Math.round((links.filter(link => link.active).length / links.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">links ativos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Links por Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length > 0 ? (
              <div className="space-y-4">
                {links
                  .sort((a, b) => b.clickCount - a.clickCount)
                  .slice(0, 5)
                  .map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <span className="font-medium">{link.title}</span>
                          <p className="text-sm text-gray-500">{link.url}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">{link.clickCount}</span>
                        <p className="text-xs text-gray-500">cliques</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhum link para mostrar</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance por Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Gráfico de performance por horário (em desenvolvimento)
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

  // Renderizar seção Performance
  const renderPerformanceSection = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Performance</h3>
        <p className="text-gray-600">Métricas de performance e otimização</p>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma métrica de performance</h3>
          <p className="text-gray-500 mb-6">Crie links para começar a ver métricas de performance</p>
          <Button onClick={() => setIsEditorOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Link
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Total de Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{links.reduce((sum, link) => sum + link.clickCount, 0)}</div>
              <p className="text-sm text-gray-600">Todos os links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Links Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{links.filter(link => link.active).length}</div>
              <p className="text-sm text-gray-600">de {links.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Taxa de Ativação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {links.length > 0 ? Math.round((links.filter(link => link.active).length / links.length) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600">Links ativos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de cliques</span>
                  <span className="font-medium">{links.reduce((sum, link) => sum + link.clickCount, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Links ativos</span>
                  <span className="font-medium text-green-600">{links.filter(link => link.active).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxa de ativação</span>
                  <span className="font-medium">
                    {links.length > 0 ? Math.round((links.filter(link => link.active).length / links.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhuma métrica disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Otimizações Sugeridas</CardTitle>
          </CardHeader>
          <CardContent>
            {links.length > 0 ? (
              <div className="space-y-3">
                {links.filter(link => !link.active).length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Você tem {links.filter(link => !link.active).length} link(s) inativo(s). Considere ativá-los.
                    </p>
                  </div>
                )}
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    {links.filter(link => link.active).length > 0 
                      ? `Você tem ${links.filter(link => link.active).length} link(s) ativo(s)!`
                      : 'Crie seu primeiro link para começar!'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhuma sugestão disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )

  // Renderizar seção Atividade
  const renderActivitySection = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Atividade Recente</h3>
        <p className="text-gray-600">Acompanhe as últimas atividades do seu sistema</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Timeline de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {links.length > 0 ? (
              <div className="space-y-4">
                {links.slice(0, 3).map((link, index) => (
                  <div key={link.id} className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">
                        {index === 0 ? 'Link criado' : 
                         index === 1 ? (link.active ? 'Link ativo' : 'Link inativo') : 
                         `${link.clickCount} cliques registrados`}
                      </p>
                      <p className="text-xs text-gray-500">{link.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Gráfico de atividade (em desenvolvimento)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {links.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total de cliques</span>
                    <span className="font-medium">{links.reduce((sum, link) => sum + link.clickCount, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Links ativos</span>
                    <span className="font-medium">{links.filter(link => link.active).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Links inativos</span>
                    <span className="font-medium">{links.filter(link => !link.active).length}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Nenhuma estatística disponível</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )

  return (
    <div className="space-y-6">
      {activeSection === 'overview' && renderOverviewSection()}
      {activeSection === 'links' && renderLinksSection()}
      {activeSection === 'analytics' && renderAnalyticsSection()}
      {activeSection === 'performance' && renderPerformanceSection()}
      {activeSection === 'activity' && renderActivitySection()}

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
    </div>
  )
}
