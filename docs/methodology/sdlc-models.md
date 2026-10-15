# SDLC Models in AI-Based Intrusion Detection

## 1. Overview
In cyberdefense engineering, choosing a Software Development Life Cycle (SDLC) model cannot rely on general organizational habit. A mismatched model leads to architectural bottlenecks, unmitigated zero-day vulnerabilities, or uncalibrated AI false positive cascades. **NETRISK** scores 5 distinct lifecycle models.

---

## 2. Mathematical Scoring Formulas

### 1. Waterfall Model
* **Philosophy**: Sequential, gated progression from requirements to maintenance.
* **Scoring Formula**:
  $$\text{Score}_{\text{Waterfall}} = ((100 - \text{Requirement Uncertainty}) \times 0.50) + ((100 - \text{Threat Volatility}) \times 0.50)$$
* **AI-IDS Context**: Suitable only when intrusion attack signatures are strictly static and regulatory criteria are unyielding.
* **Strengths**: Strict phase documentation, predictable milestones.
* **Weaknesses**: Inflexible to emerging zero-days, delayed verification.

---

### 2. V-Model (Verification and Validation)
* **Philosophy**: Rigorous testing levels paired symmetrically with every design phase.
* **Scoring Formula**:
  $$\text{Score}_{\text{V-Model}} = (\text{Security Criticality} \times 0.45) + (\text{Operational Criticality} \times 0.35) + (\text{Compliance Requirement} \times 0.20)$$
* **AI-IDS Context**: Ideal for mission-critical infrastructure networks requiring high uptime, zero downtime, and strict audits (e.g., ISO 27001, NIST).
* **Strengths**: Early test harness preparation, strict traceability.
* **Weaknesses**: High cost of late requirement adaptations.

---

### 3. Agile Model
* **Philosophy**: Iterative, feature-driven sprints embracing shifting priorities.
* **Scoring Formula**:
  $$\text{Score}_{\text{Agile}} = (\text{Requirement Uncertainty} \times 0.45) + (\text{Threat Volatility} \times 0.35) + (\text{AI Complexity} \times 0.20)$$
* **AI-IDS Context**: Thrives in dynamic attack environments where fast iterations are needed to respond to emerging adversary evasion techniques.
* **Strengths**: Rapid velocity, continuous feedback.
* **Weaknesses**: Risk of security debt if automated testing is deferred.

---

### 4. Spiral Model
* **Philosophy**: Risk-driven iterative prototyping cycles.
* **Scoring Formula**:
  $$\text{Score}_{\text{Spiral}} = (\text{Security} \times 0.30) + (\text{AI Complexity} \times 0.25) + (\text{Threat Volatility} \times 0.20) + (\text{Operational} \times 0.15) + (\text{Requirement Uncertainty} \times 0.10)$$
* **AI-IDS Context**: Tailored for cutting-edge, experimental AI/ML algorithms where technical feasibility and evasion risks must be resolved via prototypes.
* **Strengths**: Explicit risk analysis in each quadrant, prototype containment.
* **Weaknesses**: High managerial overhead, requires seasoned risk assessors.

---

### 5. DevSecOps
* **Philosophy**: Continuous integration, continuous delivery, and shift-left automated security.
* **Scoring Formula**:
  $$\text{Score}_{\text{DevSecOps}} = (\text{Security} \times 0.30) + (\text{Threat Volatility} \times 0.25) + (\text{Requirement Uncertainty} \times 0.20) + (\text{Operational} \times 0.15) + (\text{AI Complexity} \times 0.10)$$
* **AI-IDS Context**: Essential for high-velocity cloud intrusion detection needing automated pipeline testing (SAST/DAST/MLOps) and live signature distribution.
* **Strengths**: Automated security gates, rapid zero-day patching, real-time telemetry.
* **Weaknesses**: Complex infrastructure setup, demanding tooling investment.

---

## 3. Comparative Summary

| SDLC Model | Primary Driver | Primary Strength | Key Limitation in AI-IDS |
|------------|----------------|------------------|--------------------------|
| **Waterfall** | Stability | Predictability | Cannot adapt to polymorphic zero-day exploits |
| **V-Model** | Criticality & Verification | Formal validation traceability | Slow response to mutating adversary vectors |
| **Agile** | Change & Volatility | Sprints adapt to threat shifts | Less structured compliance audit trail |
| **Spiral** | Risk & Algorithmic Complexity | Dedicated risk analysis per loop | Heavy process overhead for simple systems |
| **DevSecOps** | Threat Velocity & Automation | Shift-left CI/CD automated gates | Requires mature DevOps & MLOps infrastructure |
