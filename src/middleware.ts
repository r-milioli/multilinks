import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso às rotas públicas
        if (req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/api/upload') ||
            req.nextUrl.pathname.startsWith('/api/analytics/click') ||
            req.nextUrl.pathname.startsWith('/api/analytics/visit') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/[username]') ||
            req.nextUrl.pathname.match(/^\/[a-zA-Z0-9_-]+$/)) {
          return true
        }

        // Requerer autenticação para rotas protegidas
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/links/:path*',
    '/api/user/:path*',
    '/api/analytics/:path*'
  ]
}

