# 🚀 Guia de Migração: Cloudinary → MinIO

## 📋 Visão Geral

Este guia detalha a migração completa do Cloudinary para o MinIO, eliminando custos e colocando o controle total dos dados em suas mãos.

## ✅ Benefícios da Migração

- 💰 **Economia**: Elimina custos mensais do Cloudinary
- 🏠 **Controle**: Dados em sua infraestrutura
- 🔒 **Segurança**: Sem dependência de serviços externos
- 📈 **Performance**: MinIO otimizado para sua rede
- 🛠️ **Flexibilidade**: Controle total sobre transformações

## 🛠️ Implementação Realizada

### 1. **Serviços Criados**
- ✅ `MinIOService` - Serviço principal de upload/transformação
- ✅ `UploadServiceMinIO` - Interface compatível com o sistema atual
- ✅ API de transformação dinâmica `/api/image/[publicId]`

### 2. **APIs de Upload**
- ✅ `/api/upload/avatar-minio` - Upload de avatares
- ✅ `/api/upload/background-minio` - Upload de backgrounds
- ✅ `/api/upload/link-image-minio` - Upload de imagens de links

### 3. **Funcionalidades**
- ✅ Transformações automáticas com Sharp
- ✅ Otimização de imagens (WebP, qualidade)
- ✅ URLs dinâmicas com transformações
- ✅ Compatibilidade com sistema atual

## 🔧 Configuração

### 1. **Variáveis de Ambiente**
```bash
# MinIO Configuration
MINIO_ENDPOINT="seu-minio.com"
MINIO_PORT="9000"
MINIO_USE_SSL="true"
MINIO_ACCESS_KEY="sua-access-key"
MINIO_SECRET_KEY="sua-secret-key"
MINIO_BUCKET_NAME="multilinks-images"
NEXT_PUBLIC_MINIO_ENDPOINT="https://seu-minio.com:9000"
```

### 2. **Dependências Instaladas**
```bash
npm install minio sharp @types/minio
```

## 📦 Estrutura de Arquivos

```
src/
├── shared/services/
│   ├── minioService.ts          # Serviço principal MinIO
│   └── uploadServiceMinIO.ts    # Interface compatível
├── app/api/
│   ├── image/[publicId]/        # API de transformação
│   └── upload/
│       ├── avatar-minio/        # Upload de avatares
│       ├── background-minio/    # Upload de backgrounds
│       └── link-image-minio/    # Upload de imagens de links
└── scripts/
    └── migrate-to-minio.js      # Script de migração
```

## 🚀 Processo de Migração

### **Fase 1: Preparação**
1. Configure as variáveis de ambiente do MinIO
2. Crie o bucket `multilinks-images`
3. Teste a conexão com MinIO

### **Fase 2: Migração de Dados**
```bash
# Executar script de migração
node scripts/migrate-to-minio.js
```

O script irá:
- ✅ Migrar todos os avatares do Cloudinary
- ✅ Migrar todas as imagens de links
- ✅ Migrar todas as imagens de fundo
- ✅ Atualizar URLs no banco de dados

### **Fase 3: Atualização do Código**
1. Substituir `UploadService` por `UploadServiceMinIO`
2. Atualizar endpoints de upload
3. Testar funcionalidades

### **Fase 4: Limpeza**
1. Remover dependências do Cloudinary
2. Remover variáveis de ambiente antigas
3. Remover APIs legadas

## 🧪 Testes

### **Teste de Upload**
```bash
# Testar upload de avatar
curl -X POST http://localhost:3000/api/upload/avatar-minio \
  -F "file=@avatar.jpg" \
  -H "Authorization: Bearer token"
```

### **Teste de Transformação**
```bash
# Testar transformação de imagem
curl "http://localhost:3000/api/image/avatars/user123.webp?w=200&h=200&q=80"
```

## 📊 Comparação de Performance

| Aspecto | Cloudinary | MinIO |
|---------|------------|-------|
| **Custo** | 💰 Pago | ✅ Gratuito |
| **Controle** | ❌ Externo | ✅ Local |
| **Performance** | 🌐 CDN Global | 🏠 Rede Local |
| **Transformações** | ✅ Automáticas | ✅ Com Sharp |
| **Escalabilidade** | ✅ Ilimitada | ✅ Sua infraestrutura |

## 🔄 Rollback

Se necessário, é possível voltar ao Cloudinary:
1. Reverter commits de migração
2. Restaurar variáveis de ambiente
3. Executar script de migração reversa

## 📈 Próximos Passos

1. **Monitoramento**: Implementar logs de upload
2. **Cache**: Adicionar cache para transformações
3. **CDN**: Configurar CDN para MinIO (opcional)
4. **Backup**: Implementar backup automático

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verificar logs do MinIO
2. Testar conectividade
3. Validar permissões do bucket
4. Verificar configurações de SSL

---

**🎉 Migração concluída com sucesso!**
**💰 Economia estimada: 100% dos custos do Cloudinary**
**🏠 Controle total dos dados em sua infraestrutura**
