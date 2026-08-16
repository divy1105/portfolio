from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

from app.middlewares.auth_middleware import require_admin
from app.services import analytics_service

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


class EventIn(BaseModel):
    event_type: str = Field(pattern="^(page_view|resume_download)$")
    path: str | None = None
    source: str | None = None
    session_id: str | None = None


@router.post("/event")
async def track(body: EventIn, request: Request):
    ip = request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (
        request.client.host if request.client else None
    )
    return await analytics_service.record_event(body.model_dump(), ip=ip)


@router.get("/summary")
async def summary(_: str = Depends(require_admin)):
    return await analytics_service.summary()


@router.get("/report")
async def report(period: str = "weekly", _: str = Depends(require_admin)):
    return await analytics_service.report(period)
