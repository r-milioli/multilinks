# Script para debug do sistema administrativo
# Execute este script no PowerShell

Write-Host "🔍 Testando APIs de Debug do MultiLink" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Verificar se as APIs estão funcionando
Write-Host "1. Testando API de verificação de role..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://multilink.iacas.top/api/debug/user-role" -Method GET
    Write-Host "✅ API funcionando:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Erro ao testar API:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""

# Teste 2: Definir usuário como SUPER_ADMIN (substitua o email)
Write-Host "2. Para definir um usuário como SUPER_ADMIN, execute:" -ForegroundColor Yellow
Write-Host ""
Write-Host "`$body = @{ email = 'SEU-EMAIL@EXEMPLO.COM' } | ConvertTo-Json" -ForegroundColor White
Write-Host "Invoke-RestMethod -Uri 'https://multilink.iacas.top/api/debug/set-super-admin' -Method POST -Body `$body -ContentType 'application/json'" -ForegroundColor White
Write-Host ""

Write-Host "📋 Instruções:" -ForegroundColor Cyan
Write-Host "1. Faça login no site: https://multilink.iacas.top/login" -ForegroundColor White
Write-Host "2. Acesse: https://multilink.iacas.top/api/debug/user-role (no navegador)" -ForegroundColor White
Write-Host "3. Se o role não for SUPER_ADMIN, use o comando acima para corrigir" -ForegroundColor White
Write-Host "4. Faça logout e login novamente" -ForegroundColor White
Write-Host "5. Verifique se o menu Administração aparece" -ForegroundColor White
