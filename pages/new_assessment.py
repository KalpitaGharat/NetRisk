import sys
from pathlib import Path
import streamlit as st
import pandas as pd

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header, render_kpi_card
from services.data_service import (
    get_all_projects,
    get_or_create_project,
    save_assessment,
    create_sdlc_ranking_bar,
    create_factor_breakdown_bar,
    RISK_TIER_COLORS,
)
from backend.app.services.risk_engine import RiskEngine

render_page_header(
    title="New Risk Assessment",
    subtitle="Evaluate project risk dimensions and calculate mathematically optimal SDLC model suitability for AI-based intrusion detection software.",
    category="Risk Analysis",
)

# Session state initialization
if "last_submission_hash" not in st.session_state:
    st.session_state.last_submission_hash = None
if "active_result" not in st.session_state:
    st.session_state.active_result = None

# Reference Scenarios
PRESETS = {
    "Manual Custom Configuration": None,
    "Critical Infrastructure Deep-Packet IDS (Spiral)": {
        "security_criticality": 92.0,
        "ai_complexity": 88.0,
        "requirement_uncertainty": 65.0,
        "threat_volatility": 85.0,
        "operational_criticality": 95.0,
        "compliance_requirement": 90.0,
        "team_experience": 55.0,
    },
    "High-Velocity Cloud SOC Anomaly Detector (DevSecOps)": {
        "security_criticality": 85.0,
        "ai_complexity": 75.0,
        "requirement_uncertainty": 70.0,
        "threat_volatility": 92.0,
        "operational_criticality": 80.0,
        "compliance_requirement": 70.0,
        "team_experience": 85.0,
    },
    "Regulated Banking Infrastructure Sentinel (V-Model)": {
        "security_criticality": 90.0,
        "ai_complexity": 45.0,
        "requirement_uncertainty": 30.0,
        "threat_volatility": 40.0,
        "operational_criticality": 95.0,
        "compliance_requirement": 95.0,
        "team_experience": 80.0,
    },
    "Exploratory AI Research Prototype (Agile)": {
        "security_criticality": 40.0,
        "ai_complexity": 85.0,
        "requirement_uncertainty": 90.0,
        "threat_volatility": 80.0,
        "operational_criticality": 35.0,
        "compliance_requirement": 25.0,
        "team_experience": 75.0,
    },
    "Deterministic Legacy Signature Matcher (Waterfall)": {
        "security_criticality": 45.0,
        "ai_complexity": 20.0,
        "requirement_uncertainty": 15.0,
        "threat_volatility": 20.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 60.0,
        "team_experience": 80.0,
    },
}

with st.container(border=True):
    st.markdown("**Reference Baseline Scenario**")
    selected_preset_name = st.selectbox(
        "Load baseline configuration (optional):",
        options=list(PRESETS.keys()),
        index=0,
    )
    current_preset = PRESETS.get(selected_preset_name)

with st.container(border=True):
    st.markdown("**System Entity Metadata**")
    existing_projects = get_all_projects()
    project_options = ["Register New System..."] + [p["name"] for p in existing_projects]

    p_col1, p_col2 = st.columns(2)
    with p_col1:
        selected_proj = st.selectbox(
            "Target Project:",
            options=project_options,
            index=1 if len(project_options) > 1 else 0,
        )

    with p_col2:
        if selected_proj == "Register New System...":
            project_name = st.text_input("System Identifier / Name *", placeholder="e.g. Aegis Deep Packet Sentinel")
            project_desc = st.text_input("Operational Context", placeholder="e.g. Boundary gateway anomaly detection")
        else:
            project_name = selected_proj
            matched = next((p for p in existing_projects if p["name"] == project_name), None)
            project_desc = matched["description"] if matched else ""
            st.text_input("Selected Project", value=project_name, disabled=True)

# Assessment Input Form
with st.container(border=True):
    st.markdown("**Multi-Dimensional Risk Parameters (0–100 Scale)**")
    st.caption("Empirical weighting rules: Security (25%), AI/ML (20%), Req. Uncertainty (15%), Threat Volatility (15%), Operational (10%), Compliance (10%), Team Risk (5%).")

    with st.form("new_assessment_form"):
        col_sec, col_ops = st.columns(2)

        with col_sec:
            st.markdown("**Security & Algorithmic Surface**")

            sec_val = current_preset["security_criticality"] if current_preset else 75.0
            sec_crit = st.slider("Security Criticality (25% Weight)", 0.0, 100.0, float(sec_val), 1.0, help=RiskEngine.FACTOR_METADATA["security_criticality"]["description"])

            ai_val = current_preset["ai_complexity"] if current_preset else 70.0
            ai_comp = st.slider("AI/ML Complexity (20% Weight)", 0.0, 100.0, float(ai_val), 1.0, help=RiskEngine.FACTOR_METADATA["ai_complexity"]["description"])

            req_val = current_preset["requirement_uncertainty"] if current_preset else 55.0
            req_unc = st.slider("Requirement Uncertainty (15% Weight)", 0.0, 100.0, float(req_val), 1.0, help=RiskEngine.FACTOR_METADATA["requirement_uncertainty"]["description"])

            threat_val = current_preset["threat_volatility"] if current_preset else 65.0
            threat_vol = st.slider("Threat Volatility (15% Weight)", 0.0, 100.0, float(threat_val), 1.0, help=RiskEngine.FACTOR_METADATA["threat_volatility"]["description"])

        with col_ops:
            st.markdown("**Operational & Personnel Surface**")

            ops_val = current_preset["operational_criticality"] if current_preset else 80.0
            ops_crit = st.slider("Operational Criticality (10% Weight)", 0.0, 100.0, float(ops_val), 1.0, help=RiskEngine.FACTOR_METADATA["operational_criticality"]["description"])

            comp_val = current_preset["compliance_requirement"] if current_preset else 70.0
            comp_req = st.slider("Compliance Mandates (10% Weight)", 0.0, 100.0, float(comp_val), 1.0, help=RiskEngine.FACTOR_METADATA["compliance_requirement"]["description"])

            team_val = current_preset["team_experience"] if current_preset else 60.0
            team_exp = st.slider("Team Experience (5% Weight)", 0.0, 100.0, float(team_val), 1.0, help="Team Risk = 100 - Experience.")

            team_risk_calc = 100.0 - team_exp
            st.caption(f"Calculated Team Risk Factor: **{team_risk_calc:.1f}%**")

        btn_col1, btn_col2 = st.columns([1, 1])
        with btn_col1:
            submit_action = st.form_submit_button(
                label="Execute Mathematical Assessment",
                type="primary",
                use_container_width=True,
            )
        with btn_col2:
            reset_action = st.form_submit_button(
                label="Reset Form Parameters",
                use_container_width=True,
            )

if reset_action:
    st.session_state.active_result = None
    st.session_state.last_submission_hash = None
    st.rerun()

if submit_action:
    if not project_name.strip():
        st.error("Project identifier is required before running the evaluation.")
    else:
        sig = f"{project_name.strip()}_{sec_crit}_{ai_comp}_{req_unc}_{threat_vol}_{ops_crit}_{comp_req}_{team_exp}"
        if st.session_state.last_submission_hash != sig:
            with st.spinner("Processing decision engine matrices..."):
                proj = get_or_create_project(name=project_name.strip(), description=project_desc.strip())
                res = save_assessment(
                    project_id=proj.id,
                    security_criticality=sec_crit,
                    ai_complexity=ai_comp,
                    requirement_uncertainty=req_unc,
                    threat_volatility=threat_vol,
                    operational_criticality=ops_crit,
                    compliance_requirement=comp_req,
                    team_experience=team_exp,
                )
                st.session_state.last_submission_hash = sig
                st.session_state.active_result = res
                st.session_state.active_result["project_name"] = proj.name
                st.success(f"Assessment record #{res['id']} successfully persisted to repository.")

# Render Results
if st.session_state.active_result:
    res = st.session_state.active_result
    st.divider()
    st.markdown(f"### Evaluation Results: {res.get('project_name', 'System')}")

    r1, r2, r3, r4 = st.columns(4)
    with r1:
        render_kpi_card(
            label="Overall Risk Score",
            value=f"{res['risk_score']:.2f}%",
            subtext=f"Risk Tier: {res['risk_level']}",
        )
    with r2:
        render_kpi_card(
            label="Primary Recommendation",
            value=res["recommended_model"],
            subtext=f"Suitability Score: {res['recommended_score']:.1f}%",
        )
    with r3:
        render_kpi_card(
            label="Alternative Model",
            value=res["alternative_model"],
            subtext=f"Suitability Score: {res['alternative_score']:.1f}%",
        )
    with r4:
        margin = round(res["recommended_score"] - res["alternative_score"], 2)
        render_kpi_card(
            label="Decision Margin",
            value=f"+{margin:.2f}%",
            subtext="Primary vs. alternative differential",
        )

    with st.container(border=True):
        st.markdown("**Evidence-Based Recommendation Justification**")
        st.write(res["explanation"])

    col_chart_left, col_chart_right = st.columns(2)
    with col_chart_left:
        with st.container(border=True):
            st.markdown("**SDLC Model Suitability Ranking**")
            fig_rank = create_sdlc_ranking_bar(res["sdlc_scores"], primary=res["recommended_model"], alternative=res["alternative_model"])
            st.plotly_chart(fig_rank, use_container_width=True)

    with col_chart_right:
        with st.container(border=True):
            st.markdown("**Evaluated Factor Profile**")
            profile_vals = res["risk_breakdown"]["values"]
            profile_vals["team_experience"] = res["risk_breakdown"]["team_experience"]
            fig_profile = create_factor_breakdown_bar(profile_vals)
            st.plotly_chart(fig_profile, use_container_width=True)

    tab_table, tab_directives = st.tabs(["Itemized Factor Contributions", "Recommended Engineering Directives"])

    with tab_table:
        breakdown_rows = []
        for factor_data in res["contributing_factors"]:
            breakdown_rows.append({
                "Risk Dimension": factor_data["name"],
                "Input Score": f"{factor_data['raw_value']:.1f}%",
                "Weight": factor_data["weight_pct"],
                "Contribution": f"{factor_data['weighted_contribution']:.2f}%",
                "Severity": factor_data["severity"],
            })
        st.dataframe(pd.DataFrame(breakdown_rows), use_container_width=True, hide_index=True)

    with tab_directives:
        for directive in res["development_practices"]:
            with st.container(border=True):
                st.markdown(f"**{directive['factor']}:** {directive['recommendation']}")
                st.write(directive["details"])
