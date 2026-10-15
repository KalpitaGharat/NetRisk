import pytest
from app.services.recommendation_engine import RecommendationEngine

def test_highest_and_second_highest_selection():
    # Setup inputs favor Spiral: high Sec (90), high AI (95), high Threat (80), Ops (70), Req (30)
    result = RecommendationEngine.evaluate(
        security_criticality=90.0,
        ai_complexity=95.0,
        requirement_uncertainty=30.0,
        threat_volatility=80.0,
        operational_criticality=70.0,
        compliance_requirement=60.0,
        team_experience=70.0,
    )

    assert result["recommended_model"] == "Spiral"
    assert result["recommended_score"] >= result["alternative_score"]
    assert result["alternative_model"] != result["recommended_model"]
    assert len(result["ranked_models"]) == 5
    assert result["ranked_models"][0]["model"] == result["recommended_model"]
    assert result["ranked_models"][1]["model"] == result["alternative_model"]

def test_explanation_generation_content():
    result = RecommendationEngine.evaluate(
        security_criticality=85.0,
        ai_complexity=90.0,
        requirement_uncertainty=40.0,
        threat_volatility=85.0,
        operational_criticality=80.0,
        compliance_requirement=75.0,
        team_experience=65.0,
    )
    explanation = result["explanation"]
    assert isinstance(explanation, str)
    assert len(explanation) > 50
    assert result["recommended_model"] in explanation
    assert result["alternative_model"] in explanation
    assert f"{result['recommended_score']:.2f}%" in explanation

def test_responsiveness_to_factor_shifts():
    # In a scenario with near-zero requirements uncertainty and stable threats, Waterfall should excel
    waterfall_scenario = RecommendationEngine.evaluate(
        security_criticality=20.0,
        ai_complexity=20.0,
        requirement_uncertainty=5.0,
        threat_volatility=5.0,
        operational_criticality=20.0,
        compliance_requirement=30.0,
        team_experience=90.0,
    )
    assert waterfall_scenario["recommended_model"] == "Waterfall"
    assert waterfall_scenario["recommended_score"] >= 90.0

    # If requirements and threats spike dramatically, Waterfall must plunge and Agile/DevSecOps rise
    volatile_scenario = RecommendationEngine.evaluate(
        security_criticality=20.0,
        ai_complexity=20.0,
        requirement_uncertainty=95.0,
        threat_volatility=95.0,
        operational_criticality=20.0,
        compliance_requirement=30.0,
        team_experience=90.0,
    )
    assert volatile_scenario["recommended_model"] != "Waterfall"
    assert volatile_scenario["sdlc_scores"]["Waterfall"] <= 10.0

def test_contributing_factors_and_practices():
    result = RecommendationEngine.evaluate(
        security_criticality=90.0,
        ai_complexity=80.0,
        requirement_uncertainty=70.0,
        threat_volatility=85.0,
        operational_criticality=80.0,
        compliance_requirement=75.0,
        team_experience=30.0,
    )
    assert len(result["contributing_factors"]) == 7
    # Top factor has highest weighted contribution
    assert result["contributing_factors"][0]["weighted_contribution"] >= result["contributing_factors"][-1]["weighted_contribution"]

    # Low experience (<60) should trigger team practice
    practices = result["development_practices"]
    factors_covered = [p["factor"] for p in practices]
    assert "Security Criticality" in factors_covered
    assert "AI/ML Complexity" in factors_covered
    assert "Team Experience" in factors_covered
