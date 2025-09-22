'use client'

import React, { useState } from 'react'
import { Link } from '@/types/link.types'
import { LinkItem } from './LinkItem'
import { AddLinkButton } from './LinkEditor'
import { useDragDrop } from '../hooks/useDragDrop'
import { LoadingSpinner } from '@/shared/components/ui/Loading'
import { cn } from '@/shared/utils/cn'

interface DragDropListProps {
  links: Link[]
  onReorder: (links: any[]) => Promise<any>
  onEdit: (link: Link) => void
  onDelete: (linkId: string) => void
  onToggleStatus: (linkId: string) => void
  onAddLink: () => void
  isLoading?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  isCreating?: boolean
}

export function DragDropList({
  links,
  onReorder,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddLink,
  isLoading = false,
  isUpdating = false,
  isDeleting = false,
  isCreating = false
}: DragDropListProps) {
  const {
    items,
    setItems,
    sensors,
    handleDragEnd,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
    closestCenter
  } = useDragDrop(links, onReorder)

  // Update items when links change
  React.useEffect(() => {
    setItems(links)
  }, [links, setItems])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum link ainda
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Adicione seu primeiro link para começar a construir sua página
        </p>
        <AddLinkButton onClick={onAddLink} disabled={isCreating} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((link) => (
              <LinkItem
                key={link.id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-4">
        <AddLinkButton onClick={onAddLink} disabled={isCreating} />
      </div>

      {links.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          <p>Arraste e solte para reordenar os links</p>
        </div>
      )}
    </div>
  )
}
