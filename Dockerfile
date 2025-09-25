# Multi-stage build para otimização
FROM automacaodebaixocusto/multi-link:v1.3.2 AS base

WORKDIR /app

# Copiar apenas os arquivos novos/alterados
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Gerar cliente Prisma com o novo schema
RUN npx prisma generate

# Build da aplicação Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ajustar permissões do entrypoint
RUN chmod +x ./docker-entrypoint.sh || echo "Permissão já definida"

# Usar entrypoint script atualizado
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
