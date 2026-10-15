# Explainable Decision-Support Recommendation Methodology

## 1. Academic Rationale
In academic and industrial software engineering evaluations, black-box recommendations ("Model X is best because the algorithm chose it") are unacceptable. A faculty evaluator or lead architect must understand:
1. *Why* a particular SDLC was recommended over alternatives.
2. *What* happens counterfactually if an input variable changes.
3. *How* the engineering team should adapt their practices based on specific risk factors.

NETRISK is designed around **Explainable Decision Support**.

---

## 2. Selection Algorithm

```
Algorithm 1: Risk-Aware SDLC Model Selection & Synthesis
Input: 7 continuous project parameters in [0.0, 100.0]
Output: Recommended Model, Alternative Model, Dynamic Justification, Practices

1. Validate inputs: clamp each factor to [0.0, 100.0]
2. Compute Risk Score R = sum(W_i * F_i)
3. Classify Risk Level L = Classify(R)
4. For each model M in {Waterfall, V-Model, Agile, Spiral, DevSecOps}:
      Score[M] = EvaluateFormula(M, inputs)
5. Sort models descending:
      RankedModels = SortByScoreDescending(Score)
      RecommendedModel = RankedModels[0]
      AlternativeModel = RankedModels[1]
6. Extract Top Contributing Risk Drivers based on (W_i * F_i)
7. Dynamically synthesize natural-language Explanation(RecommendedModel, AlternativeModel, inputs)
8. Dynamically synthesize EngineeringPractices(inputs)
```

---

## 3. Dynamic Justification Architecture
Rather than retrieving pre-baked canned strings, the `RecommendationEngine` constructs justifications through contextual factor analysis:
- **Salient Characteristic Identification**: Parameters exceeding 60% are flagged as high contributors; parameters below 30% are flagged as stabilizing elements.
- **Model Mechanics Linking**: Explains why the winning model's specific lifecycle mechanics (e.g., Spiral's risk assessment loop, V-Model's verification matrix, or DevSecOps' CI/CD automation) directly address the project's identified traits.
- **Differential Margin Reporting**: Explicitly states the mathematical score spread between the primary recommendation and the runner-up alternative.

---

## 4. Engineering Practice Synthesis
Practices are mapped directly to empirical risk thresholds:

| Trigger Condition | Recommended Practice | Operational Action |
|-------------------|----------------------|--------------------|
| **Security Criticality $\ge 50\%$** | Integrated Security Testing | Embed automated SAST, DAST, and dependency scanning into pipelines. |
| **AI/ML Complexity $\ge 50\%$** | Continuous Model Validation | Track dataset drift, concept drift, and adversarial evasion vectors. |
| **Threat Volatility $\ge 50\%$** | Iterative Threat Modeling | Execute recurring STRIDE / MITRE ATT&CK adversary emulation sessions. |
| **Requirement Uncertainty $\ge 50\%$** | Incremental Refinement | Utilize 2-week prototyping cadences and continuous stakeholder review. |
| **Operational Criticality $\ge 50\%$** | Failure-Impact Analysis | Conduct formal FMEA, line-rate throughput latency profiling, and stress tests. |
| **Compliance Requirement $\ge 50\%$** | Traceability & Audit Logging | Construct bidirectional traceability matrices for ISO 27001 / NIST. |
| **Team Experience $< 60\%$** | Peer Verification & Mentorship | Mandate pair programming, senior review gates, and cyber incident simulation. |
