import sys
from pathlib import Path
import streamlit as st
import pandas as pd

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header
from services.data_service import create_sdlc_ranking_bar
from backend.app.services.sdlc_engine import SDLCEngine

render_page_header(
    title="SDLC Model Comparison & Analytics",
    subtitle="Evaluate the five software engineering life cycle models, empirical formulas, and execute real-time sensitivity simulations.",
    category="Risk Analysis",
)

tab_sim, tab_math, tab_matrix = st.tabs([
    "Sensitivity Simulator",
    "Empirical Mathematical Formulations",
    "Comparative Decision Matrix",
])

# TAB 1: Simulator
with tab_sim:
    st.markdown("#### Real-Time Suitability Sensitivity Simulator")
    st.caption("Adjust inputs to observe real-time mathematical suitability shifts across all five models.")

    s_left, s_right = st.columns([1, 1])

    with s_left:
        with st.container(border=True):
            st.markdown("**Simulation Factor Inputs**")
            s_sec = st.slider("Security Criticality", 0.0, 100.0, 80.0, 5.0, key="sim_sec")
            s_ai = st.slider("AI/ML Complexity", 0.0, 100.0, 75.0, 5.0, key="sim_ai")
            s_req = st.slider("Requirement Uncertainty", 0.0, 100.0, 60.0, 5.0, key="sim_req")
            s_threat = st.slider("Threat Volatility", 0.0, 100.0, 85.0, 5.0, key="sim_threat")
            s_ops = st.slider("Operational Criticality", 0.0, 100.0, 70.0, 5.0, key="sim_ops")
            s_comp = st.slider("Compliance Requirement", 0.0, 100.0, 65.0, 5.0, key="sim_comp")

    scores = SDLCEngine.calculate_all_scores(
        security_criticality=s_sec,
        ai_complexity=s_ai,
        requirement_uncertainty=s_req,
        threat_volatility=s_threat,
        operational_criticality=s_ops,
        compliance_requirement=s_comp,
    )
    ranked = sorted(scores.items(), key=lambda x: -x[1])
    top_model, top_score = ranked[0]
    alt_model, alt_score = ranked[1]

    with s_right:
        with st.container(border=True):
            st.markdown(f"**Top Ranked Model:** `{top_model}` ({top_score:.1f}% Match)")
            st.caption(f"Alternative: `{alt_model}` ({alt_score:.1f}% Match)")
            fig_sim = create_sdlc_ranking_bar(scores, primary=top_model, alternative=alt_model)
            st.plotly_chart(fig_sim, use_container_width=True)

    st.markdown("#### Suitability Standings")
    cols = st.columns(5)
    for i, (m, sc) in enumerate(ranked):
        with cols[i]:
            with st.container(border=True):
                st.metric(f"Rank #{i+1}: {m}", f"{sc:.1f}%")

# TAB 2: Mathematical Models
with tab_math:
    st.markdown("#### Formal Empirical Multi-Criteria Formulations")
    st.caption("Each model is scored using empirical linear combinations of project risk characteristics.")

    for model_name, meta in SDLCEngine.MODEL_METADATA.items():
        with st.container(border=True):
            st.markdown(f"##### {model_name} Lifecycle Model")
            st.write(f"- **Primary Focus:** {meta['tagline']}")
            st.write(f"- **Target Application Profile:** {meta['ideal_for']}")
            st.write(f"- **Formula Definition:** `{meta['formula_description']}`")

            if model_name == "Waterfall":
                st.latex(r"S_{\text{Waterfall}} = 0.50 \cdot (100 - \text{Req Uncertainty}) + 0.50 \cdot (100 - \text{Threat Volatility})")
            elif model_name == "V-Model":
                st.latex(r"S_{\text{V-Model}} = 0.45 \cdot \text{Security} + 0.35 \cdot \text{Operational Criticality} + 0.20 \cdot \text{Compliance}")
            elif model_name == "Agile":
                st.latex(r"S_{\text{Agile}} = 0.45 \cdot \text{Req Uncertainty} + 0.35 \cdot \text{Threat Volatility} + 0.20 \cdot \text{AI Complexity}")
            elif model_name == "Spiral":
                st.latex(r"S_{\text{Spiral}} = 0.30 \cdot \text{Security} + 0.25 \cdot \text{AI Complexity} + 0.20 \cdot \text{Threat Volatility} + 0.15 \cdot \text{Operational} + 0.10 \cdot \text{Req Uncertainty}")
            elif model_name == "DevSecOps":
                st.latex(r"S_{\text{DevSecOps}} = 0.30 \cdot \text{Security} + 0.25 \cdot \text{Threat Volatility} + 0.20 \cdot \text{Req Uncertainty} + 0.15 \cdot \text{Operational} + 0.10 \cdot \text{AI Complexity}")

# TAB 3: Decision Matrix
with tab_matrix:
    st.markdown("#### Comparative Lifecycle Decision Matrix")
    matrix_rows = []
    for model_name, meta in SDLCEngine.MODEL_METADATA.items():
        matrix_rows.append({
            "SDLC Paradigm": model_name,
            "Primary Orientation": meta["tagline"],
            "Key Strengths": ", ".join(meta["key_strengths"]),
            "Inherent Vulnerabilities": ", ".join(meta["key_risks"]),
            "Suitability for AI-IDS": meta["ideal_for"],
        })
    st.dataframe(pd.DataFrame(matrix_rows), use_container_width=True, hide_index=True)
