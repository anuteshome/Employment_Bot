from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tech Vision Telegram Bot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # Database Credentials & Connection Configuration
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "tele_bot"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/tele_bot"

    # Security & Telegram Authentication
    BOT_TOKEN: str = "8900865091:AAG0VWAkv4y_YNf9T-FQq9fWF1UDSg823hE"
    WEBAPP_URL: str = "https://tele-bot-nine-chi.vercel.app"
    JWT_SECRET: str = "23b4aaa5c57f23c4a14ada7baa8840269694e05207cbd3b5ad47a4194759b2ad"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days (10080 minutes)

    # CORS Origins
    CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
