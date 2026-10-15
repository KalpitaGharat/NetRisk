import React, { useEffect, useState } from 'react';
import { 
  Kanban, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { NetRiskAPI } from '../api';
import Modal from '../components/Modal';

export default function JiraBoardPage({ showToast }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpic, setSelectedEpic] = useState('ALL');

  // Issue creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSummary, setNewSummary] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('Story');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newParentEpic, setNewParentEpic] = useState('NRASS-3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    setLoading(true);
    setError(null);
    try {
      const res = await NetRiskAPI.getJiraIssues();
      setIssues(res?.issues || []);
      setIsLive(res?.is_live || false);
    } catch (err) {
      setError(err.message || 'Failed to fetch Jira issues');
    } finally {
      setLoading(false);
    }
  }

  // Get unique epics for filter
  const epicNames = Array.from(new Set(issues.map(i => i.epic_name).filter(Boolean)));

  // Filter issues
  const filtered = issues.filter(issue => {
    const matchesSearch = 
      issue.key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEpic = selectedEpic === 'ALL' || issue.epic_name === selectedEpic;
    return matchesSearch && matchesEpic;
  });

  // Group by status
  const columns = [
    { id: 'TO DO', label: 'To Do', color: 'border-slate-500/30 text-slate-400 bg-slate-500/10' },
    { id: 'IN PROGRESS', label: 'In Progress', color: 'border-cyber-blue/30 text-cyber-sky bg-cyber-blue/10' },
    { id: 'IN REVIEW', label: 'In Review', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'DONE', label: 'Done', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  ];

  const getIssuesForColumn = (colId) => {
    return filtered.filter(i => {
      const s = (i.status || '').toUpperCase();
      if (colId === 'DONE') return s === 'DONE' || s === 'CLOSED';
      if (colId === 'IN PROGRESS') return s === 'IN PROGRESS';
      if (colId === 'IN REVIEW') return s === 'IN REVIEW';
      return s === 'TO DO' || s === 'OPEN' || s === 'BACKLOG';
    });
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!newSummary.trim()) {
      showToast('Please provide a story summary', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await NetRiskAPI.createJiraIssue({
        summary: newSummary.trim(),
        description: newDesc.trim() || undefined,
        issue_type: newType,
        priority: newPriority,
        parent_key: newParentEpic || undefined,
      });
      if (res?.success) {
        showToast(res.message || 'Created Jira issue!', 'success');
        setIsCreateOpen(false);
        setNewSummary('');
        setNewDesc('');
        loadIssues();
      } else {
        showToast(res?.message || 'Failed to create Jira issue', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error communicating with Jira API', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Kanban className="w-6 h-6 text-cyber-cyan" />
              Jira Kanban Board
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              isLive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {isLive ? 'LIVE JIRA (NRASS)' : 'DEMO MODE'}
            </span>
          </div>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Real-time story tracking &amp; development lifecycle workflow synchronized with Jira Cloud.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-xs font-bold text-cyber-cyan flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Story</span>
          </button>
          <button
            onClick={() => {
              loadIssues();
              showToast('Refreshed Jira issues', 'info');
            }}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated border border-cyber-border text-xs font-semibold text-white flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Board</span>
          </button>
          <a
            href="https://sakec-team-bcq481n1.atlassian.net/jira/software/projects/NRASS/boards"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Open in Jira Cloud</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-cyber-textMuted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stories by key or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-white placeholder:text-cyber-textMuted focus:outline-none focus:border-cyber-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedEpic}
            onChange={(e) => setSelectedEpic(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-cyber-textSecondary focus:outline-none focus:border-cyber-blue"
          >
            <option value="ALL">All Epics (All 5 Pillars)</option>
            {epicNames.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      {loading ? (
        <div className="p-16 text-center text-cyber-textMuted text-xs">
          Loading issues from Jira Cloud...
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colIssues = getIssuesForColumn(col.id);
            return (
              <div 
                key={col.id} 
                className="rounded-xl bg-cyber-card/70 border border-cyber-border p-3.5 flex flex-col gap-3 min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-cyber-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                      {colIssues.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                  {colIssues.length === 0 ? (
                    <div className="p-8 text-center text-cyber-textMuted/40 text-xs font-medium border border-dashed border-cyber-border rounded-lg">
                      No issues
                    </div>
                  ) : (
                    colIssues.map((issue) => (
                      <div
                        key={issue.key}
                        className="p-3.5 rounded-lg bg-cyber-elevated hover:bg-cyber-hover border border-cyber-border hover:border-cyber-cardBorder transition space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <a
                            href={`https://sakec-team-bcq481n1.atlassian.net/browse/${issue.key}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[11px] font-bold text-cyber-cyan hover:underline flex items-center gap-1"
                          >
                            <span>{issue.key}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          </a>
                          <span className="text-[10px] font-mono text-cyber-textMuted px-1.5 py-0.5 rounded bg-black/40">
                            {issue.points ?? 5} pts
                          </span>
                        </div>

                        <p className="text-xs text-white font-medium leading-snug line-clamp-2">
                          {issue.title}
                        </p>

                        {issue.epic_name && (
                          <div className="pt-1">
                            <span className="text-[9px] font-semibold text-cyber-sky bg-cyber-blue/15 border border-cyber-blue/30 px-1.5 py-0.5 rounded block truncate">
                              {issue.epic_name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Story in Jira (NRASS)"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated text-xs font-semibold text-white border border-cyber-border"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateIssue}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan text-cyber-bg font-bold text-xs shadow-glowCyan hover:brightness-110 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting to Jira Cloud...' : 'Create in Jira'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateIssue} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Story Summary / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement heuristic anomaly detection test suite"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cyber-input border border-cyber-border text-white text-xs focus:outline-none focus:border-cyber-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Detail development acceptance criteria, security requirements, and verification tasks..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-cyber-input border border-cyber-border text-white text-xs focus:outline-none focus:border-cyber-blue"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Issue Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-blue"
              >
                <option value="Story">Story</option>
                <option value="Task">Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-blue"
              >
                <option value="Highest">Highest</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Lowest">Lowest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Associated Epic
              </label>
              <select
                value={newParentEpic}
                onChange={(e) => setNewParentEpic(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-blue"
              >
                <option value="NRASS-1">NRASS-1 (Foundation)</option>
                <option value="NRASS-2">NRASS-2 (SDLC Intel)</option>
                <option value="NRASS-3">NRASS-3 (Dashboard)</option>
                <option value="NRASS-4">NRASS-4 (Testing)</option>
                <option value="NRASS-5">NRASS-5 (Finalization)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
