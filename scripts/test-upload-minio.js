#!/usr/bin/env node

/**
 * Script de Teste Upload MinIO
 * 
 * Este script testa o upload via API para MinIO
 */

const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
require('dotenv').config()

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function testAvatarUpload() {
  console.log('🔄 Testando upload de avatar via API...')
  
  try {
    // Criar uma imagem de teste
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
    
    const formData = new FormData()
    formData.append('file', testImageBuffer, {
      filename: 'test-avatar.jpg',
      contentType: 'image/jpeg'
    })
    formData.append('type', 'avatar')

    console.log('📤 Enviando requisição para:', `${API_BASE_URL}/api/upload/avatar-minio`)
    
    const response = await fetch(`${API_BASE_URL}/api/upload/avatar-minio`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer test-token' // Você pode precisar ajustar isso
      }
    })

    const result = await response.json()
    
    console.log('📋 Resposta da API:')
    console.log('   Status:', response.status)
    console.log('   Success:', result.success)
    
    if (result.success) {
      console.log('   URL:', result.url)
      console.log('   Public ID:', result.publicId)
      console.log('✅ Upload de avatar funcionando!')
      return result
    } else {
      console.log('   Error:', result.error)
      console.log('❌ Falha no upload de avatar')
      return null
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de upload:', error.message)
    return null
  }
}

async function testBackgroundUpload() {
  console.log('🔄 Testando upload de background via API...')
  
  try {
    // Criar uma imagem de teste
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
    
    const formData = new FormData()
    formData.append('file', testImageBuffer, {
      filename: 'test-background.jpg',
      contentType: 'image/jpeg'
    })
    formData.append('type', 'background')

    console.log('📤 Enviando requisição para:', `${API_BASE_URL}/api/upload/background-minio`)
    
    const response = await fetch(`${API_BASE_URL}/api/upload/background-minio`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer test-token' // Você pode precisar ajustar isso
      }
    })

    const result = await response.json()
    
    console.log('📋 Resposta da API:')
    console.log('   Status:', response.status)
    console.log('   Success:', result.success)
    
    if (result.success) {
      console.log('   URL:', result.url)
      console.log('   Public ID:', result.publicId)
      console.log('✅ Upload de background funcionando!')
      return result
    } else {
      console.log('   Error:', result.error)
      console.log('❌ Falha no upload de background')
      return null
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de upload:', error.message)
    return null
  }
}

async function main() {
  console.log('🚀 Teste de Upload MinIO via API')
  console.log('=' .repeat(50))
  console.log('')
  console.log('📋 Configurações:')
  console.log(`   API Base URL: ${API_BASE_URL}`)
  console.log(`   MinIO Endpoint: ${process.env.MINIO_ENDPOINT}`)
  console.log(`   MinIO Port: ${process.env.MINIO_PORT}`)
  console.log(`   MinIO SSL: ${process.env.MINIO_USE_SSL}`)
  console.log(`   MinIO Bucket: ${process.env.MINIO_BUCKET_NAME}`)
  console.log('')

  // Testar upload de avatar
  const avatarResult = await testAvatarUpload()
  console.log('')
  
  // Testar upload de background
  const backgroundResult = await testBackgroundUpload()
  console.log('')
  
  console.log('📋 Resumo dos Testes:')
  if (avatarResult) {
    console.log('   ✅ Upload de avatar: FUNCIONANDO')
    console.log(`   📍 URL: ${avatarResult.url}`)
  } else {
    console.log('   ❌ Upload de avatar: FALHOU')
  }
  
  if (backgroundResult) {
    console.log('   ✅ Upload de background: FUNCIONANDO')
    console.log(`   📍 URL: ${backgroundResult.url}`)
  } else {
    console.log('   ❌ Upload de background: FALHOU')
  }
  
  console.log('')
  console.log('💡 Próximos passos:')
  console.log('   1. Teste o upload via interface da aplicação')
  console.log('   2. Verifique as imagens no MinIO')
  console.log('   3. Confirme que não há mais uploads para Cloudinary')
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testAvatarUpload, testBackgroundUpload }
