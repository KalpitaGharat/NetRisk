# Scenario 1: Low-Risk IDS

**Description**: Stable academic campus intrusion signature detector with low zero-day exposure and experienced team.

## 1. Input Parameters

| Parameter | Evaluated Input (0–100) | Weight | Contribution |
|-----------|-------------------------|--------|--------------|
| Security Criticality | 15.0 | 25% | +3.75% |
| AI/ML Complexity | 20.0 | 20% | +4.00% |
| Requirement Uncertainty | 15.0 | 15% | +2.25% |
| Threat Volatility | 10.0 | 15% | +1.50% |
| Operational Criticality | 20.0 | 10% | +2.00% |
| Compliance Requirement | 15.0 | 10% | +1.50% |
| Team Experience (Raw: 90.0) | 10.0 (Team Risk) | 5% | +0.50% |

## 2. Risk Classification

- **Expected Risk Category**: `LOW`
- **Actual Risk Score**: `15.50%`
- **Actual Risk Classification**: `LOW`
- **Risk Classification Assessment**: MATCH (PASS)

## 3. SDLC Model Suitability Scores

| SDLC Model | Calculated Suitability Score (%) | Rank |
|------------|----------------------------------|------|
| Waterfall 🏆 (Recommended) | 87.50% | #1 |
| V-Model 🥈 (Alternative) | 16.75% | #2 |
| Spiral | 16.00% | #3 |
| DevSecOps | 15.00% | #4 |
| Agile | 14.25% | #5 |

## 4. Competitive SDLC Assessment

- **Expected Competitive Model(s)**: Waterfall
- **Selected Recommended Model**: `Waterfall` (87.50%)
- **Selected Alternative Model**: `V-Model` (16.75%)
- **Model Match Result**: PASS

## 5. Dynamic Algorithmic Justification

> Waterfall is recommended (Suitability Score: 87.50%) because the project is characterized by low security sensitivity (15.0%), straightforward AI algorithmic requirements (20.0%), a stable threat environment (10.0%), well-defined, stable specifications (15.0%). With minimal requirement volatility and a stable threat landscape, a linear sequential approach provides straightforward governance, predictable milestone schedules, and complete upfront architectural documentation. As a secondary alternative, V-Model scored 16.75% (a differential of 70.75%), offering an adaptable contingency should development priorities shift.

## 6. Tailored Engineering Practices

- **Standard Quality Assurance**: Follow structured standard testing and modular code organization.
  - *Details*: With stable, low-risk project attributes, adhere to conventional unit testing, integration suites, and standard revision control.

## 7. Overall Scenario Verdict

**Verdict**: **PASS**
