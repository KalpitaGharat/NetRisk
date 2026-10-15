from typing import Dict, Any

class SDLCEngine:
    """
    Suitability scoring engine for SDLC models applied to AI-based Intrusion Detection Systems.
    Evaluates 5 classic and modern paradigms:
      1. Waterfall
      2. V-Model
      3. Agile
      4. Spiral
      5. DevSecOps
    """

    MODEL_METADATA: Dict[str, Dict[str, Any]] = {
        "Waterfall": {
            "name": "Waterfall",
            "tagline": "Sequential & Predictable Linear Development",
            "ideal_for": "Stable threat landscapes with fixed, non-volatile intrusion signatures and deterministic regulatory rules.",
            "formula_description": "50% (100 - Req Uncertainty) + 50% (100 - Threat Volatility)",
            "key_strengths": ["Rigid phase gates", "Comprehensive upfront design", "Predictable documentation"],
            "key_risks": ["Inflexible to zero-day emergence", "Late integration and testing", "Poor fit for heuristic AI experimentation"],
        },
        "V-Model": {
            "name": "V-Model",
            "tagline": "Verification and Validation Focused Lifecycle",
            "ideal_for": "High security criticality, high operational uptime, and strict compliance certification.",
            "formula_description": "45% Security Criticality + 35% Operational Criticality + 20% Compliance Requirement",
            "key_strengths": ["Early test planning alongside architecture", "Rigorous validation traceability", "Defect containment before deployment"],
            "key_risks": ["Low agility when attack vectors mutate", "Costly scope modifications mid-stream"],
        },
        "Agile": {
            "name": "Agile",
            "tagline": "Iterative, Adaptable & Feature-Driven Delivery",
            "ideal_for": "Fast-changing attack vectors, evolving customer expectations, and rapid exploratory AI development.",
            "formula_description": "45% Requirement Uncertainty + 35% Threat Volatility + 20% AI/ML Complexity",
            "key_strengths": ["Rapid sprints responding to zero-days", "Continuous stakeholder feedback", "Heuristic model experimentation"],
            "key_risks": ["Potential security debt if testing is postponed", "Less structured formal compliance audits"],
        },
        "Spiral": {
            "name": "Spiral",
            "tagline": "Risk-Driven Incremental Prototyping",
            "ideal_for": "Complex AI algorithms (deep learning/neural anomaly detection) paired with severe mission criticality.",
            "formula_description": "30% Security + 25% AI Complexity + 20% Threat Volatility + 15% Operational Criticality + 10% Requirement Uncertainty",
            "key_strengths": ["Dedicated risk analysis phase per loop", "Iterative ML benchmark refinement", "Structured containment of technical unknowns"],
            "key_risks": ["High process overhead", "Requires specialized risk assessment expertise", "Can become prolonged without strict milestones"],
        },
        "DevSecOps": {
            "name": "DevSecOps",
            "tagline": "Continuous Integration, Delivery & Automated Security Pipeline",
            "ideal_for": "High-velocity production environments with volatile external threats needing automated SAST/DAST and MLOps.",
            "formula_description": "30% Security + 25% Threat Volatility + 20% Req Uncertainty + 15% Operational Criticality + 10% AI Complexity",
            "key_strengths": ["Automated security testing in CI/CD", "Instant deployment of threat signatures/model weights", "Continuous monitoring and telemetry"],
            "key_risks": ["High initial tooling investment", "Requires mature DevOps and MLOps culture"],
        },
    }

    @staticmethod
    def clamp(value: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
        """Clamp value between min_val and max_val and round to 2 decimal places."""
        clamped = max(min_val, min(max_val, value))
        return round(clamped, 2)

    @classmethod
    def calculate_waterfall_score(
        cls,
        requirement_uncertainty: float,
        threat_volatility: float,
    ) -> float:
        """
        Waterfall Suitability:
        ((100 - Requirement Uncertainty) * 0.50) + ((100 - Threat Volatility) * 0.50)
        """
        req_stability = 100.0 - cls.clamp(requirement_uncertainty)
        threat_stability = 100.0 - cls.clamp(threat_volatility)
        score = (req_stability * 0.50) + (threat_stability * 0.50)
        return cls.clamp(score)

    @classmethod
    def calculate_vmodel_score(
        cls,
        security_criticality: float,
        operational_criticality: float,
        compliance_requirement: float,
    ) -> float:
        """
        V-Model Suitability:
        (Security Criticality * 0.45) + (Operational Criticality * 0.35) + (Compliance Requirement * 0.20)
        """
        sec = cls.clamp(security_criticality)
        ops = cls.clamp(operational_criticality)
        comp = cls.clamp(compliance_requirement)
        score = (sec * 0.45) + (ops * 0.35) + (comp * 0.20)
        return cls.clamp(score)

    @classmethod
    def calculate_agile_score(
        cls,
        requirement_uncertainty: float,
        threat_volatility: float,
        ai_complexity: float,
    ) -> float:
        """
        Agile Suitability:
        (Requirement Uncertainty * 0.45) + (Threat Volatility * 0.35) + (AI/ML Complexity * 0.20)
        """
        req = cls.clamp(requirement_uncertainty)
        threat = cls.clamp(threat_volatility)
        ai = cls.clamp(ai_complexity)
        score = (req * 0.45) + (threat * 0.35) + (ai * 0.20)
        return cls.clamp(score)

    @classmethod
    def calculate_spiral_score(
        cls,
        security_criticality: float,
        ai_complexity: float,
        threat_volatility: float,
        operational_criticality: float,
        requirement_uncertainty: float,
    ) -> float:
        """
        Spiral Suitability:
        (Security Criticality * 0.30) +
        (AI/ML Complexity * 0.25) +
        (Threat Volatility * 0.20) +
        (Operational Criticality * 0.15) +
        (Requirement Uncertainty * 0.10)
        """
        sec = cls.clamp(security_criticality)
        ai = cls.clamp(ai_complexity)
        threat = cls.clamp(threat_volatility)
        ops = cls.clamp(operational_criticality)
        req = cls.clamp(requirement_uncertainty)

        score = (
            (sec * 0.30)
            + (ai * 0.25)
            + (threat * 0.20)
            + (ops * 0.15)
            + (req * 0.10)
        )
        return cls.clamp(score)

    @classmethod
    def calculate_devsecops_score(
        cls,
        security_criticality: float,
        threat_volatility: float,
        requirement_uncertainty: float,
        operational_criticality: float,
        ai_complexity: float,
    ) -> float:
        """
        DevSecOps Suitability:
        (Security Criticality * 0.30) +
        (Threat Volatility * 0.25) +
        (Requirement Uncertainty * 0.20) +
        (Operational Criticality * 0.15) +
        (AI/ML Complexity * 0.10)
        """
        sec = cls.clamp(security_criticality)
        threat = cls.clamp(threat_volatility)
        req = cls.clamp(requirement_uncertainty)
        ops = cls.clamp(operational_criticality)
        ai = cls.clamp(ai_complexity)

        score = (
            (sec * 0.30)
            + (threat * 0.25)
            + (req * 0.20)
            + (ops * 0.15)
            + (ai * 0.10)
        )
        return cls.clamp(score)

    @classmethod
    def calculate_all_scores(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
    ) -> Dict[str, float]:
        """Calculate suitability scores for all 5 SDLC models."""
        return {
            "Waterfall": cls.calculate_waterfall_score(
                requirement_uncertainty=requirement_uncertainty,
                threat_volatility=threat_volatility,
            ),
            "V-Model": cls.calculate_vmodel_score(
                security_criticality=security_criticality,
                operational_criticality=operational_criticality,
                compliance_requirement=compliance_requirement,
            ),
            "Agile": cls.calculate_agile_score(
                requirement_uncertainty=requirement_uncertainty,
                threat_volatility=threat_volatility,
                ai_complexity=ai_complexity,
            ),
            "Spiral": cls.calculate_spiral_score(
                security_criticality=security_criticality,
                ai_complexity=ai_complexity,
                threat_volatility=threat_volatility,
                operational_criticality=operational_criticality,
                requirement_uncertainty=requirement_uncertainty,
            ),
            "DevSecOps": cls.calculate_devsecops_score(
                security_criticality=security_criticality,
                threat_volatility=threat_volatility,
                requirement_uncertainty=requirement_uncertainty,
                operational_criticality=operational_criticality,
                ai_complexity=ai_complexity,
            ),
        }
