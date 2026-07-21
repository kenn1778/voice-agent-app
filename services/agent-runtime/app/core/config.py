"""Application configuration loaded from environment variables."""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = False
    log_level: str = "INFO"
    aws_region: str = "us-east-1"
    nova_sonic_model_id: str = "amazon.nova-sonic-v1"
    nova_pro_model_id: str = "amazon.nova-pro-v1"
    session_timeout_seconds: int = 600

    class Config:
        env_file = ".env"

settings = Settings()
