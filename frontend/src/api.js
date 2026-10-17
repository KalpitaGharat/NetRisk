/**
 * NETRISK - Client API Communication Service
 * Connects to FastAPI backend using standard relative paths
 */

const BASE_URL = (typeof window !== "undefined" && window.NETRISK_API_URL) ? window.NETRISK_API_URL : "";

export class NetRiskAPI {
  static getBaseUrl() {
    return BASE_URL;
  }

  static async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("netrisk_token") : null;
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
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
        throw new Error(`Cannot connect to backend server. Ensure the NETRISK FastAPI service is reachable.`);
      }
      throw err;
    }
  }

  // Authentication
  static login(credentials) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  static logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  static getSession() {
    return this.request("/api/auth/me");
  }

  // Health
  static checkHealth() {
    return this.request("/health");
  }

  // Metadata
  static getModels() {
    return this.request("/api/models");
  }

  static getWeights() {
    return this.request("/api/weights");
  }

  // Dashboard
  static getDashboard() {
    return this.request("/api/dashboard");
  }

  // Projects
  static createProject(payload) {
    return this.request("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static getProjects() {
    return this.request("/api/projects");
  }

  static getProject(projectId) {
    return this.request(`/api/projects/${projectId}`);
  }

  // Assessments
  static createAssessment(payload) {
    return this.request("/api/assessments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static getAssessments() {
    return this.request("/api/assessments");
  }

  static getAssessment(assessmentId) {
    return this.request(`/api/assessments/${assessmentId}`);
  }

  static deleteAssessment(assessmentId) {
    return this.request(`/api/assessments/${assessmentId}`, {
      method: "DELETE",
    });
  }

  // Integrations (Jira & Confluence)
  static getJiraStatus() {
    return this.request("/api/integrations/jira/status");
  }

  static getJiraProject() {
    return this.request("/api/integrations/jira/project");
  }

  static getJiraEpics() {
    return this.request("/api/integrations/jira/epics");
  }

  static getJiraIssues() {
    return this.request("/api/integrations/jira/issues");
  }

  static createJiraIssue(payload) {
    return this.request("/api/integrations/jira/issues", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static getJiraSprints() {
    return this.request("/api/integrations/jira/sprints");
  }

  static getJiraProgress() {
    return this.request("/api/integrations/jira/progress");
  }

  static getJiraActivity() {
    return this.request("/api/integrations/jira/activity");
  }

  static getConfluencePages() {
    return this.request("/api/integrations/confluence/pages");
  }
}
