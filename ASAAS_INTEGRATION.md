# 💳 Integração com Asaas - Sistema de Pagamentos

Este documento descreve a implementação completa do sistema de pagamentos com checkout transparente usando a Asaas no MultiLink.

## 🚀 Funcionalidades Implementadas

### ✅ Backend
- **APIs de Pagamento**: Checkout, status, histórico, cancelamento
- **Webhook da Asaas**: Processamento automático de eventos
- **Integração com Banco**: Uso das tabelas existentes (Subscription, Payment)
- **Notificações por Email**: Confirmação, vencimento, cancelamento

### ✅ Frontend
- **Formulário de Checkout**: Interface completa e responsiva
- **Status de Pagamento**: Acompanhamento em tempo real
- **Múltiplos Métodos**: Cartão, PIX, Boleto
- **Parcelamento**: Até 12x no cartão de crédito

### ✅ Recursos Avançados
- **Checkout Transparente**: Cliente não sai do site
- **Polling Automático**: Atualização de status em tempo real
- **Validação de Dados**: CPF/CNPJ, email, telefone
- **Segurança**: Certificação PCI-DSS da Asaas

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── payment.types.ts              # Tipos de pagamento
├── lib/
│   ├── asaasService.ts               # Serviço da Asaas
│   ├── paymentService.ts             # Lógica de pagamentos
│   └── emailService.ts               # Notificações (atualizado)
├── app/api/payments/
│   ├── checkout/route.ts             # Criar checkout
│   ├── status/route.ts               # Status do pagamento
│   ├── history/route.ts              # Histórico
│   ├── cancel/route.ts               # Cancelar assinatura
│   └── webhook/asaas/route.ts        # Webhook da Asaas
├── modules/payments/
│   ├── components/
│   │   ├── CheckoutForm.tsx          # Formulário de checkout
│   │   └── PaymentStatus.tsx         # Status do pagamento
│   └── hooks/
│       └── usePayment.ts             # Hook para pagamentos
└── app/checkout/
    └── page.tsx                      # Página de checkout
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `env.asaas.example` para `.env.local` e configure:

```env
# Asaas Configuration
ASAAS_API_KEY=your_asaas_api_key_here
ASAAS_ENVIRONMENT=sandbox
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_WEBHOOK_SECRET=your_webhook_secret_here

# Para produção
ASAAS_ENVIRONMENT=production
ASAAS_API_URL=https://www.asaas.com/api/v3
```

### 2. Configuração da Asaas

1. **Criar conta na Asaas** (sandbox para testes)
2. **Obter API Key** no painel da Asaas
3. **Configurar Webhook**:
   - URL: `https://seudominio.com/api/payments/webhook/asaas`
   - Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_CANCELLED`

### 3. Teste da Integração

```bash
# Executar script de teste
node scripts/test-asaas-integration.js
```

## 🔄 Fluxo de Pagamento

### 1. Checkout
```
Usuário → Seleciona Plano → Formulário → API Checkout → Asaas
```

### 2. Processamento
```
Asaas → Webhook → Atualiza Banco → Notifica Usuário
```

### 3. Métodos de Pagamento

#### Cartão de Crédito
- Parcelamento até 12x
- Validação em tempo real
- Checkout transparente

#### PIX
- QR Code gerado automaticamente
- Pagamento instantâneo
- Código copiável

#### Boleto Bancário
- Vencimento em 3 dias
- Código de barras
- Pagamento em lotéricas

## 📊 Banco de Dados

### Tabelas Utilizadas (JÁ EXISTENTES)

#### `Subscription`
```sql
- id, userId, planId, planName
- amount, currency, status
- startDate, endDate, billingCycle
- paymentMethod, lastPaymentAt, nextPaymentAt
- trialEndsAt, createdAt, updatedAt
```

#### `Payment`
```sql
- id, userId, subscriptionId
- amount, currency, status
- paymentMethod, transactionId
- gatewayResponse (JSON), processedAt
- createdAt, updatedAt
```

#### `UserStats`
```sql
- subscriptionPlan, subscriptionStatus
- (outros campos existentes)
```

## 🔧 APIs Implementadas

### POST `/api/payments/checkout`
Criar novo checkout
```json
{
  "planId": "pro",
  "paymentMethod": "CREDIT_CARD",
  "customerData": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpfCnpj": "123.456.789-00",
    "phone": "(11) 99999-9999"
  },
  "installments": 3
}
```

### GET `/api/payments/status?paymentId=xxx`
Buscar status do pagamento

### GET `/api/payments/history?limit=10`
Histórico de pagamentos

### POST `/api/payments/cancel`
Cancelar assinatura

### POST `/api/payments/webhook/asaas`
Webhook da Asaas (automático)

## 🎨 Componentes Frontend

### CheckoutForm
- Formulário completo de checkout
- Validação de dados
- Seleção de método de pagamento
- Parcelamento para cartão

### PaymentStatus
- Status em tempo real
- QR Code para PIX
- Código de barras para boleto
- Link de pagamento

### usePayment Hook
- `processCheckout()`: Criar checkout
- `getPaymentStatus()`: Buscar status
- `getPaymentHistory()`: Histórico
- `cancelSubscription()`: Cancelar
- `pollPaymentStatus()`: Polling automático

## 📧 Notificações por Email

### Tipos de Email
- **Confirmação de Pagamento**: Quando aprovado
- **Pagamento Vencido**: Quando vence
- **Cancelamento**: Quando cancelado

### Configuração
```typescript
// Já implementado no EmailService
await EmailService.sendPaymentConfirmation(userId, { planName, amount })
await EmailService.sendPaymentOverdue(userId, { planName, amount })
await EmailService.sendSubscriptionCancelled(userId, planName)
```

## 🧪 Testes

### Teste Manual
1. Acesse `/pricing`
2. Selecione um plano pago
3. Preencha o formulário
4. Teste diferentes métodos de pagamento

### Teste Automatizado
```bash
node scripts/test-asaas-integration.js
```

## 🚀 Deploy

### 1. Configurar Produção
```env
ASAAS_ENVIRONMENT=production
ASAAS_API_URL=https://www.asaas.com/api/v3
```

### 2. Configurar Webhook
- URL: `https://seudominio.com/api/payments/webhook/asaas`
- Eventos: Todos os eventos de pagamento

### 3. Testar em Produção
- Criar conta real na Asaas
- Testar com valores baixos
- Verificar webhooks

## 🔒 Segurança

### Certificações
- **PCI-DSS**: Dados de cartão protegidos
- **SSL/TLS**: Comunicação criptografada
- **Webhook Signature**: Verificação de autenticidade

### Validações
- CPF/CNPJ válido
- Email válido
- Telefone formatado
- Dados obrigatórios

## 📈 Monitoramento

### Logs Importantes
- Criação de checkout
- Processamento de webhook
- Erros de pagamento
- Notificações enviadas

### Métricas
- Taxa de conversão
- Tempo de processamento
- Erros por método de pagamento

## 🆘 Troubleshooting

### Problemas Comuns

#### Webhook não funciona
- Verificar URL configurada na Asaas
- Verificar assinatura do webhook
- Verificar logs do servidor

#### Pagamento não atualiza
- Verificar polling no frontend
- Verificar processamento do webhook
- Verificar status na Asaas

#### Email não enviado
- Verificar configuração SMTP
- Verificar logs do EmailService
- Verificar se usuário existe

### Logs Úteis
```bash
# Logs do webhook
tail -f logs/webhook.log

# Logs de pagamento
tail -f logs/payment.log

# Logs de email
tail -f logs/email.log
```

## 🎯 Próximos Passos

### Melhorias Futuras
- [ ] Dashboard de pagamentos
- [ ] Relatórios financeiros
- [ ] Integração com outros gateways
- [ ] Assinaturas recorrentes
- [ ] Cupons de desconto

## 📞 Suporte

Para dúvidas sobre a integração:
- Documentação da Asaas: https://docs.asaas.com
- Logs do sistema: `/logs`
- Testes: `scripts/test-asaas-integration.js`

---

**✅ Sistema de pagamentos implementado com sucesso!** 🎉
