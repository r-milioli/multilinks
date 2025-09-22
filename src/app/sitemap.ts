import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  try {
    // Buscar todos os usuários públicos
    const users = await prisma.user.findMany({
      where: {
        username: { not: null },
        // Adicionar filtro de privacidade se necessário
      },
      select: {
        username: true,
        updatedAt: true,
      },
    })

    // Páginas dinâmicas dos usuários
    const userPages: MetadataRoute.Sitemap = users.map((user) => ({
      url: `${baseUrl}/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticPages, ...userPages]
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return staticPages
  }
}

