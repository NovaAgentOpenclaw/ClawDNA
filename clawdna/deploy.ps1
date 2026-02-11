# ClawDNA - Deploy Script para Windows
# Uso: .\deploy.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ClawDNA Deploy Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Solana CLI
Write-Host "[1/6] Verificando Solana CLI..." -ForegroundColor Yellow
$solanaVersion = solana --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Solana CLI não encontrado!" -ForegroundColor Red
    Write-Host "    Instale em: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
}
Write-Host "✅ $solanaVersion" -ForegroundColor Green

# Verificar Anchor CLI
Write-Host "[2/6] Verificando Anchor CLI..." -ForegroundColor Yellow
$anchorVersion = anchor --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Anchor CLI não encontrado!" -ForegroundColor Red
    Write-Host "    Use WSL2 ou uma máquina Linux para instalar:"
    Write-Host "    cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked"
    exit 1
}
Write-Host "✅ $anchorVersion" -ForegroundColor Green

# Verificar configuração
Write-Host "[3/6] Verificando configuração Solana..." -ForegroundColor Yellow
$solanaConfig = solana config get
Write-Host $solanaConfig

# Verificar saldo
Write-Host "[4/6] Verificando saldo..." -ForegroundColor Yellow
$balance = solana balance 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Não foi possível verificar saldo" -ForegroundColor Yellow
    $balance = "0"
}
Write-Host "Saldo: $balance SOL" -ForegroundColor Cyan

if ([float]$balance -lt 0.5) {
    Write-Host "⚠️  Saldo insuficiente para deploy!" -ForegroundColor Yellow
    Write-Host "    Solicitando airdrop..." -ForegroundColor Yellow
    solana airdrop 2
    
    $newBalance = solana balance
    Write-Host "Novo saldo: $newBalance SOL" -ForegroundColor Cyan
    
    if ([float]$newBalance -lt 0.5) {
        Write-Host "❌ Airdrop falhou. Obtenha SOL em: https://faucet.solana.com/" -ForegroundColor Red
        exit 1
    }
}

# Build
Write-Host "[5/6] Fazendo build do programa..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot"
anchor build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falhou!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build concluído!" -ForegroundColor Green

# Deploy
Write-Host "[6/6] Fazendo deploy para devnet..." -ForegroundColor Yellow
$deployOutput = anchor deploy --provider.cluster devnet 2>&1
Write-Host $deployOutput

# Extrair Program ID
$programId = ($deployOutput | Select-String -Pattern "Program Id: ([A-Za-z0-9]+)").Matches.Groups[1].Value
if ($programId) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DEPLOY CONCLUÍDO!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "Program ID: $programId" -ForegroundColor Cyan
    Write-Host ""
    
    # Salvar em arquivo
    $programId | Out-File -FilePath "DEPLOYED_PROGRAM_ID.txt" -Encoding utf8
    Write-Host "✅ Program ID salvo em DEPLOYED_PROGRAM_ID.txt" -ForegroundColor Green
    
    # Atualizar lib.rs
    $libRsPath = "programs\clawdna\src\lib.rs"
    if (Test-Path $libRsPath) {
        $content = Get-Content $libRsPath -Raw
        $newContent = $content -replace 'declare_id!\("[^"]+"\)', "declare_id!(`"$programId`")"
        $newContent | Out-File -FilePath $libRsPath -Encoding utf8
        Write-Host "✅ declare_id! atualizado em $libRsPath" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Não foi possível extrair Program ID automaticamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para verificar o programa:" -ForegroundColor Cyan
Write-Host "  solana program show $programId" -ForegroundColor Gray
Write-Host ""
