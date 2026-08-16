from __future__ import annotations

import logging
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorGridFSBucket

from app.config import settings

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None
fs: AsyncIOMotorGridFSBucket | None = None
db_ok = False


async def connect_db() -> None:
    global client, db, fs, db_ok
    if not settings.mongodb_uri:
        logger.warning("MONGODB_URI not set — running without database")
        db_ok = False
        return
    try:
        client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
        await client.admin.command("ping")
        db = client[settings.db_name]
        fs = AsyncIOMotorGridFSBucket(db, bucket_name="media")
        db_ok = True
        logger.info("MongoDB connected (%s)", settings.db_name)
    except Exception as exc:  # noqa: BLE001
        logger.warning("MongoDB unavailable: %s", exc)
        client = None
        db = None
        fs = None
        db_ok = False


async def close_db() -> None:
    global client, db, fs, db_ok
    if client:
        client.close()
    client = None
    db = None
    fs = None
    db_ok = False


def get_db() -> AsyncIOMotorDatabase | None:
    return db


def get_fs() -> AsyncIOMotorGridFSBucket | None:
    return fs


def collection(name: str) -> Any:
    if db is None:
        return None
    return db[name]
