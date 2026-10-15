import sys
from pathlib import Path
import streamlit as st

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header

render_page_header(
    title="System Documentation & Specifications",
    subtitle="Technical architecture, empirical risk modeling, and UN Sustainable Development Goal 9 alignment.",
    category="Operations",
)

tab_arch, tab_sdg, tab_weights, tab_models = st.tabs([
    "System Architecture",
    "UN SDG 9 Mandate",
    "Seven Risk Dimensions",
    "Decision Formulation",
])

with tab_arch:
    st.markdown("#### Modular Layered Architecture")
    with st.container(border=True):
        st.markdown("""
        **NETRISK** operates as an enterprise-grade decision intelligence platform:
        
        1. **User Interface Layer (Streamlit & Plotly):**
           - Pure Python reactive interface with native components and custom multi-page navigation.
           - Enterprise dark design system (`#0B0F14` background, `#101720` surface, `#273244` borders, `#22D3EE` cyan accent).
           - Plotly data visualizations (ranking charts, horizontal distribution bars, surface breakdowns).
        
        2. **Multi-Criteria Analytical Core:**
           - `RiskEngine`: Computes normalized multi-factor project risk index ($0–100\%$) across seven dimensions.
           - `SDLCEngine`: Implements deterministic linear suitability models across five paradigms (Waterfall, V-Model, Agile, Spiral, DevSecOps).
           - `RecommendationEngine`: Synthesizes primary/alternative rankings, confidence differentials, and natural-language explainable justifications.
        
        3. **Relational Persistence Layer (SQLAlchemy 2.0 & SQLite):**
           - Normalized relational database at `database/netrisk.db`.
           - Entities for `projects` and `assessments` with cascading foreign keys and timestamps.
        
        4. **Integration Layer (Atlassian REST v3 & Agile):**
           - `JiraService`: Bidirectional ticket tracking for project `NRASS`.
           - `ConfluenceService`: Automated space documentation generation for `NRSS`.
        """)

with tab_sdg:
    st.markdown("#### Alignment with UN Sustainable Development Goal 9")
    with st.container(border=True):
        st.markdown("""
        ### Target 9.1 & 9.4: Resilient Infrastructure & Upgraded Technological Capabilities
        
        - **Critical Digital Infrastructure:** Artificial Intelligence-based Intrusion Detection Systems (AI-IDS) protect the digital perimeter of telecommunications networks, electrical utilities, financial transaction networks, and smart cities.
        - **Mitigating Software Engineering Failure:** A lifecycle failure in AI cybersecurity software (such as skipping verification in high-risk environments, or delaying updates in mutating attack surfaces) threatens critical national infrastructure.
        - **NETRISK Contribution:** By replacing informal or dogmatic SDLC selection with empirical, mathematically grounded risk evaluation, NETRISK ensures software development processes match system vulnerability characteristics, directly reinforcing infrastructure resilience.
        """)

with tab_weights:
    st.markdown("#### Seven Software Project Risk Dimensions")
    st.markdown("""
    | Risk Dimension | Formula Weight | Description |
    | :--- | :---: | :--- |
    | **Security Criticality** | **25%** | Confidentiality, integrity, and availability impact of network intrusion or breach. |
    | **AI/ML Complexity** | **20%** | Intricacy of training pipelines, dataset drift, adversarial evasion risk, and false positive rates. |
    | **Requirement Uncertainty** | **15%** | Ambiguity and anticipated volatility in specifications or operational threat rules. |
    | **Threat Volatility** | **15%** | Frequency and sophistication of mutating zero-day exploits and attack surfaces. |
    | **Operational Criticality** | **10%** | Permissible downtime, packet drop tolerance, and line-rate latency constraints. |
    | **Compliance Requirement** | **10%** | Mandatory adherence to cybersecurity frameworks (e.g. NIST, ISO 27001, SOC 2, HIPAA). |
    | **Team Risk** | **5%** | Inversely proportional to team experience: $\\text{Team Risk} = 100 - \\text{Team Experience}$. |
    """)

    st.markdown("##### Overall Risk Index Equation")
    st.latex(r"\text{Overall Risk} = \sum_{i=1}^{7} (W_i \times F_i) = 0.25 S + 0.20 A + 0.15 R + 0.15 T + 0.10 O + 0.10 C + 0.05 (100 - E)")

    st.markdown("""
    ##### Risk Classification Boundaries
    - **LOW:** $0.00\% - 30.00\%$
    - **MODERATE:** $30.01\% - 50.00\%$
    - **HIGH:** $50.01\% - 70.00\%$
    - **VERY HIGH:** $70.01\% - 100.00\%$
    """)

with tab_models:
    st.markdown("#### Decision-Support Methodology")
    with st.container(border=True):
        st.markdown("""
        1. **No Universal SDLC Paradigm:**
           - No lifecycle model is universally optimal. Agile excels in rapid exploratory heuristic prototyping but introduces severe vulnerability debt when applied uncritically to mission-critical infrastructure where formal verification (V-Model) is required.
        
        2. **Dual-Model Recommendation:**
           - NETRISK produces both a **Primary Recommendation** and an **Alternative Model**, equipping engineering leads with contingency options calibrated to organizational capacity.
        
        3. **Transparent & Deterministic Justifications:**
           - Every recommendation is accompanied by an explainable natural-language justification dynamically generated from the dominant risk dimensions identified in the assessment.
        """)
