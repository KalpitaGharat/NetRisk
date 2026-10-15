from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)

    # 7 Risk Parameters (0-100)
    security_criticality = Column(Float, nullable=False)
    ai_complexity = Column(Float, nullable=False)
    requirement_uncertainty = Column(Float, nullable=False)
    threat_volatility = Column(Float, nullable=False)
    operational_criticality = Column(Float, nullable=False)
    compliance_requirement = Column(Float, nullable=False)
    team_experience = Column(Float, nullable=False)

    # Risk Computation Results
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)

    # Recommendation Results
    recommended_model = Column(String(50), nullable=False)
    recommended_score = Column(Float, nullable=False)
    alternative_model = Column(String(50), nullable=False)
    alternative_score = Column(Float, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="assessments")
