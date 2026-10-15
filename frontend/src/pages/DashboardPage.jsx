import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Printer, 
  Download, 
  PlusCircle, 
  FolderGit2, 
  TrendingUp, 
  AlertTriangle, 
  Compass, 
  Scale, 
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal
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
import StatCard from '../components/StatCard';

export default function DashboardPage({ setCurrentTab, setSelectedAssessmentId }) {
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        NetRiskAPI.getAssessments().catch(() => []),
        NetRiskAPI.getDashboard().catch(() => null),
      ]);

      const list = listRes || [];
      setAssessmentsList(list);
      setDashboardStats(statsRes);

      if (list.length > 0) {
        const firstId = list[0].id;
        setActiveAssessmentId(firstId);
        loadAssessmentDetails(firstId);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize executive intelligence data');
    } finally {
      setLoading(false);
    }
  }

  async function loadAssessmentDetails(id) {
    if (!id) return;
    setLoadingActive(true);
    try {
      const full = await NetRiskAPI.getAssessment(id);
      setActiveAssessment(full);
      setActiveAssessmentId(id);
      if (setSelectedAssessmentId) {
        setSelectedAssessmentId(id);
      }
    } catch (err) {
      console.error("Error loading assessment detail:", err);
    } finally {
      setLoadingActive(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!activeAssessment) return;
    const blob = new Blob([JSON.stringify(activeAssessment, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETRISK_ASSESSMENT_${activeAssessment.id}_${(activeAssessment.project_name || 'system').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[450px] text-cyber-textMuted">
        <div className="w-10 h-10 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Aggregating SOC Risk Intelligence &amp; Mathematical Matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 space-y-3">
        <div className="flex items-center gap-2 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Failed to Connect to Risk Engine</span>
        </div>
        <p className="text-xs">{error}</p>
        <button 
          onClick={loadInitialData}
          className="px-4 py-2 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Model scores for horizontal bar & radar chart
  const scores = activeAssessment?.sdlc_scores || {};
  const modelScores = [
    { name: 'Waterfall', score: Number(scores['Waterfall'] ?? activeAssessment?.waterfall_score ?? 0), color: '#38bdf8' },
    { name: 'V-Model', score: Number(scores['V-Model'] ?? activeAssessment?.vmodel_score ?? 0), color: '#00f0ff' },
    { name: 'Agile', score: Number(scores['Agile'] ?? activeAssessment?.agile_score ?? 0), color: '#10b981' },
    { name: 'Spiral', score: Number(scores['Spiral'] ?? activeAssessment?.spiral_score ?? 0), color: '#f59e0b' },
    { name: 'DevSecOps', score: Number(scores['DevSecOps'] ?? activeAssessment?.devsecops_score ?? 0), color: '#ef4444' },
  ];

  const recScore = Number(activeAssessment?.recommended_score || 0);
  const altScore = Number(activeAssessment?.alternative_score || 0);
  const marginDelta = (recScore - altScore).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Assessment Record Selector & Actions Bar */}
      <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <SlidersHorizontal className="w-4 h-4 text-cyber-cyan shrink-0" />
          <span className="text-xs font-bold text-cyber-textMuted uppercase tracking-wider shrink-0">
            Active System Record:
          </span>
          {assessmentsList.length > 0 ? (
            <select
              value={activeAssessmentId || ''}
              onChange={(e) => loadAssessmentDetails(Number(e.target.value))}
              className="bg-cyber-elevated text-white text-xs font-semibold rounded-lg px-3 py-2 border border-cyber-border focus:border-cyber-cyan focus:outline-none max-w-md w-full truncate"
            >
              {assessmentsList.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} — {a.project_name} ({a.risk_level} Risk • {a.risk_score?.toFixed(1)}%)
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-cyber-textMuted italic">No assessments logged in repository</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            disabled={!activeAssessment}
            className="px-3.5 py-1.5 rounded-lg bg-cyber-elevated hover:bg-white/10 border border-cyber-border text-xs font-semibold text-white flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportJson}
            disabled={!activeAssessment}
            className="px-3.5 py-1.5 rounded-lg bg-cyber-elevated hover:bg-white/10 border border-cyber-border text-xs font-semibold text-cyber-cyan flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => setCurrentTab('assessment')}
            className="px-4 py-1.5 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Main Cybersecurity Intelligence Center Showcase (Reference Screenshot Design) */}
      {activeAssessment ? (
        <div className="space-y-6">
          {/* System Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-cyber-border">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeAssessment.project_name}
              </h2>
              <RiskBadge level={activeAssessment.risk_level} />
            </div>
            <p className="text-xs font-mono text-cyber-textMuted">
              Evaluated on {new Date(activeAssessment.created_at).toLocaleString()} • ID: #{activeAssessment.id}
            </p>
          </div>

          {/* Top 2-Column Grid: Primary Recommendation (2/3) vs Alternative & Risk Donut (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Recommended Model Showcase Card */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-cyber-card border border-cyber-cyan/40 shadow-glow relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan">
                    PRIMARY RECOMMENDED SDLC MODEL
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Optimal Framework Match
                </span>
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-4xl font-black text-white tracking-tight">
                  {activeAssessment.recommended_model}
                </h3>
                <div className="text-3xl font-extrabold font-mono text-cyber-cyan">
                  {recScore.toFixed(1)}%
                </div>
                <span className="text-xs font-mono font-semibold text-cyber-textMuted uppercase tracking-wider">
                  SUITABILITY
                </span>
              </div>

              <p className="text-xs text-cyber-textSecondary leading-relaxed">
                Selected as the optimal lifecycle model balancing {activeAssessment.recommended_model} principles against the {(activeAssessment.risk_score || 0).toFixed(1)}% calculated project risk profile.
              </p>

              {/* Nested Decision Justification Box */}
              <div className="p-4 rounded-xl bg-black/35 border border-cyber-border space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyber-sky" />
                  <span>Explainable Decision Justification:</span>
                </div>
                <p className="text-xs text-cyber-textSecondary leading-relaxed italic">
                  "{activeAssessment.explanation || 'Determined through multi-factor decision analysis balancing threat volatility and system criticality.'}"
                </p>
              </div>
            </div>

            {/* Right Column: Alternative Model + Overall Risk Donut */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Alternative Model Card */}
              <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyber-textMuted flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-cyber-sky" />
                  <span>ALTERNATIVE MODEL</span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  {activeAssessment.alternative_model}
                </h4>
                <div className="text-2xl font-mono font-bold text-cyber-sky">
                  {altScore.toFixed(1)}%
                </div>
                <p className="text-xs font-mono text-cyber-textMuted">
                  Delta: {marginDelta}% score margin
                </p>
              </div>

              {/* Overall Risk Donut Card */}
              <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-cyber-textMuted">Overall Risk</div>
                  <div className="text-3xl font-mono font-black text-white">
                    {(activeAssessment.risk_score || 0).toFixed(1)}%
                  </div>
                  <div className="mt-1">
                    <RiskBadge level={activeAssessment.risk_level} size="sm" />
                  </div>
                </div>
                <RiskGauge score={activeAssessment.risk_score} size={95} strokeWidth={9} />
              </div>
            </div>
          </div>

          {/* Bottom 2-Column Grid: SDLC Suitability Comparison Bar & Multilateral Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Horizontal Bar Chart */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyber-cyan" />
                  <span>SDLC Suitability Score Comparison</span>
                </h3>
                <p className="text-xs text-cyber-textMuted mt-0.5">
                  Comparative evaluation across all five Software Development Life Cycles
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelScores} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0c1424', borderColor: '#1e2b45', borderRadius: '8px', color: '#fff' }}
                      formatter={(val) => [`${Number(val).toFixed(2)}%`, 'Suitability Score']}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                      {modelScores.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === activeAssessment.recommended_model ? '#00f0ff' : entry.color} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Multilateral Suitability Radar */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyber-cyan" />
                  <span>Multilateral Suitability Radar</span>
                </h3>
                <p className="text-xs text-cyber-textMuted mt-0.5">
                  Topological footprint of SDLC trade-offs
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={modelScores} cx="50%" cy="50%" outerRadius="72%">
                    <PolarGrid stroke="#1e2b45" />
                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis domain={[0, 100]} stroke="#475569" fontSize={10} angle={30} />
                    <Radar 
                      name="Suitability" 
                      dataKey="score" 
                      stroke="#00f0ff" 
                      fill="#00f0ff" 
                      fillOpacity={0.25} 
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-cyber-card border border-cyber-border text-center space-y-3">
          <p className="text-xs text-cyber-textMuted">No assessments recorded in SQLite database.</p>
          <button
            onClick={() => setCurrentTab('assessment')}
            className="px-4 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold"
          >
            Launch First Assessment
          </button>
        </div>
      )}

      {/* Portfolio Executive KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <StatCard
          label="Total Assessments"
          value={dashboardStats?.total_assessments ?? assessmentsList.length}
          subtext="Persisted in SQLite database"
          icon={FolderGit2}
          color="blue"
        />
        <StatCard
          label="Portfolio Mean Risk"
          value={`${(dashboardStats?.average_risk ?? 0).toFixed(1)}%`}
          subtext={
            dashboardStats?.average_risk <= 30 ? "Portfolio: LOW RISK" :
            dashboardStats?.average_risk <= 50 ? "Portfolio: MODERATE" :
            dashboardStats?.average_risk <= 70 ? "Portfolio: HIGH RISK" : "Portfolio: VERY HIGH"
          }
          icon={TrendingUp}
          color="cyan"
          highlight
        />
        <StatCard
          label="High-Risk Systems"
          value={dashboardStats?.high_risk_count ?? 0}
          subtext="Risk Score 51% – 70%"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          label="Dominant SDLC Model"
          value={dashboardStats?.most_recommended_sdlc || "None"}
          subtext="Most Prescribed Framework"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Recent Project Risk Assessments Table */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyber-cyan" />
              <span>Assessment History Audit Ledger</span>
            </h3>
            <p className="text-xs text-cyber-textMuted mt-0.5">
              Click any assessment to inspect in the live showcase above
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('history')}
            className="text-xs font-semibold text-cyber-sky hover:text-cyber-cyan flex items-center gap-1 transition"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyber-elevated text-cyber-textMuted uppercase text-[11px] font-bold tracking-wider border-b border-cyber-border">
              <tr>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Overall Risk</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Recommended SDLC</th>
                <th className="px-4 py-3">Suitability</th>
                <th className="px-4 py-3">Alternative Model</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border text-cyber-textSecondary">
              {assessmentsList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-cyber-textMuted">
                    No assessments recorded in SQLite yet. Launch your first evaluation.
                  </td>
                </tr>
              ) : (
                assessmentsList.slice(0, 8).map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-white/[0.03] transition ${item.id === activeAssessmentId ? 'bg-cyber-blue/10 border-l-2 border-cyber-cyan' : ''}`}
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {item.project_name}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {(item.risk_score ?? 0).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-cyber-sky bg-cyber-sky/10 border border-cyber-sky/30 px-2 py-0.5 rounded text-[11px]">
                        {item.recommended_model}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-400">
                      {(item.recommended_score ?? 0).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-cyber-textMuted">
                      {item.alternative_model} ({(item.alternative_score ?? 0).toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => loadAssessmentDetails(item.id)}
                        className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                          item.id === activeAssessmentId 
                            ? 'bg-cyber-cyan text-cyber-bg font-bold' 
                            : 'bg-cyber-elevated hover:bg-cyber-blue hover:text-white border border-cyber-border text-cyber-sky'
                        }`}
                      >
                        {item.id === activeAssessmentId ? 'Active' : 'Inspect ↑'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
