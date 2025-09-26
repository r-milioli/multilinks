#!/usr/bin/env node

/**
 * Script de Migração Cloudinary → MinIO
 * 
 * Este script ajuda na migração das imagens do Cloudinary para o MinIO
 * e atualiza as referências no banco de dados.
 */

const { PrismaClient } = require('@prisma/client')
const { v2: cloudinary } = require('cloudinary')
const { Client } = require('minio')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Configurações
const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}

const MINIO_CONFIG = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucketName: process.env.MINIO_BUCKET || 'multilinks'
}

// Inicializar serviços
cloudinary.config(CLOUDINARY_CONFIG)
const minioClient = new Client(MINIO_CONFIG)

async function migrateUserAvatars() {
  console.log('🔄 Migrando avatares de usuários...')
  
  const users = await prisma.user.findMany({
    where: {
      image: {
        not: null,
        contains: 'cloudinary.com'
      }
    }
  })

  console.log(`📊 Encontrados ${users.length} usuários com avatares do Cloudinary`)

  for (const user of users) {
    try {
      console.log(`👤 Migrando avatar do usuário: ${user.email}`)
      
      // Baixar imagem do Cloudinary
      const imageUrl = user.image
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      // Processar com Sharp (400x400, WebP)
      const processedBuffer = await sharp(buffer)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer()

      // Upload para MinIO
      const fileName = `avatars/${user.id}_${Date.now()}.webp`
      await minioClient.putObject(
        MINIO_CONFIG.bucketName,
        fileName,
        processedBuffer,
        { 'Content-Type': 'image/webp' }
      )

      // Atualizar URL no banco
      const newImageUrl = `${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${fileName}`
      await prisma.user.update({
        where: { id: user.id },
        data: { image: newImageUrl }
      })

      console.log(`✅ Avatar migrado: ${user.email}`)
      
    } catch (error) {
      console.error(`❌ Erro ao migrar avatar do usuário ${user.email}:`, error)
    }
  }
}

async function migrateLinkImages() {
  console.log('🔄 Migrando imagens de links...')
  
  const links = await prisma.link.findMany({
    where: {
      image: {
        not: null,
        contains: 'cloudinary.com'
      }
    }
  })

  console.log(`📊 Encontrados ${links.length} links com imagens do Cloudinary`)

  for (const link of links) {
    try {
      console.log(`🔗 Migrando imagem do link: ${link.title}`)
      
      // Baixar imagem do Cloudinary
      const imageUrl = link.image
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      // Processar com Sharp (otimizado para links)
      const processedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: 'inside' })
        .webp({ quality: 85 })
        .toBuffer()

      // Upload para MinIO
      const fileName = `link-images/${link.userId}/${link.id}_${Date.now()}.webp`
      await minioClient.putObject(
        MINIO_CONFIG.bucketName,
        fileName,
        processedBuffer,
        { 'Content-Type': 'image/webp' }
      )

      // Atualizar URL no banco
      const newImageUrl = `${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${fileName}`
      await prisma.link.update({
        where: { id: link.id },
        data: { image: newImageUrl }
      })

      console.log(`✅ Imagem do link migrada: ${link.title}`)
      
    } catch (error) {
      console.error(`❌ Erro ao migrar imagem do link ${link.title}:`, error)
    }
  }
}

async function migrateBackgroundImages() {
  console.log('🔄 Migrando imagens de fundo...')
  
  const users = await prisma.user.findMany({
    where: {
      backgroundImage: {
        not: null,
        contains: 'cloudinary.com'
      }
    }
  })

  console.log(`📊 Encontrados ${users.length} usuários com imagens de fundo do Cloudinary`)

  for (const user of users) {
    try {
      console.log(`🎨 Migrando imagem de fundo do usuário: ${user.email}`)
      
      // Baixar imagem do Cloudinary
      const imageUrl = user.backgroundImage
      const response = await fetch(imageUrl)
      const buffer = await response.arrayBuffer()
      
      // Processar com Sharp (1920x1080, WebP)
      const processedBuffer = await sharp(buffer)
        .resize(1920, 1080, { fit: 'cover' })
        .webp({ quality: 85 })
        .toBuffer()

      // Upload para MinIO
      const fileName = `backgrounds/${user.id}_${Date.now()}.webp`
      await minioClient.putObject(
        MINIO_CONFIG.bucketName,
        fileName,
        processedBuffer,
        { 'Content-Type': 'image/webp' }
      )

      // Atualizar URL no banco
      const newImageUrl = `${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${fileName}`
      await prisma.user.update({
        where: { id: user.id },
        data: { backgroundImage: newImageUrl }
      })

      console.log(`✅ Imagem de fundo migrada: ${user.email}`)
      
    } catch (error) {
      console.error(`❌ Erro ao migrar imagem de fundo do usuário ${user.email}:`, error)
    }
  }
}

async function main() {
  console.log('🚀 Iniciando migração Cloudinary → MinIO')
  console.log('📋 Configurações:')
  console.log(`   MinIO: ${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}`)
  console.log(`   Bucket: ${MINIO_CONFIG.bucketName}`)
  console.log('')

  try {
    // Verificar conexão com MinIO
    console.log('🔍 Verificando conexão com MinIO...')
    await minioClient.bucketExists(MINIO_CONFIG.bucketName)
    console.log('✅ Conexão com MinIO OK')

    // Executar migrações
    await migrateUserAvatars()
    await migrateLinkImages()
    await migrateBackgroundImages()

    console.log('')
    console.log('🎉 Migração concluída com sucesso!')
    console.log('📝 Próximos passos:')
    console.log('   1. Atualizar as variáveis de ambiente')
    console.log('   2. Testar as novas APIs de upload')
    console.log('   3. Remover dependências do Cloudinary')

  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = { migrateUserAvatars, migrateLinkImages, migrateBackgroundImages }
