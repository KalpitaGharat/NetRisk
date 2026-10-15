import React from 'react';

export default function RiskGauge({ score = 0, size = 140, strokeWidth = 12 }) {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  let color = "#10b981"; // Low
  if (normalized > 70) color = "#ef4444"; // Very High
  else if (normalized > 50) color = "#f97316"; // High
  else if (normalized > 30) color = "#f59e0b"; // Moderate

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold font-mono tracking-tight text-white">
          {normalized.toFixed(1)}%
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-cyber-textMuted">
          Overall Risk
        </span>
      </div>
    </div>
  );
}
