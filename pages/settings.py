import sys
from pathlib import Path
import streamlit as st

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header
from services.data_service import get_all_projects, get_all_assessments
from backend.app.config import settings

render_page_header(
    title="System Configuration & Diagnostics",
    subtitle="Inspect data repository integrity, Atlassian connection endpoints, and system parameters.",
    category="Operations",
)

with st.container(border=True):
    st.markdown("#### Database Repository Diagnostics")
    db_path = Path(settings.DATABASE_URL.replace("sqlite:///", ""))
    exists = db_path.exists()
    size_kb = (db_path.stat().st_size / 1024) if exists else 0.0

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Database Engine", "SQLite (Operational)" if exists else "Not Detected")
    with col2:
        st.metric("Storage Volume", f"{size_kb:.2f} KB")
    with col3:
        assessments = get_all_assessments()
        projects = get_all_projects()
        st.metric("Logged Records", f"{len(assessments)} Assessments | {len(projects)} Systems")

    st.caption(f"Physical Location: `{db_path.resolve()}`")

st.divider()

with st.container(border=True):
    st.markdown("#### Atlassian Integration Configuration")
    col_j1, col_j2 = st.columns(2)

    with col_j1:
        st.markdown("**Jira Cloud Target**")
        st.write(f"- Base Endpoint: `{settings.JIRA_BASE_URL}`")
        st.write(f"- Project Key: `{settings.JIRA_PROJECT_KEY}`")
        masked_token = "••••••••••••••••" if settings.JIRA_API_TOKEN else "(Unset - Demo Mode)"
        st.write(f"- Service Account: `{settings.JIRA_EMAIL or '(Unset - Demo Mode)'}`")
        st.write(f"- API Token: `{masked_token}`")

    with col_j2:
        st.markdown("**Confluence Knowledge Base**")
        st.write(f"- Space Key: `{settings.CONFLUENCE_SPACE_KEY}`")
        st.write(f"- Wiki URL: `{settings.JIRA_BASE_URL}/wiki`")

st.divider()

with st.container(border=True):
    st.markdown("#### Application Cache & Telemetry")
    if st.button("Invalidate In-Memory Telemetry Cache", use_container_width=True):
        st.cache_data.clear()
        st.cache_resource.clear()
        st.success("Platform cache cleared.")
