import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Scale, 
  Activity, 
  Globe,
  Eye
} from 'lucide-react';
import { NetRiskAPI } from '../api';
import Modal from '../components/Modal';

export default function DocumentationPage() {
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDocModal, setActiveDocModal] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    setLoading(true);
    setError(null);
    try {
      const res = await NetRiskAPI.getConfluencePages();
      setDocData(res);
    } catch (err) {
      setError(err.message || 'Failed to load Confluence documentation');
    } finally {
      setLoading(false);
    }
  }

  const iconMap = {
    '🛡️': ShieldAlert,
    '🏗️': Cpu,
    '📐': Scale,
    '⚙️': Activity,
    '🧪': CheckCircle2,
    '🎯': Globe,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyber-cyan" />
              Confluence Technical Documentation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyber-blue/15 border border-cyber-blue/30 text-cyber-sky">
              SPACE: NRSS
            </span>
          </div>
          <p className="text-xs text-cyber-textSecondary mt-1">
            Verified academic specifications and engineering architecture in Confluence Cloud.
          </p>
        </div>

        <a
          href={docData?.space_url || "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/overview"}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>Open Confluence Space</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Space Overview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyber-card to-cyber-elevated border border-cyber-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-cyber-cyan">
            ATLASSIAN CONFLUENCE ENTERPRISE
          </div>
          <h2 className="text-lg font-bold text-white">
            {docData?.space_name || 'NETRISK — Risk-Aware SDLC Selector'}
          </h2>
          <p className="text-xs text-cyber-textSecondary">
            Organization Domain: <span className="text-cyber-sky">{docData?.organization_domain || 'sakec-team-bcq481n1.atlassian.net'}</span> &bull; 6 Core Technical Documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            6 / 6 PUBLISHED
          </span>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="p-16 text-center text-cyber-textMuted text-xs">
          Loading documentation specifications...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {docData?.pages?.map((doc) => {
            const Icon = iconMap[doc.icon] || FileText;

            return (
              <div 
                key={doc.id}
                className="p-5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-cardBorder transition flex flex-col justify-between space-y-4 group hover:-translate-y-0.5 hover:shadow-glow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyber-sky bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyber-elevated border border-cyber-border flex items-center justify-center text-cyber-cyan shrink-0 group-hover:border-cyber-cyan/40 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyber-cyan transition">
                        {doc.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-cyber-textSecondary line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyber-border flex items-center justify-between">
                  <button
                    onClick={() => setActiveDocModal(doc)}
                    className="text-xs font-semibold text-cyber-textSecondary hover:text-white flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>

                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    <span>Read on Confluence</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Preview Modal */}
      <Modal
        isOpen={Boolean(activeDocModal)}
        onClose={() => setActiveDocModal(null)}
        title={activeDocModal?.title}
        footer={
          <a
            href={activeDocModal?.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-cyber-blue hover:bg-cyber-sky text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Open Complete Page in Confluence</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-cyber-sky font-bold font-mono">Category:</span>
            <span className="text-white">{activeDocModal?.category}</span>
          </div>
          <div>
            <span className="text-cyber-sky font-bold font-mono block mb-1">Executive Summary:</span>
            <p className="text-cyber-textPrimary text-sm leading-relaxed">
              {activeDocModal?.description}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-cyber-elevated border border-cyber-border space-y-1">
            <span className="font-bold text-white block">Atlassian Confluence Space:</span>
            <p className="text-cyber-textMuted font-mono break-all text-[11px]">
              {activeDocModal?.url}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
