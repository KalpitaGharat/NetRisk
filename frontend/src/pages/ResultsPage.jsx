import React, { useEffect, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  ArrowLeft, 
  Cpu, 
  ShieldAlert, 
  Server, 
  Scale, 
  Compass,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { NetRiskAPI } from '../api';
import RiskBadge from '../components/RiskBadge';
import RiskGauge from '../components/RiskGauge';

export default function ResultsPage({ 
  selectedAssessmentId, 
  setCurrentTab, 
  setSelectedAssessmentId,
  showToast 
}) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssessment();
  }, [selectedAssessmentId]);

  async function loadAssessment() {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      if (selectedAssessmentId) {
        data = await NetRiskAPI.getAssessment(selectedAssessmentId);
      } else {
        const list = await NetRiskAPI.getAssessments();
        if (list && list.length > 0) {
          // Fetch full assessment record by ID so sdlc_scores and all 7 factors are present
          data = await NetRiskAPI.getAssessment(list[0].id);
          setSelectedAssessmentId(list[0].id);
        }
      }
      setAssessment(data);
    } catch (err) {
      setError(err.message || 'Failed to load assessment results');
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!assessment) return;
    const blob = new Blob([JSON.stringify(assessment, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETRISK_${(assessment.project_name || 'assessment').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported assessment JSON report', 'success');
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-cyber-textMuted">
        <div className="w-10 h-10 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Synthesizing explainable SDLC recommendations...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="p-6 rounded-xl bg-cyber-card border border-cyber-border text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="font-bold text-white text-base">No Assessment Selected</h3>
        <p className="text-xs text-cyber-textMuted max-w-md mx-auto">
          {error || 'No assessments exist yet or none was selected. Complete a risk evaluation to view recommendations.'}
        </p>
        <button
          onClick={() => setCurrentTab('assessment')}
          className="px-4 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold"
        >
          Launch New Assessment
        </button>
      </div>
    );
  }

  // Model scores array for charts (derived from assessment.sdlc_scores)
  const scores = assessment.sdlc_scores || {};
  const modelScores = [
    { name: 'Waterfall', score: Number(scores['Waterfall'] ?? assessment.waterfall_score ?? 0), color: '#38bdf8' },
    { name: 'V-Model', score: Number(scores['V-Model'] ?? assessment.vmodel_score ?? 0), color: '#6366f1' },
    { name: 'Agile', score: Number(scores['Agile'] ?? assessment.agile_score ?? 0), color: '#10b981' },
    { name: 'Spiral', score: Number(scores['Spiral'] ?? assessment.spiral_score ?? 0), color: '#f59e0b' },
    { name: 'DevSecOps', score: Number(scores['DevSecOps'] ?? assessment.devsecops_score ?? 0), color: '#ef4444' },
  ];

  // 7 Factor Breakdown Data
  const factorItems = [
    { label: 'Security Criticality', value: assessment.security_criticality, weight: '25%' },
    { label: 'AI/ML Complexity', value: assessment.ai_complexity, weight: '20%' },
    { label: 'Threat Volatility', value: assessment.threat_volatility, weight: '15%' },
    { label: 'Req. Uncertainty', value: assessment.requirement_uncertainty, weight: '15%' },
    { label: 'Operational Impact', value: assessment.operational_criticality, weight: '10%' },
    { label: 'Compliance Req.', value: assessment.compliance_requirement, weight: '10%' },
    { label: 'Team Experience', value: assessment.team_experience, weight: '5% (Inv)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {assessment.project_name}
            </h1>
            <RiskBadge level={assessment.risk_level} />
          </div>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Evaluated on {new Date(assessment.created_at).toLocaleString()} &bull; ID: #{assessment.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated border border-cyber-border text-xs font-semibold text-white flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated border border-cyber-border text-xs font-semibold text-cyber-sky flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => setCurrentTab('assessment')}
            className="px-3 py-1.5 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold transition"
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Primary & Alternative Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Recommended Model (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-cyber-card to-cyber-elevated border border-cyber-cyan/40 shadow-glow relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyber-cyan/20 text-cyber-cyan">
                <Award className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan">
                Primary Recommended SDLC Model
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              Optimal Framework Match
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {assessment.recommended_model}
            </h2>
            <div className="text-2xl font-extrabold font-mono text-cyber-cyan">
              {(assessment.recommended_score ?? 0).toFixed(1)}% <span className="text-xs text-cyber-textMuted uppercase font-sans">Suitability</span>
            </div>
          </div>

          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            {assessment.recommendation_rationale || 
             `Selected as the optimal lifecycle model balancing ${assessment.recommended_model} principles against the ${(assessment.risk_score ?? 0).toFixed(1)}% calculated project risk profile.`}
          </p>

          <div className="p-4 rounded-xl bg-black/25 border border-cyber-border/80 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyber-sky" />
              Explainable Decision Justification:
            </div>
            <p className="text-xs text-cyber-textSecondary leading-relaxed italic">
              "{assessment.explanation || 'Calculated through multi-criteria decision modeling balancing security requirements against requirement volatility.'}"
            </p>
          </div>
        </div>

        {/* Alternative Model + Risk Score (1/3 width) */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-cyber-textMuted flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyber-sky" />
              Alternative Model
            </div>
            <h3 className="text-xl font-bold text-white">
              {assessment.alternative_model}
            </h3>
            <div className="text-xl font-mono font-bold text-cyber-sky">
              {(assessment.alternative_score ?? 0).toFixed(1)}%
            </div>
            <p className="text-xs text-cyber-textMuted">
              Delta: {((assessment.recommended_score ?? 0) - (assessment.alternative_score ?? 0)).toFixed(1)}% score margin
            </p>
          </div>

          <div className="pt-4 border-t border-cyber-border flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Overall Risk</div>
              <div className="text-2xl font-mono font-extrabold text-white">
                {(assessment.risk_score ?? 0).toFixed(1)}%
              </div>
            </div>
            <RiskGauge score={assessment.risk_score} size={80} strokeWidth={8} />
          </div>
        </div>
      </div>

      {/* Model Comparison Charts: Bar & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Comparison */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyber-cyan" />
            SDLC Suitability Score Comparison
          </h3>
          <p className="text-xs text-cyber-textMuted">
            Comparative evaluation across all five Software Development Life Cycles
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelScores} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${Number(val).toFixed(2)}%`, 'Suitability Score']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  {modelScores.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === assessment.recommended_model ? '#00f2fe' : entry.color} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Comparison */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-400" />
            Multilateral Suitability Radar
          </h3>
          <p className="text-xs text-cyber-textMuted">
            Topological footprint of SDLC trade-offs
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={modelScores} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#475569" fontSize={10} angle={30} />
                <Radar 
                  name="Suitability" 
                  dataKey="score" 
                  stroke="#00f2fe" 
                  fill="#00f2fe" 
                  fillOpacity={0.4} 
                  isAnimationActive={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${Number(val).toFixed(2)}%`, 'Suitability Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7 Factor Risk Breakdown Cards */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyber-cyan" />
          Seven-Factor Project Risk Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {factorItems.map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-cyber-elevated border border-cyber-border space-y-1">
              <div className="text-[10px] text-cyber-textMuted line-clamp-1">{f.label}</div>
              <div className="text-lg font-mono font-extrabold text-white">
                {f.value ?? '-'}
              </div>
              <div className="text-[9px] font-mono text-cyber-sky">Weight: {f.weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailored Engineering Practices */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Recommended Engineering &amp; Governance Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-cyber-elevated border border-cyber-border flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <div>
              <div className="font-bold text-white">Automated SAST/DAST &amp; Dependency Scanning</div>
              <div className="text-cyber-textMuted mt-0.5">Integrate container security scanners and Python vulnerability checks into CI/CD pipeline.</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-cyber-elevated border border-cyber-border flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-cyber-blue/10 text-cyber-sky flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <div>
              <div className="font-bold text-white">Adversarial ML Robustness &amp; Drift Monitoring</div>
              <div className="text-cyber-textMuted mt-0.5">Implement test suites against adversarial perturbation, data poisoning, and distribution drift.</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-cyber-elevated border border-cyber-border flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <div>
              <div className="font-bold text-white">Cryptographic Audit Logging &amp; Traceability</div>
              <div className="text-cyber-textMuted mt-0.5">Maintain immutable tamper-evident logs for all detection model updates and inference verdicts.</div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-cyber-elevated border border-cyber-border flex items-start gap-2.5">
            <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <div>
              <div className="font-bold text-white">Sprint Verification &amp; Security Acceptance Criteria</div>
              <div className="text-cyber-textMuted mt-0.5">Enforce definition-of-done security gates tracked in Jira issues before production deployment.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
