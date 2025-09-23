import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MultiLink - Seus links em um só lugar',
    short_name: 'MultiLink',
    description: 'Crie sua página de links personalizada e compartilhe todos os seus perfis sociais em um só lugar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3B82F6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

