#!/usr/bin/env node

/**
 * Script de Teste MinIO Upload
 * 
 * Este script testa o upload para MinIO e mostra claramente onde a imagem foi salva
 */

const { Client } = require('minio')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
require('dotenv').config()

// Configurações do MinIO
const MINIO_CONFIG = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucketName: process.env.MINIO_BUCKET_NAME || 'multilinks-images'
}

const minioClient = new Client(MINIO_CONFIG)

async function testMinIOConnection() {
  console.log('🔍 Testando conexão com MinIO...')
  console.log('📋 Configurações:')
  console.log(`   Endpoint: ${MINIO_CONFIG.endPoint}`)
  console.log(`   Porta: ${MINIO_CONFIG.port}`)
  console.log(`   SSL: ${MINIO_CONFIG.useSSL}`)
  console.log(`   Bucket: ${MINIO_CONFIG.bucketName}`)
  console.log('')

  try {
    // Verificar se o bucket existe
    const bucketExists = await minioClient.bucketExists(MINIO_CONFIG.bucketName)
    
    if (!bucketExists) {
      console.log('📦 Bucket não existe. Criando...')
      await minioClient.makeBucket(MINIO_CONFIG.bucketName, 'us-east-1')
      console.log('✅ Bucket criado com sucesso!')
    } else {
      console.log('✅ Bucket existe!')
    }

    // Listar objetos no bucket
    console.log('📁 Conteúdo do bucket:')
    const objectsList = []
    const stream = minioClient.listObjects(MINIO_CONFIG.bucketName, '', true)
    
    stream.on('data', (obj) => {
      objectsList.push(obj)
    })
    
    stream.on('end', () => {
      if (objectsList.length === 0) {
        console.log('   (Bucket vazio)')
      } else {
        objectsList.forEach(obj => {
          console.log(`   📄 ${obj.name} (${obj.size} bytes)`)
        })
      }
    })

    return true
  } catch (error) {
    console.error('❌ Erro na conexão com MinIO:', error.message)
    return false
  }
}

async function testImageUpload() {
  console.log('🖼️ Testando upload de imagem...')
  
  try {
    // Criar uma imagem de teste
    const testImageBuffer = await sharp({
      create: {
        width: 400,
        height: 400,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
    .jpeg()
    .toBuffer()

    console.log('✅ Imagem de teste criada:', testImageBuffer.length, 'bytes')

    // Upload para MinIO
    const fileName = `test/avatar_${Date.now()}.jpg`
    const result = await minioClient.putObject(
      MINIO_CONFIG.bucketName,
      fileName,
      testImageBuffer,
      {
        'Content-Type': 'image/jpeg',
        'Content-Length': testImageBuffer.length
      }
    )

    console.log('✅ Upload concluído!')
    console.log('📍 Imagem salva em:')
    console.log(`   🗂️  Bucket: ${MINIO_CONFIG.bucketName}`)
    console.log(`   📄 Arquivo: ${fileName}`)
    console.log(`   🌐 URL: http://${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${fileName}`)
    console.log(`   🔗 URL completa: ${MINIO_CONFIG.useSSL ? 'https' : 'http'}://${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${fileName}`)

    return fileName
  } catch (error) {
    console.error('❌ Erro no upload:', error.message)
    return null
  }
}

async function testImageTransformation(fileName) {
  console.log('🔄 Testando transformação de imagem...')
  
  try {
    // Baixar imagem do MinIO
    const imageStream = await minioClient.getObject(MINIO_CONFIG.bucketName, fileName)
    const chunks = []
    
    imageStream.on('data', chunk => chunks.push(chunk))
    
    await new Promise((resolve, reject) => {
      imageStream.on('end', resolve)
      imageStream.on('error', reject)
    })
    
    const originalBuffer = Buffer.concat(chunks)
    console.log('✅ Imagem baixada:', originalBuffer.length, 'bytes')

    // Aplicar transformação com Sharp
    const transformedBuffer = await sharp(originalBuffer)
      .resize(200, 200, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer()

    console.log('✅ Transformação aplicada:', transformedBuffer.length, 'bytes')

    // Salvar versão transformada
    const transformedFileName = fileName.replace('.jpg', '_transformed.webp')
    await minioClient.putObject(
      MINIO_CONFIG.bucketName,
      transformedFileName,
      transformedBuffer,
      {
        'Content-Type': 'image/webp',
        'Content-Length': transformedBuffer.length
      }
    )

    console.log('✅ Versão transformada salva:')
    console.log(`   📄 Arquivo: ${transformedFileName}`)
    console.log(`   🌐 URL: http://${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}/${MINIO_CONFIG.bucketName}/${transformedFileName}`)

    return transformedFileName
  } catch (error) {
    console.error('❌ Erro na transformação:', error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Teste de Upload MinIO')
  console.log('=' .repeat(50))
  console.log('')

  // Testar conexão
  const connected = await testMinIOConnection()
  if (!connected) {
    console.log('❌ Não foi possível conectar ao MinIO')
    process.exit(1)
  }

  console.log('')
  
  // Testar upload
  const fileName = await testImageUpload()
  if (!fileName) {
    console.log('❌ Falha no upload de teste')
    process.exit(1)
  }

  console.log('')
  
  // Testar transformação
  await testImageTransformation(fileName)

  console.log('')
  console.log('🎉 Teste concluído com sucesso!')
  console.log('')
  console.log('📋 Resumo:')
  console.log(`   🗂️  Bucket: ${MINIO_CONFIG.bucketName}`)
  console.log(`   🌐 Endpoint: ${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}`)
  console.log(`   🔗 URLs das imagens estão listadas acima`)
  console.log('')
  console.log('💡 Para acessar as imagens:')
  console.log(`   1. Abra: http://${MINIO_CONFIG.endPoint}:${MINIO_CONFIG.port}`)
  console.log(`   2. Faça login com: ${MINIO_CONFIG.accessKey} / ${MINIO_CONFIG.secretKey}`)
  console.log(`   3. Navegue até o bucket: ${MINIO_CONFIG.bucketName}`)
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testMinIOConnection, testImageUpload, testImageTransformation }
