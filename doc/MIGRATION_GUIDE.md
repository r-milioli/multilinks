# 🔄 Guia de Migração - Sistema SMTP

## 📋 Resumo da Migração

**Versão:** v1.4.0  
**Data:** 26 de Setembro de 2024  
**Tipo:** Adição de funcionalidade (não-breaking)  
**Impacto:** Baixo (apenas adições)

---

## 🎯 Objetivo

Implementar sistema completo de recuperação de senha via email com tokens seguros e expiração automática.

---

## 📊 Alterações no Schema

### ➕ Nova Tabela Adicionada

```sql
-- Tabela para tokens de reset de senha
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

### 📈 Índices Criados

```sql
-- Índices para performance e integridade
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");
CREATE INDEX "PasswordResetToken_expires_idx" ON "PasswordResetToken"("expires");
```

---

## 🚀 Processo de Migração

### 1. **Backup do Banco** ⚠️

```bash
# Backup completo (recomendado)
pg_dump -h localhost -U username -d multilink > backup_pre_smtp.sql

# Backup apenas schema
pg_dump -h localhost -U username -d multilink --schema-only > schema_backup.sql
```

### 2. **Aplicar Migration**

```bash
# Verificar status atual
npx prisma migrate status

# Aplicar migration
npx prisma migrate deploy

# Ou para desenvolvimento
npx prisma migrate dev
```

### 3. **Verificar Aplicação**

```sql
-- Verificar se tabela foi criada
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'PasswordResetToken';

-- Verificar índices
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'PasswordResetToken';
```

---

## 🔧 Configuração Pós-Migração

### 1. **Variáveis de Ambiente**

```env
# Adicionar ao .env.local
EMAIL_SERVER_HOST=smtp.brevo.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu-email@brevo.com
EMAIL_SERVER_PASSWORD=sua-senha-brevo
EMAIL_FROM=noreply@seudominio.com
```

### 2. **Teste de Conectividade**

```bash
# Testar conexão SMTP
curl -X GET http://localhost:3001/api/test-smtp

# Testar envio de email
curl -X POST http://localhost:3001/api/test-smtp \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","testType":"reset"}'
```

---

## 📋 Checklist de Migração

### ✅ Pré-Migração

- [ ] Backup do banco de dados
- [ ] Verificar espaço em disco disponível
- [ ] Confirmar versão do Prisma
- [ ] Testar em ambiente de desenvolvimento

### ✅ Durante a Migração

- [ ] Aplicar migration
- [ ] Verificar criação da tabela
- [ ] Confirmar índices criados
- [ ] Testar funcionalidades básicas

### ✅ Pós-Migração

- [ ] Configurar variáveis de email
- [ ] Testar envio de emails
- [ ] Verificar fluxo de reset de senha
- [ ] Monitorar logs de erro
- [ ] Documentar alterações

---

## 🧪 Testes de Validação

### 1. **Teste de Criação de Token**

```javascript
// Teste via API
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'teste@example.com' })
});

const result = await response.json();
console.log('Token criado:', result.success);
```

### 2. **Teste de Validação**

```javascript
// Teste de validação de token
const tokenResponse = await fetch(`/api/auth/reset-password?token=${token}`);
const tokenResult = await tokenResponse.json();
console.log('Token válido:', tokenResult.success);
```

### 3. **Teste de Reset**

```javascript
// Teste de redefinição de senha
const resetResponse = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    token: token, 
    password: 'NovaSenh@123' 
  })
});

const resetResult = await resetResponse.json();
console.log('Senha redefinida:', resetResult.success);
```

---

## 🔍 Monitoramento

### 📊 Métricas Importantes

```sql
-- Tokens criados por dia
SELECT 
  DATE("createdAt") as date,
  COUNT(*) as tokens_created
FROM "PasswordResetToken" 
WHERE "createdAt" > NOW() - INTERVAL '7 days'
GROUP BY DATE("createdAt")
ORDER BY date DESC;

-- Taxa de uso dos tokens
SELECT 
  COUNT(*) as total_tokens,
  COUNT(CASE WHEN used = true THEN 1 END) as used_tokens,
  ROUND(
    COUNT(CASE WHEN used = true THEN 1 END) * 100.0 / COUNT(*), 2
  ) as usage_rate
FROM "PasswordResetToken" 
WHERE "createdAt" > NOW() - INTERVAL '30 days';

-- Tokens expirados não utilizados
SELECT COUNT(*) as expired_unused
FROM "PasswordResetToken" 
WHERE expires < NOW() AND used = false;
```

### 🚨 Alertas Recomendados

- **Alta taxa de tokens expirados:** > 80%
- **Muitos tokens por email:** > 5 em 1 hora
- **Falhas de envio de email:** > 10% dos tokens

---

## 🔄 Rollback (Se Necessário)

### ⚠️ Remover Tabela

```sql
-- CUIDADO: Remove todos os dados
DROP TABLE "PasswordResetToken";
```

### 🔄 Reverter Migration

```bash
# Reverter para migration anterior
npx prisma migrate resolve --rolled-back 20250926012132_add_password_reset_tokens
```

---

## 📚 Recursos Adicionais

- **Documentação Completa:** [SMTP_DATABASE_CHANGES.md](./SMTP_DATABASE_CHANGES.md)
- **Changelog:** [DATABASE_CHANGELOG.md](./DATABASE_CHANGELOG.md)
- **API Docs:** [README.md](../README.md)

---

## 👥 Suporte

**Em caso de problemas:**

1. Verificar logs do Prisma
2. Confirmar configurações de email
3. Testar conectividade SMTP
4. Revisar documentação

**Contatos:**
- Equipe de Desenvolvimento
- Tech Lead
- DevOps

---

**Última Atualização:** 26 de Setembro de 2024  
**Versão:** 1.4.0  
**Status:** ✅ Documentado e Testado
