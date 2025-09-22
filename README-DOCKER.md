# 🐳 Docker - Multi-Link

Configuração Docker simplificada para o Multi-Link.

## 📦 Imagem Docker

- **Nome**: `automacaodebaixocusto/multi-link`
- **Rede**: `network_public`
- **Labels Traefik**: Configuradas automaticamente

## 🚀 Uso Rápido

### 1. Configurar Variáveis

```bash
# Copiar arquivo de exemplo
cp env.docker .env

# Editar configurações
nano .env
```

### 2. Build da Imagem

```bash
# Tornar scripts executáveis
chmod +x *.sh

# Build da imagem
./build.sh

# OU com tag específica
./build.sh v1.0.0
```

### 3. Push para Docker Hub

```bash
# Login no Docker Hub
docker login

# Push da imagem
./push.sh

# OU com tag específica
./push.sh v1.0.0
```

### 4. Deploy em Produção

#### Para Docker Swarm (Recomendado)
```bash
# Deploy completo no Swarm
./deploy-swarm.sh latest build

# OU apenas deploy (imagem já existe)
./deploy-swarm.sh latest
```

#### Para Docker Compose (Desenvolvimento)
```bash
# Deploy completo (build + push + deploy)
./deploy.sh

# OU apenas deploy
docker-compose up -d
```

## 📁 Arquivos

- **`Dockerfile`** - Configuração da imagem
- **`docker-compose.yml`** - Stack com labels Traefik
- **`env.docker`** - Variáveis de ambiente
- **`build.sh`** - Script para build
- **`push.sh`** - Script para push
- **`deploy.sh`** - Script para deploy completo

## 🔧 Configurações Traefik

### Labels Configuradas

- **Routers**: Domínio principal, www, API, Auth
- **Middlewares**: Security headers, compressão, rate limiting
- **SSL**: Let's Encrypt automático
- **Health Check**: `/api/health`

### Rate Limiting

- **Geral**: 50 req/min, burst 100
- **API**: 10 req/min, burst 20
- **Auth**: 2 req/min, burst 5

## 🌐 Variáveis de Ambiente

### Obrigatórias

```bash
DOMAIN="seudominio.com"
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="https://seudominio.com"
NEXTAUTH_SECRET="sua-chave-secreta"
```

### Opcionais

```bash
# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

## 🔍 Comandos Úteis

### Docker Swarm
```bash
# Ver status dos serviços
docker stack services multi-link

# Ver tasks
docker stack ps multi-link

# Ver logs
docker service logs -f multi-link_multi-link

# Atualizar serviço
docker service update --image automacaodebaixocusto/multi-link:new-tag multi-link_multi-link

# Parar stack
docker stack rm multi-link

# Verificar health
curl https://seudominio.com/api/health
```

### Docker Compose
```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Atualizar imagem
docker-compose pull
docker-compose up -d
```

## 🚨 Troubleshooting

### Imagem não encontrada
```bash
# Verificar se imagem existe
docker image ls | grep multi-link

# Rebuild se necessário
./build.sh
```

### Rede não encontrada
```bash
# Criar rede
docker network create network_public
```

### Variáveis não configuradas
```bash
# Verificar arquivo .env
cat .env

# Verificar se arquivo existe
ls -la .env
```

---

**Happy Deploying! 🚀**
