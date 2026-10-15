# Scenario 4: High Threat Volatility

**Description**: Cloud-native edge intrusion detection facing polymorphic malware, nation-state APTs, and continuous zero-days.

## 1. Input Parameters

| Parameter | Evaluated Input (0–100) | Weight | Contribution |
|-----------|-------------------------|--------|--------------|
| Security Criticality | 80.0 | 25% | +20.00% |
| AI/ML Complexity | 40.0 | 20% | +8.00% |
| Requirement Uncertainty | 75.0 | 15% | +11.25% |
| Threat Volatility | 95.0 | 15% | +14.25% |
| Operational Criticality | 60.0 | 10% | +6.00% |
| Compliance Requirement | 40.0 | 10% | +4.00% |
| Team Experience (Raw: 75.0) | 25.0 (Team Risk) | 5% | +1.25% |

## 2. Risk Classification

- **Expected Risk Category**: `HIGH`
- **Actual Risk Score**: `64.75%`
- **Actual Risk Classification**: `HIGH`
- **Risk Classification Assessment**: MATCH (PASS)

## 3. SDLC Model Suitability Scores

| SDLC Model | Calculated Suitability Score (%) | Rank |
|------------|----------------------------------|------|
| DevSecOps 🏆 (Recommended) | 75.75% | #1 |
| Agile 🥈 (Alternative) | 75.00% | #2 |
| Spiral | 69.50% | #3 |
| V-Model | 65.00% | #4 |
| Waterfall | 15.00% | #5 |

## 4. Competitive SDLC Assessment

- **Expected Competitive Model(s)**: DevSecOps, Agile
- **Selected Recommended Model**: `DevSecOps` (75.75%)
- **Selected Alternative Model**: `Agile` (75.00%)
- **Model Match Result**: PASS

## 5. Dynamic Algorithmic Justification

> DevSecOps is recommended (Suitability Score: 75.75%) because the project demonstrates high security criticality (80.0%), significant threat volatility (95.0%), high requirement uncertainty (75.0%), mission-critical operational reliability (60.0%). The combination of rapid threat emergence and critical security demands requires an automated CI/CD pipeline where security checks (SAST, DAST, container scanning) and continuous model monitoring are integrated directly into development, ensuring real-time response to mutating zero-day exploits. As a secondary alternative, Agile scored 75.00% (a differential of 0.75%), offering an adaptable contingency should development priorities shift.

## 6. Tailored Engineering Practices

- **Security Criticality**: Integrate security testing throughout development.
  - *Details*: Given high security criticality (80.0%), embed automated SAST, DAST, and dependency vulnerability scanning into the pipeline.
- **Threat Volatility**: Use iterative threat modelling and frequent security reviews.
  - *Details*: With high threat volatility (95.0%), conduct regular STRIDE/MITRE ATT&CK threat modeling and recurring red-team adversary emulation.
- **Requirement Uncertainty**: Use incremental requirements refinement.
  - *Details*: To address requirement volatility (75.0%), utilize short prototyping cadences, user story backlogs, and stakeholder feedback loops.
- **Operational Criticality**: Perform extensive verification and failure-impact analysis.
  - *Details*: For mission-critical uptime (60.0%), conduct packet-drop stress tests, latency profiling, and formal Failure Mode and Effects Analysis (FMEA).

## 7. Overall Scenario Verdict

**Verdict**: **PASS**
