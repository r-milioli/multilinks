# 📧 Documentação: Alterações no Banco de Dados - Sistema SMTP

## 📋 Visão Geral

Este documento detalha as alterações realizadas no banco de dados PostgreSQL para implementar o sistema completo de envio de emails (SMTP) no MultiLink.

**Data da Implementação:** 26 de Setembro de 2024  
**Versão:** v1.4.0+  
**Migration ID:** `20250926012132_add_password_reset_tokens`

---

## 🗄️ Alterações Realizadas

### ✅ 1. Nova Tabela: `PasswordResetToken`

**Propósito:** Armazenar tokens seguros para recuperação de senha via email.

#### 📊 Estrutura da Tabela

```sql
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
```

#### 🔍 Detalhamento dos Campos

| Campo | Tipo | Descrição | Restrições |
|-------|------|-----------|------------|
| `id` | TEXT (CUID) | Identificador único do registro | Chave primária, não nulo |
| `token` | TEXT | Token criptográfico para reset | Único, não nulo |
| `email` | TEXT | Email do usuário | Não nulo, formato email |
| `expires` | TIMESTAMP(3) | Data/hora de expiração | Não nulo |
| `used` | BOOLEAN | Flag de uso do token | Default: false |
| `createdAt` | TIMESTAMP(3) | Data de criação | Auto-gerado |
| `updatedAt` | TIMESTAMP(3) | Data de última atualização | Auto-atualizado |

---

## 🚀 Índices Criados

### 📈 Índices para Performance

```sql
-- Índice único para garantir tokens únicos
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- Índice para busca rápida por email
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- Índice para busca por token (duplicado para performance)
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- Índice para limpeza de tokens expirados
CREATE INDEX "PasswordResetToken_expires_idx" ON "PasswordResetToken"("expires");
```

### 🎯 Justificativa dos Índices

- **`token_key` (UNIQUE):** Garante que não existam tokens duplicados
- **`email_idx`:** Acelera buscas por usuário específico
- **`token_idx`:** Otimiza validação de tokens na URL
- **`expires_idx`:** Facilita limpeza automática de tokens expirados

---

## 🔒 Funcionalidades de Segurança

### 🛡️ Medidas Implementadas

1. **Tokens Criptográficos**
   - Geração com `crypto.randomBytes(32)`
   - 256 bits de entropia
   - Hexadecimal encoding

2. **Expiração Automática**
   - Duração: 1 hora (3600 segundos)
   - Verificação automática no backend
   - Limpeza periódica de tokens expirados

3. **Uso Único**
   - Token marcado como `used = true` após uso
   - Previne reutilização de tokens
   - Invalidação de todos os tokens do email

4. **Rate Limiting**
   - Um token ativo por email
   - Prevenção de spam de emails
   - Controle de tentativas

---

## 📝 Schema Prisma

### 🔧 Modelo Atualizado

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  expires   DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([token])
  @@index([expires])
}
```

### 📚 Relacionamentos

- **Independente:** Não possui foreign keys
- **Isolado:** Não afeta outras tabelas
- **Autocontido:** Toda lógica de reset em uma tabela

---

## 🔄 Fluxo de Operações

### 1. **Criação de Token**
```sql
INSERT INTO "PasswordResetToken" 
(id, token, email, expires, used, "createdAt", "updatedAt")
VALUES 
('clx123...', 'a1b2c3...', 'user@example.com', '2024-09-26 15:00:00', false, NOW(), NOW());
```

### 2. **Validação de Token**
```sql
SELECT * FROM "PasswordResetToken" 
WHERE token = 'a1b2c3...' 
  AND used = false 
  AND expires > NOW();
```

### 3. **Marcação como Usado**
```sql
UPDATE "PasswordResetToken" 
SET used = true, "updatedAt" = NOW() 
WHERE id = 'clx123...';
```

### 4. **Limpeza de Tokens Expirados**
```sql
DELETE FROM "PasswordResetToken" 
WHERE expires < NOW();
```

---

## 📊 Impacto no Sistema

### ✅ Vantagens

- **Zero Breaking Changes:** Não afeta funcionalidades existentes
- **Performance Otimizada:** Índices para consultas rápidas
- **Segurança Robusta:** Múltiplas camadas de proteção
- **Escalabilidade:** Suporta milhares de tokens simultâneos
- **Manutenibilidade:** Código limpo e bem estruturado

### 📈 Métricas Esperadas

- **Tempo de consulta:** < 10ms (com índices)
- **Capacidade:** 10.000+ tokens simultâneos
- **Limpeza:** Tokens expirados removidos automaticamente
- **Disponibilidade:** 99.9% (sem dependências externas)

---

## 🧪 Testes Recomendados

### 1. **Teste de Criação**
```javascript
// Criar token de reset
const token = await prisma.passwordResetToken.create({
  data: {
    token: 'test-token-123',
    email: 'test@example.com',
    expires: new Date(Date.now() + 3600000) // 1 hora
  }
});
```

### 2. **Teste de Validação**
```javascript
// Validar token
const validToken = await prisma.passwordResetToken.findFirst({
  where: {
    token: 'test-token-123',
    used: false,
    expires: { gt: new Date() }
  }
});
```

### 3. **Teste de Limpeza**
```javascript
// Limpar tokens expirados
const deleted = await prisma.passwordResetToken.deleteMany({
  where: {
    expires: { lt: new Date() }
  }
});
```

---

## 🔧 Comandos de Manutenção

### 📋 Verificação de Saúde

```sql
-- Contar tokens ativos
SELECT COUNT(*) FROM "PasswordResetToken" WHERE used = false AND expires > NOW();

-- Contar tokens expirados
SELECT COUNT(*) FROM "PasswordResetToken" WHERE expires < NOW();

-- Tokens por email (últimas 24h)
SELECT email, COUNT(*) as token_count 
FROM "PasswordResetToken" 
WHERE "createdAt" > NOW() - INTERVAL '24 hours'
GROUP BY email 
ORDER BY token_count DESC;
```

### 🧹 Limpeza Manual

```sql
-- Remover todos os tokens expirados
DELETE FROM "PasswordResetToken" WHERE expires < NOW();

-- Remover tokens usados antigos (mais de 7 dias)
DELETE FROM "PasswordResetToken" 
WHERE used = true AND "updatedAt" < NOW() - INTERVAL '7 days';
```

---

## 📚 Referências

- **Migration File:** `prisma/migrations/20250926012132_add_password_reset_tokens/migration.sql`
- **Schema File:** `prisma/schema.prisma`
- **API Routes:** 
  - `src/app/api/auth/forgot-password/route.ts`
  - `src/app/api/auth/reset-password/route.ts`
- **Email Service:** `src/lib/emailService.ts`

---

## 👥 Responsáveis

- **Implementação:** Equipe de Desenvolvimento MultiLink
- **Revisão:** Arquitetura de Software
- **Aprovação:** Tech Lead

---

**Última Atualização:** 26 de Setembro de 2024  
**Versão do Documento:** 1.0  
**Status:** ✅ Implementado e Testado
