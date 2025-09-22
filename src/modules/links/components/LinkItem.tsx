'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link, ExternalLink, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Link as LinkType } from '@/types/link.types'
import { formatUrlForDisplay, getFaviconUrl } from '@/lib/utils'
import { cn } from '@/shared/utils/cn'

interface LinkItemProps {
  link: LinkType
  onEdit: (link: LinkType) => void
  onDelete: (linkId: string) => void
  onToggleStatus: (linkId: string) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

export function LinkItem({ 
  link, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  isUpdating = false,
  isDeleting = false 
}: LinkItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleEdit = () => {
    onEdit(link)
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este link?')) {
      onDelete(link.id)
    }
  }

  const handleToggleStatus = () => {
    onToggleStatus(link.id)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-all duration-200',
        isDragging && 'opacity-50 shadow-lg',
        !link.active && 'opacity-60',
        isHovered && 'shadow-md'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Favicon */}
          <div className="flex-shrink-0">
            <img
              src={getFaviconUrl(link.url)}
              alt=""
              className="h-6 w-6 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/default-favicon.png'
              }}
            />
          </div>

          {/* Link Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className={cn(
                'text-sm font-medium truncate',
                !link.active && 'line-through text-gray-500'
              )}>
                {link.title}
              </h3>
              {!link.active && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Inativo
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {formatUrlForDisplay(link.url)}
            </p>
            {link.clickCount > 0 && (
              <p className="text-xs text-gray-400">
                {link.clickCount} clique{link.clickCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className="h-8 w-8"
            >
              {link.active ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

