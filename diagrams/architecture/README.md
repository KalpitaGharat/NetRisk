# System Architecture Specification

## 1. Overview
The NETRISK architecture follows a 3-tier decoupled web architecture:
1. **Presentation Tier**: HTML5, CSS3, Vanilla JavaScript, Chart.js. Communicates via REST.
2. **Application Tier**: FastAPI running under Uvicorn, structured into Pydantic Schemas, SQLAlchemy ORM, and decoupled domain services (`RiskEngine`, `SDLCEngine`, `RecommendationEngine`).
3. **Data Tier**: SQLite database managed via SQLAlchemy auto-migration.

## 2. Draw.io Rendering Instructions
1. Open [https://app.diagrams.net](https://app.diagrams.net).
2. Click **File > Open From > Device**.
3. Select `architecture_diagram.xml` in this folder.
