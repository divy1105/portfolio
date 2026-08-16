from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def _formsubmit_ok(data: Any) -> tuple[bool, str]:
    """FormSubmit often returns HTTP 200 with success:false in JSON."""
    if not isinstance(data, dict):
        return False, "Unexpected FormSubmit response"
    raw = data.get("success")
    msg = str(data.get("message") or "")
    ok = raw is True or str(raw).lower() == "true"
    # First submit: activation mail was sent — treat as OK so the UI can guide the user
    if not ok and "activat" in msg.lower():
        return True, msg
    return ok, msg or ("OK" if ok else "FormSubmit rejected the submission")


async def send_contact_email(payload: dict[str, Any]) -> bool:
    """Send contact mail via FormSubmit (no API key)."""
    subject = payload.get("subject") or "Portfolio contact"
    name = payload.get("name") or "Someone"
    email = payload.get("email") or ""
    message = payload.get("message") or ""
    body = f"From: {name} <{email}>\n\n{message}"
    to_email = settings.admin_email

    if not to_email or "@" not in to_email or "example.com" in to_email:
        logger.warning("Contact email not sent — set ADMIN_EMAIL in backend/.env")
        return False

    # FormSubmit blocks requests that look like file:// / no Origin
    origin = "http://127.0.0.1:5174"
    if settings.cors_origins_list:
        origin = settings.cors_origins_list[0]

    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            res = await client.post(
                f"https://formsubmit.co/ajax/{to_email}",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Origin": origin,
                    "Referer": f"{origin.rstrip('/')}/",
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    ),
                },
                json={
                    "name": name,
                    "email": email,
                    "subject": f"[Portfolio] {subject}",
                    "message": body,
                    "_replyto": email,
                    "_template": "table",
                    "_captcha": "false",
                    "_url": origin,
                },
            )
            if res.is_error:
                logger.warning("FormSubmit HTTP %s: %s", res.status_code, res.text)
                return False

            try:
                data = res.json()
            except Exception:  # noqa: BLE001
                logger.warning("FormSubmit non-JSON body: %s", res.text[:300])
                return False

            ok, msg = _formsubmit_ok(data)
            if ok:
                logger.info("FormSubmit OK (%s): %s", to_email, msg)
                return True
            logger.warning("FormSubmit rejected: %s", msg)
            return False
    except Exception as exc:  # noqa: BLE001
        logger.warning("FormSubmit failed: %s", exc)
        return False
