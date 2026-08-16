from fastapi import APIRouter

from app.services import leetcode_service

router = APIRouter(prefix="/api/leetcode", tags=["leetcode"])


@router.get("/stats")
async def stats():
    return await leetcode_service.get_cached_leetcode()
