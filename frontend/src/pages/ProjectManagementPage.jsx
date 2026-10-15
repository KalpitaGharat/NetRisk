import React, { useEffect, useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Kanban,
  Activity,
  AlertCircle
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
import { NetRiskAPI } from '../api';

export default function ProjectManagementPage({ setCurrentTab }) {
  const [projectSummary, setProjectSummary] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [epics, setEpics] = useState([]);
  const [progressDist, setProgressDist] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEpicId, setExpandedEpicId] = useState(null);

  useEffect(() => {
    loadAllJiraData();
  }, []);

  async function loadAllJiraData() {
    setLoading(true);
    setError(null);
    try {
      const [projRes, sprintRes, epicsRes, progRes, actRes] = await Promise.all([
        NetRiskAPI.getJiraProject(),
        NetRiskAPI.getJiraSprints(),
        NetRiskAPI.getJiraEpics(),
        NetRiskAPI.getJiraProgress(),
        NetRiskAPI.getJiraActivity(),
      ]);
      setProjectSummary(projRes);
      setSprints(sprintRes?.sprints || []);
      setEpics(epicsRes?.epics || []);
      setProgressDist(progRes);
      setActivity(actRes?.activities || actRes?.activity || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch Jira project management data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-cyber-textMuted">
        <div className="w-10 h-10 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Synchronizing with Atlassian Jira Cloud (NRASS)...</p>
      </div>
    );
  }

  const isLive = projectSummary?.is_live ?? false;
  const completionPct = projectSummary?.completion_percentage ?? 0;

  // Progress chart data
  const statusChartData = [
    { name: 'To Do', count: progressDist?.status_counts?.['TO DO'] ?? 20, color: '#64748b' },
    { name: 'In Progress', count: progressDist?.status_counts?.['IN PROGRESS'] ?? 0, color: '#38bdf8' },
    { name: 'In Review', count: progressDist?.status_counts?.['IN REVIEW'] ?? 0, color: '#f59e0b' },
    { name: 'Done', count: progressDist?.status_counts?.['DONE'] ?? 14, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Project Management &bull; Jira Cloud
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              isLive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {isLive ? 'LIVE JIRA SYNC' : 'DEMO MODE'}
            </span>
          </div>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Project: <span className="text-white font-semibold">{projectSummary?.project_name || 'NETRISK'}</span> &bull; Key: <span className="text-cyber-cyan font-mono">NRASS</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('jira-board')}
            className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated border border-cyber-border text-xs font-semibold text-cyber-cyan flex items-center gap-1.5 transition"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Interactive Board</span>
          </button>
          <a
            href={projectSummary?.base_url ? `${projectSummary.base_url}/jira/software/projects/NRASS/boards` : "https://sakec-team-bcq481n1.atlassian.net"}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Open in Jira Cloud</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error} (Using structured academic dataset)</span>
        </div>
      )}

      {/* Top Overview Metrics Banner */}
      <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Project Key</div>
          <div className="text-xl font-mono font-black text-cyber-cyan mt-1">NRASS</div>
          <div className="text-[10px] text-cyber-textMuted mt-0.5">Atlassian Cloud</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Total Epics</div>
          <div className="text-xl font-mono font-black text-white mt-1">
            {projectSummary?.total_epics ?? 5}
          </div>
          <div className="text-[10px] text-cyber-textMuted mt-0.5">Architectural Pillars</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Total Stories</div>
          <div className="text-xl font-mono font-black text-white mt-1">
            {projectSummary?.total_stories ?? 34}
          </div>
          <div className="text-[10px] text-cyber-textMuted mt-0.5">Assigned Tasks</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Completed</div>
          <div className="text-xl font-mono font-black text-emerald-400 mt-1">
            {projectSummary?.completed_stories ?? 14}
          </div>
          <div className="text-[10px] text-cyber-textMuted mt-0.5">Sprints 1 &amp; 2 Closed</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Pending</div>
          <div className="text-xl font-mono font-black text-amber-400 mt-1">
            {projectSummary?.pending_stories ?? 20}
          </div>
          <div className="text-[10px] text-cyber-textMuted mt-0.5">In Backlog/Queue</div>
        </div>

        <div>
          <div className="text-[11px] uppercase font-bold text-cyber-textMuted">Completion</div>
          <div className="text-xl font-mono font-black text-cyber-sky mt-1">
            {completionPct.toFixed(1)}%
          </div>
          <div className="w-full bg-cyber-elevated h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-cyber-cyan h-full transition-all duration-500" 
              style={{ width: `${completionPct}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Sprints Progress Cards (5 Sprints) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyber-cyan" />
          Development Sprints Roadmap (5 Iterations)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {sprints.map((s, idx) => {
            const isClosed = s.status === 'CLOSED';
            const isActive = s.status === 'ACTIVE';
            const sPct = s.completion_percentage ?? (isClosed ? 100 : 0);

            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl bg-cyber-card border flex flex-col justify-between space-y-3 ${
                  isActive ? 'border-cyber-blue shadow-glow' : 'border-cyber-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isClosed ? 'bg-emerald-500/15 text-emerald-400' :
                      isActive ? 'bg-cyber-blue/20 text-cyber-sky animate-pulse' :
                      'bg-cyber-elevated text-cyber-textMuted'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-cyber-textMuted mt-1">
                    {s.start_date || 'Sprint Target'} &ndash; {s.end_date || 'Target'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyber-textSecondary">Progress:</span>
                    <span className="text-white font-bold">{sPct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-cyber-elevated h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isClosed ? 'bg-emerald-400' : 'bg-cyber-cyan'}`} 
                      style={{ width: `${sPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-cyber-textMuted font-mono">
                    <span>{s.completed_points ?? 0}/{s.total_points ?? 0} pts</span>
                    <span>{s.completed_tasks ?? 0} tasks done</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Epics Tracking (5 Epics with Stories) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-cyan" />
          Project Epics &amp; User Story Breakdown
        </h3>

        <div className="space-y-2.5">
          {epics.map((epic) => {
            const isExpanded = expandedEpicId === epic.id;
            const epicPct = epic.completion_percentage ?? 0;

            return (
              <div 
                key={epic.id} 
                className="rounded-xl bg-cyber-card border border-cyber-border overflow-hidden transition"
              >
                <div 
                  onClick={() => setExpandedEpicId(isExpanded ? null : epic.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyber-sky bg-cyber-sky/10 border border-cyber-sky/20 px-2 py-0.5 rounded">
                      {epic.id}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{epic.name}</h4>
                      <p className="text-[11px] text-cyber-textMuted line-clamp-1">{epic.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-mono font-bold text-white">{epicPct.toFixed(0)}% Done</span>
                      <span className="text-[10px] text-cyber-textMuted">{epic.completed_stories ?? 0}/{epic.total_stories ?? 0} Stories</span>
                    </div>

                    <div className="w-20 hidden sm:block bg-cyber-elevated h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyber-cyan h-full" style={{ width: `${epicPct}%` }} />
                    </div>

                    <div className="p-1 text-cyber-textMuted">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Stories List */}
                {isExpanded && (
                  <div className="p-4 bg-black/25 border-t border-cyber-border space-y-2 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {epic.stories?.map((st) => (
                        <div 
                          key={st.key}
                          className="p-2.5 rounded-lg bg-cyber-elevated border border-cyber-border flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-mono font-bold text-cyber-cyan text-[11px] shrink-0">
                              {st.key}
                            </span>
                            <span className="text-white text-[11px] truncate">
                              {st.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-cyber-textMuted px-1.5 py-0.5 rounded bg-black/30">
                              {st.points ?? 5} pts
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              st.status === 'DONE' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-cyber-card text-cyber-textMuted border border-cyber-border'
                            }`}>
                              {st.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Distribution Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status distribution */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            Task Status Distribution
          </h3>
          <p className="text-xs text-cyber-textMuted">
            Current allocation of stories across Kanban workflow columns
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Audit Log */}
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-sky" />
            Recent Jira Project Activity
          </h3>
          <p className="text-xs text-cyber-textMuted">
            Synchronized audit stream of development milestones
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {activity.length === 0 ? (
              <p className="text-xs text-cyber-textMuted py-4">No recent activity recorded.</p>
            ) : (
              activity.slice(0, 6).map((act, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-cyber-elevated border border-cyber-border/80 flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-[11px] font-semibold">{act.details || act.summary || act.description}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-cyber-textMuted">
                      <span>{act.author || 'System'}</span>
                      <span>&bull;</span>
                      <span>{act.timestamp ? new Date(act.timestamp).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
