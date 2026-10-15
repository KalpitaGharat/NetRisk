import sys
from pathlib import Path
import pytest

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.data_service import (
    get_all_projects,
    get_or_create_project,
    get_all_assessments,
    save_assessment,
    get_dashboard_summary,
    create_risk_distribution_donut,
    create_sdlc_distribution_bar,
    create_factor_radar_chart,
    create_sdlc_suitability_comparison_chart,
    create_timeline_trend_chart,
)
from backend.app.services.risk_engine import RiskEngine
from backend.app.services.sdlc_engine import SDLCEngine
from backend.app.services.recommendation_engine import RecommendationEngine


def test_get_all_projects():
    """Verify that projects can be retrieved from SQLite."""
    projects = get_all_projects()
    assert isinstance(projects, list)
    assert len(projects) >= 1
    sample = projects[0]
    assert "id" in sample
    assert "name" in sample


def test_get_or_create_project():
    """Verify idempotent project retrieval/creation."""
    proj_name = "Automated Test Project"
    proj = get_or_create_project(name=proj_name, description="Test description")
    assert proj.id is not None
    assert proj.name == proj_name

    # Retrieve again - must return same project
    proj_again = get_or_create_project(name=proj_name)
    assert proj_again.id == proj.id


def test_save_and_retrieve_assessment():
    """Test full assessment evaluation and persistence."""
    proj = get_or_create_project("Assessment Test Project")
    result = save_assessment(
        project_id=proj.id,
        security_criticality=85.0,
        ai_complexity=80.0,
        requirement_uncertainty=70.0,
        threat_volatility=75.0,
        operational_criticality=80.0,
        compliance_requirement=70.0,
        team_experience=70.0,
    )

    assert result["id"] is not None
    assert result["risk_score"] > 0
    assert result["risk_level"] in ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
    assert result["recommended_model"] in ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"]
    assert result["alternative_model"] in ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"]

    # Verify presence in all assessments
    all_assessments = get_all_assessments()
    ids = [a["id"] for a in all_assessments]
    assert result["id"] in ids


def test_dashboard_summary():
    """Verify summary KPIs calculation."""
    summary = get_dashboard_summary()
    assert summary["total_assessments"] >= 1
    assert summary["total_projects"] >= 1
    assert 0.0 <= summary["avg_risk_score"] <= 100.0
    assert summary["avg_risk_level"] in ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
    assert "risk_distribution" in summary
    assert "factor_averages" in summary


def test_chart_generation():
    """Verify Plotly figure generation functions."""
    summary = get_dashboard_summary()

    donut = create_risk_distribution_donut(summary["risk_distribution"])
    assert donut is not None
    assert hasattr(donut, "data")

    bar = create_sdlc_distribution_bar(summary["model_distribution"])
    assert bar is not None
    assert hasattr(bar, "data")

    radar = create_factor_radar_chart(summary["factor_averages"])
    assert radar is not None
    assert hasattr(radar, "data")

    scores = SDLCEngine.calculate_all_scores(80, 80, 70, 70, 80, 70)
    comp_chart = create_sdlc_suitability_comparison_chart(scores)
    assert comp_chart is not None
    assert hasattr(comp_chart, "data")

    # New screenshot matching visuals
    from services.data_service import (
        create_sdlc_comparison_bars,
        create_sdlc_radar_chart,
        create_circular_risk_gauge,
        get_assessment_by_id,
    )
    bars = create_sdlc_comparison_bars(scores)
    assert bars is not None
    assert hasattr(bars, "data")

    radar_sdlc = create_sdlc_radar_chart(scores)
    assert radar_sdlc is not None
    assert hasattr(radar_sdlc, "data")

    gauge = create_circular_risk_gauge(79.8, "VERY HIGH")
    assert gauge is not None
    assert hasattr(gauge, "data")

    # Assessment lookup
    assessments = get_all_assessments()
    if assessments:
        item = get_assessment_by_id(assessments[0]["id"])
        assert item is not None
        assert "explanation" in item
        assert "sdlc_scores" in item


def test_csv_export_format():
    """Verify DataFrame export capability."""
    assessments = get_all_assessments()
    import pandas as pd
    df = pd.DataFrame(assessments)
    csv_bytes = df.to_csv(index=False).encode("utf-8")
    assert len(csv_bytes) > 0
    assert b"security_criticality" in csv_bytes

