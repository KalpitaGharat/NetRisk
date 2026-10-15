from typing import Optional
import streamlit as st

def render_page_header(
    title: str,
    subtitle: str,
    category: Optional[str] = None,
) -> None:
    """Render a structured, dignified enterprise page header."""
    if category:
        st.caption(f":cyan[**{category.upper()}**]")
    st.subheader(title)
    st.caption(subtitle)
    st.markdown("---")


def render_section_divider(title: Optional[str] = None) -> None:
    """Render a clean section divider with optional section label."""
    if title:
        st.markdown(f":gray[**{title.upper()}**]")
    st.markdown("---")
