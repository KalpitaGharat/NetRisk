# NETRISK — Academic Evaluation Scenarios Suite

This directory documents the 8 rigorous test scenarios evaluating the risk computation and SDLC recommendation engines against varying AI Intrusion Detection project profiles.

| Scenario # | Project Profile | Risk Category | Actual Risk | Recommended Model | Top Score | Status |
|------------|-----------------|---------------|-------------|-------------------|-----------|--------|
| 1 | Low-Risk IDS | LOW | 15.50% | **Waterfall** | 87.50% | **PASS** |
| 2 | High-Security IDS | HIGH | 60.75% | **V-Model** | 91.25% | **PASS** |
| 3 | High AI/ML Complexity | VERY HIGH | 71.50% | **Spiral** | 78.00% | **PASS** |
| 4 | High Threat Volatility | HIGH | 64.75% | **DevSecOps** | 75.75% | **PASS** |
| 5 | High Compliance | HIGH | 53.75% | **V-Model** | 87.00% | **PASS** |
| 6 | High Operational Criticality | HIGH | 56.30% | **V-Model** | 90.80% | **PASS** |
| 7 | High-Risk AI IDS | VERY HIGH | 90.25% | **Spiral** | 92.25% | **PASS** |
| 8 | Balanced Project | MODERATE | 50.00% | **Agile** | 50.00% | **PASS** |

## Verification Summary

All 8 academic scenarios executed directly against `RiskEngine` and `SDLCEngine`. Status: **ALL PASS**.
