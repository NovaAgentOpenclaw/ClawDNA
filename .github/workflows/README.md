# 🚀 Deploy via GitHub Actions

## Setup

### 1. Configurar o Secret no GitHub

Vá em **Settings > Secrets and variables > Actions** e adicione:

**`SOLANA_KEYPAIR`**
- Conteúdo: Array JSON da keypair (formato: `[12,34,56,...]`)
- Como obter: `cat ~/.config/solana/id.json`

⚠️ **Importante**: A conta precisa ter SOL na devnet para pagar o deploy.

### 2. Obter SOL na Devnet

```bash
# Localmente, com a mesma keypair que vai no secret
solana config set --url devnet
solana airdrop 2
solana balance
```

Ou use: https://faucet.solana.com/

### 3. Rodar o Deploy

O workflow roda automaticamente quando:
- Há push na branch `main`, `master` ou `develop` com mudanças em `programs/`
- Ou manualmente via **Actions > Deploy ClawDNA > Run workflow**

### 4. Verificar o Deploy

Após o deploy bem-sucedido:
1. O Program ID é salvo em `DEPLOYED_PROGRAM_ID.txt`
2. O `lib.rs` é atualizado com o novo ID
3. Os artifacts são disponibilizados para download

## Estrutura do Workflow

```
.github/workflows/
└── deploy.yml          # Workflow principal

clawdna/
├── programs/
│   └── clawdna/
│       └── src/
│           └── lib.rs   # Código do programa
├── target/
│   ├── deploy/
│   │   └── clawdna.so   # Binary compilado
│   └── idl/
│       └── clawdna.json # IDL para frontend
└── DEPLOYED_PROGRAM_ID.txt
```

## Troubleshooting

### "Insufficient funds"
- A conta não tem SOL suficiente
- Solução: Pedir mais airdrop ou transferir de outra conta

### "Program already deployed"
- O programa já existe nesse Program ID
- Solução: O workflow atualiza automaticamente (upgrade)

### "Rate limited"
- O faucet da devnet tem rate limit
- Solução: Esperar alguns minutos e tentar novamente

## URLs Úteis

- **Explorer**: https://explorer.solana.com/?cluster=devnet
- **Faucet**: https://faucet.solana.com/
- **ClawDNA no Colosseum**: https://agents.colosseum.com/projects/clawdna-uv2mzh
