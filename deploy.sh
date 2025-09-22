#!/bin/bash
set -e

echo "🚀 Deploy completo do Multi-Link..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Definir variáveis
IMAGE_NAME="automacaodebaixocusto/multi-link"
TAG=${1:-latest}

echo "🔧 Configuração:"
echo "   • Imagem: $IMAGE_NAME:$TAG"
echo "   • Rede: network_public"
echo ""

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "💡 Copie env.docker para .env e configure suas variáveis"
    exit 1
fi

# Verificar se rede existe
echo "🔍 Verificando rede network_public..."
if ! docker network ls | grep -q "network_public"; then
    echo "❌ Rede network_public não encontrada!"
    echo "💡 Crie a rede: docker network create network_public"
    exit 1
fi

# Build da imagem
echo "🔨 Construindo imagem..."
docker build -t $IMAGE_NAME:$TAG .

# Push da imagem
echo "📤 Fazendo push da imagem..."
docker push $IMAGE_NAME:$TAG

# Deploy com Docker Swarm
echo "🐳 Iniciando deploy no Docker Swarm..."
docker stack rm multi-link || true
sleep 5
docker stack deploy -c docker-compose.yml multi-link

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Verificando status..."
docker stack services multi-link

echo ""
echo "📊 Para ver logs:"
echo "   docker service logs -f multi-link_multi-link"
echo ""
echo "🛑 Para parar:"
echo "   docker stack rm multi-link"
