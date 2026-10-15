/**
 * NETRISK - Application Shell Manager
 * Handles responsive sidebar collapse, active navigation routing,
 * topbar status pills, and global Atlassian integration status.
 */

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initActiveLinks();
  initGlobalJiraStatus();
});

/**
 * Initialize Sidebar Collapse & Mobile Drawer
 */
function initSidebar() {
  const collapseBtn = document.getElementById("sidebarCollapseBtn");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("appSidebar");

  // Restore collapsed state from localStorage
  const isCollapsed = localStorage.getItem("netrisk_sidebar_collapsed") === "true";
  if (isCollapsed && window.innerWidth > 992) {
    document.body.classList.add("sidebar-collapsed");
  }

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
      const current = document.body.classList.contains("sidebar-collapsed");
      localStorage.setItem("netrisk_sidebar_collapsed", current ? "true" : "false");
    });
  }

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("mobile-open");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("mobile-open") && !sidebar.contains(e.target)) {
        sidebar.classList.remove("mobile-open");
      }
    });
  }
}

/**
 * Highlight Active Navigation Link based on current URL
 */
function initActiveLinks() {
  const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const targetFile = href.split("/").pop();

    if (targetFile === currentPath || (currentPath === "" && targetFile === "dashboard.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Global Jira Status sync for topbar & sidebar indicators
 */
async function initGlobalJiraStatus() {
  const topbarPill = document.getElementById("jiraStatusPill");
  const sidebarStatus = document.getElementById("sidebarSyncStatus");

  try {
    const res = await NetRiskAPI.getJiraStatus();
    const isLive = res && res.is_connected && res.mode === "live";

    if (topbarPill) {
      if (isLive) {
        topbarPill.className = "status-pill pill-live";
        topbarPill.innerHTML = `
          <span class="sync-dot-live"></span>
          <span>LIVE JIRA (NRASS)</span>
        `;
        topbarPill.title = `Connected to ${res.project_name || 'NRASS'}`;
      } else {
        topbarPill.className = "status-pill pill-demo";
        topbarPill.innerHTML = `
          <span class="sync-dot-demo"></span>
          <span>DEMO JIRA MODE</span>
        `;
        topbarPill.title = res.message || "Running in structured academic demo mode";
      }
    }

    if (sidebarStatus) {
      if (isLive) {
        sidebarStatus.innerHTML = `
          <div style="display:flex;align-items:center;">
            <span class="sync-dot-live"></span>
            <span style="font-weight:600;color:#10b981;">Jira Cloud Active</span>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.68rem;color:#94a3b8;">NRASS</span>
        `;
      } else {
        sidebarStatus.innerHTML = `
          <div style="display:flex;align-items:center;">
            <span class="sync-dot-demo"></span>
            <span style="font-weight:600;color:#f59e0b;">Demo Project</span>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.68rem;color:#94a3b8;">NRASS</span>
        `;
      }
    }
  } catch (err) {
    console.warn("Unable to check global Jira status:", err);
    if (topbarPill) {
      topbarPill.className = "status-pill pill-demo";
      topbarPill.innerHTML = `<span class="sync-dot-demo"></span><span>OFFLINE / DEMO</span>`;
    }
  }
}
