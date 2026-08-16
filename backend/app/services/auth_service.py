import secrets

from app.config import settings
from app.utils.jwt_utils import create_access_token


def login(email: str, password: str) -> dict | None:
    if not (
        secrets.compare_digest(email.strip(), settings.admin_email.strip())
        and secrets.compare_digest(password, settings.admin_password)
    ):
        return None
    token = create_access_token(email.strip())
    return {"access_token": token, "token_type": "bearer"}
