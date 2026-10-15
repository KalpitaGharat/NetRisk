/**
 * NETRISK — Client-Side Application Controller
 * Vanilla JavaScript interacting with FastAPI endpoints and Chart.js
 */

// Toast Notifications
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
};

// Sidebar Controls (Collapse, Mobile Drawer, Persistence)
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.app-container');
  const collapseToggle = document.getElementById('sidebar-collapse-toggle');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('app-sidebar') || document.querySelector('.sidebar');

  // Restore sidebar collapse state
  if (container && localStorage.getItem('netrisk_sidebar_collapsed') === 'true') {
    container.classList.add('sidebar-collapsed');
  }

  // Toggle desktop collapse
  if (collapseToggle && container) {
    collapseToggle.addEventListener('click', () => {
      container.classList.toggle('sidebar-collapsed');
      const isCollapsed = container.classList.contains('sidebar-collapsed');
      localStorage.setItem('netrisk_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    });
  }

  // Mobile menu toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Live formatted date in navbar
  const dateEl = document.getElementById('current-date-display');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }
});

// Modal Utilities
window.openModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.add('active');
  }
};

window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.remove('active');
  }
};

// Assessment Wizard Live Calculations & Presets
window.initAssessmentWizard = function() {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  const sliders = {
    s: document.getElementById('slider-security'),
    a: document.getElementById('slider-ai'),
    u: document.getElementById('slider-uncertainty'),
    t: document.getElementById('slider-threat'),
    o: document.getElementById('slider-operational'),
    c: document.getElementById('slider-compliance'),
    e: document.getElementById('slider-team'),
  };

  const previewScore = document.getElementById('live-risk-score');
  const previewBadge = document.getElementById('live-risk-badge');
  const previewBar = document.getElementById('live-risk-bar');

  function calculateLiveRisk() {
    const s = parseFloat(sliders.s?.value || 50);
    const a = parseFloat(sliders.a?.value || 50);
    const u = parseFloat(sliders.u?.value || 50);
    const t = parseFloat(sliders.t?.value || 50);
    const o = parseFloat(sliders.o?.value || 50);
    const c = parseFloat(sliders.c?.value || 50);
    const teamExp = parseFloat(sliders.e?.value || 50);
    const teamRisk = 100 - teamExp;

    const overall = (s * 0.25) + (a * 0.20) + (u * 0.15) + (t * 0.15) + (o * 0.10) + (c * 0.10) + (teamRisk * 0.05);
    const rounded = Math.round(overall * 100) / 100;

    if (previewScore) previewScore.textContent = `${rounded.toFixed(1)}%`;
    if (previewBar) previewBar.style.width = `${Math.min(100, Math.max(0, rounded))}%`;

    let level = 'LOW';
    let badgeClass = 'badge-low';
    let barColor = 'var(--risk-low)';

    if (rounded <= 30.0) {
      level = 'LOW';
      badgeClass = 'badge-low';
      barColor = 'var(--risk-low)';
    } else if (rounded <= 50.0) {
      level = 'MODERATE';
      badgeClass = 'badge-moderate';
      barColor = 'var(--risk-moderate)';
    } else if (rounded <= 70.0) {
      level = 'HIGH';
      badgeClass = 'badge-high';
      barColor = 'var(--risk-high)';
    } else {
      level = 'VERY HIGH';
      badgeClass = 'badge-very-high';
      barColor = 'var(--risk-very-high)';
    }

    if (previewBadge) {
      previewBadge.textContent = level;
      previewBadge.className = `badge ${badgeClass}`;
    }
    if (previewBar) {
      previewBar.style.backgroundColor = barColor;
    }
  }

  // Bind input events to all sliders
  Object.keys(sliders).forEach(key => {
    const el = sliders[key];
    if (el) {
      const valDisplay = document.getElementById(`val-${key}`);
      el.addEventListener('input', () => {
        if (valDisplay) valDisplay.textContent = el.value;
        calculateLiveRisk();
      });
    }
  });

  // Calculate initially
  calculateLiveRisk();

  // Presets
  const presets = {
    critical: {
      name: "Critical Infrastructure AI-IDS",
      desc: "High-assurance deep packet inspection for SCADA / Industrial IoT grid defense.",
      cat: "Industrial / SCADA Cyber-Defense",
      s: 90, a: 80, u: 40, t: 75, o: 95, c: 90, e: 80
    },
    enterprise: {
      name: "Enterprise SOC Threat Hunter",
      desc: "Cloud SIEM behavioral anomaly detection assistant with adaptive threat models.",
      cat: "Enterprise SOC Threat Detection",
      s: 70, a: 85, u: 65, t: 80, o: 60, c: 50, e: 60
    },
    edge: {
      name: "SaaS Gateway Edge-IDS",
      desc: "Initial lightweight serverless packet filter prototype targeting rapid threat iterations.",
      cat: "Cloud-Native Edge Security",
      s: 50, a: 60, u: 85, t: 70, o: 45, c: 40, e: 40
    }
  };

  window.applyPreset = function(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    const nameInput = document.getElementById('project_name');
    const descInput = document.getElementById('project_description');
    const catInput = document.getElementById('project_category');

    if (nameInput) nameInput.value = p.name;
    if (descInput) descInput.value = p.desc;
    if (catInput) catInput.value = p.cat;

    sliders.s.value = p.s; document.getElementById('val-s').textContent = p.s;
    sliders.a.value = p.a; document.getElementById('val-a').textContent = p.a;
    sliders.u.value = p.u; document.getElementById('val-u').textContent = p.u;
    sliders.t.value = p.t; document.getElementById('val-t').textContent = p.t;
    sliders.o.value = p.o; document.getElementById('val-o').textContent = p.o;
    sliders.c.value = p.c; document.getElementById('val-c').textContent = p.c;
    sliders.e.value = p.e; document.getElementById('val-e').textContent = p.e;

    calculateLiveRisk();
    window.showToast(`Applied preset: ${p.name}`, 'info');
  };

  // Form submission via Fetch
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-assessment-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Evaluating Risk Profile...</span>';
    }

    const payload = {
      project_name: document.getElementById('project_name').value.trim(),
      description: document.getElementById('project_description').value.trim() || null,
      category: document.getElementById('project_category')?.value.trim() || 'AI-IDS Cybersecurity',
      security_criticality: parseFloat(sliders.s.value),
      ai_complexity: parseFloat(sliders.a.value),
      requirement_uncertainty: parseFloat(sliders.u.value),
      threat_volatility: parseFloat(sliders.t.value),
      operational_criticality: parseFloat(sliders.o.value),
      compliance_requirement: parseFloat(sliders.c.value),
      team_experience: parseFloat(sliders.e.value),
    };

    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        let errMessage = 'Failed to submit assessment';
        if (data && data.message) errMessage = data.message;
        else if (data && data.details) errMessage = data.details.map(d => d.message).join('; ');
        throw new Error(errMessage);
      }

      window.showToast('Assessment successfully computed and saved!', 'success');
      window.location.href = `/results/${data.id}`;
    } catch (err) {
      window.showToast(err.message, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Generate Risk Assessment</span>';
      }
    }
  });
};

// Dashboard Chart Instances Store
window.dashboardChartInstances = {
  riskDonut: null,
  sdlcComparison: null,
};

// Render or Update Semicircular Risk Gauge
window.updateRiskGauge = function(score) {
  const arc = document.getElementById('gauge-fill-arc');
  const scoreVal = document.getElementById('gauge-score-display');
  const levelBadge = document.getElementById('gauge-level-badge');
  const postureDesc = document.getElementById('gauge-posture-text');

  const clampedScore = Math.min(100, Math.max(0, Number(score) || 0));
  
  if (scoreVal) {
    scoreVal.textContent = clampedScore.toFixed(1) + '%';
  }

  if (arc) {
    const totalLength = 282.74; // Circumference of semicircle r=90
    const fillLength = (clampedScore / 100) * totalLength;
    arc.style.strokeDasharray = `${fillLength} ${totalLength}`;

    let color = '#10b981'; // LOW
    let levelText = 'LOW RISK';
    let postureText = 'Portfolio operates within safe thresholds (0.00% – 30.00%). Standard agile testing and baseline code audits are sufficient.';

    if (clampedScore > 70.0) {
      color = '#ef4444';
      levelText = 'VERY HIGH RISK';
      postureText = 'Critical risk threshold exceeded (>70.00%). Demands zero-trust validation, formal verification (V-Model / Spiral), and automated adversarial regression suites.';
    } else if (clampedScore > 50.0) {
      color = '#f97316';
      levelText = 'HIGH RISK';
      postureText = 'Elevated operational & threat complexity (50.01% – 70.00%). Requires formal phase gating, dedicated penetration audits, and robust data drift monitors.';
    } else if (clampedScore > 30.0) {
      color = '#f59e0b';
      levelText = 'MODERATE RISK';
      postureText = 'Balanced risk posture (30.01% – 50.00%). Iterative lifecycle models with scheduled SAST/DAST pipeline integration recommended.';
    }

    arc.style.stroke = color;

    if (levelBadge) {
      levelBadge.textContent = levelText;
      levelBadge.style.color = color;
      levelBadge.style.borderColor = color;
      levelBadge.style.background = `${color}1a`;
    }

    if (postureDesc) {
      postureDesc.textContent = postureText;
    }
  }
};

// Chart.js: Dashboard Visualizations
window.initDashboardCharts = function(sdlcDistribution, riskDistribution, totalCount, averageScore) {
  // Update Semicircular Gauge
  window.updateRiskGauge(averageScore || 0);

  // Update Donut Center Count
  const centerVal = document.getElementById('donut-center-total');
  if (centerVal) {
    centerVal.textContent = totalCount || 0;
  }

  // 1. Risk Severity Donut Chart
  const donutCanvas = document.getElementById('riskDistChart');
  if (donutCanvas) {
    if (window.dashboardChartInstances.riskDonut) {
      window.dashboardChartInstances.riskDonut.destroy();
    }

    const riskLabels = ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH'];
    const riskCounts = riskLabels.map(lvl => (riskDistribution && riskDistribution[lvl]) || 0);

    window.dashboardChartInstances.riskDonut = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk (0–30%)', 'Moderate (30–50%)', 'High (50–70%)', 'Very High (70–100%)'],
        datasets: [{
          data: riskCounts,
          backgroundColor: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
          borderColor: '#0f172a',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'Inter', size: 11, weight: 500 },
              padding: 14,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#1e293b',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw || 0;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                return ` ${context.label}: ${val} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // 2. SDLC Model Comparison Chart
  const barCanvas = document.getElementById('sdlcDistChart');
  if (barCanvas) {
    if (window.dashboardChartInstances.sdlcComparison) {
      window.dashboardChartInstances.sdlcComparison.destroy();
    }

    const models = ['Waterfall', 'V-Model', 'Agile', 'Spiral', 'DevSecOps'];
    const counts = models.map(m => (sdlcDistribution && sdlcDistribution[m]) || 0);
    const colors = {
      'Waterfall': '#38bdf8',
      'V-Model': '#6366f1',
      'Agile': '#10b981',
      'Spiral': '#f59e0b',
      'DevSecOps': '#00f2fe'
    };

    window.dashboardChartInstances.sdlcComparison = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: models,
        datasets: [{
          label: 'Recommendations',
          data: counts,
          backgroundColor: models.map(m => colors[m]),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#1e293b',
            borderWidth: 1,
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            callbacks: {
              label: (context) => ` Total Recommendations: ${context.raw}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, precision: 0 },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            ticks: { color: '#f8fafc', font: { family: 'Inter', size: 12, weight: 600 } },
            grid: { display: false }
          }
        }
      }
    });
  }
};

// Asynchronous Dashboard Refresh without full page reload
window.refreshDashboardData = async function() {
  const refreshBtn = document.getElementById('dashboard-refresh-btn');
  const refreshIcon = refreshBtn ? refreshBtn.querySelector('svg') : null;
  if (refreshIcon) refreshIcon.classList.add('spin-icon');

  try {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to retrieve updated intelligence metrics');
    const data = await res.json();

    // Update KPI numbers
    const totalEl = document.getElementById('kpi-total-assessments');
    if (totalEl) totalEl.textContent = data.total_assessments;

    const meanEl = document.getElementById('kpi-mean-risk');
    if (meanEl) meanEl.textContent = Number(data.average_risk).toFixed(1) + '%';

    const highEl = document.getElementById('kpi-high-risk-count');
    if (highEl) highEl.textContent = data.critical_projects_count;

    const highPctEl = document.getElementById('kpi-high-risk-pct');
    if (highPctEl) highPctEl.textContent = `${data.high_risk_percentage}% of portfolio`;

    const sdlcEl = document.getElementById('kpi-dominant-sdlc');
    if (sdlcEl) sdlcEl.textContent = data.most_recommended_sdlc;

    const sdlcSubEl = document.getElementById('kpi-dominant-sdlc-sub');
    if (sdlcSubEl) sdlcSubEl.textContent = `${data.most_recommended_count} evaluations (${data.most_recommended_share}%)`;

    // Re-initialize charts
    window.initDashboardCharts(
      data.sdlc_distribution,
      data.risk_level_distribution,
      data.total_assessments,
      data.average_risk
    );

    window.showToast('Dashboard intelligence synchronized with SQLite ledger.', 'success');
  } catch (err) {
    window.showToast(err.message, 'error');
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('spin-icon');
  }
};

// Client-Side Table Filtering & Search
window.initDashboardTableInteractions = function() {
  const searchInput = document.getElementById('table-search-input');
  const riskSelect = document.getElementById('filter-risk-select');
  const sdlcSelect = document.getElementById('filter-sdlc-select');
  const sortSelect = document.getElementById('sort-table-select');
  const tableBody = document.getElementById('dashboard-table-body');
  const emptyRow = document.getElementById('table-no-results-row');
  const counterEl = document.getElementById('table-visible-count');

  if (!tableBody) return;

  function filterAndSortRows() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const riskFilter = riskSelect ? riskSelect.value : 'ALL';
    const sdlcFilter = sdlcSelect ? sdlcSelect.value : 'ALL';
    const sortMode = sortSelect ? sortSelect.value : 'newest';

    const rows = Array.from(tableBody.querySelectorAll('tr:not(#table-no-results-row)'));
    let visibleCount = 0;

    rows.forEach(row => {
      const name = (row.dataset.projectName || '').toLowerCase();
      const risk = row.dataset.riskLevel || '';
      const sdlc = row.dataset.recommendedModel || '';

      const matchesSearch = !query || name.includes(query);
      const matchesRisk = riskFilter === 'ALL' || risk === riskFilter;
      const matchesSDLC = sdlcFilter === 'ALL' || sdlc === sdlcFilter;

      if (matchesSearch && matchesRisk && matchesSDLC) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    const visibleRows = rows.filter(r => r.style.display !== 'none');
    visibleRows.sort((a, b) => {
      if (sortMode === 'highest-risk') {
        return (Number(b.dataset.riskScore) || 0) - (Number(a.dataset.riskScore) || 0);
      } else if (sortMode === 'lowest-risk') {
        return (Number(a.dataset.riskScore) || 0) - (Number(b.dataset.riskScore) || 0);
      } else if (sortMode === 'name') {
        return (a.dataset.projectName || '').localeCompare(b.dataset.projectName || '');
      } else {
        return (Number(b.dataset.id) || 0) - (Number(a.dataset.id) || 0);
      }
    });

    visibleRows.forEach(row => tableBody.appendChild(row));

    if (emptyRow) {
      emptyRow.style.display = visibleCount === 0 ? '' : 'none';
    }

    if (counterEl) {
      counterEl.textContent = `${visibleCount} of ${rows.length} records`;
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterAndSortRows);
  if (riskSelect) riskSelect.addEventListener('change', filterAndSortRows);
  if (sdlcSelect) sdlcSelect.addEventListener('change', filterAndSortRows);
  if (sortSelect) sortSelect.addEventListener('change', filterAndSortRows);
};

// Chart.js: Results Page Visualizations
window.initResultsCharts = function(sdlcScores, recommendedModel) {
  // Horizontal Bar Chart
  const barCanvas = document.getElementById('resultsBarChart');
  if (barCanvas && sdlcScores) {
    const models = ['Waterfall', 'V-Model', 'Agile', 'Spiral', 'DevSecOps'];
    const scores = models.map(m => Number((sdlcScores[m] || 0).toFixed(2)));
    const bgColors = models.map(m => m === recommendedModel ? '#00f2fe' : '#38bdf8');

    new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: models,
        datasets: [{
          label: 'Suitability Score (%)',
          data: scores,
          backgroundColor: bgColors,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#1e293b',
            borderWidth: 1,
            callbacks: {
              label: (context) => `Suitability: ${context.raw}%`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, callback: v => `${v}%` },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            ticks: { color: '#f8fafc', font: { family: 'Inter', size: 12, weight: 600 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Radar Chart
  const radarCanvas = document.getElementById('resultsRadarChart');
  if (radarCanvas && sdlcScores) {
    const models = ['Waterfall', 'V-Model', 'Agile', 'Spiral', 'DevSecOps'];
    const scores = models.map(m => Number((sdlcScores[m] || 0).toFixed(2)));

    new Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: models,
        datasets: [{
          label: 'Suitability Footprint',
          data: scores,
          backgroundColor: 'rgba(0, 242, 254, 0.25)',
          borderColor: '#00f2fe',
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00f2fe'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#1e293b',
            borderWidth: 1
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, color: '#475569', backdropColor: 'transparent', font: { size: 9 } },
            grid: { color: 'rgba(255,255,255,0.08)' },
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: 600 } }
          }
        }
      }
    });
  }
};

// History Page Filter & Deletion
window.initHistoryPage = function() {
  const searchInput = document.getElementById('history-search');
  const riskFilter = document.getElementById('filter-risk');
  const modelFilter = document.getElementById('filter-model');
  const sortSelect = document.getElementById('sort-by');
  const tableBody = document.getElementById('history-table-body');
  let itemToDeleteId = null;

  function filterTable() {
    if (!tableBody) return;
    const query = (searchInput?.value || '').toLowerCase().trim();
    const risk = riskFilter?.value || 'ALL';
    const model = modelFilter?.value || 'ALL';
    const rows = Array.from(tableBody.querySelectorAll('tr[data-id]'));

    rows.forEach(row => {
      const name = (row.getAttribute('data-name') || '').toLowerCase();
      const rowRisk = (row.getAttribute('data-risk') || '').toUpperCase();
      const rowModel = row.getAttribute('data-model') || '';

      const matchesSearch = !query || name.includes(query);
      const matchesRisk = risk === 'ALL' || rowRisk === risk;
      const matchesModel = model === 'ALL' || rowModel === model;

      row.style.display = (matchesSearch && matchesRisk && matchesModel) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (riskFilter) riskFilter.addEventListener('change', filterTable);
  if (modelFilter) modelFilter.addEventListener('change', filterTable);

  // Sorting
  if (sortSelect && tableBody) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      const rows = Array.from(tableBody.querySelectorAll('tr[data-id]'));

      rows.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-created') || 0);
        const dateB = new Date(b.getAttribute('data-created') || 0);
        const scoreA = parseFloat(a.getAttribute('data-score') || 0);
        const scoreB = parseFloat(b.getAttribute('data-score') || 0);

        if (sortBy === 'date_desc') return dateB - dateA;
        if (sortBy === 'date_asc') return dateA - dateB;
        if (sortBy === 'risk_desc') return scoreB - scoreA;
        if (sortBy === 'risk_asc') return scoreA - scoreB;
        return 0;
      });

      rows.forEach(r => tableBody.appendChild(r));
    });
  }

  // Deletion Modal
  window.confirmDeleteAssessment = function(id, name) {
    itemToDeleteId = id;
    const nameEl = document.getElementById('delete-target-name');
    if (nameEl) nameEl.textContent = name || `#${id}`;
    window.openModal('delete-modal');
  };

  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!itemToDeleteId) return;
      confirmDeleteBtn.disabled = true;
      try {
        const resp = await fetch(`/api/assessments/${itemToDeleteId}`, {
          method: 'DELETE'
        });
        if (!resp.ok) throw new Error('Failed to delete assessment');

        const row = document.querySelector(`tr[data-id="${itemToDeleteId}"]`);
        if (row) row.remove();

        window.showToast(`Deleted assessment #${itemToDeleteId}`, 'info');
        window.closeModal('delete-modal');
      } catch (err) {
        window.showToast(err.message, 'error');
      } finally {
        confirmDeleteBtn.disabled = false;
      }
    });
  }
};

// Kanban Board Issue Creation
window.initKanbanBoard = function() {
  const form = document.getElementById('create-jira-issue-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('create-issue-submit-btn');
    if (btn) btn.disabled = true;

    const payload = {
      summary: document.getElementById('issue_summary').value.trim(),
      description: document.getElementById('issue_description').value.trim() || null,
      issue_type: document.getElementById('issue_type').value,
      priority: document.getElementById('issue_priority').value,
      parent_key: document.getElementById('issue_parent_epic').value || null,
    };

    try {
      const resp = await fetch('/api/integrations/jira/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (data && data.success) {
        window.showToast(data.message || 'Created Jira issue!', 'success');
        window.closeModal('create-issue-modal');
        setTimeout(() => window.location.reload(), 800);
      } else {
        throw new Error(data.message || 'Failed to create Jira issue');
      }
    } catch (err) {
      window.showToast(err.message, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  // Kanban Filter by Search & Epic
  const searchInput = document.getElementById('kanban-search');
  const epicSelect = document.getElementById('kanban-epic-filter');

  function filterKanban() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const epic = epicSelect?.value || 'ALL';
    const cards = document.querySelectorAll('.kanban-card');

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const key = (card.getAttribute('data-key') || '').toLowerCase();
      const cardEpic = card.getAttribute('data-epic') || '';

      const matchQ = !q || title.includes(q) || key.includes(q);
      const matchEpic = epic === 'ALL' || cardEpic === epic;

      card.style.display = (matchQ && matchEpic) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterKanban);
  if (epicSelect) epicSelect.addEventListener('change', filterKanban);
};

// JSON Export for Results Page
window.exportAssessmentJson = function(assessmentData) {
  if (!assessmentData) return;
  const blob = new Blob([JSON.stringify(assessmentData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NETRISK_${(assessmentData.project_name || 'assessment').replace(/\s+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.showToast('Exported assessment JSON report', 'success');
};
