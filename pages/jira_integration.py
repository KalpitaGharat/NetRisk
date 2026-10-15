import sys
from pathlib import Path
import streamlit as st
import pandas as pd

# Path setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from services.ui_components import render_page_header
from backend.app.services.jira_service import JiraService
from backend.app.config import settings

render_page_header(
    title="Atlassian Jira Project Integration",
    subtitle="Bidirectional synchronization with Atlassian Jira Cloud boards, sprint backlogs, and cybersecurity risk tickets.",
    category="Operations",
)

conn = JiraService.check_connection()

# Status Banner
with st.container(border=True):
    col_stat, col_action = st.columns([3, 1])
    with col_stat:
        if conn.get("is_connected"):
            st.success(f"Connected to Atlassian Jira Cloud: Project `{settings.JIRA_PROJECT_KEY}` at `{settings.JIRA_BASE_URL}`")
        else:
            st.info(
                f"Operational State: **{conn.get('mode', 'STANDALONE').upper()} MODE** — "
                f"Displaying local verification records for Project `{settings.JIRA_PROJECT_KEY}`. (Configure API token in `.env` to enable live cloud sync)."
            )
    with col_action:
        if st.button("Refresh Telemetry", use_container_width=True):
            st.toast("Syncing Atlassian status...")
            st.rerun()

st.divider()

# Load issues
try:
    issues_res = JiraService.get_all_issues()
    if isinstance(issues_res, dict) and "issues" in issues_res:
        raw_list = issues_res["issues"]
    elif isinstance(issues_res, list):
        raw_list = issues_res
    else:
        raw_list = []
except Exception:
    raw_list = []

# Format issues
table_records = []
for item in raw_list:
    f = item.get("fields", item)
    k = item.get("key", "NRASS-X")
    s = f.get("summary", "Issue Summary")
    st_val = f.get("status", {})
    st_name = st_val.get("name", "To Do") if isinstance(st_val, dict) else str(st_val)
    t_val = f.get("issuetype", {})
    t_name = t_val.get("name", "Task") if isinstance(t_val, dict) else str(t_val)
    p_val = f.get("priority", {})
    p_name = p_val.get("name", "Medium") if isinstance(p_val, dict) else str(p_val)

    table_records.append({
        "Issue Key": k,
        "Summary": s,
        "Type": t_name,
        "Status": st_name,
        "Priority": p_name,
    })

issues_df = pd.DataFrame(table_records)

# KPI row
m1, m2, m3, m4 = st.columns(4)
total = len(issues_df)
todo = len(issues_df[issues_df["Status"].str.contains("To Do|Open|Backlog", case=False, na=False)])
in_prog = len(issues_df[issues_df["Status"].str.contains("Progress|Development", case=False, na=False)])
done = len(issues_df[issues_df["Status"].str.contains("Done|Closed|Resolved", case=False, na=False)])

with m1:
    with st.container(border=True):
        st.metric("Total Issues", total)
with m2:
    with st.container(border=True):
        st.metric("To Do / Backlog", todo)
with m3:
    with st.container(border=True):
        st.metric("In Development", in_prog)
with m4:
    with st.container(border=True):
        st.metric("Completed / Verified", done)

st.divider()

tab_board, tab_table = st.tabs(["Sprint Workflow Board", "Synchronized Issues Table"])

with tab_board:
    b1, b2, b3 = st.columns(3)

    with b1:
        st.markdown("##### Backlog / To Do")
        for _, r in issues_df[issues_df["Status"].str.contains("To Do|Open|Backlog", case=False, na=False)].iterrows():
            with st.container(border=True):
                st.markdown(f"**[{r['Issue Key']}]** {r['Summary']}")
                st.caption(f"Type: {r['Type']} | Priority: {r['Priority']}")

    with b2:
        st.markdown("##### In Progress")
        for _, r in issues_df[issues_df["Status"].str.contains("Progress|Development", case=False, na=False)].iterrows():
            with st.container(border=True):
                st.markdown(f"**[{r['Issue Key']}]** {r['Summary']}")
                st.caption(f"Type: {r['Type']} | Priority: {r['Priority']}")

    with b3:
        st.markdown("##### Completed")
        for _, r in issues_df[issues_df["Status"].str.contains("Done|Closed|Resolved", case=False, na=False)].iterrows():
            with st.container(border=True):
                st.markdown(f"**[{r['Issue Key']}]** {r['Summary']}")
                st.caption(f"Type: {r['Type']} | Priority: {r['Priority']}")

with tab_table:
    if not issues_df.empty:
        st.dataframe(issues_df, use_container_width=True, hide_index=True)
    else:
        st.info("No synchronized issues detected.")
