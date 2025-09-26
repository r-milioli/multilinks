# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat openssl bind-tools iputils
WORKDIR /app

# Build da aplicação
FROM base AS builder
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiar schema do Prisma
COPY --from=builder /app/prisma ./prisma

# Copiar scripts de migração
COPY --from=builder /app/scripts ./scripts

# Copiar arquivos de configuração
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tsconfig.json ./

# Ajustar permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Script de inicialização inline
CMD ["sh", "-c", "\
echo '🚀 Iniciando aplicação MultiLink...' && \
echo '📊 DATABASE_URL configurada: ${DATABASE_URL}' && \
echo '⏳ Aguardando conexão com o banco de dados...' && \
max_attempts=30 && \
attempt=1 && \
while [ $attempt -le $max_attempts ]; do \
  echo \"🔄 Tentativa $attempt/$max_attempts - Testando conexão com o banco...\" && \
  if npx prisma db push --accept-data-loss > /dev/null 2>&1; then \
    echo '✅ Banco de dados conectado!' && \
    break; \
  fi && \
  if [ $attempt -eq $max_attempts ]; then \
    echo '❌ Falha ao conectar com o banco de dados após $max_attempts tentativas' && \
    exit 1; \
  fi && \
  echo '⏳ Aguardando 3 segundos antes da próxima tentativa...' && \
  sleep 3 && \
  attempt=$((attempt + 1)); \
done && \
echo '🔄 Executando inicialização inteligente do banco de dados...' && \
node scripts/init-db.js && \
echo '✅ Inicialização concluída com sucesso!' && \
echo '🚀 Iniciando servidor Next.js...' && \
npm start"]