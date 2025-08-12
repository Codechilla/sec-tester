from fastapi import APIRouter
from .database import engine
from .redis_client import check_redis_health
import asyncio

router = APIRouter()

@router.get("/health")
async def health():
    # Check database connection
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        db_status = "ok"
    except Exception:
        db_status = "error"
    # Check Redis connection
    redis_status = "ok" if check_redis_health() else "error"
    return {"database": db_status, "redis": redis_status}
