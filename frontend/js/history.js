/**
 * NETRISK - History Log Controller
 * Fetches historical assessments, handles inspection navigation and deletion.
 */

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("history-tbody");
  const countBadge = document.getElementById("history-count-badge");
  const alertBox = document.getElementById("history-alert");

  loadHistory();

  async function loadHistory() {
    try {
      const assessments = await NetRiskAPI.getAssessments();
      renderTable(assessments);
    } catch (err) {
      if (alertBox) {
        alertBox.style.display = "block";
        alertBox.textContent = `Error loading history: ${err.message}`;
      }
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: #ef4444; padding: 2rem;">
            Failed to retrieve records from database.
          </td>
        </tr>
      `;
    }
  }

  function renderTable(list) {
    if (countBadge) {
      countBadge.textContent = `${list.length} Total`;
    }

    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">🗂️</div>
              <h4>No Historical Assessments Found</h4>
              <p>Assess an AI-based IDS project to store the risk and model recommendation record.</p>
              <a href="assessment.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">
                + Create First Assessment
              </a>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(item => `
      <tr id="row-${item.id}">
        <td style="font-family: var(--font-mono); color: var(--text-dim); font-size: 0.85rem;">#${item.id}</td>
        <td style="font-weight: 600; color: #fff;">${escapeHtml(item.project_name)}</td>
        <td style="font-family: var(--font-mono);">${UIUtils.formatPercent(item.risk_score)}</td>
        <td>${UIUtils.getRiskBadge(item.risk_level)}</td>
        <td><span class="badge badge-model">${item.recommended_model}</span></td>
        <td style="font-family: var(--font-mono); color: #38bdf8;">${UIUtils.formatPercent(item.recommended_score)}</td>
        <td style="color: var(--text-dim); font-size: 0.82rem;">${UIUtils.formatDate(item.created_at)}</td>
        <td style="text-align: right; white-space: nowrap;">
          <a href="results.html?id=${item.id}" class="btn btn-secondary btn-sm" style="margin-right: 0.4rem;">
            View
          </a>
          <button class="btn btn-danger btn-sm" onclick="handleDelete(${item.id}, '${escapeHtml(item.project_name)}')">
            Delete
          </button>
        </td>
      </tr>
    `).join("");
  }

  window.handleDelete = async function(id, projectName) {
    const confirmed = confirm(`Are you sure you want to delete assessment #${id} for "${projectName}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await NetRiskAPI.deleteAssessment(id);
      UIUtils.showToast(`Assessment #${id} deleted successfully.`, "success");
      // Remove row dynamically
      const row = document.getElementById(`row-${id}`);
      if (row) row.remove();
      // Reload history to update totals
      loadHistory();
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
