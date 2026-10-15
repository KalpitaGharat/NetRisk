import React from 'react';

export default function RiskBadge({ level, size = 'md' }) {
  const norm = (level || '').toUpperCase();

  let colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let dotColor = "bg-emerald-400";
  let label = norm || "LOW";

  if (norm === "MODERATE") {
    colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    dotColor = "bg-amber-400";
  } else if (norm === "HIGH") {
    colorClasses = "bg-orange-500/15 text-orange-400 border-orange-500/30";
    dotColor = "bg-orange-400";
  } else if (norm === "VERY HIGH" || norm === "CRITICAL") {
    colorClasses = "bg-rose-500/15 text-rose-400 border-rose-500/35";
    dotColor = "bg-rose-400";
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-semibold tracking-wide';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border font-mono ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
}
