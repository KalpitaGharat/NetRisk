import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import { NetRiskAPI } from '../api';
import RiskBadge from '../components/RiskBadge';
import Modal from '../components/Modal';

export default function HistoryPage({ setCurrentTab, setSelectedAssessmentId, showToast }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterModel, setFilterModel] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  async function loadAssessments() {
    setLoading(true);
    setError(null);
    try {
      const list = await NetRiskAPI.getAssessments();
      setAssessments(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await NetRiskAPI.deleteAssessment(itemToDelete.id);
      setAssessments(assessments.filter(a => a.id !== itemToDelete.id));
      showToast(`Deleted assessment #${itemToDelete.id}`, 'info');
      setItemToDelete(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete assessment', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted list
  const filtered = assessments.filter(item => {
    const matchesSearch = item.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || (item.risk_level || '').toUpperCase() === filterRisk;
    const matchesModel = filterModel === 'ALL' || item.recommended_model === filterModel;
    return matchesSearch && matchesRisk && matchesModel;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'date_asc') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'risk_desc') return (b.risk_score || 0) - (a.risk_score || 0);
    if (sortBy === 'risk_asc') return (a.risk_score || 0) - (b.risk_score || 0);
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Assessment Ledger &amp; History
          </h1>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Complete audit trail of AI-IDS evaluations stored with parameter weighting in SQLite.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('assessment')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-cyber-textMuted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-white placeholder:text-cyber-textMuted focus:outline-none focus:border-cyber-blue"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Risk Level Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-cyber-textSecondary focus:outline-none focus:border-cyber-blue"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="VERY HIGH">Very High Risk</option>
          </select>

          {/* Model Filter */}
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-cyber-textSecondary focus:outline-none focus:border-cyber-blue"
          >
            <option value="ALL">All SDLC Models</option>
            <option value="Waterfall">Waterfall</option>
            <option value="V-Model">V-Model</option>
            <option value="Agile">Agile</option>
            <option value="Spiral">Spiral</option>
            <option value="DevSecOps">DevSecOps</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-cyber-input border border-cyber-border text-xs text-cyber-textSecondary focus:outline-none focus:border-cyber-blue"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="risk_desc">Risk: High to Low</option>
            <option value="risk_asc">Risk: Low to High</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-cyber-card border border-cyber-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-cyber-textMuted text-xs">
            Loading assessment records...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-xs">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-cyber-textMuted space-y-2">
            <History className="w-8 h-8 mx-auto text-cyber-textMuted/40" />
            <p className="text-sm font-semibold text-white">No assessments match criteria</p>
            <p className="text-xs">Try adjusting your filters or evaluate a new project.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cyber-elevated text-cyber-textMuted uppercase text-[11px] font-bold tracking-wider border-b border-cyber-border">
                <tr>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Project Name</th>
                  <th className="px-4 py-3.5">Calculated Risk</th>
                  <th className="px-4 py-3.5">Classification</th>
                  <th className="px-4 py-3.5">Recommended SDLC</th>
                  <th className="px-4 py-3.5">Suitability</th>
                  <th className="px-4 py-3.5">Alternative Model</th>
                  <th className="px-4 py-3.5">Evaluated On</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border text-cyber-textSecondary">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 font-mono text-cyber-textMuted">
                      #{item.id}
                    </td>
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
                    <td className="px-4 py-3 text-cyber-textMuted">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAssessmentId(item.id);
                            setCurrentTab('results');
                          }}
                          className="p-1.5 rounded bg-cyber-elevated hover:bg-cyber-blue hover:text-white text-cyber-sky border border-cyber-border transition"
                          title="Inspect Results"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded bg-cyber-elevated hover:bg-rose-500 hover:text-white text-rose-400 border border-cyber-border transition"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Confirm Deletion"
        footer={
          <>
            <button
              onClick={() => setItemToDelete(null)}
              className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-elevated text-xs font-semibold text-white border border-cyber-border"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-white font-bold">
              Are you sure you want to delete assessment #{itemToDelete?.id}?
            </p>
            <p className="text-xs text-cyber-textMuted">
              Project: <span className="text-white font-semibold">{itemToDelete?.project_name}</span>. This will remove this record and its calculated scores from the SQLite database. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
