#!/bin/bash
set -e

echo "🚀 ClawDNA Auto Deploy"
echo "======================"

# 1. Setup wallet
echo "📝 Creating wallet..."
solana-keygen new --no-bip39-passphrase --silent --outfile ~/.config/solana/id.json 2>/dev/null || true
solana config set --url https://api.devnet.solana.com

# 2. Get SOL
echo "💰 Requesting airdrops..."
solana airdrop 2 || true
sleep 3
solana airdrop 2 || true
sleep 3

BALANCE=$(solana balance | grep -oP '\d+\.\d+')
echo "Balance: $BALANCE SOL"

# 3. Build
echo "🔨 Building program..."
cd clawdna
anchor build

# 4. Deploy
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet 2>&1 | tee deploy.log

# 5. Extract Program ID
PROGRAM_ID=$(grep -oP 'Program Id: \K[0-9A-Za-z]+' deploy.log)
echo ""
echo "✅ SUCCESS!"
echo "Program ID: $PROGRAM_ID"
echo "$PROGRAM_ID" > ../DEPLOYED_PROGRAM_ID.txt

echo ""
echo "🔗 View on explorer:"
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
