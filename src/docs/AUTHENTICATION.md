# Sistema de Autenticação e Autorização

## Visão Geral

O sistema implementa autenticação baseada em NextAuth.js com controle de acesso baseado em roles (USER, ADMIN, SUPER_ADMIN).

## Estrutura de Roles

- **USER**: Usuário comum com acesso básico
- **ADMIN**: Administrador com acesso ao painel administrativo
- **SUPER_ADMIN**: Super administrador com acesso total ao sistema

## Componentes Principais

### 1. Middleware de Autenticação (`src/lib/adminAuth.ts`)

Funções utilitárias para verificar autenticação e permissões:

```typescript
// Verificar se usuário é admin
const authError = await requireAdminAuth(request)
if (authError) {
  return authError
}

// Verificar se usuário é super admin
const authError = await requireSuperAdminAuth(request)
if (authError) {
  return authError
}

// Verificar permissão específica
const authError = await requirePermission(request, 'ADMIN')
if (authError) {
  return authError
}
```

### 2. Hook de Autenticação Admin (`src/modules/auth/hooks/useAdminAuth.ts`)

Hook React para gerenciar autenticação e permissões no frontend:

```typescript
const { 
  user, 
  userRole, 
  isAdmin, 
  isSuperAdmin, 
  hasPermission 
} = useAdminAuth()

// Verificar permissão específica
if (hasPermission('ADMIN')) {
  // Usuário tem permissões de admin
}
```

### 3. Componente de Proteção (`src/shared/components/AdminGuard.tsx`)

Componente wrapper para proteger rotas administrativas:

```typescript
// Proteção básica de admin
<AdminGuard>
  <AdminContent />
</AdminGuard>

// Proteção de super admin
<SuperAdminGuard>
  <SuperAdminContent />
</SuperAdminGuard>
```

## Proteção de APIs

### APIs Administrativas

Todas as APIs em `/api/admin/*` são automaticamente protegidas:

- `/api/admin/users` - Gerenciamento de usuários
- `/api/admin/stats` - Estatísticas do sistema
- `/api/admin/activity` - Atividades recentes
- `/api/admin/system-settings` - Configurações do sistema

### Exemplo de Implementação

```typescript
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    const authError = await requireAdminAuth(request)
    if (authError) {
      return authError
    }

    // Lógica da API aqui...
  } catch (error) {
    // Tratamento de erro...
  }
}
```

## Proteção de Rotas Frontend

### Middleware (`src/middleware.ts`)

O middleware verifica automaticamente:
- Autenticação para rotas protegidas
- Permissões de role para rotas administrativas
- Redirecionamentos apropriados

### Componentes Protegidos

```typescript
// No componente AdminContent
return (
  <AdminGuard>
    <div>
      {/* Conteúdo administrativo */}
    </div>
  </AdminGuard>
)
```

## Fluxo de Autenticação

1. **Login**: Usuário faz login via NextAuth.js
2. **Token JWT**: Sistema gera token com informações de role
3. **Middleware**: Verifica token e permissões
4. **API**: Valida autenticação em cada endpoint
5. **Frontend**: Hook gerencia estado de autenticação

## Configuração de Roles

### Atribuição de Role

Roles são definidos no banco de dados (Prisma) e sincronizados via NextAuth.js:

```typescript
// No callback de sessão
session.user.role = token.role as string
```

### Verificação de Permissões

```typescript
// No hook useAdminAuth
const hasPermission = (requiredRole: UserRole) => {
  switch (requiredRole) {
    case 'SUPER_ADMIN':
      return isSuperAdmin
    case 'ADMIN':
      return isAdmin
    case 'USER':
      return isAuthenticated
    default:
      return false
  }
}
```

## Tratamento de Erros

### Respostas de Erro Padronizadas

```typescript
// 401 - Não autorizado
{ success: false, error: 'Não autorizado. Faça login para continuar.' }

// 403 - Acesso negado
{ success: false, error: 'Acesso negado. Você não tem permissões de administrador.' }
```

### Frontend - Estados de Loading e Erro

```typescript
// AdminGuard exibe estados apropriados
if (isLoading) {
  return <LoadingSpinner />
}

if (!isAuthenticated) {
  return <LoginRequired />
}

if (!isAdmin) {
  return <AccessDenied />
}
```

## Segurança

### Boas Práticas Implementadas

1. **Validação Dupla**: Middleware + API + Frontend
2. **Tokens JWT**: Seguros com expiração
3. **Verificação de Sessão**: Validação contínua
4. **Princípio do Menor Privilégio**: Roles específicos
5. **Logs de Segurança**: Auditoria de acessos

### Rotas Protegidas

- ✅ `/dashboard` - Requer autenticação
- ✅ `/dashboard/*/admin` - Requer role ADMIN ou SUPER_ADMIN
- ✅ `/api/admin/*` - Requer autenticação + permissões
- ✅ Componentes administrativos - Wrapped com AdminGuard

## Exemplos de Uso

### Verificar Permissão em Componente

```typescript
function AdminButton() {
  const { hasPermission } = useAdminAuth()
  
  if (!hasPermission('ADMIN')) {
    return null
  }
  
  return <Button>Admin Action</Button>
}
```

### Proteger Rota de API

```typescript
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  // API logic here...
}
```

### Verificar Role no Middleware

```typescript
if (pathname.startsWith('/dashboard/admin')) {
  const userRole = token?.role
  if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
    return NextResponse.redirect('/dashboard')
  }
}
```
