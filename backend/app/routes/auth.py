from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from app.middlewares.auth_middleware import require_admin
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
async def login(body: LoginIn):
    result = auth_service.login(body.email, body.password)
    if not result:
        raise HTTPException(401, "Invalid credentials")
    return result


@router.get("/me")
async def me(email: str = Depends(require_admin)):
    return {"email": email}
