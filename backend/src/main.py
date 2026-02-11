"""
ClawDNA Backend API
Production-grade FastAPI application with Clean Architecture
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import structlog

from src.adapters.api import router, limiter, auth_router

# Setup structured logging
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    print("🧬 ClawDNA Backend API starting...")
    yield
    # Shutdown
    print("👋 ClawDNA Backend API shutting down...")


def create_application() -> FastAPI:
    """Application factory"""
    app = FastAPI(
        title="ClawDNA Backend API",
        description="""
        **Production-grade genetic evolution API**
        
        ClawDNA exposes the genetic evolution simulator as a RESTful service,
        making it accessible to other agents and frontends programmatically.
        
        ## Features
        
        * **Genetic Evolution**: Run population evolutions with configurable parameters
        * **Clean Architecture**: Domain-driven design with clear separation of concerns
        * **Rate Limiting**: Protected against abuse with SlowAPI
        * **Data Persistence**: SQLite or in-memory storage options
        * **Comprehensive Validation**: Pydantic models ensure data integrity
        * **Full OpenAPI Docs**: Interactive documentation at /docs
        
        ## Endpoints
        
        * `POST /api/v1/evolution/run` - Run evolution simulation
        * `GET /api/v1/evolution/results/{id}` - Get specific result
        * `GET /api/v1/evolution/results` - List all results
        * `GET /api/v1/evolution/health` - Health check
        """,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan
    )
    
    # Add rate limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Gzip compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Include routers
    app.include_router(router)
    app.include_router(auth_router)
    
    # Root endpoint
    @app.get("/", include_in_schema=False)
    async def root():
        return {
            "name": "ClawDNA Backend API",
            "version": "1.0.0",
            "docs": "/docs",
            "endpoints": {
                "run_evolution": "POST /api/v1/evolution/run",
                "get_result": "GET /api/v1/evolution/results/{id}",
                "list_results": "GET /api/v1/evolution/results",
                "health": "GET /api/v1/evolution/health"
            }
        }
    
    # Global exception handler - secure: don't expose internal error details
    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        # Log the actual error internally for debugging
        logger.error(
            "unhandled_exception",
            path=str(request.url.path),
            method=request.method,
            error_type=type(exc).__name__,
            error_message=str(exc)
        )
        
        # Return generic error message to client (don't expose details)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "message": "An unexpected error occurred. Please try again later."
            }
        )
    
    return app


# Create application instance
app = create_application()

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
