# ClawDNA Backend API

Serverless backend for ClawDNA evolutionary simulation platform, powered by Vercel Functions and KV storage.

## Features

- **Evolution Engine**: Tournament selection, crossover, mutation
- **Session Management**: Persistent populations with Vercel KV
- **Rate Limiting**: Built-in request throttling
- **Solana Integration**: Wallet connection and NFT preparation
- **Leaderboard**: Global rankings across sessions

## API Endpoints

### Population

#### POST `/api/population/init`
Initialize a new population.

**Request:**
```json
{
  "config": {
    "populationSize": 50,
    "mutationRate": 0.1,
    "survivalRate": 0.4,
    "tournamentSize": 3,
    "maxGenerations": 100
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "sess_1234567890_ABC123",
  "agents": [...],
  "bestAgent": {...},
  "generation": 0,
  "config": {...},
  "populationSize": 50
}
```

### Evolution

#### POST `/api/evolve`
Run evolution step(s).

**Request:**
```json
{
  "sessionId": "sess_1234567890_ABC123",
  "generations": 1
}
```

**Response:**
```json
{
  "success": true,
  "generation": 1,
  "agents": [...],
  "bestAgent": {...},
  "generationData": [...],
  "stats": {
    "averageFitness": 0.75,
    "maxFitness": 0.95,
    "minFitness": 0.55
  }
}
```

### Agents

#### GET `/api/agents`
Get all agents with filtering and pagination.

**Query Parameters:**
- `sessionId` (required): Session identifier
- `sort`: `fitness` | `age` | `generation` | `id` (default: `fitness`)
- `order`: `asc` | `desc` (default: `desc`)
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset (default: 0)
- `generation`: Filter by generation number
- `minFitness`: Filter by minimum fitness

**Example:**
```
GET /api/agents?sessionId=sess_123&sort=fitness&order=desc&limit=20
```

### Breeding

#### POST `/api/breed`
Breed two agents.

**Request:**
```json
{
  "sessionId": "sess_1234567890_ABC123",
  "parent1Id": "A-ABC123",
  "parent2Id": "A-DEF456",
  "mutationRate": 0.15,
  "customName": "Super Agent",
  "autoAdd": true
}
```

### Leaderboard

#### GET `/api/leaderboard`
Get top performers globally.

**Query Parameters:**
- `limit`: Number of entries (default: 20, max: 100)
- `sessionId`: Include current session indicator
- `includeCurrent`: Include session's best agent

### Session Management

#### GET `/api/session`
Get session details.

**Query Parameters:**
- `sessionId`: Session identifier
- `walletAddress`: Get session by wallet

#### DELETE `/api/session`
Delete a session.

**Request:**
```json
{
  "sessionId": "sess_1234567890_ABC123"
}
```

### Wallet / Solana

#### POST `/api/wallet?action=connect`
Connect wallet to session.

#### GET `/api/wallet?action=balance&address=<wallet>`
Get wallet balance.

#### POST `/api/wallet?action=mint`
Prepare NFT mint for an agent.

#### POST `/api/wallet?action=airdrop`
Request SOL airdrop (devnet only).

### Health

#### GET `/api/health`
Check API health status.

## Frontend Integration

### Using the React Hook

```tsx
import { useEvolutionBackend, useLeaderboard } from './services/useEvolutionApi'

function App() {
  const {
    sessionId,
    agents,
    bestAgentEver,
    isLoading,
    initialize,
    evolve,
    breed,
    connectWallet,
  } = useEvolutionBackend()

  const { leaderboard, fetchLeaderboard } = useLeaderboard()

  // Initialize on mount
  useEffect(() => {
    initialize()
  }, [])

  return (
    <div>
      <button onClick={() => evolve()} disabled={isLoading}>
        Evolve
      </button>
      <button onClick={() => breed(agents[0].id, agents[1].id)}>
        Breed
      </button>
    </div>
  )
}
```

### Using the API Service Directly

```tsx
import * as api from './services/api'

// Initialize population
const { sessionId, agents } = await api.initPopulation({
  populationSize: 100,
  mutationRate: 0.15,
})

// Evolve
const result = await api.evolve(sessionId, 5)

// Get leaderboard
const { leaderboard } = await api.getLeaderboard(10)
```

## Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Vercel KV (Optional but recommended)

1. Go to Vercel Dashboard → Storage
2. Create new KV database
3. Link to your project
4. Environment variables auto-populate

### 3. Environment Variables

Add to Vercel Dashboard or `.env.local`:

```bash
# Required for persistence
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."

# Solana (defaults to devnet)
SOLANA_NETWORK="devnet"
SOLANA_RPC_URL="https://api.devnet.solana.com"

# Rate limiting
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX="100"

# Session TTL (1 hour default)
SESSION_TTL_SECONDS="3600"
```

### 4. Deploy

```bash
vercel --prod
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Vercel API     │────▶│  Vercel KV      │
│   (React/Vite)  │◀────│  (Serverless)   │◀────│  (Session Store)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Solana RPC     │
                        │  (Wallet/NFT)   │
                        └─────────────────┘
```

## File Structure

```
/api
  ├── health.ts          # Health check
  ├── population/
  │   └── init.ts        # Initialize population
  ├── evolve.ts          # Evolution step
  ├── agents.ts          # Get agents
  ├── breed.ts           # Breed agents
  ├── leaderboard.ts     # Global rankings
  ├── session.ts         # Session CRUD
  └── wallet.ts          # Solana integration
/lib
  ├── utils.ts           # Core utilities
  ├── store.ts           # KV storage wrapper
  ├── rateLimit.ts       # Rate limiting
  └── solana.ts          # Solana helpers
/src/services
  ├── api.ts             # API client
  └── useEvolutionApi.ts # React hooks
```

## Rate Limiting

- Default: 100 requests per minute per IP
- Applied to POST/PUT/DELETE only
- Headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error Codes

| Code | Description |
|------|-------------|
| `MISSING_SESSION_ID` | Session ID not provided |
| `SESSION_NOT_FOUND` | Invalid or expired session |
| `NO_POPULATION` | Population not initialized |
| `PARENT_NOT_FOUND` | Parent agent doesn't exist |
| `INVALID_WALLET` | Invalid Solana address |
| `NO_WALLET` | Wallet not connected |

## Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Batch evolution processing
- [ ] IPFS metadata storage for NFTs
- [ ] Metaplex NFT minting
- [ ] Multi-population tournaments
- [ ] Agent trading marketplace
