# ClawDNA Backend API

Production-grade FastAPI backend for the ClawDNA genetic evolution platform.

## Architecture

This backend follows **Clean/Hexagonal Architecture** principles:

```
backend/
├── src/
│   ├── domain/           # Enterprise business rules (entities, repositories, exceptions)
│   ├── application/      # Use cases and orchestration
│   ├── adapters/         # External interfaces
│   │   ├── api/         # HTTP routes and controllers
│   │   └── persistence/ # Database implementations
│   └── main.py          # FastAPI application entry point
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # API integration tests
├── Dockerfile
└── docker-compose.yml
```

## Quick Start

### Using Docker (Recommended)

```bash
cd backend

# Build and run
docker-compose up --build

# API will be available at http://localhost:8000
```

### Using Python

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API
python -m uvicorn src.main:app --reload
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/evolution/run` | Run evolution simulation |
| GET | `/api/v1/evolution/results/{id}` | Get specific result |
| GET | `/api/v1/evolution/results` | List all results |
| GET | `/api/v1/evolution/health` | Health check |

## Example Usage

### Run Evolution

```bash
curl -X POST "http://localhost:8000/api/v1/evolution/run" \
  -H "Content-Type: application/json" \
  -d '{
    "population_size": 50,
    "generations": 20,
    "mutation_rate": 0.1,
    "survival_rate": 0.4,
    "tournament_size": 3,
    "random_seed": 42
  }'
```

### Response

```json
{
  "id": "uuid-string",
  "status": "completed",
  "parameters": { ... },
  "generations": [
    {
      "generation_number": 1,
      "avg_fitness": 2.45,
      "max_fitness": 4.12,
      "min_fitness": 1.23,
      "diversity_score": 0.08,
      "population_size": 50,
      "timestamp": "2026-02-04T23:30:00"
    }
  ],
  "best_agent": {
    "id": "agent-uuid",
    "genome": {
      "speed": 0.95,
      "strength": 0.87,
      "intelligence": 0.92,
      "cooperation": 0.78,
      "adaptability": 0.88
    },
    "fitness": 4.40,
    "generation": 20
  },
  "execution_time_ms": 1250
}
```

## Documentation

Interactive API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_entities.py

# Run integration tests only
pytest tests/integration/
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `8000` | Server port |
| `CLAWDNA_DB_PATH` | `clawdna.db` | SQLite database path |
| `CLAWDNA_USE_MEMORY_DB` | `false` | Use in-memory storage |
| `CORS_ORIGINS` | `*` | Allowed CORS origins |

## Features

- ✅ **Clean Architecture** - Domain-driven design with separation of concerns
- ✅ **Pydantic Validation** - Comprehensive input validation
- ✅ **Rate Limiting** - SlowAPI protection against abuse
- ✅ **Dual Storage** - SQLite or in-memory persistence options
- ✅ **OpenAPI/Swagger** - Full interactive API documentation
- ✅ **Comprehensive Testing** - Unit and integration tests
- ✅ **Docker Support** - Production-ready containerization
- ✅ **CORS Enabled** - Cross-origin requests supported
- ✅ **Health Checks** - Built-in health monitoring
