# 🗂️ Configuração MinIO - Onde as Imagens São Salvas

## 📍 Estrutura de Armazenamento

### **Localização das Imagens:**
```
MinIO Server: http://seu-minio.com:9000
Bucket: multilinks-images
```

### **Estrutura de Pastas:**
```
multilinks-images/
├── multilinks/
│   ├── avatars/           # Avatares dos usuários
│   │   ├── user123_avatar_1234567890.webp
│   │   └── user456_avatar_1234567891.webp
│   ├── backgrounds/      # Imagens de fundo
│   │   ├── user123_background_1234567890.webp
│   │   └── user456_background_1234567891.webp
│   └── link-images/      # Imagens de links
│       ├── user123/
│       │   ├── link456_image_1234567890.webp
│       │   └── link789_image_1234567891.webp
│       └── user456/
│           └── link123_image_1234567892.webp
└── test/                 # Imagens de teste
    └── avatar_1234567890.jpg
```

## 🔧 Configuração

### **1. Variáveis de Ambiente:**
```bash
# MinIO Configuration
MINIO_ENDPOINT="seu-minio.com"          # IP ou domínio do MinIO
MINIO_PORT="9000"                        # Porta do MinIO
MINIO_USE_SSL="false"                    # true se usar HTTPS
MINIO_ACCESS_KEY="sua-access-key"        # Chave de acesso
MINIO_SECRET_KEY="sua-secret-key"        # Chave secreta
MINIO_BUCKET_NAME="multilinks-images"    # Nome do bucket
NEXT_PUBLIC_MINIO_ENDPOINT="http://seu-minio.com:9000"  # URL pública
```

### **2. URLs de Acesso:**
```bash
# Interface Web do MinIO
http://seu-minio.com:9000

# Acesso direto às imagens
http://seu-minio.com:9000/multilinks-images/multilinks/avatars/user123_avatar_1234567890.webp

# Com transformações (via API)
http://seu-app.com/api/image/multilinks/avatars/user123_avatar_1234567890.webp?w=200&h=200&q=80
```

## 🧪 Teste de Configuração

### **1. Executar Script de Teste:**
```bash
node scripts/test-minio-upload.js
```

### **2. Verificar Logs:**
```
🔍 Testando conexão com MinIO...
📋 Configurações:
   Endpoint: seu-minio.com
   Porta: 9000
   SSL: false
   Bucket: multilinks-images

✅ Bucket existe!
📁 Conteúdo do bucket:
   📄 multilinks/avatars/user123_avatar_1234567890.webp (45123 bytes)
   📄 multilinks/backgrounds/user456_background_1234567891.webp (67890 bytes)

✅ Upload concluído!
📍 Imagem salva em:
   🗂️  Bucket: multilinks-images
   📄 Arquivo: multilinks/avatars/user123_avatar_1234567890.webp
   🌐 URL: http://seu-minio.com:9000/multilinks-images/multilinks/avatars/user123_avatar_1234567890.webp
```

## 📊 Monitoramento

### **1. Interface Web MinIO:**
- Acesse: `http://seu-minio.com:9000`
- Login: `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`
- Navegue até o bucket: `multilinks-images`

### **2. Logs da Aplicação:**
```bash
# Upload de avatar
🔄 Iniciando upload de avatar para MinIO...
📁 Arquivo recebido: { name: 'avatar.jpg', type: 'image/jpeg', size: 136090 }
✅ Buffer criado: 136090 bytes
☁️ Iniciando upload para MinIO...
📍 Destino MinIO: {
  endpoint: 'seu-minio.com',
  port: 9000,
  bucket: 'multilinks-images',
  folder: 'multilinks/avatars',
  fileName: 'user123_avatar_1234567890.webp'
}
✅ Upload concluído: {
  url: 'http://seu-minio.com:9000/multilinks-images/multilinks/avatars/user123_avatar_1234567890.webp',
  publicId: 'multilinks/avatars/user123_avatar_1234567890.webp'
}
📍 Imagem salva em: http://seu-minio.com:9000/multilinks-images/multilinks/avatars/user123_avatar_1234567890.webp
🆔 Public ID: multilinks/avatars/user123_avatar_1234567890.webp
```

## 🔍 Verificação

### **1. Listar Imagens:**
```bash
# Via MinIO Client
mc ls seu-minio/multilinks-images/multilinks/avatars/

# Via API
curl http://seu-minio.com:9000/multilinks-images/multilinks/avatars/
```

### **2. Verificar Transformações:**
```bash
# Imagem original
curl http://seu-minio.com:9000/multilinks-images/multilinks/avatars/user123_avatar_1234567890.webp

# Imagem transformada (200x200, qualidade 80)
curl http://seu-app.com/api/image/multilinks/avatars/user123_avatar_1234567890.webp?w=200&h=200&q=80
```

## 🚨 Troubleshooting

### **Problemas Comuns:**

1. **"Bucket não existe"**
   - Verificar se o bucket `multilinks-images` foi criado
   - Executar: `mc mb seu-minio/multilinks-images`

2. **"Acesso negado"**
   - Verificar `MINIO_ACCESS_KEY` e `MINIO_SECRET_KEY`
   - Verificar permissões do usuário

3. **"Conexão recusada"**
   - Verificar `MINIO_ENDPOINT` e `MINIO_PORT`
   - Verificar se o MinIO está rodando

4. **"SSL/TLS error"**
   - Verificar `MINIO_USE_SSL` (true/false)
   - Verificar certificados SSL

### **Comandos de Diagnóstico:**
```bash
# Testar conexão
node scripts/test-minio-upload.js

# Verificar configuração
echo $MINIO_ENDPOINT
echo $MINIO_BUCKET_NAME

# Listar buckets
mc ls seu-minio/
```

---

**🎯 Resumo:** As imagens são salvas no MinIO em `multilinks-images/multilinks/` com subpastas por tipo (avatars, backgrounds, link-images) e organizadas por usuário. As URLs são geradas automaticamente e incluem transformações dinâmicas via API.
