# Sistema de Tracking - Google Analytics e Facebook Pixel

## 📊 Visão Geral

O sistema de tracking implementa Google Analytics e Facebook Pixel de forma completa e funcional nas páginas públicas do MultiLink.

## 🚀 Funcionalidades

### ✅ Implementado

1. **Scripts de Tracking**
   - Google Analytics (Universal Analytics e GA4)
   - Facebook Pixel
   - Injeção automática nas páginas públicas

2. **Eventos Rastreados**
   - **Page View**: Visualização de página
   - **Link Click**: Clique em links
   - **Form Submission**: Submissão de formulários
   - **Custom Events**: Eventos personalizados

3. **Configuração**
   - Salva no banco de dados (`integrationSettings`)
   - Validação de formatos
   - Interface de configuração

## 🔧 Como Usar

### 1. Configurar Tracking

1. Acesse: **Configurações → Integrações**
2. Configure:
   - **Google Analytics**: `UA-XXXXXXXXX-X` ou `G-XXXXXXXXXX`
   - **Facebook Pixel**: `123456789012345` (15-16 dígitos)
3. Clique em **"Salvar Integrações"**

### 2. Verificar Funcionamento

**Em Desenvolvimento:**
- Aparece um widget de debug no canto inferior direito
- Mostra status de carregamento dos scripts
- Logs no console do navegador

**Em Produção:**
- Scripts carregam automaticamente
- Eventos são enviados para GA e FB
- Sem interface de debug

## 📁 Arquivos Implementados

### Componentes
- `src/shared/components/TrackingScripts.tsx` - Scripts principais
- `src/shared/components/TrackingDebug.tsx` - Debug em desenvolvimento

### Hooks
- `src/shared/hooks/useTracking.ts` - Hook para tracking

### Integração
- `src/modules/public/components/PublicPage.tsx` - Página pública
- `src/modules/public/components/PublicLinkItem.tsx` - Links com formulários

## 🎯 Eventos Rastreados

### Google Analytics
```javascript
// Page View
gtag('event', 'page_view', {
  page_title: 'Nome do Usuário - Links',
  page_location: 'https://...',
  user_id: 'user_id'
})

// Link Click
gtag('event', 'click', {
  event_category: 'Link',
  event_label: 'Título do Link'
})

// Form Submission
gtag('event', 'conversion', {
  event_category: 'Form',
  event_label: 'Título do Formulário'
})
```

### Facebook Pixel
```javascript
// Page View
fbq('track', 'PageView')

// Lead (Link Click)
fbq('track', 'Lead', {
  content_name: 'Título do Link',
  content_category: 'Link Click',
  value: 1,
  currency: 'BRL'
})

// Complete Registration (Form)
fbq('track', 'CompleteRegistration', {
  content_name: 'Título do Formulário',
  content_category: 'Form Submission',
  value: 5,
  currency: 'BRL'
})
```

## 🔍 Debug e Testes

### Console Logs
```javascript
// Google Analytics
console.log('📊 GA Event:', { action, category, label, value })

// Facebook Pixel
console.log('📘 FB Event:', { eventName, parameters })

// Scripts carregados
console.log('✅ Google Analytics carregado:', googleAnalytics)
console.log('✅ Facebook Pixel carregado:', facebookPixel)
```

### Widget de Debug
- Aparece apenas em `NODE_ENV=development`
- Mostra status de carregamento
- Posição: canto inferior direito

## 🛠️ Personalização

### Adicionar Novos Eventos
```typescript
import { trackEvent } from '@/shared/components/TrackingScripts'

// Evento personalizado
trackEvent.gtag('custom_action', 'Custom Category', 'Custom Label', 10)
trackEvent.fbq('CustomEvent', { custom_parameter: 'value' })
```

### Usar Hook
```typescript
import { useTracking } from '@/shared/hooks/useTracking'

const { trackCustomEvent, trackFbEvent } = useTracking()

// Usar em componentes
trackCustomEvent('button_click', 'UI', 'header_button')
```

## 📊 Verificação de Funcionamento

### Google Analytics
1. Configure um ID válido
2. Acesse uma página pública
3. Verifique no GA Real-time se aparece a visita
4. Teste cliques em links e formulários

### Facebook Pixel
1. Configure um Pixel ID válido
2. Use o Facebook Pixel Helper (extensão do Chrome)
3. Verifique se os eventos aparecem
4. Teste no Facebook Events Manager

## ⚠️ Considerações

1. **Performance**: Scripts carregam de forma assíncrona
2. **Privacidade**: Respeita configurações de privacidade do usuário
3. **Compatibilidade**: Funciona com Universal Analytics e GA4
4. **Debug**: Widget de debug apenas em desenvolvimento
5. **Fallback**: Sistema continua funcionando mesmo se tracking falhar

## 🎉 Status

**✅ IMPLEMENTAÇÃO COMPLETA E FUNCIONAL**

- ✅ Scripts injetados automaticamente
- ✅ Eventos rastreados corretamente
- ✅ Configuração via interface
- ✅ Debug em desenvolvimento
- ✅ Validação de dados
- ✅ Persistência no banco
- ✅ Compatibilidade com GA4 e Universal Analytics
- ✅ Facebook Pixel funcional
