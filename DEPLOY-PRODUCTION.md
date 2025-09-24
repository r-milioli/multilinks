# 🚀 Deploy em Produção - MultiLink

Este documento explica como fazer o deploy da aplicação MultiLink em produção com migração automática do banco de dados.

## 📋 Pré-requisitos

- Docker instalado
- Conta no Docker Hub
- Banco de dados PostgreSQL acessível
- Variáveis de ambiente configuradas

## 🔧 Configuração das Variáveis de Ambiente

Crie um arquivo `.env.production` com as seguintes variáveis:

```bash
# Banco de dados
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://seudominio.com"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# Outras configurações
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED="1"
```

## 🐳 Build e Deploy

### 1. Executar Build e Deploy Automático

```bash
# Build com versão específica
DOCKER_TAG=v1.2.3 ./build.sh

# Ou build com latest (com confirmação)
./build.sh
```

### 2. Ou usar script alternativo

```bash
# Configurar tag se necessário
export DOCKER_TAG="v1.2.3"

# Executar build e deploy
chmod +x scripts/build-and-deploy.sh
./scripts/build-and-deploy.sh
```

### 3. Ou fazer manualmente

```bash
# Build da imagem
docker build -t automacaodebaixocusto/multi-link:v1.2.3 .

# Push para Docker Hub
docker push automacaodebaixocusto/multi-link:v1.2.3
```

### 4. Testar build localmente

```bash
# Executar script de teste
chmod +x scripts/test-build.sh
./scripts/test-build.sh
```

## 🚀 Executar em Produção

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: seu-username/multilink:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=multilink
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=senha-segura
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Docker Run

```bash
docker run -d \
  --name multilink-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://username:password@host:port/database" \
  -e NEXTAUTH_URL="https://seudominio.com" \
  -e NEXTAUTH_SECRET="sua-chave-secreta" \
  -e NODE_ENV="production" \
  automacaodebaixocusto/multi-link:v1.2.2
```

## 🔄 Migração Automática do Banco

O sistema agora inclui migração automática que:

1. **Verifica** se o banco de dados está acessível
2. **Detecta** se as tabelas existem
3. **Aplica** apenas as mudanças necessárias
4. **Preserva** dados existentes
5. **Adiciona** novas colunas (como `legalLinksSettings`)

### Logs de Migração

Ao iniciar o container, você verá logs como:

```
🚀 Iniciando aplicação MultiLink...
📊 DATABASE_URL configurada: postgresql://...
⏳ Aguardando conexão com o banco de dados...
✅ Banco de dados conectado!
🔄 Executando inicialização inteligente do banco de dados...
✅ Conexão com banco de dados estabelecida
✅ Tabelas principais encontradas
📝 Coluna legalLinksSettings não encontrada. Aplicando migração...
✅ Migração aplicada com sucesso!
🎉 Inicialização do banco de dados concluída!
✅ Inicialização concluída com sucesso!
🚀 Iniciando servidor Next.js...
```

## 🔍 Troubleshooting

### Erro: "The column User.legalLinksSettings does not exist"

**Solução**: O sistema de migração automática resolve este problema. Certifique-se de usar a nova imagem Docker.

### Erro de Conexão com Banco

**Verificações**:
1. `DATABASE_URL` está correta
2. Banco de dados está acessível
3. Credenciais estão corretas
4. Porta está aberta

### Erro de Permissões

**Solução**:
```bash
# Tornar scripts executáveis
chmod +x docker-entrypoint.sh
chmod +x scripts/*.sh
```

## 📊 Monitoramento

### Logs do Container

```bash
# Ver logs em tempo real
docker logs -f multilink-app

# Ver logs das últimas 100 linhas
docker logs --tail 100 multilink-app
```

### Health Check

```bash
# Verificar se a aplicação está funcionando
curl http://localhost:3000/api/health
```

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça as mudanças no código
2. Execute o build e deploy
3. Pare o container atual
4. Execute o novo container

```bash
# Parar container atual
docker stop multilink-app
docker rm multilink-app

# Executar nova versão
docker run -d --name multilink-app -p 3000:3000 [variáveis de ambiente] seu-username/multilink:latest
```

## 📝 Notas Importantes

- ✅ **Dados preservados**: O sistema não apaga dados existentes
- ✅ **Migração incremental**: Aplica apenas mudanças necessárias
- ✅ **Verificação automática**: Detecta o estado atual do banco
- ✅ **Logs detalhados**: Facilita troubleshooting
- ✅ **Rollback seguro**: Em caso de erro, não corrompe o banco

## 🆘 Suporte

Em caso de problemas:

1. Verifique os logs do container
2. Confirme as variáveis de ambiente
3. Teste a conectividade com o banco
4. Verifique se a imagem está atualizada
