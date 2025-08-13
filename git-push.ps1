# Script PowerShell para Git sem conflitos - SmyrnaWiki

Write-Host "🚀 Git Push Seguro - SmyrnaWiki" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Verificar se há mudanças
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nenhuma mudança para commit" -ForegroundColor Green
    exit 0
}

# Mostrar status atual
Write-Host "📋 Status atual:" -ForegroundColor Yellow
git status --short

# Adicionar todas as mudanças
Write-Host ""
Write-Host "📦 Adicionando mudanças..." -ForegroundColor Blue
git add .

# Solicitar mensagem de commit
Write-Host ""
$commit_message = Read-Host "💬 Mensagem do commit"

# Se não fornecer mensagem, usar padrão
if (-not $commit_message) {
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    $commit_message = "update: atualizações $date"
}

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Blue
git commit -m $commit_message

# Push seguro
Write-Host ""
Write-Host "🔄 Fazendo push seguro..." -ForegroundColor Blue
$pushResult = git push --force-with-lease origin wiki 2>&1

# Verificar resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Repositório: https://github.com/altadevtech/_smyrnaapp" -ForegroundColor Cyan
    Write-Host "🚀 Deploy automático iniciado no Render.com" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️ Push rejeitado - usando força total..." -ForegroundColor Yellow
    git push --force origin wiki
    Write-Host "✅ Push forçado realizado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Processo concluído!" -ForegroundColor Green

# Pausar para ver o resultado
Read-Host "Pressione Enter para continuar..."
