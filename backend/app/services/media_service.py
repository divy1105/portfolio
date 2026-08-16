from __future__ import annotations

from typing import Any

from bson import ObjectId
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse

import app.database as database
from app.database import get_fs


async def save_media(file: UploadFile) -> dict[str, Any]:
    if not database.db_ok:
        raise HTTPException(503, "Database unavailable")
    fs = get_fs()
    assert fs is not None
    data = await file.read()
    file_id = await fs.upload_from_stream(
        file.filename or "upload.bin",
        data,
        metadata={"content_type": file.content_type or "application/octet-stream"},
    )
    return {
        "id": str(file_id),
        "url": f"/api/media/{file_id}",
        "content_type": file.content_type,
    }


async def stream_media(file_id: str) -> StreamingResponse:
    if not database.db_ok or not ObjectId.is_valid(file_id):
        raise HTTPException(404, "Not found")
    fs = get_fs()
    assert fs is not None
    try:
        grid_out = await fs.open_download_stream(ObjectId(file_id))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(404, "Not found") from exc

    async def iterator():
        while True:
            chunk = await grid_out.readchunk()
            if not chunk:
                break
            yield chunk

    content_type = (grid_out.metadata or {}).get("content_type", "application/octet-stream")
    return StreamingResponse(
        iterator(),
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


async def delete_media(file_id: str) -> bool:
    if not database.db_ok or not ObjectId.is_valid(file_id):
        return False
    fs = get_fs()
    assert fs is not None
    await fs.delete(ObjectId(file_id))
    return True
