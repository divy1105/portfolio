from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    mongodb_uri: str = ""
    db_name: str = "portfolio"
    admin_email: str = "admin@example.com"
    admin_password: str = "changeme"
    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    github_username: str = "divy1105"
    github_token: str = ""
    leetcode_username: str = ""
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    redis_url: str = ""
    resume_uri: str = (
        "https://drive.google.com/file/d/1quRrPeAvFvs2sSuZMzze2EcbODkOqdm2/view?usp=sharing"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
