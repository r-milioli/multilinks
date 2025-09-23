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

# Executar migrations
echo "🔄 Executando migrations..."
./node_modules/.bin/prisma db push --accept-data-loss

echo "✅ Migrations executadas com sucesso!"

# Iniciar a aplicação
echo "🚀 Iniciando servidor Next.js..."
exec "$@"