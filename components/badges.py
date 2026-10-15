from typing import Optional
import streamlit as st
from components.theme import RISK_COLORS, STATUS_SUCCESS, STATUS_WARNING, STATUS_HIGH, STATUS_CRITICAL

def get_risk_badge_markdown(tier: str, score: Optional[float] = None) -> str:
    """Return formatted markdown string for risk tier badge."""
    tier_upper = tier.upper()
    if tier_upper == "VERY HIGH":
        color = ":red-background"
    elif tier_upper == "HIGH":
        color = ":orange-background"
    elif tier_upper == "MODERATE":
        color = ":yellow-background"
    else:
        color = ":green-background"

    score_str = f" {score:.1f}%" if score is not None else ""
    return f"{color}[▪ {tier_upper}{score_str}]"


def render_risk_badge(tier: str, score: Optional[float] = None) -> None:
    """Render a risk tier badge in Streamlit."""
    st.markdown(get_risk_badge_markdown(tier, score))


def render_status_pill(label: str, active: bool = True) -> None:
    """Render an operational status pill."""
    if active:
        st.markdown(f":green-background[● {label}]")
    else:
        st.markdown(f":gray-background[○ {label}]")
