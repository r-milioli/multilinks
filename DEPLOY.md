# Guia de Deploy - MultiLink

Este guia explica como fazer o deploy do MultiLink em diferentes plataformas.

## 🚀 Deploy na Vercel (Recomendado)

### 1. Preparação
1. Faça push do código para o GitHub
2. Crie uma conta na [Vercel](https://vercel.com)
3. Conecte sua conta do GitHub

### 2. Configuração do Projeto
1. Clique em "New Project" na Vercel
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth.js
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-super-seguro

# OAuth Providers
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=seu-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

### 3. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Configure o domínio personalizado (opcional)

## 🐘 Configuração do PostgreSQL

### Opção 1: Vercel Postgres
1. No dashboard da Vercel, vá em "Storage"
2. Clique em "Create Database" → "Postgres"
3. Copie a string de conexão para `DATABASE_URL`

### Opção 2: Supabase
1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em "Settings" → "Database"
4. Copie a string de conexão

### Opção 3: Railway
1. Crie uma conta no [Railway](https://railway.app)
2. Crie um novo projeto PostgreSQL
3. Copie a string de conexão

### Configuração do Banco
Após configurar o banco, execute:

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema
npm run db:push

# (Opcional) Executar seed
npm run db:seed
```

## ☁️ Configuração do Cloudinary

1. Crie uma conta no [Cloudinary](https://cloudinary.com)
2. No dashboard, copie:
   - Cloud Name
   - API Key
   - API Secret
3. Configure as variáveis de ambiente

## 🔐 Configuração OAuth

### Google OAuth
1. Vá ao [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione URIs de redirecionamento:
   - `https://seu-dominio.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)

### GitHub OAuth
1. Vá às [configurações do GitHub](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Configure:
   - Application name: MultiLink
   - Homepage URL: `https://seu-dominio.vercel.app`
   - Authorization callback URL: `https://seu-dominio.vercel.app/api/auth/callback/github`

## 🌐 Deploy em Outras Plataformas

### Netlify
1. Conecte o repositório GitHub
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Configure variáveis de ambiente
4. Deploy

### Railway
1. Conecte o repositório GitHub
2. Configure variáveis de ambiente
3. Deploy automático

### DigitalOcean App Platform
1. Crie um novo app
2. Conecte o repositório GitHub
3. Configure variáveis de ambiente
4. Deploy

## 🔧 Configurações Pós-Deploy

### 1. Configurar Domínio Personalizado
1. Compre um domínio
2. Configure DNS:
   - A record: `@` → IP da Vercel
   - CNAME: `www` → `cname.vercel-dns.com`
3. Adicione o domínio na Vercel

### 2. Configurar SSL
- A Vercel configura SSL automaticamente
- Para outras plataformas, configure certificados SSL

### 3. Configurar Analytics
- Adicione Google Analytics
- Configure métricas de performance

### 4. Configurar Monitoramento
- Configure alertas de erro
- Monitore performance
- Configure backups

## 🚨 Troubleshooting

### Erro de Build
```bash
# Verificar logs
vercel logs

# Build local
npm run build
```

### Erro de Banco de Dados
```bash
# Verificar conexão
npm run db:push

# Resetar banco (cuidado!)
npm run db:push --force-reset
```

### Erro de Autenticação
- Verificar variáveis de ambiente
- Verificar URLs de callback
- Verificar configuração OAuth

### Erro de Upload
- Verificar configuração Cloudinary
- Verificar limites de tamanho
- Verificar tipos de arquivo

## 📊 Monitoramento

### Vercel Analytics
1. Ative Vercel Analytics
2. Configure métricas customizadas
3. Monitore performance

### Logs
```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de uma função específica
vercel logs --function=api/links
```

## 🔄 CI/CD

### GitHub Actions
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run db:push
```

## 🎯 Otimizações de Performance

### 1. Imagens
- Use Next.js Image component
- Configure otimizações do Cloudinary
- Implemente lazy loading

### 2. Bundle
- Configure code splitting
- Otimize imports
- Use dynamic imports

### 3. Caching
- Configure cache headers
- Use Vercel Edge Functions
- Implemente ISR

## 🔒 Segurança

### 1. Headers de Segurança
Configure em `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
]
```

### 2. Rate Limiting
- Configure rate limiting nas APIs
- Use Vercel Edge Functions
- Implemente captcha se necessário

### 3. Validação
- Valide todos os inputs
- Use Zod para validação
- Sanitize dados

## 📈 Escalabilidade

### 1. Banco de Dados
- Configure connection pooling
- Use read replicas
- Implemente caching

### 2. CDN
- Use Vercel Edge Network
- Configure cache headers
- Otimize assets

### 3. Monitoring
- Configure alertas
- Monitore métricas
- Implemente health checks

---

Para mais informações, consulte a [documentação oficial do Next.js](https://nextjs.org/docs/deployment).

