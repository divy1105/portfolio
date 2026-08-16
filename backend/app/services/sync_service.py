from __future__ import annotations

from typing import Any

from app.services import github_service, leetcode_service, project_service
from app.services.cache_service import set_sync_meta


async def run_full_sync() -> dict[str, Any]:
    sources: dict[str, Any] = {}
    ok = True
    try:
        repos = await github_service.fetch_github_repos()
        sources["github_repos"] = len(repos)
    except Exception as exc:  # noqa: BLE001
        ok = False
        sources["github_repos_error"] = str(exc)
        repos = await github_service.get_cached_repos()

    try:
        lc = await leetcode_service.fetch_leetcode_stats()
        sources["leetcode"] = lc.get("source")
    except Exception as exc:  # noqa: BLE001
        ok = False
        sources["leetcode_error"] = str(exc)

    readme_count = 0
    urls: list[str] = []
    for r in repos:
        if r.get("github_url"):
            urls.append(r["github_url"])
    curated = await project_service.list_curated()
    for p in curated:
        if p.get("github_url"):
            urls.append(p["github_url"])
    for url in sorted(set(urls)):
        try:
            await github_service.sync_readme_for_url(url)
            readme_count += 1
        except Exception:  # noqa: BLE001
            pass
    sources["readmes"] = readme_count

    merged = await project_service.rebuild_merged_projects_cache()
    sources["merged_projects"] = len(merged)

    await set_sync_meta(ok, sources)
    return {"ok": ok, "sources": sources}
