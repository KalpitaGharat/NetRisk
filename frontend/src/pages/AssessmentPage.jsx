import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  FileQuestion, 
  Radio, 
  Server, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  Info
} from 'lucide-react';
import { NetRiskAPI } from '../api';
import RiskGauge from '../components/RiskGauge';
import RiskBadge from '../components/RiskBadge';

export default function AssessmentPage({ setCurrentTab, setSelectedAssessmentId, showToast }) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    securityCriticality: 65,
    aiComplexity: 70,
    requirementUncertainty: 50,
    threatVolatility: 60,
    operationalCriticality: 55,
    complianceRequirement: 50,
    teamExperience: 60,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Weight configuration for the 7 factors
  const weights = {
    sec: 0.25,
    ai: 0.20,
    req: 0.15,
    threat: 0.15,
    ops: 0.10,
    comp: 0.10,
    exp: 0.05,
  };

  // Dynamic live risk calculation
  // team_risk = (100 - team_experience) * 0.05
  const liveContributions = {
    sec: formData.securityCriticality * weights.sec,
    ai: formData.aiComplexity * weights.ai,
    req: formData.requirementUncertainty * weights.req,
    threat: formData.threatVolatility * weights.threat,
    ops: formData.operationalCriticality * weights.ops,
    comp: formData.complianceRequirement * weights.comp,
    exp: (100 - formData.teamExperience) * weights.exp,
  };

  const overallLiveRisk = Object.values(liveContributions).reduce((a, b) => a + b, 0);

  const getRiskLevel = (score) => {
    if (score <= 30) return "LOW";
    if (score <= 50) return "MODERATE";
    if (score <= 70) return "HIGH";
    return "VERY HIGH";
  };

  const currentRiskLevel = getRiskLevel(overallLiveRisk);

  // Presets
  const presets = [
    {
      name: "Critical Banking IDS",
      desc: "High regulatory compliance, critical operational uptime, and high security boundaries.",
      data: {
        projectName: "Global Core Banking AI-NIDS",
        description: "Zero-downtime intrusion detection system for international SWIFT/banking transactions.",
        securityCriticality: 92,
        aiComplexity: 78,
        requirementUncertainty: 30,
        threatVolatility: 75,
        operationalCriticality: 95,
        complianceRequirement: 96,
        teamExperience: 75,
      }
    },
    {
      name: "Zero-Trust Defense IDS",
      desc: "Mission-critical perimeter, high threat volatility, and strict military cyberdefense standards.",
      data: {
        projectName: "Tactical Perimeter Zero-Trust IDS",
        description: "Autonomous behavioral anomaly detection for defense communication networks.",
        securityCriticality: 95,
        aiComplexity: 85,
        requirementUncertainty: 45,
        threatVolatility: 90,
        operationalCriticality: 90,
        complianceRequirement: 88,
        teamExperience: 80,
      }
    },
    {
      name: "Agile Cloud Prototype",
      desc: "Experimental graph-based anomaly detector exploring evolving microservice telemetry.",
      data: {
        projectName: "Cloud Microservices Anomaly Detector",
        description: "Rapidly iterating machine learning model analyzing Kubernetes telemetry stream.",
        securityCriticality: 45,
        aiComplexity: 82,
        requirementUncertainty: 78,
        threatVolatility: 65,
        operationalCriticality: 40,
        complianceRequirement: 35,
        teamExperience: 60,
      }
    },
    {
      name: "Startup IDS Prototype",
      desc: "Emerging security solution with beginner team, high uncertainty, and basic compliance.",
      data: {
        projectName: "SaaS Gateway Edge-IDS",
        description: "Initial minimum viable security prototype for serverless edge routing.",
        securityCriticality: 50,
        aiComplexity: 60,
        requirementUncertainty: 85,
        threatVolatility: 70,
        operationalCriticality: 45,
        complianceRequirement: 40,
        teamExperience: 40,
      }
    }
  ];

  const applyPreset = (p) => {
    setFormData(p.data);
    showToast(`Loaded "${p.name}" preset parameters`, 'info');
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      description: '',
      securityCriticality: 50,
      aiComplexity: 50,
      requirementUncertainty: 50,
      threatVolatility: 50,
      operationalCriticality: 50,
      complianceRequirement: 50,
      teamExperience: 50,
    });
    setError(null);
    showToast('Reset form to baseline values', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectName.trim()) {
      setError('Please provide a Project Name.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      project_name: formData.projectName.trim(),
      description: formData.description.trim() || null,
      security_criticality: Number(formData.securityCriticality),
      ai_complexity: Number(formData.aiComplexity),
      requirement_uncertainty: Number(formData.requirementUncertainty),
      threat_volatility: Number(formData.threatVolatility),
      operational_criticality: Number(formData.operationalCriticality),
      compliance_requirement: Number(formData.complianceRequirement),
      team_experience: Number(formData.teamExperience),
    };

    try {
      const res = await NetRiskAPI.createAssessment(payload);
      showToast('Assessment computed & persisted in SQLite!', 'success');
      setSelectedAssessmentId(res.id);
      setCurrentTab('results');
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const factorConfigs = [
    {
      key: 'securityCriticality',
      label: 'Security Criticality',
      weightText: '25% Weight',
      icon: ShieldAlert,
      color: 'text-rose-400',
      help: 'Sensitivity of defended assets, confidentiality, and integrity impact if breached.'
    },
    {
      key: 'aiComplexity',
      label: 'AI / ML Complexity',
      weightText: '20% Weight',
      icon: Cpu,
      color: 'text-purple-400',
      help: 'Deep learning pipeline, feature engineering, model drift, and retraining latency.'
    },
    {
      key: 'threatVolatility',
      label: 'Threat Volatility',
      weightText: '15% Weight',
      icon: Radio,
      color: 'text-orange-400',
      help: 'Evolution speed of zero-day exploits and polymorphic adversarial attacks.'
    },
    {
      key: 'requirementUncertainty',
      label: 'Requirement Uncertainty',
      weightText: '15% Weight',
      icon: FileQuestion,
      color: 'text-amber-400',
      help: 'Ambiguity of detection specs, changing stakeholders, and exploratory features.'
    },
    {
      key: 'operationalCriticality',
      label: 'Operational Criticality',
      weightText: '10% Weight',
      icon: Server,
      color: 'text-blue-400',
      help: 'Acceptable false-positive tolerance and real-time wire-speed throughput requirements.'
    },
    {
      key: 'complianceRequirement',
      label: 'Compliance & Governance',
      weightText: '10% Weight',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      help: 'Statutory compliance (NIST, ISO 27001, GDPR, PCI-DSS) and audit traceability.'
    },
    {
      key: 'teamExperience',
      label: 'Team Experience & Maturity',
      weightText: '5% Weight (Inverted)',
      icon: Users,
      color: 'text-cyber-cyan',
      help: 'Familiarity with secure MLOps, adversarial ML defense, and secure coding practices.'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            New Project Risk Assessment Wizard
          </h1>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Quantify 7 project risk factors to compute explainable SDLC model recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated border border-cyber-border text-xs font-semibold text-cyber-textSecondary hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-textMuted flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
          Quick-Load Scenario Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-2.5 text-left rounded-lg bg-cyber-elevated hover:bg-cyber-blue/15 border border-cyber-border hover:border-cyber-blue/40 transition group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyber-cyan transition">
                {p.name}
              </div>
              <div className="text-[10px] text-cyber-textMuted line-clamp-1 mt-0.5">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Assessment Grid: Form on Left (2/3), Sticky Live Preview on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Section 1: Project Metadata */}
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyber-blue/20 text-cyber-sky flex items-center justify-center text-xs font-mono font-bold">1</span>
              Project Identification &amp; Context
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-cyber-textPrimary mb-1.5">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Autonomous Banking IDS"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-cyber-input border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-blue transition placeholder:text-cyber-textMuted"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cyber-textPrimary mb-1.5">
                  Project Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify system purpose, deployment environment, and defense constraints..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-cyber-input border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-blue transition placeholder:text-cyber-textMuted"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 7 Risk Factors */}
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyber-blue/20 text-cyber-sky flex items-center justify-center text-xs font-mono font-bold">2</span>
              Seven-Dimensional Risk Attributes
            </h3>

            <div className="space-y-5 divide-y divide-cyber-border/60">
              {factorConfigs.map((cfg) => {
                const Icon = cfg.icon;
                const value = formData[cfg.key];
                return (
                  <div key={cfg.key} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                        <span className="text-xs font-bold text-white">
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-mono text-cyber-textMuted px-1.5 py-0.5 rounded bg-cyber-elevated">
                          {cfg.weightText}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-extrabold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/20 px-2 py-0.5 rounded">
                        {value} / 100
                      </span>
                    </div>

                    <p className="text-[11px] text-cyber-textMuted">
                      {cfg.help}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] font-mono text-cyber-textMuted">0</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [cfg.key]: Number(e.target.value) })}
                        className="w-full h-1.5 bg-cyber-elevated rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-cyber-textMuted">100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-cyan text-cyber-bg font-extrabold text-sm shadow-glowCyan hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />
                  <span>Computing Mathematical Suitability...</span>
                </>
              ) : (
                <>
                  <span>Calculate Risk &amp; Recommend SDLC</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Sticky Preview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border sticky top-24 space-y-5">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-textMuted">
                Real-Time Risk Preview
              </h3>
              <RiskBadge level={currentRiskLevel} size="sm" />
            </div>

            {/* Gauge */}
            <div className="flex justify-center py-2">
              <RiskGauge score={overallLiveRisk} size={150} />
            </div>

            {/* Breakdown contributions */}
            <div className="space-y-2.5 pt-2 border-t border-cyber-border text-xs">
              <div className="flex justify-between text-cyber-textMuted font-mono text-[11px]">
                <span>Risk Factor</span>
                <span>Contribution</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Security Criticality:</span>
                  <span className="font-mono text-white">{liveContributions.sec.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">AI/ML Complexity:</span>
                  <span className="font-mono text-white">{liveContributions.ai.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Threat Volatility:</span>
                  <span className="font-mono text-white">{liveContributions.threat.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Req. Uncertainty:</span>
                  <span className="font-mono text-white">{liveContributions.req.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Operational Impact:</span>
                  <span className="font-mono text-white">{liveContributions.ops.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Compliance Req.:</span>
                  <span className="font-mono text-white">{liveContributions.comp.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-textSecondary">Inverted Team Risk:</span>
                  <span className="font-mono text-white">{liveContributions.exp.toFixed(1)}%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-cyber-border flex items-center justify-between font-bold text-sm">
                <span className="text-white">Total Project Risk:</span>
                <span className="font-mono text-cyber-cyan text-base">
                  {overallLiveRisk.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Decision Logic Notice */}
            <div className="p-3 rounded-lg bg-cyber-elevated border border-cyber-border text-[11px] text-cyber-textMuted flex items-start gap-2">
              <Info className="w-4 h-4 text-cyber-sky shrink-0 mt-0.5" />
              <span>
                Scores above 70% favor risk-mitigating lifecycles (Spiral / DevSecOps), while lower criticality favors agile iteration.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
