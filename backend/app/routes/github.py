from fastapi import APIRouter, Query

from app.services import github_service

router = APIRouter(prefix="/api/github", tags=["github"])


@router.get("/repos")
async def repos():
    return await github_service.get_cached_repos()


@router.get("/readme")
async def readme(url: str = Query(...)):
    html = await github_service.get_readme_by_url(url)
    return {"html": html, "url": url}
