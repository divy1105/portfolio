from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from bson import ObjectId

import app.database as database
from app.database import collection
from app.services.cache_service import cache_get, cache_set
from app.services.github_service import get_cached_repos

CRIMEPULSE_HTML = """
<h1>CrimePulse</h1>
<p>Chicago crime awareness dashboard with <strong>live 90-day beat forecasts</strong>.</p>
<h2>Overview</h2>
<p>CrimePulse helps explore recent crime patterns and projected activity across police beats.
It pairs a Flask backend with LightGBM forecasting and an interactive map + chart frontend.</p>
<h2>Highlights</h2>
<ul>
<li>MAE <strong>1.06</strong> on forecast evaluation</li>
<li>Coverage across <strong>305</strong> beats</li>
<li>Live forecast window for the next 90 days</li>
</ul>
<h2>Stack</h2>
<ul>
<li>Python &amp; Flask</li>
<li>LightGBM</li>
<li>Chart.js &amp; Leaflet</li>
<li>SQLite</li>
</ul>
<h2>Status</h2>
<p>Public GitHub link coming soon — details shown here until the repo is published.</p>
"""

EVENT_HTML = """
<h1>Event Management System</h1>
<p>MCA final-year event management portal — organize events with a modern web client and .NET API.</p>
<h2>Features</h2>
<ul>
<li>Event creation and organization workflows</li>
<li>Modern React + Ant Design client</li>
<li>ASP.NET API with TypeScript frontend tooling</li>
</ul>
<h2>Stack</h2>
<p>C# / ASP.NET, React, TypeScript, Vite, Ant Design</p>
<h2>Repository</h2>
<p><a href="https://github.com/divy1105/Event-Management-System-MCA">github.com/divy1105/Event-Management-System-MCA</a></p>
"""

SPORTIES_HTML = """
<h1>Sporties</h1>
<p>Full-stack e-commerce platform for sports equipment with product catalog, cart, and checkout flow.</p>
<h2>Features</h2>
<ul>
<li>Product catalog browsing</li>
<li>Shopping cart</li>
<li>Checkout flow backed by MySQL</li>
</ul>
<h2>Stack</h2>
<p>HTML, CSS, JavaScript, PHP, MySQL (XAMPP)</p>
<h2>Status</h2>
<p>Public GitHub link coming soon — project details shown here until published.</p>
"""

SEED_PROJECTS: list[dict[str, Any]] = [
    {
        "title": "CrimePulse",
        "description": "Chicago crime awareness dashboard with live 90-day beat forecasts",
        "content_html": CRIMEPULSE_HTML.strip(),
        "tech": ["Python", "Flask", "LightGBM", "Chart.js", "Leaflet", "SQLite"],
        "github_url": None,
        "demo_url": None,
        "featured": True,
        "order": 1,
        "source": "manual",
    },
    {
        "title": "CareerLens",
        "description": "AI resume-to-career platform — job match scores, skill gaps, roadmap, mock interviews",
        "content_html": "",
        "tech": ["React", "Vite", "Tailwind", "FastAPI", "Gemini", "Exa"],
        "github_url": "https://github.com/divy1105/CareerLens",
        "demo_url": "https://career-lens-alpha.vercel.app",
        "featured": True,
        "order": 2,
        "source": "manual",
    },
    {
        "title": "TravelMind",
        "description": "Plan multi-city trips as one story — itinerary, budget, packing, and notes in one place",
        "content_html": "",
        "tech": ["React", "TypeScript", "Vite", "Hono", "Neon Postgres", "Tailwind"],
        "github_url": "https://github.com/divy1105/TravelMind",
        "demo_url": None,
        "featured": True,
        "order": 3,
        "source": "manual",
    },
    {
        "title": "Manager_Task_Ai",
        "description": "Turn meeting notes into structured, filterable tasks with AI extraction",
        "content_html": "",
        "tech": ["FastAPI", "React", "Vite", "Neon Postgres", "Groq API"],
        "github_url": "https://github.com/divy1105/Manager_Task_Ai",
        "demo_url": None,
        "featured": False,
        "order": 4,
        "source": "manual",
    },
    {
        "title": "Event-Management-System-MCA",
        "description": "MCA final-year event management portal with .NET API and React client",
        "content_html": EVENT_HTML.strip(),
        "tech": ["C# / ASP.NET", "React", "TypeScript", "Vite", "Ant Design"],
        "github_url": "https://github.com/divy1105/Event-Management-System-MCA",
        "demo_url": None,
        "featured": False,
        "order": 5,
        "source": "manual",
    },
    {
        "title": "Sporties",
        "description": "Full-stack e-commerce for sports equipment — catalog, cart, checkout",
        "content_html": SPORTIES_HTML.strip(),
        "tech": ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
        "github_url": None,
        "demo_url": None,
        "featured": False,
        "order": 6,
        "source": "manual",
    },
]


def serialize_project(doc: dict[str, Any]) -> dict[str, Any]:
    out = {k: v for k, v in doc.items() if k != "_id"}
    out["id"] = str(doc.get("_id") or doc.get("id") or uuid4())
    return out


async def _backfill_seed_fields(col: Any, docs: list[dict[str, Any]]) -> bool:
    """Fill missing github_url / content_html / order from SEED for known curated titles."""
    seed_by_title = {p["title"].lower(): p for p in SEED_PROJECTS}
    updated = False
    for d in docs:
        seed = seed_by_title.get(str(d.get("title") or "").lower())
        if not seed:
            continue
        patch: dict[str, Any] = {}
        if not d.get("github_url") and seed.get("github_url"):
            patch["github_url"] = seed["github_url"]
        if seed.get("description") and d.get("description") != seed.get("description"):
            patch["description"] = seed["description"]
        seed_html = (seed.get("content_html") or "").strip()
        current_html = (d.get("content_html") or "").strip()
        if seed_html and (not current_html or len(current_html) < 80):
            patch["content_html"] = seed_html
        if d.get("order") != seed.get("order"):
            patch["order"] = seed["order"]
        if bool(d.get("featured")) != bool(seed.get("featured")):
            patch["featured"] = seed["featured"]
        if patch:
            await col.update_one({"_id": d["_id"]}, {"$set": patch})
            d.update(patch)
            updated = True
    return updated


async def _ensure_seed_projects(col: Any, docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Insert any SEED titles missing from Mongo so new curated projects show up."""
    existing = {str(d.get("title") or "").lower() for d in docs}
    inserted = False
    for p in SEED_PROJECTS:
        if p["title"].lower() in existing:
            continue
        await col.insert_one({**p, "created_at": datetime.now(timezone.utc).isoformat()})
        inserted = True
    if inserted:
        return await col.find({}).sort("order", 1).to_list(200)
    return docs


async def list_curated() -> list[dict[str, Any]]:
    if not database.db_ok:
        return [{**p, "id": f"seed-{i}"} for i, p in enumerate(SEED_PROJECTS)]
    col = collection("projects")
    docs = await col.find({}).sort("order", 1).to_list(200)
    if not docs:
        for p in SEED_PROJECTS:
            await col.insert_one({**p, "created_at": datetime.now(timezone.utc).isoformat()})
        docs = await col.find({}).sort("order", 1).to_list(200)
    else:
        docs = await _ensure_seed_projects(col, docs)
        await _backfill_seed_fields(col, docs)
    return [serialize_project(d) for d in docs]


async def rebuild_merged_projects_cache() -> list[dict[str, Any]]:
    curated = await list_curated()
    github = await get_cached_repos()
    seen: set[str] = set()
    merged: list[dict[str, Any]] = []

    for p in curated:
        url = (p.get("github_url") or "").lower()
        if url:
            seen.add(url)
        merged.append(p)

    for g in github:
        url = (g.get("github_url") or "").lower()
        if url and url in seen:
            continue
        if url:
            seen.add(url)
        merged.append(g)

    await cache_set("merged_projects", merged)
    return merged


async def get_public_projects() -> list[dict[str, Any]]:
    cached = await cache_get("merged_projects")
    if cached:
        cached_titles = {(p.get("title") or "").lower() for p in cached}
        missing_seed = any(p["title"].lower() not in cached_titles for p in SEED_PROJECTS)
        thin = any(
            (p.get("title") or "").lower() in {"crimepulse", "sporties", "event-management-system-mca"}
            and len((p.get("content_html") or "").strip()) < 80
            for p in cached
        )
        if not thin and not missing_seed:
            return cached
    return await rebuild_merged_projects_cache()


async def get_project(project_id: str) -> dict[str, Any] | None:
    projects = await get_public_projects()
    for p in projects:
        if str(p.get("id")) == project_id or p.get("title") == project_id:
            return p
    if database.db_ok and ObjectId.is_valid(project_id):
        doc = await collection("projects").find_one({"_id": ObjectId(project_id)})
        if doc:
            return serialize_project(doc)
    return None


async def create_project(data: dict[str, Any]) -> dict[str, Any]:
    if not database.db_ok:
        raise RuntimeError("Database unavailable")
    data = {**data, "source": "manual", "created_at": datetime.now(timezone.utc).isoformat()}
    res = await collection("projects").insert_one(data)
    data["_id"] = res.inserted_id
    await rebuild_merged_projects_cache()
    return serialize_project(data)


async def update_project(project_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
    if not database.db_ok or not ObjectId.is_valid(project_id):
        return None
    await collection("projects").update_one({"_id": ObjectId(project_id)}, {"$set": data})
    await rebuild_merged_projects_cache()
    return await get_project(project_id)


async def delete_project(project_id: str) -> bool:
    if not database.db_ok or not ObjectId.is_valid(project_id):
        return False
    res = await collection("projects").delete_one({"_id": ObjectId(project_id)})
    await rebuild_merged_projects_cache()
    return res.deleted_count > 0
