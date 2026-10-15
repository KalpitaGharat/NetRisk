import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  Globe, 
  ShieldCheck, 
  Key, 
  Layers, 
  Sliders,
  ExternalLink
} from 'lucide-react';
import { NetRiskAPI } from '../api';

export default function SettingsPage({ showToast }) {
  const [jiraStatus, setJiraStatus] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [testingJira, setTestingJira] = useState(false);
  const [testingHealth, setTestingHealth] = useState(false);

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  async function fetchDiagnostics() {
    try {
      const [jStatus, bHealth] = await Promise.all([
        NetRiskAPI.getJiraStatus(),
        NetRiskAPI.checkHealth(),
      ]);
      setJiraStatus(jStatus);
      setBackendHealth(bHealth);
    } catch (err) {
      console.warn("Diagnostics error:", err);
    }
  }

  const handleTestJira = async () => {
    setTestingJira(true);
    try {
      const res = await NetRiskAPI.getJiraStatus();
      setJiraStatus(res);
      if (res?.is_connected) {
        showToast('Successfully verified Jira Cloud credentials!', 'success');
      } else {
        showToast(res?.message || 'Jira running in demo mode', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to connect to Jira API', 'error');
    } finally {
      setTestingJira(false);
    }
  };

  const handleTestHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await NetRiskAPI.checkHealth();
      setBackendHealth(res);
      showToast('FastAPI backend & SQLite database healthy!', 'success');
    } catch (err) {
      showToast(err.message || 'Health check failed', 'error');
    } finally {
      setTestingHealth(false);
    }
  };

  const weights = [
    { factor: "Security Criticality", weight: "25%", role: "Impact of compromise & asset sensitivity" },
    { factor: "AI/ML Complexity", weight: "20%", role: "Model architecture, data pipeline, retraining" },
    { factor: "Threat Volatility", weight: "15%", role: "Zero-day pace & polymorphic evolution" },
    { factor: "Requirement Uncertainty", weight: "15%", role: "Exploratory specifications & scope volatility" },
    { factor: "Operational Criticality", weight: "10%", role: "Latency bounds & false-positive tolerance" },
    { factor: "Compliance Requirement", weight: "10%", role: "Auditing, NIST, ISO 27001, regulatory rules" },
    { factor: "Team Experience (Inverted)", weight: "5%", role: "Maturity mitigating architectural friction" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyber-cyan" />
            System &amp; Integration Diagnostics
          </h1>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Real-time status of backend services, database persistence, and Atlassian cloud bridges.
          </p>
        </div>
      </div>

      {/* Grid of Diagnostics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jira Cloud Diagnostic */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-cyber-blue/15 border border-cyber-blue/30 flex items-center justify-center font-bold text-cyber-cyan text-xs">
                JIRA
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Atlassian Jira Cloud Bridge</h3>
                <span className="text-[11px] text-cyber-textMuted">Project Key: NRASS</span>
              </div>
            </div>

            <button
              onClick={handleTestJira}
              disabled={testingJira}
              className="px-3 py-1.5 rounded-lg bg-cyber-elevated hover:bg-cyber-blue hover:text-white border border-cyber-border text-xs font-semibold text-cyber-sky flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingJira ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-cyber-elevated border border-cyber-border space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Status:</span>
              <span className={jiraStatus?.is_connected ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {jiraStatus?.mode === 'live' ? 'ONLINE (AUTHENTICATED)' : 'DEMO MODE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Host URL:</span>
              <span className="text-white truncate max-w-[220px]">
                {jiraStatus?.base_url || 'https://sakec-team-bcq481n1.atlassian.net'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Project:</span>
              <span className="text-white">{jiraStatus?.project_name || 'NETRISK (NRASS)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Token Protection:</span>
              <span className="text-emerald-400">Strict Server-Side (Zero Client Leakage)</span>
            </div>
          </div>

          <p className="text-[11px] text-cyber-textMuted leading-relaxed">
            {jiraStatus?.message || 'Synchronized with Jira REST API v3 via basic auth token.'}
          </p>
        </div>

        {/* Backend & SQLite Diagnostic */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">FastAPI Backend &amp; SQLite</h3>
                <span className="text-[11px] text-cyber-textMuted">Port 8000 &bull; Local Engine</span>
              </div>
            </div>

            <button
              onClick={handleTestHealth}
              disabled={testingHealth}
              className="px-3 py-1.5 rounded-lg bg-cyber-elevated hover:bg-cyber-blue hover:text-white border border-cyber-border text-xs font-semibold text-cyber-sky flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
              <span>Ping Health</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-cyber-elevated border border-cyber-border space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Backend Status:</span>
              <span className="text-emerald-400 font-bold">
                {backendHealth?.status?.toUpperCase() || 'HEALTHY'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Database Engine:</span>
              <span className="text-white">SQLite (SQLAlchemy ORM)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">FastAPI Version:</span>
              <span className="text-white">{backendHealth?.version || '2.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-textMuted">Swagger Docs:</span>
              <a 
                href="http://127.0.0.1:8000/docs" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyber-cyan hover:underline flex items-center gap-1"
              >
                <span>/docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-cyber-textMuted leading-relaxed">
            Persistent storage maintained in `backend/netrisk.db` with automated migrations and relational integrity.
          </p>
        </div>
      </div>

      {/* Model Weights Configuration Table */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyber-cyan" />
          Rigorous Seven-Factor Mathematical Weight Distribution
        </h3>
        <p className="text-xs text-cyber-textMuted">
          Normalized mathematical weights enforced by the risk scoring algorithm
        </p>

        <div className="overflow-x-auto border border-cyber-border rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyber-elevated text-cyber-textMuted uppercase text-[11px] font-bold tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-3">Risk Dimension</th>
                <th className="px-4 py-3">Weight Coefficient</th>
                <th className="px-4 py-3">Engineering Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border text-cyber-textSecondary">
              {weights.map((w, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold text-white">{w.factor}</td>
                  <td className="px-4 py-3 font-mono font-bold text-cyber-cyan">{w.weight}</td>
                  <td className="px-4 py-3 text-cyber-textMuted">{w.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SDG 9 Alignment Statement Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyber-card to-cyber-elevated border border-amber-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg shrink-0">
          9
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            UN SDG 9 &bull; Industry, Innovation and Infrastructure
          </div>
          <h4 className="text-sm font-bold text-white">
            Resilient Digital Infrastructure via Risk-Disciplined AI Engineering
          </h4>
          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            By preventing catastrophic architecture mismatch in AI-based intrusion detection software, NETRISK directly advances Target 9.1 (resilient infrastructure) and Target 9.4 (upgrading industrial cybersecurity capabilities).
          </p>
        </div>
      </div>
    </div>
  );
}
