import React, { useState } from 'react';
import { 
  Award, 
  Sliders, 
  BookOpen, 
  Table, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  FileQuestion, 
  Radio, 
  Server, 
  ShieldCheck 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function SdlcComparisonPage() {
  const [activeTab, setActiveTab] = useState('simulator');

  // Simulation factor states (0-100)
  const [simFactors, setSimFactors] = useState({
    securityCriticality: 80,
    aiComplexity: 75,
    requirementUncertainty: 60,
    threatVolatility: 85,
    operationalCriticality: 70,
    complianceRequirement: 65,
  });

  // Calculate the 5 SDLC suitability scores using exact mathematical formulas
  const calculateScores = (f) => {
    const waterfall = 0.50 * (100 - f.requirementUncertainty) + 0.50 * (100 - f.threatVolatility);
    const vmodel = 0.45 * f.securityCriticality + 0.35 * f.operationalCriticality + 0.20 * f.complianceRequirement;
    const agile = 0.45 * f.requirementUncertainty + 0.35 * f.threatVolatility + 0.20 * f.aiComplexity;
    const spiral = 0.30 * f.securityCriticality + 0.25 * f.aiComplexity + 0.20 * f.threatVolatility + 0.15 * f.operationalCriticality + 0.10 * f.requirementUncertainty;
    const devsecops = 0.30 * f.securityCriticality + 0.25 * f.threatVolatility + 0.20 * f.requirementUncertainty + 0.15 * f.operationalCriticality + 0.10 * f.aiComplexity;

    return [
      { name: 'Waterfall', score: Math.round(waterfall * 10) / 10, color: '#38bdf8' },
      { name: 'V-Model', score: Math.round(vmodel * 10) / 10, color: '#00f0ff' },
      { name: 'Agile', score: Math.round(agile * 10) / 10, color: '#10b981' },
      { name: 'Spiral', score: Math.round(spiral * 10) / 10, color: '#f59e0b' },
      { name: 'DevSecOps', score: Math.round(devsecops * 10) / 10, color: '#ef4444' },
    ];
  };

  const chartData = calculateScores(simFactors);
  const ranked = [...chartData].sort((a, b) => b.score - a.score);
  const topModel = ranked[0];
  const runnerUp = ranked[1];

  const sliderConfigs = [
    { key: 'securityCriticality', label: 'Security Criticality', icon: ShieldAlert, color: 'text-rose-400' },
    { key: 'aiComplexity', label: 'AI/ML Complexity', icon: Cpu, color: 'text-purple-400' },
    { key: 'requirementUncertainty', label: 'Requirement Uncertainty', icon: FileQuestion, color: 'text-amber-400' },
    { key: 'threatVolatility', label: 'Threat Volatility', icon: Radio, color: 'text-orange-400' },
    { key: 'operationalCriticality', label: 'Operational Criticality', icon: Server, color: 'text-blue-400' },
    { key: 'complianceRequirement', label: 'Compliance Requirement', icon: ShieldCheck, color: 'text-emerald-400' },
  ];

  const formulas = [
    {
      name: "Waterfall",
      tagline: "Sequential, gated verification for deterministic systems",
      formula: "S = 0.50 × (100 - Req Uncertainty) + 0.50 × (100 - Threat Volatility)",
      idealFor: "Static signature engines with frozen specifications and low attack mutation.",
      color: "#38bdf8",
    },
    {
      name: "V-Model",
      tagline: "Formal paired verification and validation architecture",
      formula: "S = 0.45 × Security + 0.35 × Operational + 0.20 × Compliance",
      idealFor: "Regulated perimeter gateways, banking networks, and safety-critical audit requirements.",
      color: "#00f0ff",
    },
    {
      name: "Agile",
      tagline: "High-adaptability iterative heuristic prototyping",
      formula: "S = 0.45 × Req Uncertainty + 0.35 × Threat Volatility + 0.20 × AI Complexity",
      idealFor: "Rapid zero-day exploit analysis, threat research prototypes, and evolving models.",
      color: "#10b981",
    },
    {
      name: "Spiral",
      tagline: "Risk-driven phased hazard reduction and prototyping",
      formula: "S = 0.30 × Security + 0.25 × AI + 0.20 × Threat + 0.15 × Ops + 0.10 × Req",
      idealFor: "High-complexity deep neural intrusion detection paired with extreme security exposure.",
      color: "#f59e0b",
    },
    {
      name: "DevSecOps",
      tagline: "Continuous integration, automated security testing, and live telemetry",
      formula: "S = 0.30 × Security + 0.25 × Threat + 0.20 × Req + 0.15 × Ops + 0.10 × AI",
      idealFor: "Cloud-native SOC pipelines, automated ML model deployment, and high-velocity defense.",
      color: "#ef4444",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-cyber-cyan" />
            SDLC Model Comparison &amp; Sensitivity Analytics
          </h1>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Empirical multi-criteria decision formulations, real-time sensitivity simulation, and comparative paradigm matrix.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-cyber-elevated border border-cyber-border">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'simulator' 
                ? 'bg-cyber-blue text-white shadow' 
                : 'text-cyber-textSecondary hover:text-white'
            }`}
          >
            Sensitivity Simulator
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'formulas' 
                ? 'bg-cyber-blue text-white shadow' 
                : 'text-cyber-textSecondary hover:text-white'
            }`}
          >
            Mathematical Formulations
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matrix' 
                ? 'bg-cyber-blue text-white shadow' 
                : 'text-cyber-textSecondary hover:text-white'
            }`}
          >
            Decision Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sliders container */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyber-cyan" />
                  Real-Time Sensitivity Inputs
                </h3>
                <span className="text-[11px] font-mono text-cyber-textMuted">0–100 Scale</span>
              </div>

              <div className="space-y-4">
                {sliderConfigs.map((cfg) => {
                  const Icon = cfg.icon;
                  const val = simFactors[cfg.key];
                  return (
                    <div key={cfg.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyber-textSecondary flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          {cfg.label}
                        </span>
                        <span className="font-mono font-bold text-white bg-cyber-elevated px-2 py-0.5 rounded border border-cyber-border">
                          {val}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={val}
                        onChange={(e) => setSimFactors({ ...simFactors, [cfg.key]: Number(e.target.value) })}
                        className="w-full h-1.5 bg-cyber-elevated rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Chart & Standing */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <h3 className="text-sm font-bold text-white">Dynamic Model Suitability Ranking</h3>
                  <span className="text-xs font-mono font-bold text-cyber-cyan px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30">
                    Leader: {topModel.name} ({topModel.score}%)
                  </span>
                </div>
                <p className="text-xs text-cyber-textMuted mt-1">
                  Runner-up: {runnerUp.name} ({runnerUp.score}%) • Margin: +{(topModel.score - runnerUp.score).toFixed(1)}%
                </p>

                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                        formatter={(val) => [`${val}%`, 'Suitability Score']}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === topModel.name ? '#00f0ff' : entry.color} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ranks bar */}
              <div className="grid grid-cols-5 gap-2 pt-3 border-t border-cyber-border">
                {ranked.map((m, i) => (
                  <div key={m.name} className="p-2 rounded-lg bg-cyber-elevated text-center border border-cyber-border">
                    <div className="text-[10px] text-cyber-textMuted font-mono">#{i + 1}</div>
                    <div className="text-xs font-bold text-white truncate">{m.name}</div>
                    <div className="text-xs font-mono font-extrabold text-cyber-cyan">{m.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Formulas */}
      {activeTab === 'formulas' && (
        <div className="space-y-4">
          {formulas.map((f) => (
            <div key={f.name} className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                  <h3 className="text-lg font-bold text-white">{f.name} Lifecycle Model</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyber-elevated border border-cyber-border text-cyber-textSecondary">
                  {f.tagline}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-cyber-border/60 font-mono text-xs text-cyber-cyan">
                {f.formula}
              </div>

              <p className="text-xs text-cyber-textSecondary">
                <strong className="text-white">Target AI-IDS Profile:</strong> {f.idealFor}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Decision Matrix */}
      {activeTab === 'matrix' && (
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyber-elevated text-cyber-textMuted uppercase text-[11px] font-bold tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-3">SDLC Paradigm</th>
                <th className="px-4 py-3">Primary Orientation</th>
                <th className="px-4 py-3">Security Sensitivity</th>
                <th className="px-4 py-3">AI / ML Uncertainty</th>
                <th className="px-4 py-3">Regulatory Audit</th>
                <th className="px-4 py-3">Sprint Cadence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border text-cyber-textSecondary">
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Waterfall
                </td>
                <td className="px-4 py-3">Sequential Gated Gates</td>
                <td className="px-4 py-3 text-amber-400">Low / Moderate</td>
                <td className="px-4 py-3 text-rose-400">Poor (Requires Frozen Specs)</td>
                <td className="px-4 py-3 text-emerald-400">High (Rigid Traceability)</td>
                <td className="px-4 py-3">6–18 Month Milestones</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]" /> V-Model
                </td>
                <td className="px-4 py-3">Paired Verification &amp; Validation</td>
                <td className="px-4 py-3 text-emerald-400">Extreme (Dual-Phase QA)</td>
                <td className="px-4 py-3 text-amber-400">Moderate</td>
                <td className="px-4 py-3 text-emerald-400">Strict Compliance (NIST/ISO)</td>
                <td className="px-4 py-3">Phased Sign-Off Cycles</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Agile
                </td>
                <td className="px-4 py-3">High-Velocity Incremental Iterations</td>
                <td className="px-4 py-3 text-amber-400">Moderate</td>
                <td className="px-4 py-3 text-emerald-400">Excellent (Adaptive Tuning)</td>
                <td className="px-4 py-3 text-amber-400">Moderate Traceability</td>
                <td className="px-4 py-3">1–2 Week Sprints</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Spiral
                </td>
                <td className="px-4 py-3">Risk-Driven Phased Prototyping</td>
                <td className="px-4 py-3 text-emerald-400">High / Critical</td>
                <td className="px-4 py-3 text-emerald-400">Superior (Hazard Proof-of-Concept)</td>
                <td className="px-4 py-3 text-emerald-400">High Milestone Audits</td>
                <td className="px-4 py-3">Spiral Phase Loops</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> DevSecOps
                </td>
                <td className="px-4 py-3">Continuous Security Automation (CI/CD)</td>
                <td className="px-4 py-3 text-emerald-400">Continuous SAST/DAST</td>
                <td className="px-4 py-3 text-emerald-400">High (Live Telemetry &amp; MLOps)</td>
                <td className="px-4 py-3 text-emerald-400">Automated Audit Trails</td>
                <td className="px-4 py-3">Daily / On-Demand Deployments</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
