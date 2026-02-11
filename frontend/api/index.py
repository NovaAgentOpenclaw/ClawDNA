"""
Vercel Serverless Function wrapper for FastAPI backend.
Runs the ClawDNA backend as a serverless function on Vercel.
"""
import os
import sys

# Add backend source to Python path
backend_src = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src')
sys.path.insert(0, backend_src)

# Force in-memory database for serverless
os.environ['CLAWDNA_USE_MEMORY_DB'] = 'true'
os.environ['CORS_ORIGINS'] = '*'

# Import FastAPI and create app
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import adapters directly (avoiding lifespan manager for serverless)
from src.adapters.api.routes import router as evolution_router
from src.adapters.api.auth_routes import router as auth_router
from src.adapters.api.routes import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Create minimal FastAPI app for serverless
app = FastAPI(
    title="ClawDNA Backend API",
    description="AI Agent Evolution Platform on Solana - Serverless",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(evolution_router, prefix="/api/v1/evolution")
app.include_router(auth_router, prefix="/api/v1/auth")

# Root endpoint
@app.get("/")
@app.get("/api")
@app.get("/api/v1")
async def root():
    return {
        "name": "ClawDNA Backend API",
        "version": "1.0.0",
        "mode": "serverless",
        "docs": "/docs",
        "endpoints": {
            "run_evolution": "POST /api/v1/evolution/run",
            "get_result": "GET /api/v1/evolution/results/{id}",
            "list_results": "GET /api/v1/evolution/results",
            "health": "GET /api/v1/evolution/health",
            "stats": "GET /api/v1/evolution/stats"
        }
    }

# Health check for Vercel
@app.get("/api/health")
@app.get("/api/v1/health")
async def health():
    return {
        "status": "ok",
        "mode": "serverless",
        "database": "in-memory",
        "timestamp": __import__('time').time()
    }

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "type": type(exc).__name__,
            "message": str(exc) if os.getenv("DEBUG") else "An error occurred"
        }
    )

# Vercel handler
from mangum import Mangum
handler = Mangum(app, lifespan="off")
