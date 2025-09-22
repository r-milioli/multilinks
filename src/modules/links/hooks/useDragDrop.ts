import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Link, ReorderLinkData } from '@/types/link.types'

export function useDragDrop(links: Link[], onReorder: (links: ReorderLinkData[]) => Promise<any>) {
  const [items, setItems] = useState(links)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Criar array de reordenação
      const reorderData: ReorderLinkData[] = newItems.map((item, index) => ({
        id: item.id,
        position: index
      }))

      // Chamar função de reordenação
      await onReorder(reorderData)
    }
  }

  return {
    items,
    setItems,
    sensors,
    handleDragEnd,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
    closestCenter
  }
}

