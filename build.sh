#!/bin/bash
set -e

echo "🐳 Build da imagem Multi-Link..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Definir variáveis
IMAGE_NAME="automacaodebaixocusto/multi-link"
TAG=${1:-latest}

echo "🔨 Construindo imagem: $IMAGE_NAME:$TAG"

# Build da imagem
docker build -t $IMAGE_NAME:$TAG .

echo "✅ Build concluído!"
echo "📦 Imagem criada: $IMAGE_NAME:$TAG"
echo ""
echo "🚀 Para fazer push:"
echo "   docker push $IMAGE_NAME:$TAG"
echo ""
echo "🧪 Para testar localmente:"
echo "   docker run -p 3000:3000 $IMAGE_NAME:$TAG"
