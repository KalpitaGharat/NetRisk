/**
 * NETRISK - Dashboard Controller
 * Fetches metrics and initializes Chart.js visualizations
 */

document.addEventListener("DOMContentLoaded", async () => {
  const errorBanner = document.getElementById("error-banner");
  let sdlcChartInstance = null;
  let riskChartInstance = null;

  try {
    const data = await NetRiskAPI.getDashboard();
    renderMetrics(data);
    renderCharts(data);
    renderRecentTable(data.recent_assessments);
  } catch (err) {
    if (errorBanner) {
      errorBanner.style.display = "block";
      errorBanner.textContent = `Dashboard Load Failure: ${err.message}`;
    }
  }

  function renderMetrics(metrics) {
    document.getElementById("val-total-assessments").textContent = metrics.total_assessments;
    document.getElementById("val-avg-risk").textContent = `${metrics.average_risk.toFixed(2)}%`;
    document.getElementById("val-high-risk").textContent = metrics.high_risk_count;
    document.getElementById("val-veryhigh-risk").textContent = metrics.very_high_risk_count;
    document.getElementById("val-top-sdlc").textContent = metrics.most_recommended_sdlc;

    const avgSub = document.getElementById("val-avg-level");
    if (avgSub) {
      if (metrics.average_risk === 0) avgSub.textContent = "No data recorded";
      else if (metrics.average_risk <= 30) avgSub.textContent = "Average: LOW";
      else if (metrics.average_risk <= 50) avgSub.textContent = "Average: MODERATE";
      else if (metrics.average_risk <= 70) avgSub.textContent = "Average: HIGH";
      else avgSub.textContent = "Average: VERY HIGH";
    }
  }

  function renderCharts(metrics) {
    if (typeof Chart === "undefined") {
      console.warn("Chart.js not loaded.");
      return;
    }

    // SDLC Distribution Chart
    const sdlcCtx = document.getElementById("sdlcDistChart")?.getContext("2d");
    if (sdlcCtx) {
      const labels = ["Waterfall", "V-Model", "Agile", "Spiral", "DevSecOps"];
      const counts = labels.map(l => metrics.sdlc_distribution[l] || 0);

      if (sdlcChartInstance) sdlcChartInstance.destroy();

      sdlcChartInstance = new Chart(sdlcCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Recommended Count",
            data: counts,
            backgroundColor: [
              "rgba(56, 189, 248, 0.7)",
              "rgba(99, 102, 241, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
            borderColor: [
              "#38bdf8",
              "#6366f1",
              "#10b981",
              "#f59e0b",
              "#ef4444",
            ],
            borderWidth: 1.5,
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
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: { color: "#94a3b8" },
            },
            y: {
              beginAtZero: true,
              ticks: { precision: 0, color: "#94a3b8" },
              grid: { color: "rgba(255,255,255,0.05)" },
            },
          },
        },
      });
    }

    // Risk Distribution Doughnut Chart
    const riskCtx = document.getElementById("riskDistChart")?.getContext("2d");
    if (riskCtx) {
      const riskLabels = ["LOW", "MODERATE", "HIGH", "VERY HIGH"];
      const riskData = riskLabels.map(lvl => metrics.risk_level_distribution[lvl] || 0);

      if (riskChartInstance) riskChartInstance.destroy();

      riskChartInstance = new Chart(riskCtx, {
        type: "doughnut",
        data: {
          labels: riskLabels,
          datasets: [{
            data: riskData,
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(249, 115, 22, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: "#0c1220",
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#94a3b8", boxWidth: 12, padding: 16 },
            },
            tooltip: {
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderWidth: 1,
            },
          },
          cutout: "68%",
        },
      });
    }
  }

  function renderRecentTable(recents) {
    const tbody = document.getElementById("recent-tbody");
    if (!tbody) return;

    if (!recents || recents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">📋</div>
              <h4>No Project Assessments Yet</h4>
              <p>Evaluate your first AI-based IDS project to populate operational analytics.</p>
              <a href="assessment.html" class="btn btn-primary btn-sm" style="margin-top:1rem;">Start Assessment</a>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = recents.map(row => `
      <tr>
        <td style="font-weight: 600; color: #fff;">${escapeHtml(row.project_name)}</td>
        <td style="font-family: var(--font-mono);">${UIUtils.formatPercent(row.risk_score)}</td>
        <td>${UIUtils.getRiskBadge(row.risk_level)}</td>
        <td><span class="badge badge-model">${row.recommended_model}</span></td>
        <td style="font-family: var(--font-mono); color: #38bdf8;">${UIUtils.formatPercent(row.recommended_score)}</td>
        <td><span style="color: var(--text-muted); font-size: 0.85rem;">${row.alternative_model} (${UIUtils.formatPercent(row.alternative_score)})</span></td>
        <td style="color: var(--text-dim); font-size: 0.8rem;">${UIUtils.formatDate(row.created_at)}</td>
        <td>
          <a href="results.html?id=${row.id}" class="btn btn-secondary btn-sm">Inspect →</a>
        </td>
      </tr>
    `).join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
