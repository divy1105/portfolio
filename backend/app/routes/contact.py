from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

import app.database as database
from app.database import collection
from app.middlewares.auth_middleware import require_admin
from app.services.email_service import send_contact_email

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str | None = None
    message: str = Field(min_length=1, max_length=5000)


@router.post("/")
async def create_contact(body: ContactIn):
    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    contact_id = None
    if database.db_ok:
        res = await collection("contacts").insert_one(doc)
        contact_id = str(res.inserted_id)
    emailed = await send_contact_email(doc)
    return {"success": True, "id": contact_id, "emailed": emailed}


@router.get("/")
async def list_contacts(_: str = Depends(require_admin)):
    if not database.db_ok:
        return []
    docs = await collection("contacts").find({}).sort("created_at", -1).to_list(200)
    out = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        out.append(d)
    return out
