import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color = 'cyan', highlight = false }) {
  const iconColorMap = {
    cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20',
    blue: 'text-cyber-sky bg-cyber-blue/10 border-cyber-blue/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  const iconClasses = iconColorMap[color] || iconColorMap.cyan;

  return (
    <div className={`p-5 rounded-xl bg-cyber-card border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow flex items-center justify-between ${highlight ? 'border-cyber-blue/40 shadow-glow' : 'border-cyber-border hover:border-cyber-cardBorder'}`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyber-textMuted">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-white font-mono tracking-tight">
          {value ?? '-'}
        </p>
        {subtext && (
          <p className="text-xs text-cyber-textSecondary">
            {subtext}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${iconClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
