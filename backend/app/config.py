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
    VERSION: str = "2.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str = (
        os.getenv("NETRISK_DATABASE_URL") 
        or os.getenv("DATABASE_URL") 
        or f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
    )

    @field_validator("DATABASE_URL", mode="after")
    @classmethod
    def resolve_sqlite_url(cls, v: str) -> str:
        if v.startswith("sqlite://"):
            # Normalize /app/data container paths
            if "/app/data" in v or "app/data" in v:
                return "sqlite:////app/data/netrisk.db"
            
            if v.startswith("sqlite:////"):
                raw_path = "/" + v[11:]
            elif v.startswith("sqlite:///"):
                raw_path = v[10:]
            else:
                raw_path = v[9:]

            # Absolute Unix path (/...) or Windows drive path (C:/...)
            if raw_path.startswith("/") or (len(raw_path) > 1 and raw_path[1] == ":"):
                if raw_path.startswith("/"):
                    return f"sqlite:////{raw_path.lstrip('/')}"
                return f"sqlite:///{raw_path}"

            path_obj = Path(raw_path)
            if path_obj.is_absolute():
                return f"sqlite:///{path_obj.as_posix()}"

            if "netrisk.db" in raw_path.lower() and not raw_path.startswith("data"):
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
