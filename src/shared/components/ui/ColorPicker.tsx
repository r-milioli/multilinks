'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Palette, Check } from 'lucide-react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#EF4444', // Red
  '#F59E0B', // Yellow
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#A855F7', // Violet
  '#000000', // Black
  '#6B7280', // Gray
  '#FFFFFF', // White
  '#DC2626'  // Dark Red
]

export function ColorPicker({ value, onChange, label, className = '' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start"
      >
        <div 
          className="w-4 h-4 rounded mr-2 border border-gray-300"
          style={{ backgroundColor: value || '#000000' }}
        />
        <span className="text-sm">{value?.toUpperCase() || '#000000'}</span>
        <Palette className="ml-auto h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[200px]">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform relative"
                style={{ backgroundColor: color }}
                title={color}
              >
                {value === color && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                )}
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Cor personalizada:
            </label>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Overlay para fechar quando clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
