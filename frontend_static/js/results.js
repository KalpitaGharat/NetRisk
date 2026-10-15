/**
 * NETRISK - Results View Controller
 * Visualizes calculated SDLC suitability, risk breakdowns, and dynamic justifications.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const assessmentId = urlParams.get("id");
  const errorBox = document.getElementById("error-box");

  let sdlcChartInstance = null;
  let riskChartInstance = null;

  try {
    let data;
    if (assessmentId) {
      data = await NetRiskAPI.getAssessment(assessmentId);
    } else {
      // Fallback: load most recent assessment
      const recents = await NetRiskAPI.getAssessments();
      if (recents && recents.length > 0) {
        data = await NetRiskAPI.getAssessment(recents[0].id);
      } else {
        throw new Error("No assessments found. Please create an assessment first.");
      }
    }

    renderAssessment(data);
  } catch (err) {
    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.textContent = `Failed to load assessment report: ${err.message}`;
    }
  }

  function renderAssessment(data) {
    // Header & KPIs
    document.getElementById("res-project-name").textContent = data.project_name;
    document.getElementById("res-project-desc").textContent = data.description || "No description provided.";
    document.getElementById("res-timestamp").textContent = `Assessed: ${UIUtils.formatDate(data.created_at)}`;

    document.getElementById("res-overall-score").textContent = UIUtils.formatPercent(data.risk_score);
    document.getElementById("res-overall-badge").innerHTML = UIUtils.getRiskBadge(data.risk_level);

    document.getElementById("res-rec-model").textContent = data.recommended_model;
    document.getElementById("res-rec-score").textContent = UIUtils.formatPercent(data.recommended_score);

    document.getElementById("res-alt-model").textContent = data.alternative_model;
    document.getElementById("res-alt-score").textContent = UIUtils.formatPercent(data.alternative_score);

    // Dynamic Explanation
    document.getElementById("res-explanation").textContent = data.explanation;

    // Charts
    renderSDLCComparisonChart(data.sdlc_scores, data.recommended_model);
    renderRiskFactorChart(data.risk_breakdown);

    // Contributing Factors List
    renderContributingFactors(data.contributing_factors);

    // Recommended Practices
    renderPractices(data.development_practices);
  }

  function renderSDLCComparisonChart(sdlcScores, recommendedModel) {
    const ctx = document.getElementById("sdlcComparisonChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

    const models = ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"];
    const scores = models.map(m => sdlcScores[m] || 0);

    // Visually highlight the recommended model with Cyan, secondary with muted blue, others with slate
    const bgColors = models.map(m => {
      if (m === recommendedModel) return "rgba(6, 182, 212, 0.85)"; // Vibrant Cyan
      return "rgba(51, 65, 85, 0.75)";
    });

    const borderColors = models.map(m => {
      if (m === recommendedModel) return "#06b6d4";
      return "#475569";
    });

    if (sdlcChartInstance) sdlcChartInstance.destroy();

    sdlcChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: models,
        datasets: [{
          label: "Suitability Score (%)",
          data: scores,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 6,
        }],
      },
      options: {
        indexAxis: "y", // Horizontal Bar Chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "#334155",
            borderWidth: 1,
            callbacks: {
              label: (context) => ` Suitability: ${context.parsed.x.toFixed(2)}%`,
            },
          },
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: {
              color: "#94a3b8",
              callback: (val) => `${val}%`,
            },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
          y: {
            ticks: {
              color: "#f1f5f9",
              font: { weight: "600" },
            },
            grid: { display: false },
          },
        },
      },
    });
  }

  function renderRiskFactorChart(riskBreakdown) {
    const ctx = document.getElementById("riskFactorChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

    const values = riskBreakdown?.values || {};
    const labels = [
      "Security",
      "AI Complexity",
      "Req Uncertainty",
      "Threat Volatility",
      "Operational",
      "Compliance",
      "Team Risk",
    ];
    const dataVals = [
      values.security_criticality || 0,
      values.ai_complexity || 0,
      values.requirement_uncertainty || 0,
      values.threat_volatility || 0,
      values.operational_criticality || 0,
      values.compliance_requirement || 0,
      values.team_risk || 0,
    ];

    const barColors = dataVals.map(val => {
      if (val >= 71) return "rgba(239, 68, 68, 0.75)";    // Very High (Red)
      if (val >= 51) return "rgba(249, 115, 22, 0.75)";   // High (Orange)
      if (val >= 31) return "rgba(245, 158, 11, 0.75)";   // Moderate (Amber)
      return "rgba(16, 185, 129, 0.75)";                 // Low (Green)
    });

    if (riskChartInstance) riskChartInstance.destroy();

    riskChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Evaluated Factor Value (0-100)",
          data: dataVals,
          backgroundColor: barColors,
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "#334155",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#94a3b8",
              font: { size: 11 },
            },
            grid: { display: false },
          },
          y: {
            min: 0,
            max: 100,
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
        },
      },
    });
  }

  function renderContributingFactors(factors) {
    const list = document.getElementById("factors-list");
    if (!list) return;

    if (!factors || factors.length === 0) {
      list.innerHTML = `<div style="color: var(--text-dim);">No factor breakdown available.</div>`;
      return;
    }

    list.innerHTML = factors.map(f => `
      <div class="factor-item">
        <div>
          <div style="font-weight: 600; color: #fff;">${escapeHtml(f.name)}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">Weight: ${f.weight_pct} | Raw Input: ${f.raw_value.toFixed(1)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-cyan);">+${f.weighted_contribution.toFixed(2)}%</div>
          <div style="font-size: 0.72rem; color: ${getSeverityColor(f.severity)}; font-weight: 700;">${f.severity}</div>
        </div>
      </div>
    `).join("");
  }

  function renderPractices(practices) {
    const list = document.getElementById("practices-list");
    if (!list) return;

    if (!practices || practices.length === 0) {
      list.innerHTML = `<div style="color: var(--text-dim);">No specific engineering practices generated.</div>`;
      return;
    }

    list.innerHTML = practices.map(p => `
      <div class="practice-card">
        <span class="practice-tag">${escapeHtml(p.factor)}</span>
        <h4 class="practice-title">💡 ${escapeHtml(p.recommendation)}</h4>
        <p class="practice-desc">${escapeHtml(p.details)}</p>
      </div>
    `).join("");
  }

  function getSeverityColor(sev) {
    if (sev === "CRITICAL") return "#ef4444";
    if (sev === "HIGH") return "#f97316";
    if (sev === "MODERATE") return "#f59e0b";
    return "#10b981";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
