import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/admin/',
        '/_next/',
        '/login',
        '/register',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

