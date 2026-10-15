import sys
from pathlib import Path
import streamlit as st

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from components.theme import apply_theme

st.set_page_config(
    page_title="NETRISK — Risk Intelligence Platform",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Apply global dark cybersecurity theme
apply_theme()

# Enterprise Navigation Schema
pages = {
    "OVERVIEW": [
        st.Page("pages/dashboard.py", title="Executive Dashboard", icon=":material/dashboard:", default=True),
    ],
    "RISK ANALYSIS": [
        st.Page("pages/new_assessment.py", title="New Assessment", icon=":material/shield:"),
        st.Page("pages/history.py", title="Assessment History", icon=":material/history:"),
        st.Page("pages/sdlc_comparison.py", title="SDLC Comparison", icon=":material/compare_arrows:"),
    ],
    "OPERATIONS": [
        st.Page("pages/jira_integration.py", title="Jira Integration", icon=":material/sync_alt:"),
        st.Page("pages/documentation.py", title="Documentation", icon=":material/menu_book:"),
        st.Page("pages/settings.py", title="Settings", icon=":material/settings:"),
    ],
}

pg = st.navigation(pages)

# Sidebar Brand Area
with st.sidebar:
    st.markdown("<h3 style='margin-bottom:0px;color:#4DE2E8;letter-spacing:1px;'>NETRISK</h3>", unsafe_allow_html=True)
    st.caption("RISK INTELLIGENCE PLATFORM · v1.0.0")
    st.markdown("---")

pg.run()

# Sidebar Footer Telemetry
with st.sidebar:
    st.markdown("---")
    st.caption("SYSTEM STATUS: :green[● OPERATIONAL]")
    st.caption("UN SDG 9 Aligned Infrastructure")

