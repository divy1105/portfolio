from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import app.database as database
import app.redis_client as redis_mod
from app.database import collection
from app.redis_client import redis_get_json, redis_set_json


async def cache_get(cache_id: str) -> Any | None:
    cached = await redis_get_json(cache_id)
    if cached is not None:
        return cached
    if not database.db_ok:
        return None
    col = collection("cache")
    if col is None:
        return None
    doc = await col.find_one({"_id": cache_id})
    if not doc:
        return None
    value = doc.get("value")
    await redis_set_json(cache_id, value)
    return value


async def cache_set(cache_id: str, value: Any) -> None:
    if database.db_ok:
        col = collection("cache")
        if col is not None:
            await col.update_one(
                {"_id": cache_id},
                {"$set": {"value": value, "updated_at": datetime.now(timezone.utc).isoformat()}},
                upsert=True,
            )
    await redis_set_json(cache_id, value)


async def set_sync_meta(ok: bool, sources: dict[str, Any]) -> None:
    await cache_set(
        "sync_meta",
        {
            "last_synced_at": datetime.now(timezone.utc).isoformat(),
            "ok": ok,
            "sources": sources,
        },
    )


async def get_sync_meta() -> dict[str, Any]:
    meta = await cache_get("sync_meta")
    return meta or {"last_synced_at": None, "ok": False, "sources": {}}


async def cache_benchmark(rounds: int = 5) -> dict[str, Any]:
    import time

    key = "__bench__"
    payload = {"ping": True}
    mongo_ms: list[float] = []
    redis_ms: list[float] = []

    for _ in range(max(1, min(rounds, 20))):
        if database.db_ok:
            t0 = time.perf_counter()
            await cache_set(key, payload)
            _ = await cache_get(key)
            mongo_ms.append((time.perf_counter() - t0) * 1000)
        if redis_mod.redis_ok:
            t0 = time.perf_counter()
            await redis_set_json(key, payload)
            await redis_get_json(key)
            redis_ms.append((time.perf_counter() - t0) * 1000)

    def avg(xs: list[float]) -> float | None:
        return round(sum(xs) / len(xs), 2) if xs else None

    return {
        "rounds": rounds,
        "mongo_avg_ms": avg(mongo_ms),
        "redis_avg_ms": avg(redis_ms),
        "mongo_ok": database.db_ok,
        "redis_ok": redis_mod.redis_ok,
    }
