#!/bin/bash
set -e

echo "🐳 Deploy Multi-Link no Docker Swarm..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se estamos em modo Swarm
if ! docker info | grep -q "Swarm: active"; then
    echo "❌ Docker Swarm não está ativo!"
    echo "💡 Para ativar: docker swarm init"
    exit 1
fi

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
    echo "💡 Crie a rede: docker network create -d overlay network_public"
    exit 1
fi

# Definir variáveis
IMAGE_NAME="automacaodebaixocusto/multi-link"
TAG=${1:-latest}

echo "🔧 Configuração:"
echo "   • Imagem: $IMAGE_NAME:$TAG"
echo "   • Stack: multi-link"
echo "   • Rede: network_public"
echo ""

# Build da imagem (se necessário)
if [ "$2" = "build" ]; then
    echo "🔨 Construindo imagem..."
    docker build -t $IMAGE_NAME:$TAG .
    
    echo "📤 Fazendo push da imagem..."
    docker push $IMAGE_NAME:$TAG
fi

# Deploy no Swarm
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
echo "📊 Comandos úteis:"
echo "   • Ver logs: docker service logs -f multi-link_multi-link"
echo "   • Ver status: docker stack services multi-link"
echo "   • Ver tasks: docker stack ps multi-link"
echo "   • Parar: docker stack rm multi-link"
echo "   • Atualizar: docker service update --image $IMAGE_NAME:new-tag multi-link_multi-link"
echo ""
echo "🔍 Para verificar se está funcionando:"
echo "   curl -I https://${DOMAIN:-seudominio.com}"
