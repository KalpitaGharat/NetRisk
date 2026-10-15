# NETRISK Mathematical Risk Model Specification

## 1. Overview
The **NETRISK** risk assessment engine provides a formal, quantitative foundation for evaluating the engineering risk profile of Artificial Intelligence-based Intrusion Detection Systems (AI-IDS). Unlike conventional web applications, an AI-IDS operates within an adversarial, high-throughput network environment where failures range from false alarms to catastrophic payload evasion.

## 2. Risk Dimension Weighting

The overall project risk score is computed as a weighted sum of seven distinct parameters, evaluated on a normalized scale of `[0.0, 100.0]`:

$$\text{Overall Risk} = \sum_{i=1}^{7} (W_i \times F_i)$$

Where the weights $W_i$ and factors $F_i$ are defined as:

| Dimension | Key Identifier | Weight ($W_i$) | Description & Scope |
|-----------|----------------|----------------|---------------------|
| **Security Criticality** | `security_criticality` | **0.25 (25%)** | Sensitivity of monitored traffic; severity of data breach or undetected intrusion. |
| **AI/ML Complexity** | `ai_complexity` | **0.20 (20%)** | Intricacy of feature extraction, model architecture (e.g., deep neural networks), drift, and evasion susceptibility. |
| **Requirement Uncertainty** | `requirement_uncertainty` | **0.15 (15%)** | Volatility of customer requirements, attack definitions, or detection scope. |
| **Threat Volatility** | `threat_volatility` | **0.15 (15%)** | Rate of novel zero-day exploits, polymorphic payloads, and mutating attack vectors. |
| **Operational Criticality** | `operational_criticality` | **0.10 (10%)** | Permissible packet inspection latency, throughput bottleneck tolerance, and high availability. |
| **Compliance Requirement** | `compliance_requirement` | **0.10 (10%)** | Regulatory constraints (e.g., NIST SP 800-53, ISO 27001, GDPR, PCI-DSS). |
| **Team Risk** | `team_risk` | **0.05 (5%)** | Inverse of team competency: $\text{Team Risk} = 100 - \text{Team Experience}$. |

$$\sum_{i=1}^{7} W_i = 0.25 + 0.20 + 0.15 + 0.15 + 0.10 + 0.10 + 0.05 = 1.00 \text{ (100\%)}$$

## 3. Team Risk Derivation
Team experience is captured as an asset score ($[0, 100]$). Because higher experience mitigates risk, the risk engine calculates team vulnerability inversely:

$$\text{Team Risk} = 100.0 - \text{Team Experience}$$

For example:
- Expert Team ($\text{Experience} = 90$): $\text{Team Risk} = 10.0$ (Contribution = $+0.50\%$)
- Novice Team ($\text{Experience} = 20$): $\text{Team Risk} = 80.0$ (Contribution = $+4.00\%$)

## 4. Risk Classification Thresholds
The continuous risk score is clamped to $[0.0, 100.0]$ and categorized into four standardized severity tiers:

$$\text{Category}(R) = \begin{cases}
\text{LOW} & 0 \le R \le 30.0 \\
\text{MODERATE} & 30.0 < R \le 50.0 \\
\text{HIGH} & 50.0 < R \le 70.0 \\
\text{VERY HIGH} & 70.0 < R \le 100.0
\end{cases}$$

## 5. Algorithmic Properties
- **Determinism**: Given identical inputs, the engine guarantees identical risk scores.
- **Explainability**: Every point of the final score is itemized into its constituent weighted driver.
- **Monotonicity**: Increasing any threat, uncertainty, or complexity parameter strictly increases overall risk.
