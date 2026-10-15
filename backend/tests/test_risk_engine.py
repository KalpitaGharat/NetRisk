import pytest
from app.services.risk_engine import RiskEngine

def test_all_zeros():
    # If all inputs are 0, Team Experience = 0 -> Team Risk = 100 - 0 = 100
    # Overall risk = 0*0.25 + 0*0.20 + 0*0.15 + 0*0.15 + 0*0.10 + 0*0.10 + 100*0.05 = 5.0
    score = RiskEngine.calculate_overall_risk(
        security_criticality=0.0,
        ai_complexity=0.0,
        requirement_uncertainty=0.0,
        threat_volatility=0.0,
        operational_criticality=0.0,
        compliance_requirement=0.0,
        team_experience=0.0,
    )
    assert score == 5.0
    assert RiskEngine.classify_risk(score) == "LOW"

def test_all_maximum_values():
    # If all inputs are 100 and Team Experience = 100 -> Team Risk = 0
    # Overall risk = 100*0.25 + 100*0.20 + 100*0.15 + 100*0.15 + 100*0.10 + 100*0.10 + 0*0.05 = 95.0
    # If Team Experience = 0, Team Risk = 100 -> Overall risk = 95 + 5 = 100.0
    score_exp_100 = RiskEngine.calculate_overall_risk(
        security_criticality=100.0,
        ai_complexity=100.0,
        requirement_uncertainty=100.0,
        threat_volatility=100.0,
        operational_criticality=100.0,
        compliance_requirement=100.0,
        team_experience=100.0,
    )
    assert score_exp_100 == 95.0
    assert RiskEngine.classify_risk(score_exp_100) == "VERY HIGH"

    score_exp_0 = RiskEngine.calculate_overall_risk(
        security_criticality=100.0,
        ai_complexity=100.0,
        requirement_uncertainty=100.0,
        threat_volatility=100.0,
        operational_criticality=100.0,
        compliance_requirement=100.0,
        team_experience=0.0,
    )
    assert score_exp_0 == 100.0
    assert RiskEngine.classify_risk(score_exp_0) == "VERY HIGH"

def test_normal_values():
    # Inputs: Sec=80, AI=70, Req=50, Threat=60, Ops=40, Comp=30, Exp=80 (Team Risk=20)
    # Expected: 80*0.25 + 70*0.20 + 50*0.15 + 60*0.15 + 40*0.10 + 30*0.10 + 20*0.05
    # = 20 + 14 + 7.5 + 9 + 4 + 3 + 1 = 58.5
    score = RiskEngine.calculate_overall_risk(
        security_criticality=80.0,
        ai_complexity=70.0,
        requirement_uncertainty=50.0,
        threat_volatility=60.0,
        operational_criticality=40.0,
        compliance_requirement=30.0,
        team_experience=80.0,
    )
    assert score == 58.5
    assert RiskEngine.classify_risk(score) == "HIGH"

def test_team_experience_effect():
    # Compare novice team vs expert team with identical project attributes
    base_params = {
        "security_criticality": 50.0,
        "ai_complexity": 50.0,
        "requirement_uncertainty": 50.0,
        "threat_volatility": 50.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 50.0,
    }
    score_novice = RiskEngine.calculate_overall_risk(**base_params, team_experience=0.0)
    score_expert = RiskEngine.calculate_overall_risk(**base_params, team_experience=100.0)

    # 100% experience difference should alter risk by exactly 5.0 points (0.05 weight)
    assert score_novice - score_expert == 5.0
    assert RiskEngine.calculate_team_risk(80.0) == 20.0
    assert RiskEngine.calculate_team_risk(20.0) == 80.0

def test_risk_classification_boundaries():
    assert RiskEngine.classify_risk(0.0) == "LOW"
    assert RiskEngine.classify_risk(30.0) == "LOW"
    assert RiskEngine.classify_risk(30.01) == "MODERATE"
    assert RiskEngine.classify_risk(50.0) == "MODERATE"
    assert RiskEngine.classify_risk(50.01) == "HIGH"
    assert RiskEngine.classify_risk(70.0) == "HIGH"
    assert RiskEngine.classify_risk(70.01) == "VERY HIGH"
    assert RiskEngine.classify_risk(100.0) == "VERY HIGH"

def test_risk_breakdown():
    breakdown = RiskEngine.get_risk_breakdown(
        security_criticality=80.0,
        ai_complexity=60.0,
        requirement_uncertainty=40.0,
        threat_volatility=50.0,
        operational_criticality=30.0,
        compliance_requirement=20.0,
        team_experience=70.0,
    )
    assert "values" in breakdown
    assert "weights" in breakdown
    assert "weighted_contributions" in breakdown
    assert breakdown["overall_score"] > 0
    assert breakdown["risk_level"] in ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
