#!/bin/bash

# Script genérico para build e deploy da aplicação MultiLink

set -e

echo "🚀 Iniciando build e deploy da aplicação MultiLink..."

# Configuração
DOCKER_REPOSITORY="automacaodebaixocusto/multi-link"
DOCKER_TAG=${DOCKER_TAG:-latest}

# Verificar se a versão foi especificada
if [ "$DOCKER_TAG" = "latest" ]; then
    echo "⚠️ Usando tag 'latest'. Para especificar uma versão:"
    echo "   export DOCKER_TAG=v1.2.3"
    echo "   ou"
    echo "   DOCKER_TAG=v1.2.3 ./build.sh"
    echo ""
    read -p "Continuar com 'latest'? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Build cancelado"
        exit 1
    fi
fi

# Construir a imagem
echo "🔨 Construindo imagem Docker..."
echo "📦 Repositório: ${DOCKER_REPOSITORY}"
echo "🏷️ Tag: ${DOCKER_TAG}"
docker build -t ${DOCKER_REPOSITORY}:${DOCKER_TAG} .

# Fazer push para o Docker Hub
echo "📤 Enviando imagem para Docker Hub..."
docker push ${DOCKER_REPOSITORY}:${DOCKER_TAG}

echo "✅ Build e deploy concluídos com sucesso!"
echo "📦 Imagem disponível em: ${DOCKER_REPOSITORY}:${DOCKER_TAG}"
echo ""
echo "🚀 Para executar em produção:"
echo "docker run -d --name multilink-app -p 3000:3000 \\"
echo "  -e DATABASE_URL=\"sua-url-aqui\" \\"
echo "  -e NEXTAUTH_URL=\"https://seudominio.com\" \\"
echo "  -e NEXTAUTH_SECRET=\"sua-chave\" \\"
echo "  ${DOCKER_REPOSITORY}:${DOCKER_TAG}"