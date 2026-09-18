from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, APIRouter, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from shared.config import settings
from infrastructure.database.connection import get_db, engine
import infrastructure.database.models  # Ensures all SQLAlchemy models are registered

from modules.auth.router import router as auth_router
from modules.users.router import router as users_router


class HealthCheckResponse(BaseModel):
    """Pydantic response model for System Health Check endpoint."""
    status: str = Field(..., description="API service operational status", example="online")
    project: str = Field(..., description="Project application name", example="Tech Vision Telegram Bot")
    version: str = Field(..., description="API version identifier", example="1.0.0")
    database: str = Field(..., description="Database connection health status", example="healthy")


# OpenAPI Tag Metadata for Swagger UI categorization
tags_metadata = [
    {
        "name": "System",
        "description": "System operational health checks, diagnostics, and environment monitoring.",
    },
    {
        "name": "Authentication",
        "description": "Telegram Mini App initData cryptographic validation and JWT token issuance.",
    },
    {
        "name": "Users",
        "description": "User identity, account status, and role metadata endpoints.",
    },
    {
        "name": "Employees",
        "description": "Candidate profiles, work experiences, educational background, and skill mappings.",
    },
    {
        "name": "Employers",
        "description": "Company registration, business profiles, and verification documents.",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager handling startup and shutdown procedures."""
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Telegram Reverse Employment Marketplace platform in Ethiopia.",
    openapi_tags=tags_metadata,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS Middleware
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# API v1 Router
api_v1_router = APIRouter(prefix=settings.API_V1_STR)


@api_v1_router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    tags=["System"],
    summary="Check API and Database Health",
    description="Returns current operational status of the FastAPI service and verifies live connectivity to the PostgreSQL database.",
)
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint to verify API and Database connectivity."""
    db_status = "unhealthy"
    try:
        await db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unreachable ({str(e)})"

    return HealthCheckResponse(
        status="online",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        database=db_status,
    )


# Include domain routers under API v1
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)

app.include_router(api_v1_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
