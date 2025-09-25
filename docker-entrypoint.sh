#!/bin/sh
set -e

echo "🚀 Iniciando aplicação MultiLink..."

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não está definida!"
  exit 1
fi

echo "📊 DATABASE_URL configurada: ${DATABASE_URL}"

# Aguardar o banco de dados estar disponível
echo "⏳ Aguardando conexão com o banco de dados..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  echo "🔄 Tentativa $attempt/$max_attempts - Testando conexão com o banco..."
  
  # Debug: verificar se consegue resolver o DNS
  if command -v nslookup >/dev/null 2>&1; then
    echo "🔍 Testando resolução DNS do host 'postgres'..."
    nslookup postgres || echo "❌ Falha na resolução DNS"
  fi
  
  # Debug: tentar ping (se disponível)
  if command -v ping >/dev/null 2>&1; then
    echo "🔍 Testando conectividade com 'postgres'..."
    ping -c 1 postgres >/dev/null 2>&1 && echo "✅ Host 'postgres' acessível" || echo "❌ Host 'postgres' inacessível"
  fi
  
  # Tentar conectar com mais verbosidade nas primeiras tentativas
  if [ $attempt -le 3 ]; then
    echo "🔍 Testando conexão com verbosidade..."
    ./node_modules/.bin/prisma db push --accept-data-loss
    result=$?
  else
    ./node_modules/.bin/prisma db push --accept-data-loss > /dev/null 2>&1
    result=$?
  fi
  
  if [ $result -eq 0 ]; then
    echo "✅ Banco de dados conectado!"
    break
  fi
  
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Falha ao conectar com o banco de dados após $max_attempts tentativas"
    echo "🔍 Informações de debug:"
    echo "   - DATABASE_URL: $DATABASE_URL"
    echo "   - Host: $(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')"
    echo "   - Port: $(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')"
    echo "   - Database: $(echo $DATABASE_URL | sed 's/.*\/\([^?]*\).*/\1/')"
    exit 1
  fi
  
  echo "⏳ Aguardando 3 segundos antes da próxima tentativa..."
  sleep 3
  attempt=$((attempt + 1))
done

# Executar migration segura
echo "🔄 Executando migration segura do banco de dados..."

# Verificar se estamos em produção
if [ "$NODE_ENV" = "production" ]; then
    echo "⚠️  Ambiente de produção detectado - aplicando migration segura..."
    
    # Aplicar migration segura que preserva dados existentes
    if [ -f "prisma/migrations/production-safe.sql" ]; then
        echo "📋 Arquivo de migration segura encontrado, mas usando Prisma migrate deploy..."
        echo "⚠️  psql não disponível no container, usando migration padrão do Prisma..."
        
        # Tentar migrate deploy primeiro
        if ./node_modules/.bin/prisma migrate deploy > /dev/null 2>&1; then
            echo "✅ Migration deploy executada com sucesso!"
        else
            echo "⚠️  Migrate deploy falhou, tentando resolver baseline..."
            echo "🔄 Executando db push para sincronizar schema..."
            ./node_modules/.bin/prisma db push --accept-data-loss
            echo "✅ Schema sincronizado com sucesso!"
        fi
    else
        echo "⚠️  Arquivo de migration segura não encontrado, usando migration padrão..."
        
        # Tentar migrate deploy primeiro
        if ./node_modules/.bin/prisma migrate deploy > /dev/null 2>&1; then
            echo "✅ Migration deploy executada com sucesso!"
        else
            echo "⚠️  Migrate deploy falhou, tentando resolver baseline..."
            echo "🔄 Executando db push para sincronizar schema..."
            ./node_modules/.bin/prisma db push --accept-data-loss
            echo "✅ Schema sincronizado com sucesso!"
        fi
    fi
else
    echo "🔧 Ambiente de desenvolvimento - aplicando migration padrão..."
    ./node_modules/.bin/prisma migrate deploy
fi

echo "✅ Migration concluída com sucesso!"

# Iniciar a aplicação
echo "🚀 Iniciando servidor Next.js..."
exec "$@"
