from typing import Any, Optional
import streamlit as st
from components.theme import (
    ACCENT_CYAN,
    TEXT_PRIMARY,
    TEXT_SECONDARY,
    SURFACE_PRIMARY,
    BORDER_COLOR,
)

def render_kpi_card(label: str, value: Any, subtext: str = "", delta: Optional[str] = None, delta_color: str = "normal") -> None:
    """Render an enterprise metric card with technical styling."""
    with st.container(border=True):
        st.metric(
            label=label,
            value=value,
            delta=delta,
            delta_color=delta_color,
        )
        if subtext:
            st.caption(subtext)


def render_recommendation_card(
    model_name: str,
    score: float,
    justification: str,
    risk_score: float,
) -> None:
    """Render the primary recommended SDLC model showcase card matching design system."""
    with st.container(border=True):
        head_l, head_r = st.columns([2, 1])
        with head_l:
            st.markdown(":cyan[**PRIMARY RECOMMENDED SDLC MODEL**]")
        with head_r:
            st.markdown(":green-background[Optimal Framework Match]")

        st.markdown(f"## {model_name}  :cyan[{score:.1f}%]  :gray[SUITABILITY]")
        st.caption(
            f"Selected as the optimal lifecycle model balancing {model_name} principles against the {risk_score:.1f}% calculated project risk profile."
        )

        with st.container(border=True):
            st.markdown("**Explainable Decision Justification:**")
            st.markdown(f"*{justification}*")


def render_alternative_card(alt_name: str, alt_score: float, margin: float) -> None:
    """Render the runner-up alternative model card."""
    with st.container(border=True):
        st.markdown(":gray[**ALTERNATIVE MODEL**]")
        st.subheader(alt_name)
        st.markdown(f"#### :cyan[{alt_score:.1f}%]")
        st.caption(f"Delta: {margin:.1f}% score margin")


def render_empty_state(title: str, message: str, button_label: Optional[str] = None) -> bool:
    """Render an empty state container with optional action button."""
    with st.container(border=True):
        st.subheader(title)
        st.info(message)
        if button_label:
            return st.button(button_label, type="primary")
    return False
