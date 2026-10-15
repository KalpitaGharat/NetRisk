import os
from pathlib import Path
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = PROJECT_ROOT / "database" / "netrisk.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "NETRISK"
    PROJECT_FULL_TITLE: str = "Risk-Aware SDLC Model Selection for AI-Based Intrusion Detection Software"
    VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.as_posix()}")

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def resolve_sqlite_url(cls, v: str) -> str:
        if v.startswith("sqlite:///"):
            raw_path = v.replace("sqlite:///", "")
            path_obj = Path(raw_path)
            if not path_obj.is_absolute():
                if "netrisk" in raw_path.lower():
                    resolved = (PROJECT_ROOT / "database" / "netrisk.db").resolve()
                else:
                    resolved = (PROJECT_ROOT / path_obj).resolve()
                return f"sqlite:///{resolved.as_posix()}"
        return v
    CORS_ORIGINS: List[str] = [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://localhost:3000",
        "*"
    ]
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Atlassian Integrations
    JIRA_BASE_URL: str = "https://sakec-team-bcq481n1.atlassian.net"
    JIRA_EMAIL: str = ""
    JIRA_API_TOKEN: str = ""
    JIRA_PROJECT_KEY: str = "NRASS"
    CONFLUENCE_SPACE_KEY: str = "NRSS"

    model_config = {
        "env_file": [
            str(PROJECT_ROOT / "backend" / ".env"),
            str(PROJECT_ROOT / ".env"),
            ".env",
        ],
        "extra": "allow",
    }

settings = Settings()
