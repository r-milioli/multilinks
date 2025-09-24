#!/bin/bash

# Script para testar o build da aplicação MultiLink

set -e

echo "🧪 Testando build da aplicação MultiLink..."

# Construir a imagem de teste
echo "🔨 Construindo imagem Docker de teste..."
docker build -t multilink-test:latest .

echo "✅ Build de teste concluído com sucesso!"
echo "📦 Imagem de teste criada: multilink-test:latest"

# Mostrar informações da imagem
echo "📊 Informações da imagem:"
docker images multilink-test:latest

echo "🎉 Teste de build concluído!"
