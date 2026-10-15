import sys
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import pandas as pd
import plotly.graph_objects as go

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.database import SessionLocal, init_db
from backend.app.models.project import Project
from backend.app.models.assessment import Assessment
from backend.app.services.risk_engine import RiskEngine
from backend.app.services.sdlc_engine import SDLCEngine
from backend.app.services.recommendation_engine import RecommendationEngine

# Executive Dark Theme Palette (matching reference screenshot)
BG_DARK = "#060B13"
SURFACE_CARD = "#0C1424"
SURFACE_ELEVATED = "#111C30"
BORDER_COLOR = "#1E2B45"
TEXT_PRIMARY = "#FFFFFF"
TEXT_SECONDARY = "#94A3B8"
ACCENT_CYAN = "#00F0FF"
ACCENT_BLUE = "#38BDF8"
COLOR_SUCCESS = "#10B981"
COLOR_WARNING = "#F59E0B"
COLOR_HIGH = "#F97316"
COLOR_CRITICAL = "#EF4444"

RISK_TIER_COLORS = {
    "LOW": COLOR_SUCCESS,
    "MODERATE": COLOR_WARNING,
    "HIGH": COLOR_HIGH,
    "VERY HIGH": COLOR_CRITICAL,
}

# Exact matching colors from reference screenshot
SDLC_MODEL_COLORS = {
    "Waterfall": "#38BDF8",  # Sky blue
    "V-Model": "#00F0FF",    # Bright electric cyan
    "Agile": "#10B981",      # Emerald green
    "Spiral": "#F59E0B",     # Amber orange
    "DevSecOps": "#EF4444",  # Crimson red
}


def get_db_session():
    """Obtain a new database session."""
    init_db()
    return SessionLocal()


def get_all_projects() -> List[Dict[str, Any]]:
    """Retrieve all projects ordered by name."""
    db = get_db_session()
    try:
        projects = db.query(Project).order_by(Project.name.asc()).all()
        return [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description or "",
                "category": p.category or "AI-IDS Cybersecurity",
                "created_at": p.created_at,
                "assessment_count": len(p.assessments),
            }
            for p in projects
        ]
    finally:
        db.close()


def get_or_create_project(name: str, description: str = "", category: str = "AI-IDS Cybersecurity") -> Project:
    """Find an existing project or create a new one."""
    db = get_db_session()
    try:
        project = db.query(Project).filter(Project.name == name.strip()).first()
        if not project:
            project = Project(
                name=name.strip(),
                description=description.strip(),
                category=category.strip(),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(project)
            db.commit()
            db.refresh(project)
        return project
    finally:
        db.close()


def get_all_assessments() -> List[Dict[str, Any]]:
    """Retrieve all assessments joined with project metadata, ordered newest first."""
    db = get_db_session()
    try:
        assessments = (
            db.query(Assessment, Project.name.label("project_name"))
            .join(Project, Assessment.project_id == Project.id)
            .order_by(Assessment.created_at.desc(), Assessment.id.desc())
            .all()
        )
        results = []
        for a, proj_name in assessments:
            results.append({
                "id": a.id,
                "project_id": a.project_id,
                "project_name": proj_name,
                "security_criticality": a.security_criticality,
                "ai_complexity": a.ai_complexity,
                "requirement_uncertainty": a.requirement_uncertainty,
                "threat_volatility": a.threat_volatility,
                "operational_criticality": a.operational_criticality,
                "compliance_requirement": a.compliance_requirement,
                "team_experience": a.team_experience,
                "risk_score": a.risk_score,
                "risk_level": a.risk_level,
                "recommended_model": a.recommended_model,
                "recommended_score": a.recommended_score,
                "alternative_model": a.alternative_model,
                "alternative_score": a.alternative_score,
                "created_at": a.created_at,
            })
        return results
    finally:
        db.close()


def get_assessment_by_id(assessment_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve a single assessment by ID with complete evaluation metadata."""
    assessments = get_all_assessments()
    matched = next((a for a in assessments if a["id"] == assessment_id), None)
    if not matched:
        return None

    # Compute full evaluation bundle
    eval_bundle = RecommendationEngine.evaluate(
        security_criticality=matched["security_criticality"],
        ai_complexity=matched["ai_complexity"],
        requirement_uncertainty=matched["requirement_uncertainty"],
        threat_volatility=matched["threat_volatility"],
        operational_criticality=matched["operational_criticality"],
        compliance_requirement=matched["compliance_requirement"],
        team_experience=matched["team_experience"],
    )
    eval_bundle["id"] = matched["id"]
    eval_bundle["project_id"] = matched["project_id"]
    eval_bundle["project_name"] = matched["project_name"]
    eval_bundle["created_at"] = matched["created_at"]
    return eval_bundle


def save_assessment(
    project_id: int,
    security_criticality: float,
    ai_complexity: float,
    requirement_uncertainty: float,
    threat_volatility: float,
    operational_criticality: float,
    compliance_requirement: float,
    team_experience: float,
) -> Dict[str, Any]:
    """Execute recommendation engine evaluation and persist to SQLite."""
    eval_result = RecommendationEngine.evaluate(
        security_criticality=security_criticality,
        ai_complexity=ai_complexity,
        requirement_uncertainty=requirement_uncertainty,
        threat_volatility=threat_volatility,
        operational_criticality=operational_criticality,
        compliance_requirement=compliance_requirement,
        team_experience=team_experience,
    )

    db = get_db_session()
    try:
        assessment_record = Assessment(
            project_id=project_id,
            security_criticality=security_criticality,
            ai_complexity=ai_complexity,
            requirement_uncertainty=requirement_uncertainty,
            threat_volatility=threat_volatility,
            operational_criticality=operational_criticality,
            compliance_requirement=compliance_requirement,
            team_experience=team_experience,
            risk_score=eval_result["risk_score"],
            risk_level=eval_result["risk_level"],
            recommended_model=eval_result["recommended_model"],
            recommended_score=eval_result["recommended_score"],
            alternative_model=eval_result["alternative_model"],
            alternative_score=eval_result["alternative_score"],
            created_at=datetime.now(timezone.utc),
        )
        db.add(assessment_record)
        db.commit()
        db.refresh(assessment_record)

        eval_result["id"] = assessment_record.id
        eval_result["project_id"] = assessment_record.project_id
        eval_result["created_at"] = assessment_record.created_at
        return eval_result
    finally:
        db.close()


def get_dashboard_summary() -> Dict[str, Any]:
    """Calculate executive KPIs and aggregate metrics for the dashboard."""
    assessments = get_all_assessments()
    projects = get_all_projects()

    total_assessments = len(assessments)
    total_projects = len(projects)

    if total_assessments == 0:
        return {
            "total_assessments": 0,
            "total_projects": total_projects,
            "high_risk_count": 0,
            "avg_risk_score": 0.0,
            "avg_risk_level": "N/A",
            "top_model": "N/A",
            "top_model_count": 0,
            "risk_distribution": {"LOW": 0, "MODERATE": 0, "HIGH": 0, "VERY HIGH": 0},
            "model_distribution": {},
            "factor_averages": {},
            "recent_assessments": [],
            "df": pd.DataFrame(),
        }

    df = pd.DataFrame(assessments)
    avg_risk = round(float(df["risk_score"].mean()), 2)
    avg_risk_level = RiskEngine.classify_risk(avg_risk)
    high_risk_count = int(df["risk_level"].isin(["HIGH", "VERY HIGH"]).sum())

    model_counts = df["recommended_model"].value_counts().to_dict()
    top_model = df["recommended_model"].mode()[0] if not df.empty else "N/A"
    top_model_count = int(model_counts.get(top_model, 0))

    risk_counts = df["risk_level"].value_counts().to_dict()
    risk_distribution = {
        tier: int(risk_counts.get(tier, 0))
        for tier in ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
    }

    factor_cols = [
        "security_criticality",
        "ai_complexity",
        "requirement_uncertainty",
        "threat_volatility",
        "operational_criticality",
        "compliance_requirement",
        "team_experience",
    ]
    factor_averages = {
        col: round(float(df[col].mean()), 1)
        for col in factor_cols
    }

    return {
        "total_assessments": total_assessments,
        "total_projects": total_projects,
        "high_risk_count": high_risk_count,
        "avg_risk_score": avg_risk,
        "avg_risk_level": avg_risk_level,
        "top_model": top_model,
        "top_model_count": top_model_count,
        "risk_distribution": risk_distribution,
        "model_distribution": model_counts,
        "factor_averages": factor_averages,
        "recent_assessments": assessments[:5],
        "df": df,
    }


def create_sdlc_comparison_bars(sdlc_scores: Dict[str, float]) -> go.Figure:
    """Generate the horizontal bar chart matching the reference screenshot."""
    models_order = ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"]
    # Reversing order so Waterfall is on top
    models_rev = list(reversed(models_order))
    scores_rev = [sdlc_scores.get(m, 0.0) for m in models_rev]
    colors_rev = [SDLC_MODEL_COLORS.get(m, ACCENT_BLUE) for m in models_rev]

    fig = go.Figure(data=[
        go.Bar(
            y=models_rev,
            x=scores_rev,
            orientation="h",
            marker=dict(
                color=colors_rev,
                line=dict(color="rgba(255,255,255,0.06)", width=1),
            ),
            hoverinfo="y+x",
        )
    ])

    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=10, r=20, t=10, b=30),
        xaxis=dict(
            range=[0, 100],
            dtick=25,
            ticksuffix="%",
            color=TEXT_SECONDARY,
            gridcolor=BORDER_COLOR,
            zeroline=False,
        ),
        yaxis=dict(
            color=TEXT_PRIMARY,
            tickfont=dict(size=12, color=TEXT_PRIMARY),
        ),
        height=270,
    )
    return fig


def create_sdlc_radar_chart(sdlc_scores: Dict[str, float]) -> go.Figure:
    """Generate the Multilateral Suitability Radar matching the reference screenshot."""
    models = ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"]
    scores = [sdlc_scores.get(m, 0.0) for m in models]
    # Close polygon
    scores.append(scores[0])
    categories = models + [models[0]]

    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=scores,
        theta=categories,
        fill="toself",
        fillcolor="rgba(0, 240, 255, 0.18)",
        line=dict(color=ACCENT_CYAN, width=2.5),
        marker=dict(size=6, color="#38bdf8"),
        name="Suitability",
    ))

    fig.update_layout(
        polar=dict(
            bgcolor="rgba(12, 20, 36, 0.4)",
            radialaxis=dict(
                visible=True,
                range=[0, 100],
                color=TEXT_SECONDARY,
                gridcolor=BORDER_COLOR,
                linecolor=BORDER_COLOR,
                tickfont=dict(size=9, color=TEXT_SECONDARY),
            ),
            angularaxis=dict(
                color=TEXT_PRIMARY,
                gridcolor=BORDER_COLOR,
                linecolor=BORDER_COLOR,
                tickfont=dict(size=11, color=TEXT_PRIMARY),
            ),
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=35, r=35, t=20, b=25),
        height=270,
        showlegend=False,
    )
    return fig


def create_circular_risk_gauge(risk_score: float, risk_level: str) -> go.Figure:
    """Generate the circular ring progress donut matching the reference screenshot."""
    color = RISK_TIER_COLORS.get(risk_level, COLOR_CRITICAL)
    remainder = max(0.0, 100.0 - risk_score)

    fig = go.Figure(data=[
        go.Pie(
            values=[risk_score, remainder],
            hole=0.76,
            marker=dict(
                colors=[color, "rgba(255,255,255,0.06)"],
                line=dict(color=BG_DARK, width=2),
            ),
            sort=False,
            direction="clockwise",
            textinfo="none",
            hoverinfo="none",
        )
    ])

    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=5, r=5, t=5, b=5),
        annotations=[
            dict(
                text=f"<b style='font-size:20px;color:#ffffff'>{risk_score:.1f}%</b><br><span style='font-size:9px;color:#94a3b8;letter-spacing:1px'>OVERALL RISK</span>",
                x=0.5,
                y=0.5,
                showarrow=False,
            )
        ],
        height=130,
        showlegend=False,
    )
    return fig


def create_risk_distribution_bar(risk_dist: Dict[str, int]) -> go.Figure:
    """Generate horizontal bar chart of risk tiers."""
    tiers = ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
    counts = [risk_dist.get(t, 0) for t in tiers]
    colors = [RISK_TIER_COLORS[t] for t in tiers]

    fig = go.Figure(data=[
        go.Bar(
            y=tiers,
            x=counts,
            orientation="h",
            marker=dict(
                color=colors,
                line=dict(color=BORDER_COLOR, width=1),
            ),
            text=[f" {c}" if c > 0 else "" for c in counts],
            textposition="outside",
            textfont=dict(size=12, color=TEXT_PRIMARY),
            hoverinfo="y+x",
        )
    ])

    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=10, r=30, t=10, b=25),
        xaxis=dict(
            title=dict(text="Assessment Count", font=dict(color=TEXT_SECONDARY, size=11)),
            color=TEXT_SECONDARY,
            gridcolor=BORDER_COLOR,
            dtick=1,
            zeroline=False,
        ),
        yaxis=dict(
            color=TEXT_PRIMARY,
            tickfont=dict(size=11, color=TEXT_PRIMARY),
            autorange="reversed",
        ),
        height=220,
    )
    return fig


def create_factor_breakdown_bar(factor_vals: Dict[str, float]) -> go.Figure:
    """Generate compact horizontal bar chart for the 7 risk dimensions."""
    display_names = [
        "Security Criticality",
        "AI/ML Complexity",
        "Requirement Uncertainty",
        "Threat Volatility",
        "Operational Criticality",
        "Compliance Mandates",
        "Team Experience",
    ]
    keys = [
        "security_criticality",
        "ai_complexity",
        "requirement_uncertainty",
        "threat_volatility",
        "operational_criticality",
        "compliance_requirement",
        "team_experience",
    ]
    vals = [factor_vals.get(k, 0.0) for k in keys]

    display_names_rev = list(reversed(display_names))
    vals_rev = list(reversed(vals))

    fig = go.Figure(data=[
        go.Bar(
            y=display_names_rev,
            x=vals_rev,
            orientation="h",
            marker=dict(
                color=ACCENT_BLUE,
                line=dict(color=BORDER_COLOR, width=1),
            ),
            text=[f" {v:.1f}%" for v in vals_rev],
            textposition="outside",
            textfont=dict(size=11, color=TEXT_PRIMARY),
            hoverinfo="y+x",
        )
    ])

    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=10, r=40, t=10, b=25),
        xaxis=dict(
            title=dict(text="Factor Score (0–100)", font=dict(color=TEXT_SECONDARY, size=11)),
            range=[0, 115],
            color=TEXT_SECONDARY,
            gridcolor=BORDER_COLOR,
        ),
        yaxis=dict(
            color=TEXT_PRIMARY,
            tickfont=dict(size=11, color=TEXT_PRIMARY),
        ),
        height=270,
    )
    return fig


# Aliases for backwards compatibility with test suites and pages
create_sdlc_ranking_bar = lambda scores, primary="", alternative="": create_sdlc_comparison_bars(scores)
create_risk_distribution_donut = create_risk_distribution_bar
create_sdlc_distribution_bar = lambda dist: create_sdlc_comparison_bars({m: float(c) for m, c in dist.items()})
create_factor_radar_chart = lambda factor_vals, title="": create_factor_breakdown_bar(factor_vals)
create_sdlc_suitability_comparison_chart = create_sdlc_comparison_bars
create_timeline_trend_chart = lambda df: None

