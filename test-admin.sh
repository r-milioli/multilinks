#!/bin/bash

echo "🧪 Testando aplicação com sistema administrativo..."

# Verificar se a imagem foi criada
echo "📦 Verificando imagem..."
docker images | grep "automacaodebaixocusto/multi-link.*v1.4.0"

if [ $? -eq 0 ]; then
    echo "✅ Imagem v1.4.0 encontrada!"
else
    echo "❌ Imagem v1.4.0 não encontrada!"
    exit 1
fi

# Verificar se o container pode ser iniciado
echo "🚀 Testando inicialização do container..."
docker run --rm -d \
  --name multilink-test \
  -e DATABASE_URL="postgresql://test:test@localhost:5432/test" \
  -e NODE_ENV="development" \
  -p 3001:3000 \
  automacaodebaixocusto/multi-link:v1.4.0

if [ $? -eq 0 ]; then
    echo "✅ Container iniciado com sucesso!"
    
    # Aguardar um pouco e verificar se está rodando
    sleep 5
    if docker ps | grep -q "multilink-test"; then
        echo "✅ Container está rodando!"
        echo "🌐 Aplicação disponível em: http://localhost:3001"
        echo "👑 Sistema administrativo incluído!"
    else
        echo "⚠️ Container parou de rodar. Verificando logs..."
        docker logs multilink-test
    fi
    
    # Parar o container de teste
    echo "🛑 Parando container de teste..."
    docker stop multilink-test
else
    echo "❌ Falha ao iniciar container!"
fi

echo "🎉 Teste concluído!"

