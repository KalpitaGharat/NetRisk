import pytest
from app.services.sdlc_engine import SDLCEngine

def test_waterfall_calculation():
    # If Req Uncertainty = 10, Threat Volatility = 20
    # Waterfall = ((100 - 10) * 0.50) + ((100 - 20) * 0.50) = 45 + 40 = 85.0
    score = SDLCEngine.calculate_waterfall_score(
        requirement_uncertainty=10.0,
        threat_volatility=20.0,
    )
    assert score == 85.0

    # If Req = 100, Threat = 100 -> 0
    assert SDLCEngine.calculate_waterfall_score(100.0, 100.0) == 0.0
    # If Req = 0, Threat = 0 -> 100
    assert SDLCEngine.calculate_waterfall_score(0.0, 0.0) == 100.0

def test_vmodel_calculation():
    # Security = 90, Ops = 80, Comp = 70
    # Score = 90*0.45 + 80*0.35 + 70*0.20 = 40.5 + 28.0 + 14.0 = 82.5
    score = SDLCEngine.calculate_vmodel_score(
        security_criticality=90.0,
        operational_criticality=80.0,
        compliance_requirement=70.0,
    )
    assert score == 82.5

    assert SDLCEngine.calculate_vmodel_score(0.0, 0.0, 0.0) == 0.0
    assert SDLCEngine.calculate_vmodel_score(100.0, 100.0, 100.0) == 100.0

def test_agile_calculation():
    # Req = 80, Threat = 70, AI = 60
    # Score = 80*0.45 + 70*0.35 + 60*0.20 = 36.0 + 24.5 + 12.0 = 72.5
    score = SDLCEngine.calculate_agile_score(
        requirement_uncertainty=80.0,
        threat_volatility=70.0,
        ai_complexity=60.0,
    )
    assert score == 72.5

    assert SDLCEngine.calculate_agile_score(0.0, 0.0, 0.0) == 0.0
    assert SDLCEngine.calculate_agile_score(100.0, 100.0, 100.0) == 100.0

def test_spiral_calculation():
    # Sec = 90, AI = 80, Threat = 70, Ops = 60, Req = 50
    # Score = 90*0.30 + 80*0.25 + 70*0.20 + 60*0.15 + 50*0.10
    # = 27.0 + 20.0 + 14.0 + 9.0 + 5.0 = 75.0
    score = SDLCEngine.calculate_spiral_score(
        security_criticality=90.0,
        ai_complexity=80.0,
        threat_volatility=70.0,
        operational_criticality=60.0,
        requirement_uncertainty=50.0,
    )
    assert score == 75.0

    assert SDLCEngine.calculate_spiral_score(0.0, 0.0, 0.0, 0.0, 0.0) == 0.0
    assert SDLCEngine.calculate_spiral_score(100.0, 100.0, 100.0, 100.0, 100.0) == 100.0

def test_devsecops_calculation():
    # Sec = 90, Threat = 80, Req = 70, Ops = 60, AI = 50
    # Score = 90*0.30 + 80*0.25 + 70*0.20 + 60*0.15 + 50*0.10
    # = 27.0 + 20.0 + 14.0 + 9.0 + 5.0 = 75.0
    score = SDLCEngine.calculate_devsecops_score(
        security_criticality=90.0,
        threat_volatility=80.0,
        requirement_uncertainty=70.0,
        operational_criticality=60.0,
        ai_complexity=50.0,
    )
    assert score == 75.0

    assert SDLCEngine.calculate_devsecops_score(0.0, 0.0, 0.0, 0.0, 0.0) == 0.0
    assert SDLCEngine.calculate_devsecops_score(100.0, 100.0, 100.0, 100.0, 100.0) == 100.0

def test_calculate_all_scores():
    all_scores = SDLCEngine.calculate_all_scores(
        security_criticality=85.0,
        ai_complexity=90.0,
        requirement_uncertainty=30.0,
        threat_volatility=75.0,
        operational_criticality=70.0,
        compliance_requirement=60.0,
    )
    assert len(all_scores) == 5
    for model_name in ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"]:
        assert model_name in all_scores
        assert 0.0 <= all_scores[model_name] <= 100.0
