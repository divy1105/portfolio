from fastapi import APIRouter, Depends, File, UploadFile

from app.middlewares.auth_middleware import require_admin
from app.services import media_service

router = APIRouter(prefix="/api/media", tags=["media"])


@router.post("/")
async def upload(file: UploadFile = File(...), _: str = Depends(require_admin)):
    return await media_service.save_media(file)


@router.get("/{file_id}")
async def get_file(file_id: str):
    return await media_service.stream_media(file_id)


@router.delete("/{file_id}")
async def delete_file(file_id: str, _: str = Depends(require_admin)):
    ok = await media_service.delete_media(file_id)
    return {"ok": ok}
