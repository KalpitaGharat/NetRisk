# Quality Assurance & Testing Methodology

## 1. Overview
The **NETRISK** platform implements a multi-tier quality assurance framework ensuring strict mathematical accuracy, reliable REST API contracts, clean database transactions, and explainable recommendation reproducibility.

---

## 2. Test Architecture

```
Tests Architecture
├── Unit Tests (Fast, Isolated)
│   ├── test_risk_engine.py      --> Boundary conditions, weighting sums, monotonicity
│   ├── test_sdlc_engine.py      --> Mathematical formulas for all 5 SDLC models
│   └── test_recommendation.py  --> Ranking, dynamic justification, practices
├── API & Integration Tests
│   └── test_api.py              --> FastAPI endpoints, Pydantic validation, SQLite persistence
└── Academic Scenario Suite
    └── run_scenarios.py         --> 8 empirical cyberdefense IDS project scenarios
```

---

## 3. Test Coverage Summary

### A. Risk Engine (`test_risk_engine.py`)
- **All Zeros Test**: Validates minimal baseline score with 0 inputs and 0 experience ($5.0\%$).
- **Maximum Values Test**: Validates saturation at $100\%$ and effect of maximum vs. zero experience.
- **Normal Values Test**: Validates exact floating-point calculation ($58.50\% \to \text{HIGH}$).
- **Team Experience Sensitivity**: Proves a 100-point shift in experience modulates overall risk by exactly 5.0 points.
- **Classification Boundary Tests**: Validates boundary thresholds at $30.0$, $50.0$, and $70.0$.

### B. SDLC Engine (`test_sdlc_engine.py`)
- **Waterfall**: Tests stability dependency on requirement certainty and static threats.
- **V-Model**: Tests verification dominance in high security, operational criticality, and compliance.
- **Agile**: Tests sprint agility driven by volatile requirements and mutating zero-days.
- **Spiral**: Tests risk-driven loops handling complex AI/ML anomaly models.
- **DevSecOps**: Tests continuous automated testing under rapid threat delivery.

### C. REST API & Integration (`test_api.py`)
- **Health & Metadata**: Validates `GET /api/health`, `GET /api/models`, and `GET /api/weights`.
- **Database Isolation**: Employs an in-memory SQLite database (`sqlite:///:memory:`) using FastAPI dependency overrides to prevent test crosstalk.
- **CRUD Operations**: Validates project creation, assessment generation, single assessment retrieval, historical listing, and deletion.
- **Negative & Edge Cases**:
  - Empty string project name (`422 Unprocessable Content`).
  - Missing project name field (`422`).
  - Negative values or values $> 100.0$ (`422`).
  - String inputs in numeric fields (`422`).

---

## 4. Execution Commands

### Running Pytest Unit & Integration Tests:
```bash
.\.venv\Scripts\pytest backend\tests -v
```

### Running Academic Scenarios:
```bash
.\.venv\Scripts\python backend\tests\run_scenarios.py
```
