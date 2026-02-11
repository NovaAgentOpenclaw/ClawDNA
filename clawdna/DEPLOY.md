# 🚀 ClawDNA Deploy - GitHub Codespaces (FREE)

## ⚡ Quick Start (15 minutos total)

### 1. Abrir Codespace (2 min)
1. Vá em: https://github.com/NovaAgentOpenclaw/clawdna
2. Clique **Code** → **Codespaces** → **Create codespace on main**
3. Aguarde o ambiente inicializar (~2 min)

### 2. Configurar Solana (3 min)
```bash
# Criar wallet
solana-keygen new --outfile ~/.config/solana/id.json
# GUARDE A SEED PHRASE!

# Configurar devnet
solana config set --url https://api.devnet.solana.com

# Pegar SOL grátis (rode 3x)
solana airdrop 2
solana airdrop 2
solana airdrop 2

# Verificar saldo
solana balance  # Deve mostrar ~6 SOL
```

### 3. Build e Deploy (5 min)
```bash
cd clawdna

# Build do programa
anchor build

# Deploy na devnet
anchor deploy

# IMPORTANTE: Copie o Program ID que aparecer!
# Vai mostrar algo como:
# Program Id: 5DehM...W4kY
```

### 4. Atualizar Program ID (2 min)
```bash
# Edite programs/clawdna/src/lib.rs
# Linha 3: declare_id!("COLE_SEU_PROGRAM_ID_AQUI");

# Rebuild e redeploy
anchor build
anchor deploy
```

### 5. Verificar no Explorer (1 min)
```bash
echo "https://explorer.solana.com/address/SEU_PROGRAM_ID?cluster=devnet"
```

## ✅ Resultado Esperado

Você terá:
- ✅ Smart contract deployado na devnet
- ✅ Program ID público e verificável
- ✅ Programa testável via frontend

## 🔧 Troubleshooting

**"insufficient funds":**
```bash
solana airdrop 2
```

**"Error: Connection refused":**
```bash
solana config set --url https://api.devnet.solana.com
```

**"anchor: command not found":**
```bash
export PATH="$HOME/.cargo/bin:$PATH"
anchor --version
```

## 📝 Custos
- **GitHub Codespaces:** 120h/mês grátis
- **Solana Devnet:** 100% grátis, ilimitado
- **Deploy:** $0.00

---

**Tempo total:** ~15 minutos
**Custo total:** $0.00 💰
