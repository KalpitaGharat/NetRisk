from typing import Dict, Any

class RiskEngine:
    """
    Risk computation engine for AI-based Intrusion Detection Software.
    Weights adhere to the CIAP project specification:
      - Security Criticality: 25%
      - AI/ML Complexity: 20%
      - Requirement Uncertainty: 15%
      - Threat Volatility: 15%
      - Operational Criticality: 10%
      - Compliance Requirement: 10%
      - Team Risk: 5% (where Team Risk = 100 - Team Experience)
    """

    WEIGHTS: Dict[str, float] = {
        "security_criticality": 0.25,
        "ai_complexity": 0.20,
        "requirement_uncertainty": 0.15,
        "threat_volatility": 0.15,
        "operational_criticality": 0.10,
        "compliance_requirement": 0.10,
        "team_risk": 0.05,
    }

    FACTOR_METADATA: Dict[str, Dict[str, Any]] = {
        "security_criticality": {
            "name": "Security Criticality",
            "weight": 0.25,
            "weight_pct": "25%",
            "description": "Degree of confidentiality, integrity, and network protection required.",
        },
        "ai_complexity": {
            "name": "AI/ML Complexity",
            "weight": 0.20,
            "weight_pct": "20%",
            "description": "Intricacy of ML models, training pipelines, dataset drift, and false positive tuning.",
        },
        "requirement_uncertainty": {
            "name": "Requirement Uncertainty",
            "weight": 0.15,
            "weight_pct": "15%",
            "description": "Volatility and ambiguity in customer specifications or operational rules.",
        },
        "threat_volatility": {
            "name": "Threat Volatility",
            "weight": 0.15,
            "weight_pct": "15%",
            "description": "Frequency and sophistication of evolving zero-day exploits and attack vectors.",
        },
        "operational_criticality": {
            "name": "Operational Criticality",
            "weight": 0.10,
            "weight_pct": "10%",
            "description": "Severity of downtime, packet loss, latency impacts on mission-critical traffic.",
        },
        "compliance_requirement": {
            "name": "Compliance Requirement",
            "weight": 0.10,
            "weight_pct": "10%",
            "description": "Mandatory adherence to cybersecurity frameworks (NIST, ISO 27001, GDPR, HIPAA).",
        },
        "team_risk": {
            "name": "Team Risk (100 - Experience)",
            "weight": 0.05,
            "weight_pct": "5%",
            "description": "Risk inversely proportional to the team's familiarity with AI & cybersecurity.",
        },
    }

    @staticmethod
    def clamp(value: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
        """Clamp value between min_val and max_val."""
        return max(min_val, min(max_val, value))

    @classmethod
    def calculate_team_risk(cls, team_experience: float) -> float:
        """Calculate Team Risk = 100 - Team Experience."""
        clamped_exp = cls.clamp(team_experience)
        return round(100.0 - clamped_exp, 2)

    @classmethod
    def calculate_overall_risk(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
        team_experience: float,
    ) -> float:
        """
        Calculate overall project risk score:
        Overall Risk =
            Security * 0.25 +
            AI Complexity * 0.20 +
            Requirement Uncertainty * 0.15 +
            Threat Volatility * 0.15 +
            Operational Criticality * 0.10 +
            Compliance * 0.10 +
            Team Risk * 0.05
        """
        sec = cls.clamp(security_criticality)
        ai = cls.clamp(ai_complexity)
        req = cls.clamp(requirement_uncertainty)
        threat = cls.clamp(threat_volatility)
        ops = cls.clamp(operational_criticality)
        comp = cls.clamp(compliance_requirement)
        team_risk = cls.calculate_team_risk(team_experience)

        raw_score = (
            (sec * cls.WEIGHTS["security_criticality"])
            + (ai * cls.WEIGHTS["ai_complexity"])
            + (req * cls.WEIGHTS["requirement_uncertainty"])
            + (threat * cls.WEIGHTS["threat_volatility"])
            + (ops * cls.WEIGHTS["operational_criticality"])
            + (comp * cls.WEIGHTS["compliance_requirement"])
            + (team_risk * cls.WEIGHTS["team_risk"])
        )

        clamped_score = cls.clamp(raw_score)
        return round(clamped_score, 2)

    @staticmethod
    def classify_risk(risk_score: float) -> str:
        """
        Risk Classification categories:
          0-30: LOW
          31-50: MODERATE
          51-70: HIGH
          71-100: VERY HIGH
        """
        score = max(0.0, min(100.0, risk_score))
        if score <= 30.0:
            return "LOW"
        elif score <= 50.0:
            return "MODERATE"
        elif score <= 70.0:
            return "HIGH"
        else:
            return "VERY HIGH"

    @classmethod
    def get_risk_breakdown(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
        team_experience: float,
    ) -> Dict[str, Any]:
        """Produce itemized risk breakdown components and weighted contributions."""
        team_risk = cls.calculate_team_risk(team_experience)
        values = {
            "security_criticality": cls.clamp(security_criticality),
            "ai_complexity": cls.clamp(ai_complexity),
            "requirement_uncertainty": cls.clamp(requirement_uncertainty),
            "threat_volatility": cls.clamp(threat_volatility),
            "operational_criticality": cls.clamp(operational_criticality),
            "compliance_requirement": cls.clamp(compliance_requirement),
            "team_risk": team_risk,
        }

        weighted_contributions = {}
        for key, val in values.items():
            weighted_contributions[key] = round(val * cls.WEIGHTS[key], 2)

        overall_score = round(sum(weighted_contributions.values()), 2)
        overall_score = cls.clamp(overall_score)

        return {
            "values": values,
            "weights": cls.WEIGHTS,
            "weighted_contributions": weighted_contributions,
            "overall_score": overall_score,
            "risk_level": cls.classify_risk(overall_score),
            "team_experience": cls.clamp(team_experience),
        }
