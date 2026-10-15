from typing import Dict, Any, List, Tuple
from .risk_engine import RiskEngine
from .sdlc_engine import SDLCEngine

class RecommendationEngine:
    """
    Explainable Recommendation Engine for SDLC Model Selection in AI IDS projects.
    Synthesizes risk metrics, evaluates SDLC suitability scores, selects primary and
    alternative models, and generates evidence-based justifications and development practices.
    """

    @classmethod
    def analyze_contributing_factors(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
        team_experience: float,
    ) -> List[Dict[str, Any]]:
        """Identify key risk drivers ranked by weighted impact."""
        breakdown = RiskEngine.get_risk_breakdown(
            security_criticality=security_criticality,
            ai_complexity=ai_complexity,
            requirement_uncertainty=requirement_uncertainty,
            threat_volatility=threat_volatility,
            operational_criticality=operational_criticality,
            compliance_requirement=compliance_requirement,
            team_experience=team_experience,
        )

        contributions = breakdown["weighted_contributions"]
        values = breakdown["values"]

        factor_details = []
        for factor_key, weighted_val in contributions.items():
            meta = RiskEngine.FACTOR_METADATA.get(factor_key, {})
            name = meta.get("name", factor_key.replace("_", " ").title())
            raw_val = values.get(factor_key, 0.0)
            factor_details.append({
                "key": factor_key,
                "name": name,
                "raw_value": raw_val,
                "weight_pct": meta.get("weight_pct", "0%"),
                "weighted_contribution": weighted_val,
                "severity": (
                    "CRITICAL" if raw_val >= 75
                    else "HIGH" if raw_val >= 50
                    else "MODERATE" if raw_val >= 30
                    else "LOW"
                ),
            })

        # Rank by weighted contribution descending
        factor_details.sort(key=lambda x: x["weighted_contribution"], reverse=True)
        return factor_details

    @classmethod
    def generate_practices(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
        team_experience: float,
    ) -> List[Dict[str, str]]:
        """
        Dynamically synthesize recommended software engineering practices
        based on project risk profile.
        """
        practices: List[Dict[str, str]] = []

        if security_criticality >= 50.0:
            practices.append({
                "factor": "Security Criticality",
                "recommendation": "Integrate security testing throughout development.",
                "details": f"Given high security criticality ({security_criticality:.1f}%), embed automated SAST, DAST, and dependency vulnerability scanning into the pipeline.",
            })

        if ai_complexity >= 50.0:
            practices.append({
                "factor": "AI/ML Complexity",
                "recommendation": "Perform continuous model validation and monitoring.",
                "details": f"Given AI/ML complexity ({ai_complexity:.1f}%), establish MLOps tracking for data drift, concept drift, adversarial evasion testing, and false positive calibration.",
            })

        if threat_volatility >= 50.0:
            practices.append({
                "factor": "Threat Volatility",
                "recommendation": "Use iterative threat modelling and frequent security reviews.",
                "details": f"With high threat volatility ({threat_volatility:.1f}%), conduct regular STRIDE/MITRE ATT&CK threat modeling and recurring red-team adversary emulation.",
            })

        if requirement_uncertainty >= 50.0:
            practices.append({
                "factor": "Requirement Uncertainty",
                "recommendation": "Use incremental requirements refinement.",
                "details": f"To address requirement volatility ({requirement_uncertainty:.1f}%), utilize short prototyping cadences, user story backlogs, and stakeholder feedback loops.",
            })

        if operational_criticality >= 50.0:
            practices.append({
                "factor": "Operational Criticality",
                "recommendation": "Perform extensive verification and failure-impact analysis.",
                "details": f"For mission-critical uptime ({operational_criticality:.1f}%), conduct packet-drop stress tests, latency profiling, and formal Failure Mode and Effects Analysis (FMEA).",
            })

        if compliance_requirement >= 50.0:
            practices.append({
                "factor": "Compliance Requirement",
                "recommendation": "Maintain traceability and compliance documentation.",
                "details": f"With stringent compliance mandates ({compliance_requirement:.1f}%), build bidirectional requirement-to-test matrices and automated audit logging for NIST/ISO/GDPR.",
            })

        if team_experience < 60.0:
            team_risk = 100.0 - team_experience
            practices.append({
                "factor": "Team Experience",
                "recommendation": "Implement peer code reviews, pair programming, and specialized security/ML training.",
                "details": f"With team experience at {team_experience:.1f}% (team risk {team_risk:.1f}%), institute senior architectural oversight, threat simulation workshops, and peer verification.",
            })

        # Baseline guarantee if all metrics are low
        if not practices:
            practices.append({
                "factor": "Standard Quality Assurance",
                "recommendation": "Follow structured standard testing and modular code organization.",
                "details": "With stable, low-risk project attributes, adhere to conventional unit testing, integration suites, and standard revision control.",
            })

        return practices

    @classmethod
    def generate_explanation(
        cls,
        recommended_model: str,
        recommended_score: float,
        alternative_model: str,
        alternative_score: float,
        risk_score: float,
        risk_level: str,
        inputs: Dict[str, float],
    ) -> str:
        """
        Generate dynamic, explainable justification customized to specific input parameters
        and model scoring rationale.
        """
        sec = inputs.get("security_criticality", 0.0)
        ai = inputs.get("ai_complexity", 0.0)
        req = inputs.get("requirement_uncertainty", 0.0)
        threat = inputs.get("threat_volatility", 0.0)
        ops = inputs.get("operational_criticality", 0.0)
        comp = inputs.get("compliance_requirement", 0.0)

        # Highlight key contributing characteristics
        prominent_traits = []
        if sec >= 60:
            prominent_traits.append(f"high security criticality ({sec:.1f}%)")
        elif sec <= 30:
            prominent_traits.append(f"low security sensitivity ({sec:.1f}%)")

        if ai >= 60:
            prominent_traits.append(f"complex AI/ML model dynamics ({ai:.1f}%)")
        elif ai <= 30:
            prominent_traits.append(f"straightforward AI algorithmic requirements ({ai:.1f}%)")

        if threat >= 60:
            prominent_traits.append(f"significant threat volatility ({threat:.1f}%)")
        elif threat <= 30:
            prominent_traits.append(f"a stable threat environment ({threat:.1f}%)")

        if req >= 60:
            prominent_traits.append(f"high requirement uncertainty ({req:.1f}%)")
        elif req <= 30:
            prominent_traits.append(f"well-defined, stable specifications ({req:.1f}%)")

        if ops >= 60:
            prominent_traits.append(f"mission-critical operational reliability ({ops:.1f}%)")

        if comp >= 60:
            prominent_traits.append(f"strict compliance constraints ({comp:.1f}%)")

        traits_summary = ", ".join(prominent_traits) if prominent_traits else "balanced project characteristics"

        # Model-specific explanation builders
        if recommended_model == "Spiral":
            explanation = (
                f"Spiral is recommended (Suitability Score: {recommended_score:.2f}%) because the project "
                f"exhibits {traits_summary} with an overall {risk_level} risk profile ({risk_score:.2f}%). "
                f"In AI-based intrusion detection, high algorithmic uncertainty and severe security consequences "
                f"benefit directly from Spiral's risk-driven iterative cycles, allowing the team to conduct explicit "
                f"risk analysis, prototype complex anomaly detection models, and resolve operational uncertainties before heavy engineering."
            )
        elif recommended_model == "DevSecOps":
            explanation = (
                f"DevSecOps is recommended (Suitability Score: {recommended_score:.2f}%) because the project "
                f"demonstrates {traits_summary}. The combination of rapid threat emergence and critical security demands "
                f"requires an automated CI/CD pipeline where security checks (SAST, DAST, container scanning) and continuous "
                f"model monitoring are integrated directly into development, ensuring real-time response to mutating zero-day exploits."
            )
        elif recommended_model == "V-Model":
            explanation = (
                f"V-Model is recommended (Suitability Score: {recommended_score:.2f}%) because the system demands "
                f"{traits_summary}. The V-Model establishes explicit verification and validation phases paired directly with each "
                f"architectural specification tier, ensuring rigorous verification, compliance traceability, and fail-safe network operational reliability."
            )
        elif recommended_model == "Agile":
            explanation = (
                f"Agile is recommended (Suitability Score: {recommended_score:.2f}%) because the project is driven by "
                f"{traits_summary}. Rapid iterations and short sprint cadences allow the team to pivot flexibly as requirements "
                f"evolve and novel attack vectors surface, prioritizing feature velocity and exploratory heuristic experimentation."
            )
        elif recommended_model == "Waterfall":
            explanation = (
                f"Waterfall is recommended (Suitability Score: {recommended_score:.2f}%) because the project is characterized by "
                f"{traits_summary}. With minimal requirement volatility and a stable threat landscape, a linear sequential approach "
                f"provides straightforward governance, predictable milestone schedules, and complete upfront architectural documentation."
            )
        else:
            explanation = (
                f"{recommended_model} is recommended with a score of {recommended_score:.2f}%, outperforming alternatives based on "
                f"the project's specific risk dimensions."
            )

        margin = round(recommended_score - alternative_score, 2)
        explanation += (
            f" As a secondary alternative, {alternative_model} scored {alternative_score:.2f}% "
            f"(a differential of {margin:.2f}%), offering an adaptable contingency should development priorities shift."
        )

        return explanation

    @classmethod
    def evaluate(
        cls,
        security_criticality: float,
        ai_complexity: float,
        requirement_uncertainty: float,
        threat_volatility: float,
        operational_criticality: float,
        compliance_requirement: float,
        team_experience: float,
    ) -> Dict[str, Any]:
        """
        Complete end-to-end evaluation pipeline:
          1. Calculate overall project risk
          2. Classify risk level
          3. Calculate all SDLC model suitability scores
          4. Sort and select top (recommended) and runner-up (alternative)
          5. Synthesize explainable justification
          6. Generate contributing factors
          7. Generate recommended engineering practices
        """
        inputs = {
            "security_criticality": security_criticality,
            "ai_complexity": ai_complexity,
            "requirement_uncertainty": requirement_uncertainty,
            "threat_volatility": threat_volatility,
            "operational_criticality": operational_criticality,
            "compliance_requirement": compliance_requirement,
            "team_experience": team_experience,
        }

        # 1 & 2. Risk Calculation and Classification
        risk_score = RiskEngine.calculate_overall_risk(**inputs)
        risk_level = RiskEngine.classify_risk(risk_score)

        # 3. SDLC Scores
        sdlc_scores = SDLCEngine.calculate_all_scores(
            security_criticality=security_criticality,
            ai_complexity=ai_complexity,
            requirement_uncertainty=requirement_uncertainty,
            threat_volatility=threat_volatility,
            operational_criticality=operational_criticality,
            compliance_requirement=compliance_requirement,
        )

        # 4. Sort and select primary and secondary
        # Sort descending by score; if tied, alphabetical stability
        sorted_models: List[Tuple[str, float]] = sorted(
            sdlc_scores.items(), key=lambda item: (-item[1], item[0])
        )

        recommended_model, recommended_score = sorted_models[0]
        alternative_model, alternative_score = sorted_models[1]

        # 5. Dynamic Explanation
        explanation = cls.generate_explanation(
            recommended_model=recommended_model,
            recommended_score=recommended_score,
            alternative_model=alternative_model,
            alternative_score=alternative_score,
            risk_score=risk_score,
            risk_level=risk_level,
            inputs=inputs,
        )

        # 6. Contributing Factors
        contributing_factors = cls.analyze_contributing_factors(**inputs)

        # 7. Recommended Practices
        development_practices = cls.generate_practices(**inputs)

        # Complete detailed risk breakdown
        risk_breakdown = RiskEngine.get_risk_breakdown(**inputs)

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommended_model": recommended_model,
            "recommended_score": recommended_score,
            "alternative_model": alternative_model,
            "alternative_score": alternative_score,
            "sdlc_scores": sdlc_scores,
            "ranked_models": [{"model": m, "score": s} for m, s in sorted_models],
            "explanation": explanation,
            "contributing_factors": contributing_factors,
            "development_practices": development_practices,
            "risk_breakdown": risk_breakdown,
        }
