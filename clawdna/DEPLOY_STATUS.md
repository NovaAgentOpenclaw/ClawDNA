# ClawDNA Deploy - Status e Próximos Passos

## Data/Hora: 2026-02-05 08:15 GMT-3
## Demo: 11:00 (faltam ~3 horas)

---

## ✅ O QUE FOI CONCLUÍDO

### 1. Solana CLI
- ✅ Instalado e configurado para devnet
- ✅ RPC URL: https://api.devnet.solana.com

### 2. Keypair
- ✅ Criado: `HUJeemwQ68SFu5bj4iyvceKy2QtRjyWzwEJYBfQiqLKs`
- ✅ Local: `~/.config/solana/id.json`
- ✅ Seed phrase: `ship winter devote bar mad uniform miracle history kidney dish group apple`

### 3. Solana Keygen
- ✅ Instalado via cargo

---

## ❌ PROBLEMAS ENCONTRADOS

### 1. Anchor CLI
- ❌ Falha na instalação via cargo (dependência OpenSSL)
- ❌ NPM package não suporta Windows (apenas Linux)
- ❌ AVM também requer OpenSSL

### 2. OpenSSL no Windows
- ❌ vcpkg falhou ao baixar PowerShell Core
- ❌ Chocolatey não instalado

### 3. Faucet (Airdrop)
- ❌ Rate limit atingido no faucet da devnet
- ❌ Saldo atual: 0 SOL

---

## 🚀 PRÓXIMOS PASSOS (Soluções)

### Opção 1: WSL2 (Recomendada)
```powershell
# Instalar WSL2
wsl --install

# Depois reiniciar e no WSL:
# 1. Instalar Rust
# 2. Instalar Solana CLI
# 3. Instalar Anchor CLI (funciona no WSL)
# 4. Fazer deploy
```

### Opção 2: GitHub Actions
Criar workflow para fazer deploy automaticamente:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Devnet
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Anchor
        run: npm install -g @coral-xyz/anchor-cli
      - name: Deploy
        run: anchor deploy --provider.cluster devnet
```

### Opção 3: Usar Máquina Linux/Cloud
Usar uma VM Linux na AWS/GCP/Azure para fazer o deploy.

---

## 📋 CHECKLIST PARA DEPLOY

- [ ] Instalar Anchor CLI (usar WSL2 ou Linux)
- [ ] Obter SOL na devnet (faucet ou transfer)
- [ ] Executar `anchor build`
- [ ] Executar `anchor deploy --provider.cluster devnet`
- [ ] Salvar Program ID em DEPLOYED_PROGRAM_ID.txt
- [ ] Atualizar declare_id! no lib.rs

---

## 🔧 COMANDOS MANUAIS (Quando Anchor estiver instalado)

```bash
# Configurar
solana config set --url devnet

# Verificar saldo
solana balance

# Build
anchor build

# Deploy
anchor deploy --provider.cluster devnet

# Verificar
solana program show <PROGRAM_ID>
```

---

## 📝 PROGRAM ID ATUAL

No código atual (lib.rs):
```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

Após o deploy, atualizar com o ID real.

---

## 💡 DICAS

1. **Airdrop alternativo**: Usar https://faucet.solana.com/ ou pedir no Discord
2. **Build local**: `cargo build-sbf` (se toolchain BPF estiver instalado)
3. **Deploy manual**: `solana program deploy target/deploy/clawdna.so`

---

## 📞 SUPORTE

- GitHub: https://github.com/NovaAgentOpenclaw/clawdna
- Solana Devnet Faucet: https://faucet.solana.com/
- Anchor Docs: https://www.anchor-lang.com/docs
