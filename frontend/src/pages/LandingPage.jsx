import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Award, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Globe, 
  Kanban,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ setCurrentTab }) {
  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="text-center space-y-5 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/15 border border-cyber-blue/30 text-cyber-sky text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>B.Tech Cybersecurity Capstone &bull; UN SDG 9 Aligned</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Risk-Aware SDLC Model Selection for<br />
          <span className="bg-gradient-to-r from-cyber-cyan via-cyber-sky to-cyber-blue bg-clip-text text-transparent">
            AI-Based Intrusion Detection Software
          </span>
        </h1>

        <p className="text-sm sm:text-base text-cyber-textSecondary max-w-2xl mx-auto leading-relaxed">
          NETRISK is a decision-support platform that quantifies 7 dimensional risk attributes, computes suitability across 5 software lifecycles, and synchronizes real-time development with Jira Cloud.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setCurrentTab('assessment')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-cyan text-cyber-bg font-extrabold text-sm shadow-glowCyan hover:brightness-110 transition flex items-center gap-2"
          >
            <span>Launch Risk Assessment</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="px-5 py-3 rounded-xl bg-cyber-card hover:bg-cyber-elevated text-white border border-cyber-border font-bold text-sm transition"
          >
            Open Operational Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('jira-board')}
            className="px-5 py-3 rounded-xl bg-cyber-card hover:bg-cyber-elevated text-cyber-cyan border border-cyber-border font-bold text-sm transition flex items-center gap-2"
          >
            <Kanban className="w-4 h-4" />
            <span>Jira Board (NRASS)</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-cardBorder transition space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">7-Factor Risk Engine</h3>
          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            Evaluates security criticality, AI complexity, threat volatility, requirement uncertainty, operational tolerances, compliance, and inverted team maturity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-cardBorder transition space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">5 SDLC Scoring Models</h3>
          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            Computes mathematical suitability across Waterfall, V-Model, Agile, Spiral, and DevSecOps models with natural-language decision justification.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-cardBorder transition space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Live Atlassian Ecosystem</h3>
          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            Synchronized with Jira Cloud project (NRASS) spanning 5 Epics, 5 Sprints, and 34 Stories, paired with 6 verified Confluence specifications.
          </p>
        </div>
      </div>

      {/* SDG 9 Feature Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-cyber-card to-cyber-elevated border border-amber-500/35 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#f16e22] text-white flex flex-col items-center justify-center font-black shadow-lg shrink-0">
          <span className="text-2xl leading-none">9</span>
          <span className="text-[8px] uppercase tracking-tighter text-center mt-1">Industry &bull; Innovation</span>
        </div>
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            United Nations Sustainable Development Goal 9
          </span>
          <h3 className="text-lg font-bold text-white">
            Building Resilient Infrastructure &amp; Fostering Sustainable Innovation
          </h3>
          <p className="text-xs text-cyber-textSecondary leading-relaxed">
            By embedding rigorous SDLC selection into AI-based Intrusion Detection Systems, NETRISK guards critical telecommunications and enterprise infrastructure against zero-day failures.
          </p>
        </div>
      </div>
    </div>
  );
}
