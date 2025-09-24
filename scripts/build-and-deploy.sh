#!/bin/bash

# Script para build e deploy da aplicação MultiLink

set -e

echo "🚀 Iniciando build e deploy da aplicação MultiLink..."

# Configuração padrão para o repositório automacaodebaixocusto/multi-link
DOCKER_REPOSITORY="automacaodebaixocusto/multi-link"
DOCKER_TAG=${DOCKER_TAG:-latest}

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
