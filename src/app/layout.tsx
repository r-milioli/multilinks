import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
// import { UserStatusGuard } from '@/shared/components/UserStatusGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MultiLink - Seus links em um só lugar',
  description: 'Crie sua página de links personalizada e compartilhe todos os seus perfis sociais em um só lugar.',
  keywords: ['links', 'social media', 'bio link', 'linktree', 'perfil'],
  authors: [{ name: 'MultiLink Team' }],
  creator: 'MultiLink',
  publisher: 'MultiLink',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'MultiLink - Seus links em um só lugar',
    description: 'Crie sua página de links personalizada e compartilhe todos os seus perfis sociais em um só lugar.',
    siteName: 'MultiLink',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiLink - Seus links em um só lugar',
    description: 'Crie sua página de links personalizada e compartilhe todos os seus perfis sociais em um só lugar.',
    creator: '@multilink',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

