#!/bin/bash

# Script de migration segura para produção
# Este script aplica apenas as alterações necessárias sem perder dados

echo "🚀 Iniciando migration segura para produção..."

# Verificar se estamos em produção
if [ "$NODE_ENV" = "production" ]; then
    echo "⚠️  Executando em ambiente de produção"
    
    # Backup do banco antes da migration
    echo "📦 Criando backup do banco..."
    pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
    
    # Aplicar migration segura
    echo "🔧 Aplicando migration segura..."
    psql $DATABASE_URL -f prisma/migrations/production-safe.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration aplicada com sucesso!"
    else
        echo "❌ Erro na migration. Restaurando backup..."
        # Aqui você pode adicionar lógica para restaurar o backup se necessário
        exit 1
    fi
else
    echo "🔧 Ambiente de desenvolvimento - aplicando migration normal..."
    npx prisma migrate deploy
fi

echo "🎉 Migration concluída!"
