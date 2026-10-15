# NETRISK Rebuild Audit & Migration Specification

**Document Path**: `docs/rebuild-audit.md`  
**Date**: October 2026  
**Project**: NETRISK — Intelligent Risk-Aware SDLC Decision Platform for AI-Based Cybersecurity Systems  
**Context**: Rebuilding from decoupled React SPA to unified Python-centric FastAPI + Jinja2 + Modern CSS + Chart.js application.

---

## 1. Current Architecture & State Inspection

### 1.1 Backend Architecture
- **Language & Runtime**: Python 3.13.x
- **Framework**: FastAPI with Uvicorn ASGI server
- **Validation**: Pydantic v2 schemas (`backend/app/schemas/`)
- **ORM & Database**: SQLAlchemy 2.0 with SQLite database at `database/netrisk.db`
- **Current Data**: 2 Project records, 1 Assessment record intact in SQLite
- **Business Logic Services**:
  - `RiskEngine` (`backend/app/services/risk_engine.py`): 7-factor linear weighting with Team Risk inversion and 4-tier classification (`LOW`, `MODERATE`, `HIGH`, `VERY HIGH`).
  - `SDLCEngine` (`backend/app/services/sdlc_engine.py`): Mathematical suitability formulas for Waterfall, V-Model, Agile, Spiral, and DevSecOps.
  - `RecommendationEngine` (`backend/app/services/recommendation_engine.py`): Ranking, margin delta computation, dynamic explainability justification, and risk-mitigated practices.
  - `JiraService` (`backend/app/services/jira_service.py`): REST API v3 and Agile v1.0 client for Jira project `NRASS`, with dual-mode live/demo fallback and 30s in-memory caching.
  - `ConfluenceService` (`backend/app/services/confluence_service.py`): Space `NRSS` metadata client.

### 1.2 Frontend Architecture (Pre-Rebuild)
- React 18 SPA built with Vite and Tailwind CSS in `frontend/dist/`.
- Required a secondary HTTP server or Node.js environment to serve client assets separately from the FastAPI port 8000.
- Legacy static HTML/CSS files also present in `frontend/` (`dashboard.html`, `assessment.html`, etc.).

### 1.3 Testing & Quality Assurance
- 37 automated Pytest test cases passing 100% across unit math, API contracts, validations, and integration mocks.
- 8 empirical academic cybersecurity test scenarios verified in `backend/tests/run_scenarios.py`.

### 1.4 Environment Configuration & Security
- `backend/.env` securely stores Atlassian credentials (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY=NRASS`, `CONFLUENCE_SPACE_KEY=NRSS`).
- No API tokens or secrets are exposed in client-facing code.

---

## 2. Reusable Components & Core Assets to Preserve

1. **Risk & SDLC Formulas**: Unchanged mathematical integrity. Exactly adheres to weights ($0.25, 0.20, 0.15, 0.15, 0.10, 0.10, 0.05$) and model formulas.
2. **Database & Schema**: SQLite `database/netrisk.db` records must remain completely intact. Any new fields (such as `category` in `projects`) will be applied via non-destructive ALTER statements.
3. **External Integrations**: Keep `JiraService` and `ConfluenceService` contracts, endpoints, and credentials targeting project `NRASS` and space `NRSS`.
4. **Design System & Dark Cybersecurity Aesthetic**: Deep navy/charcoal background (`#060a12`, `#0f172a`), electric cyan (`#00f2fe`), sky blue (`#38bdf8`), glowing borders, and clean typography (`Inter`, `JetBrains Mono`).
5. **REST API Endpoints**: All existing `/api/*` endpoints preserved for API clients and Swagger docs at `/docs`.

---

## 3. Identified Gaps & Target Requirements

| Requirement Area | Current State | Target Rebuilt State |
|---|---|---|
| **Frontend Runtime** | Decoupled React bundle requiring Vite/Node.js or secondary port (5501) | **Single-Server Architecture**: FastAPI directly serves server-rendered Jinja2 HTML5 templates on `http://127.0.0.1:8000/`. Zero Node.js or Vite runtime required. |
| **Styling & Assets** | Tailwind compiled CSS bundle | Pure, modern responsive CSS system located at `backend/app/static/css/style.css` preserving the dark cybersecurity theme. |
| **Interactive Visualizations** | Recharts (React-only) | Responsive **Chart.js 4.x** (Horizontal Bar, Multilateral Radar, Donut/Pie charts) with dark cyber styling. |
| **Client Scripts** | React bundle | Modular Vanilla JavaScript with native Fetch API for async submissions, live sliders, and real-time risk gauges. |
| **Page Coverage** | React routes | 9 dedicated Jinja2 templates: Landing (`/`), Dashboard (`/dashboard`), Assessment Wizard (`/assessment`), Results (`/results/{id}`), History (`/history`), Jira Hub (`/project-management`), Kanban (`/jira-board`), Docs (`/documentation`), Settings (`/settings`). |
| **Operational Tooling** | Manual commands | Standard PowerShell automation scripts in `scripts/`: `setup.ps1`, `run.ps1`, `test.ps1`. |

---

## 4. Rebuild & Migration Execution Plan

1. **Phase 1: Dependencies & Static Scaffolding**
   - Add `jinja2>=3.1.3` and `python-multipart>=0.0.9` to `backend/requirements.txt` and install into `.venv`.
   - Create directories: `backend/app/templates/`, `backend/app/static/css/`, `backend/app/static/js/`, `backend/app/static/images/`.
   - Safely backup existing `database/netrisk.db`.
2. **Phase 2: Database & Backend Enhancement**
   - Update `Project` model with `category` field; safely add column if not existing.
   - Retain all core engines (`risk_engine.py`, `sdlc_engine.py`, `recommendation_engine.py`, `jira_service.py`, `confluence_service.py`).
3. **Phase 3: Jinja2 Templates & Modern CSS Design System**
   - `base.html`: Common layout with collapsible dark cybersecurity sidebar, navbar, live Jira status indicator, toast container, and footer.
   - Individual page templates: `index.html`, `dashboard.html`, `assessment.html`, `results.html`, `history.html`, `project_management.html`, `jira_board.html`, `documentation.html`, `settings.html`.
   - `style.css`: Comprehensive, high-end cybersecurity dark theme styling with variables, cards, gauges, badges, tables, and modal dialogs.
   - `netrisk.js`: Vanilla JS controllers for dynamic sliders, Chart.js integrations, live risk meter, history search/filtering, and modal operations.
4. **Phase 4: Web Route Handlers & FastAPI Mounting**
   - Implement `web.py` router mounting all HTML page routes.
   - Mount `/static` to `backend/app/static`.
   - Preserve existing `/api/*` REST endpoints for API consumers and `/docs`.
5. **Phase 5: Automation Scripts & Testing**
   - Create `scripts/setup.ps1`, `scripts/run.ps1`, `scripts/test.ps1`.
   - Extend pytest suite to test both HTML routes and API contracts.
   - Verify all tests and 8 academic scenarios pass 100%.
6. **Phase 6: Verification & Final Report**
   - Verify application running on port 8000, test every page, and document outcomes.
