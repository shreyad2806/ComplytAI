from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded from the environment or a local .env file."""

    model_config = SettingsConfigDict(env_file=".env.local", extra="ignore")

    openai_api_key: str = Field(min_length=1)
    crewai_model: str = "gpt-4.1-mini"
    crewai_temperature: float = Field(default=0.1, ge=0, le=2)
    crewai_max_document_chars: int = Field(default=60_000, ge=1_000, le=200_000)
    pinecone_api_key: str | None = None
    pinecone_index_host: str | None = None
    pinecone_namespace: str = "complyt-reports"
    pinecone_top_k: int = Field(default=3, ge=1, le=10)
    openai_embedding_model: str = "text-embedding-3-small"


@lru_cache
def get_settings() -> Settings:
    return Settings()
