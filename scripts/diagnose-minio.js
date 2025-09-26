#!/usr/bin/env node

/**
 * Script de Diagnóstico MinIO
 * 
 * Este script verifica a configuração e conectividade do MinIO
 */

const { Client } = require('minio')

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

console.log('🔍 Diagnóstico MinIO')
console.log('=' .repeat(50))
console.log('')

// 1. Verificar variáveis de ambiente
console.log('📋 Variáveis de Ambiente:')
console.log(`   MINIO_ENDPOINT: ${process.env.MINIO_ENDPOINT || 'NÃO DEFINIDA'}`)
console.log(`   MINIO_PORT: ${process.env.MINIO_PORT || 'NÃO DEFINIDA'}`)
console.log(`   MINIO_USE_SSL: ${process.env.MINIO_USE_SSL || 'NÃO DEFINIDA'}`)
console.log(`   MINIO_ACCESS_KEY: ${process.env.MINIO_ACCESS_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA'}`)
console.log(`   MINIO_SECRET_KEY: ${process.env.MINIO_SECRET_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA'}`)
console.log(`   MINIO_BUCKET_NAME: ${process.env.MINIO_BUCKET_NAME || 'NÃO DEFINIDA'}`)
console.log('')

// 2. Verificar configuração final
console.log('⚙️ Configuração Final:')
console.log(`   Endpoint: ${MINIO_CONFIG.endPoint}`)
console.log(`   Porta: ${MINIO_CONFIG.port}`)
console.log(`   SSL: ${MINIO_CONFIG.useSSL}`)
console.log(`   Access Key: ${MINIO_CONFIG.accessKey ? 'DEFINIDA' : 'NÃO DEFINIDA'}`)
console.log(`   Secret Key: ${MINIO_CONFIG.secretKey ? 'DEFINIDA' : 'NÃO DEFINIDA'}`)
console.log(`   Bucket: ${MINIO_CONFIG.bucketName}`)
console.log('')

// 3. Testar conectividade básica
console.log('🌐 Testando Conectividade:')
const minioClient = new Client(MINIO_CONFIG)

async function testConnection() {
  try {
    console.log('   🔄 Tentando conectar...')
    
    // Testar se o serviço está rodando
    const buckets = await minioClient.listBuckets()
    console.log('   ✅ Conexão estabelecida!')
    console.log(`   📦 Buckets encontrados: ${buckets.length}`)
    
    buckets.forEach(bucket => {
      console.log(`      - ${bucket.name} (criado em: ${bucket.creationDate})`)
    })
    
    return true
  } catch (error) {
    console.log('   ❌ Erro na conexão:', error.message)
    
    // Diagnósticos específicos
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Solução: Verifique se o MinIO está rodando')
      console.log('      - Docker: docker ps | grep minio')
      console.log('      - Serviço: systemctl status minio')
    } else if (error.code === 'ENOTFOUND') {
      console.log('   💡 Solução: Verifique o MINIO_ENDPOINT')
      console.log('      - Deve ser um IP ou domínio válido')
    } else if (error.message.includes('Access Denied')) {
      console.log('   💡 Solução: Verifique as credenciais')
      console.log('      - MINIO_ACCESS_KEY e MINIO_SECRET_KEY')
    } else if (error.message.includes('SSL')) {
      console.log('   💡 Solução: Verifique MINIO_USE_SSL')
      console.log('      - true para HTTPS, false para HTTP')
    }
    
    return false
  }
}

async function testBucket() {
  try {
    console.log('   🔄 Verificando bucket...')
    
    const bucketExists = await minioClient.bucketExists(MINIO_CONFIG.bucketName)
    
    if (bucketExists) {
      console.log(`   ✅ Bucket '${MINIO_CONFIG.bucketName}' existe!`)
      
      // Listar objetos no bucket
      const objectsList = []
      const stream = minioClient.listObjects(MINIO_CONFIG.bucketName, '', true)
      
      return new Promise((resolve) => {
        stream.on('data', (obj) => {
          objectsList.push(obj)
        })
        
        stream.on('end', () => {
          console.log(`   📁 Objetos no bucket: ${objectsList.length}`)
          if (objectsList.length > 0) {
            objectsList.slice(0, 5).forEach(obj => {
              console.log(`      - ${obj.name} (${obj.size} bytes)`)
            })
            if (objectsList.length > 5) {
              console.log(`      ... e mais ${objectsList.length - 5} objetos`)
            }
          }
          resolve(true)
        })
        
        stream.on('error', (error) => {
          console.log(`   ⚠️  Erro ao listar objetos: ${error.message}`)
          resolve(false)
        })
      })
    } else {
      console.log(`   ⚠️  Bucket '${MINIO_CONFIG.bucketName}' não existe`)
      console.log('   💡 Solução: Criar o bucket')
      
      try {
        await minioClient.makeBucket(MINIO_CONFIG.bucketName, 'us-east-1')
        console.log('   ✅ Bucket criado com sucesso!')
        return true
      } catch (createError) {
        console.log(`   ❌ Erro ao criar bucket: ${createError.message}`)
        return false
      }
    }
  } catch (error) {
    console.log(`   ❌ Erro ao verificar bucket: ${error.message}`)
    return false
  }
}

async function main() {
  const connected = await testConnection()
  
  if (connected) {
    console.log('')
    await testBucket()
  }
  
  console.log('')
  console.log('📋 Resumo do Diagnóstico:')
  if (connected) {
    console.log('   ✅ MinIO está acessível')
    console.log('   ✅ Configuração está correta')
    console.log('   🚀 Pronto para usar!')
  } else {
    console.log('   ❌ MinIO não está acessível')
    console.log('   🔧 Verifique as configurações acima')
  }
  
  console.log('')
  console.log('💡 Próximos passos:')
  if (connected) {
    console.log('   1. Execute: node scripts/test-minio-upload.js')
    console.log('   2. Teste o upload de uma imagem')
    console.log('   3. Verifique a interface web do MinIO')
  } else {
    console.log('   1. Verifique se o MinIO está rodando')
    console.log('   2. Confirme as variáveis de ambiente')
    console.log('   3. Teste a conectividade de rede')
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testConnection, testBucket }
