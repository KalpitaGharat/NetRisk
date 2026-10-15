from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict

class AssessmentCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=255, description="Project name")
    description: Optional[str] = Field(None, max_length=2000, description="Project scope or context")
    category: Optional[str] = Field("AI-IDS Cybersecurity", max_length=100, description="Project category")

    security_criticality: float = Field(..., ge=0.0, le=100.0, description="Security Criticality (0-100)")
    ai_complexity: float = Field(..., ge=0.0, le=100.0, description="AI/ML Complexity (0-100)")
    requirement_uncertainty: float = Field(..., ge=0.0, le=100.0, description="Requirement Uncertainty (0-100)")
    threat_volatility: float = Field(..., ge=0.0, le=100.0, description="Threat Volatility (0-100)")
    operational_criticality: float = Field(..., ge=0.0, le=100.0, description="Operational Criticality (0-100)")
    compliance_requirement: float = Field(..., ge=0.0, le=100.0, description="Compliance Requirement (0-100)")
    team_experience: float = Field(..., ge=0.0, le=100.0, description="Team Experience (0-100)")

    @field_validator("project_name")
    @classmethod
    def validate_project_name(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Project name cannot be empty or blank")
        return s

class AssessmentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    project_name: str
    risk_score: float
    risk_level: str
    recommended_model: str
    recommended_score: float
    alternative_model: str
    alternative_score: float
    created_at: datetime

class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_id: int
    project_name: str
    description: Optional[str] = None
    category: Optional[str] = "AI-IDS Cybersecurity"

    # Input parameters
    security_criticality: float
    ai_complexity: float
    requirement_uncertainty: float
    threat_volatility: float
    operational_criticality: float
    compliance_requirement: float
    team_experience: float

    # Evaluated results
    risk_score: float
    risk_level: str
    recommended_model: str
    recommended_score: float
    alternative_model: str
    alternative_score: float

    # Extended explainable insights
    sdlc_scores: Dict[str, float]
    ranked_models: List[Dict[str, Any]]
    explanation: str
    contributing_factors: List[Dict[str, Any]]
    development_practices: List[Dict[str, str]]
    risk_breakdown: Dict[str, Any]

    created_at: datetime

class FactorMetric(BaseModel):
    key: str
    name: str
    weight: float
    weight_pct: float
    observed_avg: float
    weighted_contribution: float
    description: str

class SDLCModelFrequency(BaseModel):
    model: str
    count: int
    share_pct: float
    rank: int
    is_dominant: bool

class ActivityEvent(BaseModel):
    id: str
    event_type: str
    title: str
    description: str
    severity: str
    timestamp: str

class DashboardMetrics(BaseModel):
    total_assessments: int
    average_risk: float
    average_risk_level: str = "LOW"
    high_risk_count: int
    very_high_risk_count: int
    critical_projects_count: int = 0
    high_risk_percentage: float = 0.0
    most_recommended_sdlc: str
    most_recommended_count: int = 0
    most_recommended_share: float = 0.0
    sdlc_distribution: Dict[str, int]
    sdlc_ranking: List[SDLCModelFrequency] = []
    risk_level_distribution: Dict[str, int]
    risk_percentages: Dict[str, float] = {}
    factor_averages: List[FactorMetric] = []
    recent_assessments: List[AssessmentSummary]
    activity_feed: List[ActivityEvent] = []
    system_status: Dict[str, Any] = {}

class RiskWeightsResponse(BaseModel):
    weights: Dict[str, float]
    factors: Dict[str, Any]

class SDLCModelsResponse(BaseModel):
    models: Dict[str, Any]
