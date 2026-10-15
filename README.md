# NETRISK

### Intelligent Risk-Aware SDLC Decision Platform for AI-Based Cybersecurity Systems

> **Software Engineering & Project Management CIAP Capstone Project**  
> **Aligned with United Nations SDG 9: Industry, Innovation, and Infrastructure**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.15+-22C55E.svg)](https://recharts.org)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy%202.0+-003B57.svg)](https://www.sqlite.org/)
[![Tests Passing](https://img.shields.io/badge/pytest-54%20passed%20(100%25)-brightgreen.svg)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SDG 9](https://img.shields.io/badge/SDG-9%20Industry%20%26%20Infrastructure-orange.svg)](https://sdgs.un.org/goals/goal9)

---

## 1. Project Overview & Problem Statement

### The Problem
Artificial Intelligence-based Intrusion Detection Systems (AI-IDS) face distinct engineering challenges that conventional software rarely encounters:
1. **High Security Criticality**: Undetected malicious payloads or unauthorized breaches result in severe data exfiltration and network disruption.
2. **AI/ML Uncertainty**: Deep learning detection models suffer from adversarial evasion attacks, data drift, training latency, and false-positive spikes.
3. **Adversarial Volatility**: Polymorphic zero-day exploits mutate dynamically at wire speed.
4. **Strict Operational Constraints**: Real-time packet inspection requires wire-speed throughput and millisecond response times.

Despite these critical factors, development teams routinely pick a Software Development Life Cycle (SDLC) based on habit, organizational dogma, or marketing trends (e.g., dogmatic Agile or rigid Waterfall). A mismatched SDLC model leads to severe security debt, architectural rework, or compliance failures.

### The Solution: NETRISK
**NETRISK** is an enterprise-grade cybersecurity decision-support intelligence platform. Built with a high-performance **React 18, Tailwind CSS, Recharts, and Vite** frontend backed by a robust **FastAPI, SQLAlchemy 2.0, and SQLite** analytical core, NETRISK:
- Evaluates multi-dimensional risk attributes across 7 distinct dimensions.
- Computes empirical mathematical suitability scores across 5 primary SDLC paradigms.
- Synthesizes natural-language explainable justifications for executive decision-makers.
- Provides interactive sensitivity simulations, full audit trail ledgers, and formal LaTeX equations.

> **Core Philosophy**: No SDLC model is universally superior. NETRISK provides **Objective, Explainable, and Traceable Decision Support** calibrated to measurable software risk characteristics.

---

## 2. Platform Architecture

NETRISK uses a modern **decoupled dual-tier enterprise architecture**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NETRISK PLATFORM                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                 REACT 18 ENTERPRISE USER INTERFACE (PORT 5501)                 │   │
│   │                                                                                │   │
│   │  • Vite + React 18 + Tailwind CSS + Recharts + Lucide Icons                    │   │
│   │                                                                                │   │
│   │  • ACCESS CONTROL & SECURITY PORTAL                                            │   │
│   │    ├── Enterprise Security Authentication Portal (LoginPage)                   │   │
│   │    ├── 1-Click Capstone Demo Profiles (Kalpita Gharat & Faculty Evaluator)     │   │
│   │    └── Role-Based Clearance (Level 3-5 Clearance & Session Management)         │   │
│   │                                                                                │   │
│   │  • RISK INTELLIGENCE                                                           │   │
│   │    ├── Executive Dashboard (Hero Showcase, Dropdown Selector, Dual Grid)       │   │
│   │    ├── New Assessment Wizard (7-Factor Sliders, Baseline Presets, Live Gauge)  │   │
│   │    └── Assessment History Ledger (Search, Multi-Filter, Sort, CSV Export)      │   │
│   │                                                                                │   │
│   │  • SDLC DECISION ENGINE                                                        │   │
│   │    ├── SDLC Models & Simulator (Real-Time Sensitivity Sliders, Re-Ranking)     │   │
│   │    ├── Mathematical Formulations (LaTeX Empirical Equations)                   │   │
│   │    └── Comparative Decision Matrix (Lifecycle Trade-Off Dimensions)            │   │
│   │                                                                                │   │
│   │  • GOVERNANCE & ARCHITECTURE                                                   │   │
│   │    └── Documentation & UN SDG 9 Mandate                                        │   │
│   │                                                                                │   │
│   │  • Visual Analytics:                                                           │   │
│   │    ├── Primary Recommended SDLC Model Card + Nested Justification Box          │   │
│   │    ├── Alternative Model Card with Confidence Delta Margin                     │   │
│   │    ├── Circular SVG Risk Gauge Progress Donut (0-100%)                         │   │
│   │    ├── SDLC Suitability Score Comparison (5-Color Calibrated Horizontal Bars)  │   │
│   │    └── Multilateral Suitability Radar (5-Vertex Topological Footprint)         │   │
│   └───────────────────────────────────────┬────────────────────────────────────────┘   │
│                                           │ REST API Calls (/api/*)                    │
│                                           ▼                                            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                   FASTAPI BACKEND CORE & ENGINES (PORT 8001)                   │   │
│   │                                                                                │   │
│   │  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌────────────────┐  │   │
│   │  │    Risk Calculation     │  │     SDLC Suitability    │  │ Recommendation │  │   │
│   │  │    Engine (7 Factors)   │  │     Engine (5 Models)   │  │ & Explainability│ │   │
│   │  └─────────────────────────┘  └─────────────────────────┘  └────────────────┘  │   │
│   │                                                                                │   │
│   │  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌────────────────┐  │   │
│   │  │ SQLite Database Layer   │  │ Dynamic Data Service    │  │ Compiled SPA   │  │   │
│   │  │ (SQLAlchemy 2.0 ORM)    │  │ (database/netrisk.db)   │  │ Mount (/ & /app│  │   │
│   │  └─────────────────────────┘  └─────────────────────────┘  └────────────────┘  │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **React 18.3+** | Component-driven reactive SPA architecture |
| **Build Tool & Bundler** | **Vite 6.0+** | Hot Module Replacement (HMR) on port `5501` |
| **CSS & Design System** | **Tailwind CSS 3.4+** | Custom SOC cybersecurity dark theme tokens |
| **Data Visualizations** | **Recharts 2.15+** | Polar radars, horizontal bars, and SVG gauge rings |
| **Iconography** | **Lucide React** | Enterprise SOC and technical indicator icons |
| **Backend Framework** | **FastAPI 0.115+** | High-performance asynchronous Python REST API on port `8000` |
| **Database & ORM** | **SQLite + SQLAlchemy 2.0+** | Relational persistence with foreign keys and cascade rules |
| **Schema Validation** | **Pydantic v2** | Strict request/response typing and input sanitization |
| **Testing Harness** | **Pytest 8.0+** | 54 automated unit, regression, and service tests (100% pass rate) |
| **Launch Scripting** | **PowerShell & Batch** | Single-command runners: `run.ps1` and `run.bat` |

---

## 4. Executive Dashboard Details

The Executive Dashboard follows the layout, color palette, and visual hierarchy of modern cybersecurity intelligence centers:

### A. System Header & Quick Actions
- **Active System Record Selector:** Dropdown menu enabling instant switching between any persisted assessment in the SQLite database.
- **System Identifier:** Prominent display of the evaluated project name (e.g. `Critical Infrastructure Deep-Packet IDS (Spiral)`).
- **Risk Severity Capsule Badge:** Color-coded status badge (`▪ VERY HIGH` in red, `▪ HIGH` in orange, `▪ MODERATE` in amber, `▪ LOW` in green).
- **Audit Timestamp & Record ID:** Formatted timestamp and database reference: `Evaluated on 10/14/2026, 11:32:04 PM • ID: #2`.
- **Action Buttons:**
  - `Print Report`: Ready for browser print (Ctrl+P / Cmd+P).
  - `Export JSON`: Instant download of the full assessment JSON evaluation.
  - `New Assessment`: Direct navigation to the assessment wizard.

### B. Recommendation & Risk Overview (Top Grid)
- **Primary Recommended SDLC Model Card (Left 65% Column):**
  - Category tag with status pill: `PRIMARY RECOMMENDED SDLC MODEL` + `Optimal Framework Match`.
  - Headline: Bold model title with cyan match percentage and muted suitability label (e.g. **`Spiral  81.5%  SUITABILITY`**).
  - Contextual description: Highlights balancing of development principles against project risk profile.
  - Nested Decision Justification Box: Natural-language, evidence-based explanation detailing exact risk parameter drivers.
- **Alternative Model Card (Right 35% Top Column):**
  - Displays runner-up model (e.g. **`DevSecOps 79.0%`**) with score differential (`Delta: 2.5% score margin`).
- **Overall Risk Donut Gauge (Right 35% Bottom Column):**
  - Circular progress donut displaying overall risk index with color-coded severity arc and center label (`79.8% OVERALL RISK`).

### C. Comparative Visual Analytics (Bottom Grid)
- **SDLC Suitability Score Comparison (Bottom Left Card):**
  - Calibrated horizontal bar chart comparing all 5 models:
    - **Waterfall:** Sky Blue (`#38BDF8`)
    - **V-Model:** Electric Cyan (`#00F0FF`)
    - **Agile:** Emerald Green (`#10B981`)
    - **Spiral:** Amber Orange (`#F59E0B`)
    - **DevSecOps:** Crimson Red (`#EF4444`)
  - Scale from 0% to 100% with tick increments.
- **Multilateral Suitability Radar (Bottom Right Card):**
  - 5-vertex polar radar chart (*Waterfall*, *V-Model*, *Agile*, *Spiral*, *DevSecOps*) displaying the topological footprint of SDLC trade-offs with glowing cyan fill.

### D. Portfolio KPI Cards & Audit Ledger
- **Executive Stat Cards:** Total Assessments, Portfolio Mean Risk, High-Risk Systems Count, Dominant SDLC Model.
- **Recent Assessments Table:** Quick-inspection table with one-click `Inspect ↑` actions that load any assessment directly into the top showcase.

---

## 5. Application Modules & Navigation

The platform organizes its capabilities into focused functional sections:

### Section 1: RISK INTELLIGENCE
- **Executive Dashboard:** Live evaluation intelligence, hero recommendation showcase, circular risk gauge, horizontal comparison bars, and multilateral radar.
- **New Assessment Wizard:** 5 pre-configured industry baseline scenarios, 7-factor sliders (0-100 scale), live real-time risk gauge preview, duplicate submission protection, and instant calculation.
- **Assessment History Ledger:** Multi-criteria query filters (Project search, Risk tier filter, SDLC filter, sort order), summary statistics, and one-click **CSV export**.

### Section 2: SDLC DECISION ENGINE
- **SDLC Models & Simulator:** Real-time 6-factor sensitivity simulator with dynamic bar chart re-ranking, formal empirical mathematical formulas, and comparative paradigm decision matrix.
- **Documentation & UN SDG 9:** Complete system architecture specifications, 7-factor mathematical weighting tables, and UN SDG 9 alignment.

---

## 6. Mathematical Risk Model

The overall project risk score is evaluated across seven weighted dimensions (0–100 scale):

$$\text{Overall Risk} = \sum_{i=1}^{7} (W_i \times F_i) = 0.25 S + 0.20 A + 0.15 R + 0.15 T + 0.10 O + 0.10 C + 0.05 (100 - E)$$

Where:
- $S$ = Security Criticality (25% weight)
- $A$ = AI/ML Complexity (20% weight)
- $R$ = Requirement Uncertainty (15% weight)
- $T$ = Threat Volatility (15% weight)
- $O$ = Operational Criticality (10% weight)
- $C$ = Compliance Requirement (10% weight)
- $E$ = Team Experience (5% weight, calculated as $\text{Team Risk} = 100 - E$)

### Risk Classification Tiers
- **LOW:** $0.00\% - 30.00\%$
- **MODERATE:** $30.01\% - 50.00\%$
- **HIGH:** $50.01\% - 70.00\%$
- **VERY HIGH:** $70.01\% - 100.00\%$

---

## 7. Five SDLC Suitability Formulas

Each lifecycle model is evaluated using a dedicated mathematical formula:

### 1. Waterfall
$$S_{\text{Waterfall}} = 0.50 \cdot (100 - R) + 0.50 \cdot (100 - T)$$
*Ideal for:* Highly stable requirements and static, non-volatile threat signatures.

### 2. V-Model
$$S_{\text{V-Model}} = 0.45 \cdot S + 0.35 \cdot O + 0.20 \cdot C$$
*Ideal for:* Mission-critical environments mandating formal verification and regulatory compliance.

### 3. Agile
$$S_{\text{Agile}} = 0.45 \cdot R + 0.35 \cdot T + 0.20 \cdot A$$
*Ideal for:* High requirement uncertainty, rapid zero-day evolution, and heuristic AI prototyping.

### 4. Spiral
$$S_{\text{Spiral}} = 0.30 \cdot S + 0.25 \cdot A + 0.20 \cdot T + 0.15 \cdot O + 0.10 \cdot R$$
*Ideal for:* High algorithmic AI complexity paired with severe security criticality requiring iterative risk reduction.

### 5. DevSecOps
$$S_{\text{DevSecOps}} = 0.30 \cdot S + 0.25 \cdot T + 0.20 \cdot R + 0.15 \cdot O + 0.10 \cdot A$$
*Ideal for:* High-velocity production environments needing automated CI/CD security testing (SAST/DAST) and continuous MLOps.

---

## 8. How to Run the Application

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Windows PowerShell / Command Prompt or Terminal (macOS/Linux)

### Quick Start (PowerShell)
```powershell
# Navigate to project directory
cd C:\PROJECTS\NetRisk

# Launch both FastAPI backend and React frontend
.\run.ps1
```

### Quick Start (Command Prompt / Batch)
```cmd
run.bat
```

### Manual Commands

**1. Launch FastAPI Backend:**
```powershell
.\.venv\Scripts\python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8001
```

**2. Launch React Frontend:**
```powershell
cd frontend
npm run dev
```

Open your browser at:
- **React Frontend (Live Hot-Reload):** **`http://localhost:5501`**
- **FastAPI Core & REST API:** **`http://127.0.0.1:8001`**
- **FastAPI Compiled SPA:** **`http://127.0.0.1:8001/app`**

---

## 9. Running Automated Tests

Run the full pytest test suite:
```powershell
.\.venv\Scripts\pytest -v
```

All 54 test cases cover risk calculations, SDLC suitability formulas, recommendation sorting, SQLite persistence, Plotly chart generation, web routes, and API endpoints with a **100% pass rate**.

---

## 10. Alignment with UN Sustainable Development Goal 9

NETRISK directly aligns with **UN SDG 9: Industry, Innovation, and Infrastructure**:
- **Target 9.1 & 9.4**: Protects industrial and communication infrastructure by ensuring cybersecurity software for intrusion detection is built with a life-cycle methodology calibrated to risk severity.
- **Traceable Decision Support**: Replaces subjective decisions with reproducible mathematical formulations and explainable evidence.
