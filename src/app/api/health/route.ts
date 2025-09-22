import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Verificar conexão com o banco de dados
    await prisma.$queryRaw`SELECT 1`
    
    // Verificar se as tabelas principais existem
    const userCount = await prisma.user.count()
    const linkCount = await prisma.link.count()
    const formCount = await prisma.form.count()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      database: {
        connected: true,
        stats: {
          users: userCount,
          links: linkCount,
          forms: formCount
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT || 3000
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
