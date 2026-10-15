/**
 * NETRISK - Project Management & Jira/Confluence Controller
 * Synchronizes Atlassian Jira progress, Confluence docs, and diagnostics.
 */

document.addEventListener("DOMContentLoaded", async () => {
  let statusChartInstance = null;

  // Initial Load
  await loadAllProjectData();

  // Refresh Button Listener
  const refreshBtn = document.getElementById("btn-refresh-jira");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = "⏳ Refreshing Sync...";
      try {
        await loadAllProjectData();
        UIUtils.showToast("Project data successfully synchronized.", "success");
      } catch (err) {
        UIUtils.showToast(`Refresh error: ${err.message}`, "danger");
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = "🔄 Test Connection / Refresh";
      }
    });
  }

  async function loadAllProjectData() {
    try {
      const [status, project, sprints, epics, progress, activity, confluence] = await Promise.all([
        NetRiskAPI.getJiraStatus(),
        NetRiskAPI.getJiraProject(),
        NetRiskAPI.getJiraSprints(),
        NetRiskAPI.getJiraEpics(),
        NetRiskAPI.getJiraProgress(),
        NetRiskAPI.getJiraActivity(),
        NetRiskAPI.getConfluencePages(),
      ]);

      renderStatusBadge(status);
      renderOverview(project);
      renderSprints(sprints);
      renderEpics(epics);
      renderProgressChart(progress);
      renderConfluenceDocs(confluence);
      renderActivity(activity);
      renderDiagnostics(status);
    } catch (err) {
      console.error("Failed to load project management data:", err);
      UIUtils.showToast(`Failed to load project data: ${err.message}`, "danger");
    }
  }

  function renderStatusBadge(status) {
    const pill = document.getElementById("jira-connection-pill");
    const banner = document.getElementById("demo-mode-banner");
    const desc = document.getElementById("demo-banner-desc");

    if (status.is_connected && status.mode === "live") {
      pill.className = "status-pill status-live";
      pill.innerHTML = `
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981;"></span>
        CONNECTED: LIVE JIRA (${status.project_key})
      `;
      if (banner) {
        banner.style.display = "none";
      }
    } else {
      pill.className = "status-pill status-demo";
      pill.innerHTML = `
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#f59e0b;"></span>
        DEMO MODE (PROJECT: ${status.project_key})
      `;
      if (banner) {
        banner.style.display = "flex";
        if (desc && status.message) {
          desc.textContent = status.message;
        }
      }
    }
  }

  function renderOverview(proj) {
    document.getElementById("val-jira-key").textContent = proj.project_key;
    document.getElementById("val-jira-name").textContent = proj.project_name;
    document.getElementById("val-jira-pct").textContent = `${proj.completion_percentage}%`;
    document.getElementById("val-jira-epics").textContent = proj.total_epics;
    document.getElementById("val-jira-sprints").textContent = proj.number_of_sprints;
    document.getElementById("val-jira-done").textContent = proj.completed_stories;
    document.getElementById("val-jira-total").textContent = proj.total_stories;
    document.getElementById("val-jira-pending").textContent = proj.pending_stories;

    const boardBtn = document.getElementById("jira-board-btn");
    if (boardBtn && proj.atlassian_url) {
      boardBtn.href = proj.atlassian_url;
    }
  }

  function renderSprints(sprintsData) {
    const container = document.getElementById("sprints-container");
    if (!container) return;

    const sprints = sprintsData.sprints || [];
    container.innerHTML = sprints.map(s => {
      const isDone = s.status === "COMPLETED";
      const statusBadge = isDone 
        ? `<span class="badge badge-low">COMPLETED</span>` 
        : `<span class="badge badge-model">IN PROGRESS</span>`;

      return `
        <div class="sprint-card">
          <div>
            <div class="sprint-header">
              <div>
                <h4 class="sprint-title">${escapeHtml(s.sprint_name)}</h4>
                <div class="sprint-dates">📅 ${s.start_date} → ${s.end_date}</div>
              </div>
              ${statusBadge}
            </div>

            <div class="sprint-progress-bar-bg">
              <div class="sprint-progress-bar-fill" style="width: ${s.completion_percentage}%;"></div>
            </div>

            <div class="sprint-meta-row">
              <span>Points: <strong>${s.completed_story_points} / ${s.total_story_points}</strong></span>
              <span><strong>${s.completion_percentage}%</strong></span>
            </div>
            <div class="sprint-meta-row" style="margin-top: 0.25rem;">
              <span>Tasks: ${s.completed_tasks} completed</span>
              <span>${s.pending_tasks} pending</span>
            </div>
          </div>

          <div class="sprint-goal">
            <strong>Goal:</strong> ${escapeHtml(s.goal)}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderEpics(epicsData) {
    const container = document.getElementById("epics-container");
    if (!container) return;

    const epics = epicsData.epics || [];
    container.innerHTML = epics.map((epic, idx) => {
      const isComplete = epic.status === "DONE";
      const badge = isComplete 
        ? `<span class="badge badge-low">DONE (100%)</span>`
        : `<span class="badge badge-model">IN PROGRESS (${epic.progress_percentage}%)</span>`;

      return `
        <div class="epic-card">
          <div class="epic-header" onclick="toggleEpic('epic-body-${idx}', 'epic-arrow-${idx}')">
            <div class="epic-info">
              <h4>
                <span class="epic-tag">${epic.id}</span>
                ${escapeHtml(epic.name)}
              </h4>
              <div class="epic-summary">${escapeHtml(epic.summary)}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              ${badge}
              <span id="epic-arrow-${idx}" style="color: var(--text-dim); transition: transform 0.2s;">▼</span>
            </div>
          </div>
          <div id="epic-body-${idx}" class="epic-body" style="display: ${idx === 4 ? 'block' : 'none'};">
            ${(epic.stories || []).map(st => `
              <div class="story-item">
                <span class="story-key">${st.key}</span>
                <span class="story-title">${escapeHtml(st.title)}</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); margin-right: 0.75rem;">${st.points} pts</span>
                <span class="${st.status === 'DONE' ? 'story-badge-done' : 'story-badge-progress'}">${st.status}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  window.toggleEpic = function(bodyId, arrowId) {
    const body = document.getElementById(bodyId);
    const arrow = document.getElementById(arrowId);
    if (!body) return;
    const isHidden = body.style.display === "none";
    body.style.display = isHidden ? "block" : "none";
    if (arrow) {
      arrow.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
    }
  };

  function renderProgressChart(progress) {
    const ctx = document.getElementById("jiraStatusChart")?.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

    const dist = progress.distribution || {};
    const labels = ["Done", "In Progress", "In Review", "To Do"];
    const counts = [dist["Done"] || 0, dist["In Progress"] || 0, dist["In Review"] || 0, dist["To Do"] || 0];

    if (statusChartInstance) statusChartInstance.destroy();

    statusChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            "rgba(16, 185, 129, 0.85)", // Done (Green)
            "rgba(59, 130, 246, 0.85)",  // In Progress (Blue)
            "rgba(245, 158, 11, 0.85)",  // In Review (Amber)
            "rgba(100, 116, 139, 0.85)", // To Do (Slate)
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
            labels: { color: "#94a3b8", boxWidth: 12, padding: 12 },
          },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "#334155",
            borderWidth: 1,
          },
        },
        cutout: "68%",
      },
    });

    const legendStats = document.getElementById("status-legend-stats");
    if (legendStats) {
      legendStats.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; text-align: center;">
          <div style="background: var(--bg-dark); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Total Tasks</div>
            <div style="font-size: 1.4rem; font-weight: 700; font-family: var(--font-mono); color: #fff;">${progress.total_tasks}</div>
          </div>
          <div style="background: var(--bg-dark); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase;">Completion Rate</div>
            <div style="font-size: 1.4rem; font-weight: 700; font-family: var(--font-mono); color: #10b981;">${progress.completion_rate}%</div>
          </div>
        </div>
      `;
    }
  }

  function renderConfluenceDocs(confData) {
    const container = document.getElementById("confluence-container");
    if (!container) return;

    const pages = confData.pages || [];
    container.innerHTML = pages.map(p => `
      <div class="confluence-card">
        <div>
          <div class="confluence-top">
            <div class="confluence-icon-box">${p.icon}</div>
            <div>
              <span class="confluence-doc-cat">${escapeHtml(p.category)}</span>
              <h4 class="confluence-doc-title">${escapeHtml(p.title)}</h4>
            </div>
          </div>
          <p class="confluence-doc-desc">${escapeHtml(p.description)}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.75rem;">
          <span style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--text-dim);">${p.status}</span>
          <a href="${p.url}" target="_blank" class="btn btn-primary btn-sm">
            Open Documentation ↗
          </a>
        </div>
      </div>
    `).join("");
  }

  function renderActivity(actData) {
    const container = document.getElementById("activity-container");
    if (!container) return;

    const acts = actData.activities || [];
    container.innerHTML = acts.map(a => `
      <li class="activity-item">
        <div class="activity-icon">📌</div>
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-summary">
              <span style="color: #38bdf8; font-family: var(--font-mono);">${a.issue_key}</span>: ${escapeHtml(a.summary)}
            </span>
            <span class="activity-time">${a.timestamp}</span>
          </div>
          <div class="activity-desc">
            ${escapeHtml(a.details)} — <em>${escapeHtml(a.author)}</em>
          </div>
        </div>
      </li>
    `).join("");
  }

  function renderDiagnostics(status) {
    const connElem = document.getElementById("diag-conn-status");
    const modeElem = document.getElementById("diag-mode");
    const hostElem = document.getElementById("diag-host");
    const projElem = document.getElementById("diag-project-key");

    if (connElem) {
      if (status.is_connected && status.mode === "live") {
        connElem.innerHTML = `<span style="color: #10b981; font-weight: 700;">● Active (HTTP 200 Authenticated)</span>`;
      } else {
        connElem.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">○ Unconfigured / Demo Fallback</span>`;
      }
    }
    if (modeElem) {
      modeElem.textContent = status.mode === "live" ? "Live Jira Cloud API v3" : "Academic Demo Mode (Structured Micro-Project Data)";
    }
    if (hostElem) {
      hostElem.textContent = status.base_url || "https://sakec-team-bcq481n1.atlassian.net";
    }
    if (projElem) {
      projElem.textContent = status.project_key || "NRASS";
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
