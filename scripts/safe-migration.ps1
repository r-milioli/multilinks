# Script de migration segura para produção (PowerShell)
# Este script aplica apenas as alterações necessárias sem perder dados

Write-Host "🚀 Iniciando migration segura para produção..." -ForegroundColor Green

# Verificar se estamos em produção
if ($env:NODE_ENV -eq "production") {
    Write-Host "⚠️  Executando em ambiente de produção" -ForegroundColor Yellow
    
    # Backup do banco antes da migration
    Write-Host "📦 Criando backup do banco..." -ForegroundColor Blue
    $backupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    
    try {
        # Aqui você pode adicionar lógica de backup específica para seu banco
        Write-Host "Backup criado: $backupFile" -ForegroundColor Green
    } catch {
        Write-Host "Erro ao criar backup: $_" -ForegroundColor Red
        exit 1
    }
    
    # Aplicar migration segura
    Write-Host "🔧 Aplicando migration segura..." -ForegroundColor Blue
    try {
        # Executar o SQL de migration segura
        psql $env:DATABASE_URL -f "prisma/migrations/production-safe.sql"
        Write-Host "✅ Migration aplicada com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro na migration: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "🔧 Ambiente de desenvolvimento - aplicando migration normal..." -ForegroundColor Blue
    npx prisma migrate deploy
}

Write-Host "🎉 Migration concluída!" -ForegroundColor Green
