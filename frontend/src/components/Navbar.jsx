import React from 'react';
import { PlusCircle, ExternalLink, Menu, Shield } from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isCollapsed, 
  setIsCollapsed, 
  onMobileMenuToggle
}) {
  const tabLabels = {
    dashboard: "Executive Dashboard",
    assessment: "Risk Assessment Wizard",
    results: "SDLC Recommendations",
    history: "Assessment Ledger",
    "sdlc-comparison": "SDLC Models & Simulator",
    documentation: "Technical Specifications & UN SDG 9",
    landing: "Platform Showcase",
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-cyber-bg/85 backdrop-blur-md border-b border-cyber-border px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-cyber-textMuted hover:text-white rounded-lg border border-cyber-border"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-cyber-textMuted">
          <span className="text-cyber-textSecondary flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
            NETRISK
          </span>
          <span>/</span>
          <span className="text-white font-semibold">
            {tabLabels[currentTab] || "Overview"}
          </span>
        </div>
      </div>

      {/* Right: Operational Status + New Assessment */}
      <div className="flex items-center gap-3">
        {/* System Operational Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="hidden sm:inline">SYSTEM OPERATIONAL</span>
        </div>

        {/* Quick New Assessment Button */}
        {currentTab !== 'assessment' && (
          <button
            onClick={() => setCurrentTab('assessment')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyber-blue hover:bg-cyber-sky text-white shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        )}
      </div>
    </header>
  );
}
