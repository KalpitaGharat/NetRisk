/**
 * NETRISK - Client API Communication Service
 * Configurable backend base URL with robust error handling.
 */

const API_CONFIG = {
  // Configurable Backend API Root URL
  BASE_URL: window.NETRISK_API_URL || "http://127.0.0.1:8000",
  TIMEOUT_MS: 10000,
};

class NetRiskAPI {
  static getBaseUrl() {
    return API_CONFIG.BASE_URL;
  }

  static setBaseUrl(url) {
    API_CONFIG.BASE_URL = url.replace(/\/$/, "");
  }

  static async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        if (data && data.message) {
          errorMsg = data.message;
        } else if (data && data.detail) {
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(d => `${d.loc?.join(".") || "field"}: ${d.msg}`).join("; ");
          } else {
            errorMsg = data.detail;
          }
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`[NETRISK API Error] ${options.method || 'GET'} ${url}:`, err);
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error(`Cannot connect to backend server at ${API_CONFIG.BASE_URL}. Ensure the FastAPI server is running.`);
      }
      throw err;
    }
  }

  // Health
  static async checkHealth() {
    return this.request("/api/health");
  }

  // Metadata
  static async getModels() {
    return this.request("/api/models");
  }

  static async getWeights() {
    return this.request("/api/weights");
  }

  // Dashboard
  static async getDashboard() {
    return this.request("/api/dashboard");
  }

  // Projects
  static async createProject(payload) {
    return this.request("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async getProjects() {
    return this.request("/api/projects");
  }

  static async getProject(projectId) {
    return this.request(`/api/projects/${projectId}`);
  }

  // Assessments
  static async createAssessment(payload) {
    return this.request("/api/assessments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async getAssessments() {
    return this.request("/api/assessments");
  }

  static async getAssessment(assessmentId) {
    return this.request(`/api/assessments/${assessmentId}`);
  }

  static async deleteAssessment(assessmentId) {
    return this.request(`/api/assessments/${assessmentId}`, {
      method: "DELETE",
    });
  }

  // Integrations (Jira & Confluence)
  static async getJiraStatus() {
    return this.request("/api/integrations/jira/status");
  }

  static async getJiraProject() {
    return this.request("/api/integrations/jira/project");
  }

  static async getJiraEpics() {
    return this.request("/api/integrations/jira/epics");
  }

  static async getJiraIssues() {
    return this.request("/api/integrations/jira/issues");
  }

  static async getJiraSprints() {
    return this.request("/api/integrations/jira/sprints");
  }

  static async getJiraProgress() {
    return this.request("/api/integrations/jira/progress");
  }

  static async getJiraActivity() {
    return this.request("/api/integrations/jira/activity");
  }

  static async getConfluencePages() {
    return this.request("/api/integrations/confluence/pages");
  }
}

// UI Utility Helpers
const UIUtils = {
  formatPercent(val) {
    return `${Number(val).toFixed(2)}%`;
  },

  formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  getRiskBadge(level) {
    const l = (level || "").toUpperCase();
    if (l === "LOW") {
      return `<span class="badge badge-low"><span class="badge-dot"></span>LOW</span>`;
    } else if (l === "MODERATE") {
      return `<span class="badge badge-moderate"><span class="badge-dot"></span>MODERATE</span>`;
    } else if (l === "HIGH") {
      return `<span class="badge badge-high"><span class="badge-dot"></span>HIGH</span>`;
    } else {
      return `<span class="badge badge-very-high"><span class="badge-dot"></span>VERY HIGH</span>`;
    }
  },

  showToast(message, type = "info") {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button style="background:none;border:none;color:#94a3b8;cursor:pointer;margin-left:0.5rem;" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4000);
  },
};
