# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat openssl bind-tools iputils
WORKDIR /app

# Instalar dependências
FROM base AS deps
COPY package.json package-lock.json* ./

# Configurar Prisma para usar engines binários
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

RUN npm ci --only=production

# Build da aplicação
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./

# Instalar todas as dependências para o build
RUN npm ci

COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação Next.js
ENV NEXT_TELEMETRY_DISABLED 1
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
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar schema do Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copiar node_modules do builder (incluindo prisma)
COPY --from=builder /app/node_modules ./node_modules

# Copiar arquivos de configuração
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tsconfig.json ./

# Copiar script de entrypoint
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Ajustar permissões dos node_modules
RUN chown -R nextjs:nodejs ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
