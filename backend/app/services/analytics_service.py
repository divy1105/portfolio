from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

import httpx

import app.database as database
from app.database import collection


async def resolve_geo(ip: str | None) -> dict[str, str | None]:
    if not ip or ip in {"127.0.0.1", "::1"}:
        return {"country": None, "city": None}
    providers = [
        f"https://get.geojs.io/v1/ip/geo/{ip}.json",
        f"https://ipwho.is/{ip}",
    ]
    async with httpx.AsyncClient(timeout=8) as client:
        for url in providers:
            try:
                res = await client.get(url)
                if res.status_code != 200:
                    continue
                data = res.json()
                country = data.get("country") or data.get("country_name")
                city = data.get("city")
                return {"country": country, "city": city}
            except Exception:  # noqa: BLE001
                continue
    return {"country": None, "city": None}


async def record_event(event: dict[str, Any], ip: str | None = None) -> dict[str, Any]:
    geo = await resolve_geo(ip)
    doc = {
        **event,
        "session_id": event.get("session_id") or str(uuid4()),
        "country": geo.get("country"),
        "city": geo.get("city"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    # never store raw IP
    if database.db_ok:
        await collection("analytics").insert_one(doc)
    return {"ok": True}


async def summary() -> dict[str, Any]:
    if not database.db_ok:
        return {"page_views": 0, "resume_downloads": 0, "sessions": 0}
    col = collection("analytics")
    page_views = await col.count_documents({"event_type": "page_view"})
    resume_downloads = await col.count_documents({"event_type": "resume_download"})
    sessions = len(await col.distinct("session_id"))
    return {
        "page_views": page_views,
        "resume_downloads": resume_downloads,
        "sessions": sessions,
    }


async def report(period: str = "weekly") -> dict[str, Any]:
    # simplified aggregate for admin
    s = await summary()
    top_paths: list[dict[str, Any]] = []
    top_countries: list[dict[str, Any]] = []
    if database.db_ok:
        col = collection("analytics")
        pipeline_paths = [
            {"$match": {"event_type": "page_view"}},
            {"$group": {"_id": "$path", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        pipeline_countries = [
            {"$match": {"country": {"$ne": None}}},
            {"$group": {"_id": "$country", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        top_paths = [
            {"path": d["_id"], "count": d["count"]} async for d in col.aggregate(pipeline_paths)
        ]
        top_countries = [
            {"country": d["_id"], "count": d["count"]}
            async for d in col.aggregate(pipeline_countries)
        ]
    return {"period": period, "totals": s, "top_paths": top_paths, "top_countries": top_countries}
