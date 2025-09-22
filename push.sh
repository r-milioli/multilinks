#!/bin/bash
set -e

echo "📤 Push da imagem Multi-Link..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Definir variáveis
IMAGE_NAME="automacaodebaixocusto/multi-link"
TAG=${1:-latest}

echo "🔍 Verificando se a imagem existe..."
if ! docker image inspect $IMAGE_NAME:$TAG > /dev/null 2>&1; then
    echo "❌ Imagem $IMAGE_NAME:$TAG não encontrada!"
    echo "💡 Execute primeiro: ./build.sh $TAG"
    exit 1
fi

echo "📤 Fazendo push da imagem: $IMAGE_NAME:$TAG"

# Login no Docker Hub (se necessário)
echo "🔐 Verificando login no Docker Hub..."
if ! docker info | grep -q "Username"; then
    echo "⚠️ Não está logado no Docker Hub"
    echo "💡 Execute: docker login"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Push da imagem
docker push $IMAGE_NAME:$TAG

echo "✅ Push concluído!"
echo "📦 Imagem disponível em: https://hub.docker.com/r/$IMAGE_NAME"
echo ""
echo "🚀 Para usar em produção:"
echo "   docker pull $IMAGE_NAME:$TAG"
echo "   docker-compose up -d"
