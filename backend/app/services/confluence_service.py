from typing import Dict, Any, List
from ..config import settings

class ConfluenceService:
    """
    Service for integrating with Atlassian Confluence Cloud space documentation.
    Provides verified links, metadata, and summaries for the 6 core NETRISK
    engineering documentation pages in space NRSS.
    """

    SPACE_KEY = settings.CONFLUENCE_SPACE_KEY
    SPACE_URL = f"https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/{settings.CONFLUENCE_SPACE_KEY}/overview"

    CONFLUENCE_PAGES = [
        {
            "id": 1,
            "title": "NETRISK — Risk-Aware SDLC Selector",
            "slug": "overview",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/overview",
            "icon": "🛡️",
            "category": "Project Charter",
            "description": "Executive project overview, problem statement, CIAP micro-project scope, and the rationale for risk-driven SDLC selection in AI cyberdefense.",
            "status": "PUBLISHED",
        },
        {
            "id": 2,
            "title": "NETRISK — System Architecture & Workflow",
            "slug": "architecture-workflow",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/pages/architecture",
            "icon": "🏗️",
            "category": "System Design",
            "description": "3-tier architecture specifications, data flow diagrams (DFD Level 1), SQLite schema relationships, and the 5-step user journey.",
            "status": "PUBLISHED",
        },
        {
            "id": 3,
            "title": "NETRISK — Risk Assessment Methodology",
            "slug": "risk-methodology",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/pages/risk-model",
            "icon": "📐",
            "category": "Mathematical Model",
            "description": "Mathematical derivation of the 7-dimension weighted risk formulation, inverse team-experience modeling, and boundary classification rules.",
            "status": "PUBLISHED",
        },
        {
            "id": 4,
            "title": "NETRISK — SDLC Recommendation Methodology",
            "slug": "sdlc-methodology",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/pages/sdlc-models",
            "icon": "⚙️",
            "category": "Decision Logic",
            "description": "Formulas for Waterfall, V-Model, Agile, Spiral, and DevSecOps, dynamic natural-language explanation generation, and practice synthesis.",
            "status": "PUBLISHED",
        },
        {
            "id": 5,
            "title": "NETRISK — Testing & Validation Strategy",
            "slug": "testing-strategy",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/pages/testing",
            "icon": "🧪",
            "category": "Quality Assurance",
            "description": "Automated pytest suite documentation, boundary verification, and empirical results across the 8 real-world cyberdefense scenarios.",
            "status": "PUBLISHED",
        },
        {
            "id": 6,
            "title": "NETRISK — SDG 9, Project Outcomes & Conclusion",
            "slug": "sdg9-outcomes",
            "url": "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/pages/sdg9",
            "icon": "🎯",
            "category": "Impact & Governance",
            "description": "Detailed alignment with UN SDG 9 targets for resilient digital infrastructure, responsible AI innovation, and future development scope.",
            "status": "PUBLISHED",
        },
    ]

    @classmethod
    def get_space_metadata(cls) -> Dict[str, Any]:
        """Retrieve Confluence space overview and page directory."""
        return {
            "space_name": "NETRISK — Risk-Aware SDLC Selector",
            "space_key": cls.SPACE_KEY,
            "space_url": cls.SPACE_URL,
            "total_documents": len(cls.CONFLUENCE_PAGES),
            "organization_domain": "sakec-team-bcq481n1.atlassian.net",
            "pages": cls.CONFLUENCE_PAGES,
        }
