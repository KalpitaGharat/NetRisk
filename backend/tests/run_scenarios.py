import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from app.services.recommendation_engine import RecommendationEngine
from app.services.risk_engine import RiskEngine

SCENARIOS = [
    {
        "id": 1,
        "name": "Scenario 1: Low-Risk IDS",
        "description": "Stable academic campus intrusion signature detector with low zero-day exposure and experienced team.",
        "inputs": {
            "security_criticality": 15.0,
            "ai_complexity": 20.0,
            "requirement_uncertainty": 15.0,
            "threat_volatility": 10.0,
            "operational_criticality": 20.0,
            "compliance_requirement": 15.0,
            "team_experience": 90.0,
        },
        "expected_risk_category": "LOW",
        "expected_top_models": ["Waterfall"],
    },
    {
        "id": 2,
        "name": "Scenario 2: High-Security IDS",
        "description": "Defense contractor perimeter monitoring system requiring stringent validation and zero payload breach tolerance.",
        "inputs": {
            "security_criticality": 95.0,
            "ai_complexity": 40.0,
            "requirement_uncertainty": 25.0,
            "threat_volatility": 45.0,
            "operational_criticality": 90.0,
            "compliance_requirement": 85.0,
            "team_experience": 80.0,
        },
        "expected_risk_category": "HIGH",
        "expected_top_models": ["V-Model"],
    },
    {
        "id": 3,
        "name": "Scenario 3: High AI/ML Complexity",
        "description": "Cutting-edge deep reinforcement learning and transformer ensemble for encrypted payload anomaly detection.",
        "inputs": {
            "security_criticality": 85.0,
            "ai_complexity": 95.0,
            "requirement_uncertainty": 35.0,
            "threat_volatility": 70.0,
            "operational_criticality": 75.0,
            "compliance_requirement": 60.0,
            "team_experience": 60.0,
        },
        "expected_risk_category": "VERY HIGH",
        "expected_top_models": ["Spiral"],
    },
    {
        "id": 4,
        "name": "Scenario 4: High Threat Volatility",
        "description": "Cloud-native edge intrusion detection facing polymorphic malware, nation-state APTs, and continuous zero-days.",
        "inputs": {
            "security_criticality": 80.0,
            "ai_complexity": 40.0,
            "requirement_uncertainty": 75.0,
            "threat_volatility": 95.0,
            "operational_criticality": 60.0,
            "compliance_requirement": 40.0,
            "team_experience": 75.0,
        },
        "expected_risk_category": "HIGH",
        "expected_top_models": ["DevSecOps", "Agile"],
    },
    {
        "id": 5,
        "name": "Scenario 5: High Compliance",
        "description": "Healthcare & financial sector banking network IDS bound by HIPAA, PCI-DSS, and ISO 27001 regulatory audits.",
        "inputs": {
            "security_criticality": 85.0,
            "ai_complexity": 30.0,
            "requirement_uncertainty": 20.0,
            "threat_volatility": 30.0,
            "operational_criticality": 85.0,
            "compliance_requirement": 95.0,
            "team_experience": 80.0,
        },
        "expected_risk_category": "HIGH",
        "expected_top_models": ["V-Model"],
    },
    {
        "id": 6,
        "name": "Scenario 6: High Operational Criticality",
        "description": "Telecommunications 5G core network packet inspector where packet latency spikes or outages cause network brownouts.",
        "inputs": {
            "security_criticality": 90.0,
            "ai_complexity": 35.0,
            "requirement_uncertainty": 20.0,
            "threat_volatility": 35.0,
            "operational_criticality": 98.0,
            "compliance_requirement": 80.0,
            "team_experience": 85.0,
        },
        "expected_risk_category": "HIGH",
        "expected_top_models": ["V-Model"],
    },
    {
        "id": 7,
        "name": "Scenario 7: High-Risk AI IDS",
        "description": "Massive military satellite intelligence network IDS with experimental neural models, volatile adversary vectors, and novice team.",
        "inputs": {
            "security_criticality": 95.0,
            "ai_complexity": 95.0,
            "requirement_uncertainty": 85.0,
            "threat_volatility": 90.0,
            "operational_criticality": 90.0,
            "compliance_requirement": 85.0,
            "team_experience": 25.0,
        },
        "expected_risk_category": "VERY HIGH",
        "expected_top_models": ["Spiral", "DevSecOps"],
    },
    {
        "id": 8,
        "name": "Scenario 8: Balanced Project",
        "description": "Standard mid-market corporate IDS with median complexity across all architectural dimensions.",
        "inputs": {
            "security_criticality": 50.0,
            "ai_complexity": 50.0,
            "requirement_uncertainty": 50.0,
            "threat_volatility": 50.0,
            "operational_criticality": 50.0,
            "compliance_requirement": 50.0,
            "team_experience": 50.0,
        },
        "expected_risk_category": "MODERATE",
        "expected_top_models": ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"],
    },
]

def run_all_scenarios():
    output_dir = project_root / "tests" / "scenarios"
    output_dir.mkdir(parents=True, exist_ok=True)

    summary_lines = [
        "# NETRISK — Academic Evaluation Scenarios Suite",
        "",
        "This directory documents the 8 rigorous test scenarios evaluating the risk computation and SDLC recommendation engines against varying AI Intrusion Detection project profiles.",
        "",
        "| Scenario # | Project Profile | Risk Category | Actual Risk | Recommended Model | Top Score | Status |",
        "|------------|-----------------|---------------|-------------|-------------------|-----------|--------|",
    ]

    all_passed = True

    for s in SCENARIOS:
        res = RecommendationEngine.evaluate(**s["inputs"])
        actual_risk = res["risk_score"]
        actual_cat = res["risk_level"]
        actual_rec = res["recommended_model"]
        actual_score = res["recommended_score"]
        alt_rec = res["alternative_model"]
        alt_score = res["alternative_score"]

        # Check pass criteria
        cat_match = actual_cat == s["expected_risk_category"]
        model_match = actual_rec in s["expected_top_models"]
        status_pass = cat_match and model_match
        if not status_pass:
            all_passed = False

        status_str = "PASS" if status_pass else "FAIL"

        summary_lines.append(
            f"| {s['id']} | {s['name'].split(': ')[1]} | {actual_cat} | {actual_risk:.2f}% | **{actual_rec}** | {actual_score:.2f}% | **{status_str}** |"
        )

        # Write individual scenario file
        slug = s["name"].lower().replace(" ", "_").replace(":", "").replace("-", "_").replace("/", "_")
        sc_file = output_dir / f"{slug}.md"
        with open(sc_file, "w", encoding="utf-8") as f:
            f.write(f"# {s['name']}\n\n")
            f.write(f"**Description**: {s['description']}\n\n")
            f.write("## 1. Input Parameters\n\n")
            f.write("| Parameter | Evaluated Input (0–100) | Weight | Contribution |\n")
            f.write("|-----------|-------------------------|--------|--------------|\n")
            for factor_key, weight in RiskEngine.WEIGHTS.items():
                if factor_key == "team_risk":
                    val = 100.0 - s["inputs"]["team_experience"]
                    raw_in = s["inputs"]["team_experience"]
                    f.write(f"| Team Experience (Raw: {raw_in}) | {val:.1f} (Team Risk) | {weight*100:.0f}% | +{val*weight:.2f}% |\n")
                else:
                    val = s["inputs"][factor_key]
                    name = RiskEngine.FACTOR_METADATA[factor_key]["name"]
                    f.write(f"| {name} | {val:.1f} | {weight*100:.0f}% | +{val*weight:.2f}% |\n")

            f.write("\n## 2. Risk Classification\n\n")
            f.write(f"- **Expected Risk Category**: `{s['expected_risk_category']}`\n")
            f.write(f"- **Actual Risk Score**: `{actual_risk:.2f}%`\n")
            f.write(f"- **Actual Risk Classification**: `{actual_cat}`\n")
            f.write(f"- **Risk Classification Assessment**: {'MATCH (PASS)' if cat_match else 'MISMATCH (FAIL)'}\n\n")

            f.write("## 3. SDLC Model Suitability Scores\n\n")
            f.write("| SDLC Model | Calculated Suitability Score (%) | Rank |\n")
            f.write("|------------|----------------------------------|------|\n")
            for idx, item in enumerate(res["ranked_models"], start=1):
                star = " 🏆 (Recommended)" if idx == 1 else " 🥈 (Alternative)" if idx == 2 else ""
                f.write(f"| {item['model']}{star} | {item['score']:.2f}% | #{idx} |\n")

            f.write("\n## 4. Competitive SDLC Assessment\n\n")
            f.write(f"- **Expected Competitive Model(s)**: {', '.join(s['expected_top_models'])}\n")
            f.write(f"- **Selected Recommended Model**: `{actual_rec}` ({actual_score:.2f}%)\n")
            f.write(f"- **Selected Alternative Model**: `{alt_rec}` ({alt_score:.2f}%)\n")
            f.write(f"- **Model Match Result**: {'PASS' if model_match else 'FAIL'}\n\n")

            f.write("## 5. Dynamic Algorithmic Justification\n\n")
            f.write(f"> {res['explanation']}\n\n")

            f.write("## 6. Tailored Engineering Practices\n\n")
            for p in res["development_practices"]:
                f.write(f"- **{p['factor']}**: {p['recommendation']}\n  - *Details*: {p['details']}\n")

            f.write(f"\n## 7. Overall Scenario Verdict\n\n")
            f.write(f"**Verdict**: **{status_str}**\n")

    summary_file = output_dir / "README.md"
    with open(summary_file, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines))
        f.write("\n\n## Verification Summary\n\n")
        f.write(f"All 8 academic scenarios executed directly against `RiskEngine` and `SDLCEngine`. Status: **{'ALL PASS' if all_passed else 'SOME FAILED'}**.\n")

    print(f"Scenarios successfully executed. All passed: {all_passed}")

if __name__ == "__main__":
    run_all_scenarios()
