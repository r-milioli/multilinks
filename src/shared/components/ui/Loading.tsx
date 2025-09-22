import * as React from "react"
import { cn } from "@/shared/utils/cn"

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loading size={size} className={className} />
    </div>
  )
}

export const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loading size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export { Loading }

