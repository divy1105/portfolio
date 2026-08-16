from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.middlewares.auth_middleware import require_admin
from app.services import project_service

router = APIRouter(prefix="/api/projects", tags=["projects"])


class ProjectIn(BaseModel):
    title: str
    description: str = ""
    content_html: str = ""
    tech: list[str] = Field(default_factory=list)
    github_url: str | None = None
    demo_url: str | None = None
    thumbnail: str | None = None
    images: list[str] = Field(default_factory=list)
    video_url: str | None = None
    featured: bool = False
    order: int = 0


@router.get("/")
async def list_projects():
    return await project_service.get_public_projects()


@router.get("/curated")
async def curated(_: str = Depends(require_admin)):
    return await project_service.list_curated()


@router.get("/count")
async def count():
    projects = await project_service.get_public_projects()
    return {"count": len(projects)}


@router.get("/{project_id}")
async def get_one(project_id: str):
    project = await project_service.get_project(project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@router.post("/")
async def create(body: ProjectIn, _: str = Depends(require_admin)):
    try:
        return await project_service.create_project(body.model_dump())
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc


@router.put("/{project_id}")
async def update(project_id: str, body: ProjectIn, _: str = Depends(require_admin)):
    updated = await project_service.update_project(project_id, body.model_dump())
    if not updated:
        raise HTTPException(404, "Project not found")
    return updated


@router.delete("/{project_id}")
async def delete(project_id: str, _: str = Depends(require_admin)):
    ok = await project_service.delete_project(project_id)
    if not ok:
        raise HTTPException(404, "Project not found")
    return {"ok": True}
