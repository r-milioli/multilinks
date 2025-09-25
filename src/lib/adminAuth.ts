import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

/**
 * Middleware para verificar autenticação e autorização em APIs administrativas
 */
export async function requireAdminAuth(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any).role as UserRole

    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Você não tem permissões de administrador.' },
        { status: 403 }
      )
    }

    return null // Autorizado, continuar
  } catch (error) {
    console.error('Erro na verificação de autenticação admin:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * Middleware para verificar permissões de Super Admin
 */
export async function requireSuperAdminAuth(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any).role as UserRole

    if (!userRole || userRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Apenas Super Administradores podem acessar esta funcionalidade.' },
        { status: 403 }
      )
    }

    return null // Autorizado, continuar
  } catch (error) {
    console.error('Erro na verificação de autenticação super admin:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * Função para verificar se o usuário tem permissão para uma ação específica
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  switch (requiredRole) {
    case 'SUPER_ADMIN':
      return userRole === 'SUPER_ADMIN'
    case 'ADMIN':
      return userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
    case 'USER':
      return true // Todos os usuários autenticados
    default:
      return false
  }
}

/**
 * Middleware para verificar permissão específica
 */
export async function requirePermission(request: NextRequest, requiredRole: UserRole) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }

    const userRole = (session.user as any).role as UserRole

    if (!userRole || !hasPermission(userRole, requiredRole)) {
      const roleNames = {
        'SUPER_ADMIN': 'Super Administrador',
        'ADMIN': 'Administrador',
        'USER': 'Usuário'
      }
      
      return NextResponse.json(
        { success: false, error: `Acesso negado. Requer permissões de ${roleNames[requiredRole]}.` },
        { status: 403 }
      )
    }

    return null // Autorizado, continuar
  } catch (error) {
    console.error('Erro na verificação de permissão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
