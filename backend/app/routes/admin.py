from fastapi import APIRouter, Depends

from app.middlewares.auth_middleware import require_admin
from app.services import sync_service
from app.services.cache_service import cache_benchmark, get_sync_meta

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/sync")
async def sync(_: str = Depends(require_admin)):
    return await sync_service.run_full_sync()


@router.get("/sync/status")
async def sync_status(_: str = Depends(require_admin)):
    return await get_sync_meta()


@router.get("/cache-benchmark")
async def benchmark(rounds: int = 5, _: str = Depends(require_admin)):
    return await cache_benchmark(rounds)
