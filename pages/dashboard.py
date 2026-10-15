import sys
import json
from pathlib import Path
import streamlit as st

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.data_service import (
    get_all_assessments,
    get_assessment_by_id,
    create_sdlc_comparison_bars,
    create_sdlc_radar_chart,
    create_circular_risk_gauge,
)

# Fetch all assessments from repository
all_assessments = get_all_assessments()

if not all_assessments:
    st.subheader("Executive Decision Intelligence")
    st.info("No recorded system assessments available in the database. Run an evaluation from the New Assessment module to generate recommendations.")
    if st.button("Launch New Assessment", type="primary"):
        st.switch_page("pages/new_assessment.py")
    st.stop()

# Selector for assessment if multiple exist
assessment_options = {
    f"#{a['id']} — {a['project_name']} ({a['risk_level']} Risk)": a["id"]
    for a in all_assessments
}

selected_label = st.selectbox(
    "Active Assessment Record:",
    options=list(assessment_options.keys()),
    index=0,
    label_visibility="collapsed",
)
selected_id = assessment_options[selected_label]
active_assessment = get_assessment_by_id(selected_id)

if not active_assessment:
    st.error("Failed to load selected assessment data.")
    st.stop()

# Formatting timestamp
created_str = (
    active_assessment["created_at"].strftime("%m/%d/%Y, %I:%M:%S %p")
    if hasattr(active_assessment["created_at"], "strftime")
    else str(active_assessment["created_at"])[:19]
)

# Header Section
header_left, header_right = st.columns([2.6, 1.4])

with header_left:
    risk_level = active_assessment["risk_level"]
    badge_color = ":red-background" if risk_level == "VERY HIGH" else (":orange-background" if risk_level == "HIGH" else (":yellow-background" if risk_level == "MODERATE" else ":green-background"))
    
    st.markdown(f"### {active_assessment['project_name']}  {badge_color}[▪ {risk_level}]")
    st.caption(f"Evaluated on {created_str} • ID: #{active_assessment['id']}")

with header_right:
    btn1, btn2, btn3 = st.columns([1, 1, 1.2])
    with btn1:
        if st.button("Print Report", use_container_width=True):
            st.toast("Report ready for browser print (Ctrl+P / Cmd+P).")
    with btn2:
        json_str = json.dumps(active_assessment, default=str, indent=2)
        st.download_button(
            label="Export JSON",
            data=json_str,
            file_name=f"netrisk_assessment_{active_assessment['id']}.json",
            mime="application/json",
            use_container_width=True,
        )
    with btn3:
        if st.button("New Assessment", type="primary", use_container_width=True):
            st.switch_page("pages/new_assessment.py")

# Top Grid: Primary Recommended SDLC Model & Side Cards
col_primary, col_side = st.columns([1.75, 1])

# Left Large Card: Primary Recommendation
with col_primary:
    with st.container(border=True):
        p_head_left, p_head_right = st.columns([2, 1])
        with p_head_left:
            st.markdown(":cyan[**PRIMARY RECOMMENDED SDLC MODEL**]")
        with p_head_right:
            st.markdown(":green-background[Optimal Framework Match]")

        rec_model = active_assessment["recommended_model"]
        rec_score = active_assessment["recommended_score"]
        risk_score = active_assessment["risk_score"]

        st.markdown(f"## {rec_model}  :cyan[{rec_score:.1f}%]  :gray[SUITABILITY]")
        st.caption(f"Selected as the optimal lifecycle model balancing {rec_model} principles against the {risk_score:.1f}% calculated project risk profile.")

        # Nested Justification Box
        with st.container(border=True):
            st.markdown("**Explainable Decision Justification:**")
            st.markdown(f"*{active_assessment['explanation']}*")

# Right Column: Alternative Model & Overall Risk Donut
with col_side:
    # Alternative Model Card
    with st.container(border=True):
        st.markdown(":gray[**ALTERNATIVE MODEL**]")
        alt_model = active_assessment["alternative_model"]
        alt_score = active_assessment["alternative_score"]
        margin = round(rec_score - alt_score, 1)

        st.subheader(alt_model)
        st.markdown(f"#### :cyan[{alt_score:.1f}%]")
        st.caption(f"Delta: {margin:.1f}% score margin")

    # Overall Risk Donut Card
    with st.container(border=True):
        risk_fig = create_circular_risk_gauge(active_assessment["risk_score"], active_assessment["risk_level"])
        st.plotly_chart(risk_fig, use_container_width=True)

# Bottom Grid: SDLC Suitability Comparison Bar & Multilateral Radar
col_bars, col_radar = st.columns([1, 1])

with col_bars:
    with st.container(border=True):
        st.markdown(":cyan[**SDLC Suitability Score Comparison**]")
        st.caption("Comparative evaluation across all five Software Development Life Cycles")
        bars_fig = create_sdlc_comparison_bars(active_assessment["sdlc_scores"])
        st.plotly_chart(bars_fig, use_container_width=True)

with col_radar:
    with st.container(border=True):
        st.markdown(":cyan[**Multilateral Suitability Radar**]")
        st.caption("Topological footprint of SDLC trade-offs")
        radar_fig = create_sdlc_radar_chart(active_assessment["sdlc_scores"])
        st.plotly_chart(radar_fig, use_container_width=True)
