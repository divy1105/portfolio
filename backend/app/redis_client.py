from __future__ import annotations

import json
import logging
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)

redis_client = None
redis_ok = False


async def connect_redis() -> None:
    global redis_client, redis_ok
    if not settings.redis_url:
        redis_ok = False
        return
    try:
        import redis.asyncio as redis

        redis_client = redis.from_url(settings.redis_url, decode_responses=True)
        await redis_client.ping()
        redis_ok = True
        logger.info("Redis connected")
    except Exception as exc:  # noqa: BLE001
        logger.warning("Redis unavailable: %s", exc)
        redis_client = None
        redis_ok = False


async def close_redis() -> None:
    global redis_client, redis_ok
    if redis_client:
        await redis_client.close()
    redis_client = None
    redis_ok = False


def _key(cache_id: str) -> str:
    return f"portfolio:{cache_id}"


async def redis_get_json(cache_id: str) -> Any | None:
    if not redis_client:
        return None
    try:
        raw = await redis_client.get(_key(cache_id))
        return json.loads(raw) if raw else None
    except Exception:  # noqa: BLE001
        return None


async def redis_set_json(cache_id: str, value: Any, ttl: int = 86400) -> None:
    if not redis_client:
        return
    try:
        await redis_client.set(_key(cache_id), json.dumps(value, default=str), ex=ttl)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Redis set failed: %s", exc)
