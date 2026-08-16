from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.database as database
import app.redis_client as redis_client
from app.config import settings
from app.database import close_db, connect_db
from app.middlewares.request_logging import RequestLoggingMiddleware
from app.redis_client import close_redis, connect_redis
from app.routes import admin, analytics, auth, contact, github, leetcode, media, profile, projects


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    await connect_redis()
    yield
    await close_redis()
    await close_db()


app = FastAPI(title="Divy Makwana Portfolio API", lifespan=lifespan)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(profile.router)
app.include_router(projects.router)
app.include_router(github.router)
app.include_router(leetcode.router)
app.include_router(contact.router)
app.include_router(analytics.router)
app.include_router(media.router)


@app.get("/")
async def root():
    return {"ok": True, "service": "divy-portfolio-api"}


@app.get("/api/health")
async def health():
    return {
        "api": "ok",
        "database": "ok" if database.db_ok else "down",
        "redis": "ok" if redis_client.redis_ok else "down",
    }
