from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, ConfigDict

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Unique or descriptive name of the AI IDS project")
    description: Optional[str] = Field(None, max_length=2000, description="Project scope or architectural context")
    category: Optional[str] = Field("AI-IDS Cybersecurity", max_length=100, description="Project domain or operational tier")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Project name cannot be empty or whitespace only")
        return stripped

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    updated_at: datetime
