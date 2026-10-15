import streamlit as st

# Design System Color Tokens
BG_MAIN = "#080D18"
BG_SIDEBAR = "#0B1220"
SURFACE_PRIMARY = "#101A2B"
SURFACE_ELEVATED = "#152238"
BORDER_COLOR = "#25344B"
ACCENT_CYAN = "#4DE2E8"
ACCENT_VIOLET = "#8B7CFF"
TEXT_PRIMARY = "#F2F6FC"
TEXT_SECONDARY = "#9BAAC0"

# Status & Severity Tokens
STATUS_SUCCESS = "#35D39A"
STATUS_WARNING = "#F5B942"
STATUS_HIGH = "#FF8A4C"
STATUS_CRITICAL = "#FF5268"

RISK_COLORS = {
    "LOW": STATUS_SUCCESS,
    "MODERATE": STATUS_WARNING,
    "HIGH": STATUS_HIGH,
    "VERY HIGH": STATUS_CRITICAL,
}

SDLC_COLORS = {
    "Waterfall": "#38BDF8",
    "V-Model": "#4DE2E8",
    "Agile": "#35D39A",
    "Spiral": "#F5B942",
    "DevSecOps": "#FF5268",
}

CUSTOM_CSS = f"""
<style>
/* Streamlit Block Layout Polish */
.block-container {{
    padding-top: 1.75rem !important;
    padding-bottom: 2rem !important;
    max-width: 95% !important;
}}

/* Clean typography */
h1, h2, h3, h4, h5, h6 {{
    color: {TEXT_PRIMARY} !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em !important;
}}

/* Subdued secondary captions */
.stCaption, [data-testid="stCaptionContainer"] {{
    color: {TEXT_SECONDARY} !important;
    font-size: 0.85rem !important;
}}

/* Form inputs & borders */
[data-testid="stForm"] {{
    border: 1px solid {BORDER_COLOR} !important;
    border-radius: 6px !important;
    background-color: {SURFACE_PRIMARY} !important;
}}

/* Bordered Containers */
[data-testid="stVerticalBlock"] > div[data-testid="stVerticalBlockBorderWrapper"] {{
    border-color: {BORDER_COLOR} !important;
    border-radius: 6px !important;
    background-color: {SURFACE_PRIMARY} !important;
}}

/* Metric Cards */
[data-testid="stMetric"] {{
    background-color: {SURFACE_PRIMARY};
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
}}
[data-testid="stMetricLabel"] {{
    color: {TEXT_SECONDARY} !important;
    font-size: 0.8rem !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}}
[data-testid="stMetricValue"] {{
    color: {TEXT_PRIMARY} !important;
    font-size: 1.75rem !important;
    font-weight: 700 !important;
}}

/* Buttons */
.stButton > button {{
    border-radius: 4px !important;
    font-weight: 600 !important;
    font-size: 0.85rem !important;
    border: 1px solid {BORDER_COLOR} !important;
    transition: all 0.15s ease-in-out !important;
}}
.stButton > button:hover {{
    border-color: {ACCENT_CYAN} !important;
    color: {ACCENT_CYAN} !important;
}}
button[kind="primary"] {{
    background-color: {ACCENT_CYAN} !important;
    color: #080D18 !important;
    border: none !important;
}}
button[kind="primary"]:hover {{
    background-color: #6ee7b7 !important;
    color: #080D18 !important;
}}

/* Sidebar styling */
[data-testid="stSidebar"] {{
    background-color: {BG_SIDEBAR} !important;
    border-right: 1px solid {BORDER_COLOR} !important;
}}

/* Dataframe styling */
[data-testid="stDataFrame"] {{
    border: 1px solid {BORDER_COLOR} !important;
    border-radius: 6px !important;
}}

/* Tabs styling */
button[data-baseweb="tab"] {{
    color: {TEXT_SECONDARY} !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
}}
button[aria-selected="true"] {{
    color: {ACCENT_CYAN} !important;
    border-bottom-color: {ACCENT_CYAN} !important;
}}
</style>
"""

def apply_theme():
    """Inject polished enterprise cybersecurity CSS stylesheet."""
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
