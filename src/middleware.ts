import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Se está logado e tenta acessar login/register, redirecionar
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Se não está logado e tenta acessar área protegida, redirecionar
    if (!token && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Verificar permissões de administrador para rotas admin
    if (pathname.startsWith('/dashboard') && pathname.includes('admin')) {
      const userRole = (token as any)?.role
      
      if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Rotas públicas
        const publicRoutes = [
          '/',
          '/login',
          '/register',
          '/[username]',
          '/api/auth',
          '/api/upload',
          '/api/analytics/click',
          '/api/analytics/visit',
          '/api/forms/public',
          '/api/leads',
          '/api/public',
          '/api/debug'
        ]

        // Verificar se é rota pública
        const isPublicRoute = publicRoutes.some(route => {
          if (route.includes('[')) {
            // Para rotas dinâmicas como [username]
            return pathname.match(/^\/[a-zA-Z0-9_-]+$/)
          }
          return pathname.startsWith(route)
        })

        if (isPublicRoute) {
          return true
        }

        // Para rotas de API protegidas, sempre permitir (a autenticação será feita na própria rota)
        if (pathname.startsWith('/api/')) {
          return true
        }

        // Para outras rotas protegidas, verificar token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/links/:path*',
    '/api/user/:path*',
    '/api/analytics/:path*',
    '/api/admin/:path*'
  ]
}

