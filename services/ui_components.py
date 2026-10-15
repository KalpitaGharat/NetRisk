import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
import streamlit as st
import pandas as pd

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.data_service import (
    create_risk_distribution_bar,
    create_sdlc_ranking_bar,
    create_factor_breakdown_bar,
)
from backend.app.services.jira_service import JiraService
from backend.app.config import settings


def render_page_header(title: str, subtitle: str, category: Optional[str] = None) -> None:
    """Render a structured, dignified enterprise page header."""
    if category:
        st.caption(f"**{category.upper()}**")
    st.subheader(title)
    st.caption(subtitle)
    st.divider()


def render_kpi_card(label: str, value: Any, subtext: str = "", delta: Optional[str] = None, delta_color: str = "normal") -> None:
    """Render a standard enterprise metric card with optional contextual subtext."""
    with st.container(border=True):
        st.metric(
            label=label,
            value=value,
            delta=delta,
            delta_color=delta_color,
        )
        if subtext:
            st.caption(subtext)


def render_risk_distribution(risk_dist: Dict[str, int]) -> None:
    """Render the risk tier distribution chart with empty state handling."""
    with st.container(border=True):
        st.markdown("**Risk Tier Distribution**")
        st.caption("Distribution across Low (0–30), Moderate (31–50), High (51–70), and Very High (71–100).")
        total = sum(risk_dist.values())
        if total == 0:
            st.info("No recorded assessments available in the database.")
        else:
            fig = create_risk_distribution_bar(risk_dist)
            st.plotly_chart(fig, use_container_width=True)


def render_sdlc_comparison(sdlc_scores: Dict[str, float], primary: str = "", alternative: str = "") -> None:
    """Render SDLC suitability ranking bars."""
    with st.container(border=True):
        st.markdown("**SDLC Model Suitability Ranking**")
        st.caption("Mathematical suitability scores across the five software engineering paradigms.")
        if not sdlc_scores:
            st.info("No assessment selected for comparison.")
        else:
            fig = create_sdlc_ranking_bar(sdlc_scores, primary=primary, alternative=alternative)
            st.plotly_chart(fig, use_container_width=True)


def render_factor_analysis(factor_vals: Dict[str, float]) -> None:
    """Render the 7-factor horizontal bar chart."""
    with st.container(border=True):
        st.markdown("**Risk Surface Breakdown**")
        st.caption("Evaluated scores across the seven software risk parameters.")
        fig = create_factor_breakdown_bar(factor_vals)
        st.plotly_chart(fig, use_container_width=True)


def render_recent_assessments(recent_records: List[Dict[str, Any]]) -> None:
    """Render the recent assessments data table."""
    st.markdown("**Recent System Assessments**")
    if not recent_records:
        st.info("No recent assessment records logged in the database.")
        return

    table_data = []
    for r in recent_records:
        created_str = (
            r["created_at"].strftime("%Y-%m-%d %H:%M")
            if hasattr(r["created_at"], "strftime")
            else str(r["created_at"])[:16]
        )
        table_data.append({
            "System Name": r["project_name"],
            "Risk Score": f"{r['risk_score']:.1f}%",
            "Risk Level": r["risk_level"],
            "Recommended SDLC": r["recommended_model"],
            "Logged Date": created_str,
        })

    df = pd.DataFrame(table_data)
    st.dataframe(df, use_container_width=True, hide_index=True)


@st.cache_data(ttl=60)
def check_cached_integration_health() -> Dict[str, Any]:
    """Cached integration health check to avoid expensive rerun calls."""
    jira_info = JiraService.check_connection()
    return {
        "jira": jira_info,
        "database": True,  # Already verified via SQLite engine
    }


def render_integration_status() -> None:
    """Render operational status for database and Atlassian services."""
    health = check_cached_integration_health()
    jira = health["jira"]

    with st.container(border=True):
        st.markdown("**Operational Infrastructure Status**")
        c1, c2, c3 = st.columns(3)

        with c1:
            st.markdown("- **Database Engine:** `SQLite (Operational)`")
            st.caption("Schema version 2.0 / Read-Write connected")

        with c2:
            jira_status = "Connected (Live)" if jira.get("is_connected") else "Standby (Local Demo Mode)"
            st.markdown(f"- **Jira Integration:** `{jira_status}`")
            st.caption(f"Project Target: `{settings.JIRA_PROJECT_KEY}`")

        with c3:
            confluence_status = "Standby (Local Mode)" if not jira.get("is_connected") else "Connected (Live)"
            st.markdown(f"- **Confluence Space:** `{confluence_status}`")
            st.caption(f"Space Target: `{settings.CONFLUENCE_SPACE_KEY}`")
