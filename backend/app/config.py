from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env.local",
        extra="ignore",
    )

    ollama_base_url: str = Field(
    default="http://127.0.0.1:11434",
    alias="OLLAMA_BASE_URL",
)

    crewai_model: str = Field(
        default="ollama/qwen2.5:3b",
        alias="CREWAI_MODEL",
    )

    crewai_temperature: float = Field(
        default=0.1,
        alias="CREWAI_TEMPERATURE",
    )

    crewai_max_document_chars: int = Field(
        default=60000,
        alias="CREWAI_MAX_DOCUMENT_CHARS",
    )

    pinecone_api_key: str | None = Field(default=None, alias="PINECONE_API_KEY")
    pinecone_index_host: str | None = Field(default=None, alias="PINECONE_INDEX_HOST")
    pinecone_namespace: str = Field(default="complyt-reports", alias="PINECONE_NAMESPACE")
    pinecone_top_k: int = Field(default=3, alias="PINECONE_TOP_K")


@lru_cache
def get_settings() -> Settings:
    return Settings()
