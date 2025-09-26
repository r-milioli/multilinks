# 📊 Database Changelog - MultiLink

## 🔄 Histórico de Alterações

### [2024-09-26] - v1.4.0 - Sistema SMTP

#### ➕ Adicionado

**Nova Tabela: `PasswordResetToken`**
- Implementação completa do sistema de recuperação de senha via email
- Tokens criptográficos seguros com expiração automática
- Sistema de rate limiting para prevenir spam

**Campos da Tabela:**
- `id` (TEXT, PK) - Identificador único CUID
- `token` (TEXT, UNIQUE) - Token criptográfico para reset
- `email` (TEXT) - Email do usuário
- `expires` (TIMESTAMP) - Data de expiração (1 hora)
- `used` (BOOLEAN) - Flag de uso do token
- `createdAt` (TIMESTAMP) - Data de criação
- `updatedAt` (TIMESTAMP) - Data de última atualização

**Índices Criados:**
- `PasswordResetToken_token_key` (UNIQUE) - Garantir tokens únicos
- `PasswordResetToken_email_idx` - Busca rápida por email
- `PasswordResetToken_token_idx` - Validação de tokens
- `PasswordResetToken_expires_idx` - Limpeza de tokens expirados

#### 🔧 Funcionalidades

- **Geração de Tokens:** Tokens seguros de 256 bits
- **Validação Automática:** Verificação de expiração e uso
- **Rate Limiting:** Um token ativo por email
- **Limpeza Automática:** Remoção de tokens expirados
- **Segurança:** Múltiplas camadas de proteção

#### 📁 Arquivos Afetados

- `prisma/schema.prisma` - Adicionado modelo PasswordResetToken
- `prisma/migrations/20250926012132_add_password_reset_tokens/migration.sql` - Migration SQL
- `src/app/api/auth/forgot-password/route.ts` - API de solicitação de reset
- `src/app/api/auth/reset-password/route.ts` - API de redefinição de senha
- `src/lib/emailService.ts` - Serviço de envio de emails

#### 🧪 Testes

- ✅ Criação de tokens
- ✅ Validação de tokens
- ✅ Expiração automática
- ✅ Rate limiting
- ✅ Limpeza de tokens expirados
- ✅ Integração com sistema de emails

#### 📊 Impacto

- **Breaking Changes:** ❌ Nenhum
- **Performance:** ⬆️ Melhorada (índices otimizados)
- **Segurança:** ⬆️ Significativamente melhorada
- **Funcionalidades:** ➕ Sistema completo de reset de senha

---

### [2024-09-22] - v1.3.0 - Sistema de Formulários

#### ➕ Adicionado

**Novas Tabelas:**
- `Form` - Formulários personalizáveis
- `Lead` - Captura de leads
- `FormLink` - Relacionamento entre formulários e links

#### 🔧 Funcionalidades

- Sistema completo de formulários
- Captura e gerenciamento de leads
- Integração com links personalizados

---

### [2024-09-22] - v1.2.0 - Sistema Base

#### ➕ Adicionado

**Tabelas Principais:**
- `User` - Usuários do sistema
- `Link` - Links personalizados
- `SocialLink` - Links de redes sociais
- `Analytics` - Métricas de cliques
- `Session` - Sessões de usuário
- `Account` - Contas OAuth

#### 🔧 Funcionalidades

- Sistema de autenticação
- Gerenciamento de links
- Analytics básico
- Integração OAuth (Google, GitHub)

---

## 📋 Próximas Versões

### [Planejado] - v1.5.0 - Sistema de Notificações

#### 🎯 Objetivos

- Tabela `EmailQueue` para envio em lote
- Tabela `NotificationTemplate` para templates personalizáveis
- Sistema de webhooks para notificações
- Métricas de entrega de emails

---

## 🔍 Comandos Úteis

### 📊 Verificação de Status

```bash
# Verificar status das migrations
npx prisma migrate status

# Aplicar migrations pendentes
npx prisma migrate deploy

# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate
```

### 🧹 Manutenção

```sql
-- Verificar tokens ativos
SELECT COUNT(*) FROM "PasswordResetToken" 
WHERE used = false AND expires > NOW();

-- Limpar tokens expirados
DELETE FROM "PasswordResetToken" 
WHERE expires < NOW();

-- Estatísticas de uso
SELECT 
  DATE("createdAt") as date,
  COUNT(*) as tokens_created,
  COUNT(CASE WHEN used = true THEN 1 END) as tokens_used
FROM "PasswordResetToken" 
WHERE "createdAt" > NOW() - INTERVAL '30 days'
GROUP BY DATE("createdAt")
ORDER BY date DESC;
```

---

## 📚 Documentação Relacionada

- [SMTP Database Changes](./SMTP_DATABASE_CHANGES.md) - Detalhes completos das alterações SMTP
- [API Documentation](../README.md) - Documentação das APIs
- [Deployment Guide](./DEPLOY.md) - Guia de deploy

---

**Última Atualização:** 26 de Setembro de 2024  
**Versão:** 1.4.0  
**Status:** ✅ Atualizado
