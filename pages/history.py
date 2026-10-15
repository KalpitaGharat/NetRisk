import sys
from pathlib import Path
import streamlit as st
import pandas as pd

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header
from services.data_service import get_all_assessments
from backend.app.services.sdlc_engine import SDLCEngine

render_page_header(
    title="Assessment History & Audit Trail",
    subtitle="Search, filter, and inspect persisted software risk assessments and SDLC recommendations.",
    category="Risk Analysis",
)

assessments = get_all_assessments()

if not assessments:
    st.info("No assessments found in the repository. Perform an assessment from the New Assessment module.")
    st.stop()

df = pd.DataFrame(assessments)

# Filter Controls Container
with st.container(border=True):
    st.markdown("**Query & Filter Parameters**")
    f_col1, f_col2, f_col3, f_col4 = st.columns(4)

    with f_col1:
        search_query = st.text_input("Project Name", placeholder="Filter by system...")

    with f_col2:
        risk_tier_options = ["All Tiers"] + sorted(list(df["risk_level"].unique()))
        selected_tier = st.selectbox("Risk Level Tier", options=risk_tier_options)

    with f_col3:
        sdlc_options = ["All Models"] + sorted(list(df["recommended_model"].unique()))
        selected_model = st.selectbox("Recommended SDLC", options=sdlc_options)

    with f_col4:
        sort_order = st.selectbox(
            "Sort Order",
            options=["Newest First", "Oldest First", "Highest Risk Score", "Lowest Risk Score"],
        )

# Apply Filters
filtered_df = df.copy()

if search_query.strip():
    filtered_df = filtered_df[
        filtered_df["project_name"].str.contains(search_query.strip(), case=False, na=False)
    ]

if selected_tier != "All Tiers":
    filtered_df = filtered_df[filtered_df["risk_level"] == selected_tier]

if selected_model != "All Models":
    filtered_df = filtered_df[filtered_df["recommended_model"] == selected_model]

if sort_order == "Newest First":
    filtered_df = filtered_df.sort_values(by="created_at", ascending=False)
elif sort_order == "Oldest First":
    filtered_df = filtered_df.sort_values(by="created_at", ascending=True)
elif sort_order == "Highest Risk Score":
    filtered_df = filtered_df.sort_values(by="risk_score", ascending=False)
elif sort_order == "Lowest Risk Score":
    filtered_df = filtered_df.sort_values(by="risk_score", ascending=True)

# Status & CSV Export
h_col1, h_col2, h_col3 = st.columns(3)
with h_col1:
    st.metric("Matching Records", len(filtered_df))
with h_col2:
    mean_val = filtered_df["risk_score"].mean() if not filtered_df.empty else 0.0
    st.metric("Filtered Mean Risk Score", f"{mean_val:.2f}%")
with h_col3:
    csv_bytes = filtered_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="Export Audit Trail (CSV)",
        data=csv_bytes,
        file_name="netrisk_audit_trail.csv",
        mime="text/csv",
        use_container_width=True,
    )

st.divider()

# Tabular Display
display_df = filtered_df[
    [
        "id",
        "project_name",
        "risk_score",
        "risk_level",
        "recommended_model",
        "recommended_score",
        "alternative_model",
        "created_at",
    ]
].rename(
    columns={
        "id": "ID",
        "project_name": "Project Name",
        "risk_score": "Risk Score (%)",
        "risk_level": "Risk Tier",
        "recommended_model": "Primary SDLC",
        "recommended_score": "Match (%)",
        "alternative_model": "Alternative SDLC",
        "created_at": "Timestamp",
    }
)

st.dataframe(display_df, use_container_width=True, hide_index=True)

# Deep dive inspection
st.markdown("#### Selected Assessment Telemetry")
for _, row in filtered_df.iterrows():
    with st.expander(
        f"Record #{row['id']} — {row['project_name']} | Risk: {row['risk_score']:.1f}% ({row['risk_level']}) | Top: {row['recommended_model']}"
    ):
        d1, d2, d3 = st.columns(3)

        with d1:
            st.markdown("**Evaluated Dimensions**")
            st.write(f"- Security Criticality: **{row['security_criticality']:.1f}%**")
            st.write(f"- AI/ML Complexity: **{row['ai_complexity']:.1f}%**")
            st.write(f"- Requirement Uncertainty: **{row['requirement_uncertainty']:.1f}%**")
            st.write(f"- Threat Volatility: **{row['threat_volatility']:.1f}%**")
            st.write(f"- Operational Criticality: **{row['operational_criticality']:.1f}%**")
            st.write(f"- Compliance Requirement: **{row['compliance_requirement']:.1f}%**")
            st.write(f"- Team Experience: **{row['team_experience']:.1f}%**")

        with d2:
            st.markdown("**All Paradigm Suitability Scores**")
            scores = SDLCEngine.calculate_all_scores(
                security_criticality=row["security_criticality"],
                ai_complexity=row["ai_complexity"],
                requirement_uncertainty=row["requirement_uncertainty"],
                threat_volatility=row["threat_volatility"],
                operational_criticality=row["operational_criticality"],
                compliance_requirement=row["compliance_requirement"],
            )
            for m, s in sorted(scores.items(), key=lambda x: -x[1]):
                mark = " [Primary]" if m == row["recommended_model"] else (" [Alternative]" if m == row["alternative_model"] else "")
                st.write(f"- {m}: **{s:.1f}%**{mark}")

        with d3:
            st.markdown("**Record Metadata**")
            st.write(f"- Database ID: **#{row['id']}**")
            st.write(f"- Project ID: **#{row['project_id']}**")
            st.write(f"- Recorded At: **{row['created_at']}**")
            st.write(f"- Confidence Margin: **+{row['recommended_score'] - row['alternative_score']:.2f}%**")
