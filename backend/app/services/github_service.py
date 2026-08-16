from __future__ import annotations

from typing import Any

import httpx

from app.config import settings
from app.services.cache_service import cache_get, cache_set


def _headers() -> dict[str, str]:
    h = {"Accept": "application/vnd.github+json", "User-Agent": "divy-portfolio"}
    if settings.github_token:
        h["Authorization"] = f"Bearer {settings.github_token}"
    return h


def normalize_repo(repo: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(repo.get("id")),
        "title": repo.get("name") or "Untitled",
        "description": repo.get("description") or "",
        "github_url": repo.get("html_url"),
        "demo_url": repo.get("homepage") or None,
        "tech": [repo["language"]] if repo.get("language") else [],
        "language": repo.get("language"),
        "stars": repo.get("stargazers_count", 0),
        "source": "github",
        "featured": False,
        "order": 0,
        "updated_at": repo.get("updated_at"),
    }


async def fetch_github_repos() -> list[dict[str, Any]]:
    username = settings.github_username
    url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.get(url, headers=_headers())
        res.raise_for_status()
        repos = res.json()
    out = [normalize_repo(r) for r in repos if not r.get("fork")]
    out.sort(key=lambda r: (r.get("stars") or 0, r.get("updated_at") or ""), reverse=True)
    await cache_set("github_repos", out)
    return out


async def get_cached_repos() -> list[dict[str, Any]]:
    return (await cache_get("github_repos")) or []


def parse_github_url(url: str) -> tuple[str, str] | None:
    # https://github.com/owner/repo
    try:
        parts = url.rstrip("/").split("/")
        owner, repo = parts[-2], parts[-1]
        if ".git" in repo:
            repo = repo.replace(".git", "")
        return owner, repo
    except Exception:  # noqa: BLE001
        return None


async def fetch_readme_html(owner: str, repo: str) -> str:
    cache_id = f"github_readme:{owner}/{repo}"
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    headers = {**_headers(), "Accept": "application/vnd.github.html"}
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.get(url, headers=headers)
        if res.status_code == 404:
            return "<p>README not found.</p>"
        res.raise_for_status()
        html = res.text
    await cache_set(cache_id, html)
    return html


async def get_readme_by_url(url: str) -> str:
    parsed = parse_github_url(url)
    if not parsed:
        return "<p>Invalid GitHub URL.</p>"
    owner, repo = parsed
    cache_id = f"github_readme:{owner}/{repo}"
    cached = await cache_get(cache_id)
    if cached:
        return cached
    # public path should not hit live API per design; return empty-ish if never synced
    return "<p>README not synced yet. Admin: run Sync Data.</p>"


async def sync_readme_for_url(url: str) -> str:
    parsed = parse_github_url(url)
    if not parsed:
        return ""
    owner, repo = parsed
    return await fetch_readme_html(owner, repo)
