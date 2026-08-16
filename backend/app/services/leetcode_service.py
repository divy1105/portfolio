from __future__ import annotations

from typing import Any

import httpx

from app.config import settings
from app.services.cache_service import cache_get, cache_set


def fallback_stats() -> dict[str, Any]:
    return {
        "username": settings.leetcode_username or None,
        "ranking": None,
        "totalSolved": 0,
        "easySolved": 0,
        "mediumSolved": 0,
        "hardSolved": 0,
        "reputation": 0,
        "contestRating": None,
        "contestsAttended": 0,
        "topContests": [],
        "source": "fallback",
    }


async def fetch_leetcode_stats() -> dict[str, Any]:
    username = settings.leetcode_username.strip()
    if not username:
        stats = fallback_stats()
        await cache_set("leetcode_stats", stats)
        return stats

    query = """
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking reputation }
        submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
      }
      userContestRanking(username: $username) {
        rating attendedContestsCount
      }
      userContestRankingHistory(username: $username) {
        contest { title }
        ranking rating
      }
    }
    """
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(
                "https://leetcode.com/graphql",
                json={"query": query, "variables": {"username": username}},
                headers={"Content-Type": "application/json", "Referer": "https://leetcode.com"},
            )
            res.raise_for_status()
            data = res.json().get("data") or {}
        user = data.get("matchedUser") or {}
        profile = user.get("profile") or {}
        subs = (user.get("submitStatsGlobal") or {}).get("acSubmissionNum") or []
        counts = {s.get("difficulty"): s.get("count", 0) for s in subs}
        contest = data.get("userContestRanking") or {}
        history = data.get("userContestRankingHistory") or []
        top = sorted(
            [h for h in history if h.get("ranking")],
            key=lambda h: h.get("ranking") or 10**9,
        )[:5]
        stats = {
            "username": user.get("username") or username,
            "ranking": profile.get("ranking"),
            "totalSolved": counts.get("All", 0),
            "easySolved": counts.get("Easy", 0),
            "mediumSolved": counts.get("Medium", 0),
            "hardSolved": counts.get("Hard", 0),
            "reputation": profile.get("reputation", 0),
            "contestRating": contest.get("rating"),
            "contestsAttended": contest.get("attendedContestsCount", 0),
            "topContests": [
                {
                    "title": (t.get("contest") or {}).get("title"),
                    "ranking": t.get("ranking"),
                    "rating": t.get("rating"),
                }
                for t in top
            ],
            "source": "leetcode",
        }
    except Exception:  # noqa: BLE001
        stats = fallback_stats()
    await cache_set("leetcode_stats", stats)
    return stats


async def get_cached_leetcode() -> dict[str, Any]:
    return (await cache_get("leetcode_stats")) or fallback_stats()
