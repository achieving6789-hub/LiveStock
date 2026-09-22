import React from 'react';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

interface RiskBadgeProps {
  level: RiskLevel | string;
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, className = '' }) => {
  const normalized = (level || 'LOW').toUpperCase();

  const styles: Record<string, { bg: string; dot: string; label: string }> = {
    LOW: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      label: 'Low Risk',
    },
    MODERATE: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      dot: 'bg-amber-500',
      label: 'Moderate Risk',
    },
    HIGH: {
      bg: 'bg-orange-50 border-orange-200 text-orange-800',
      dot: 'bg-orange-500',
      label: 'High Risk',
    },
    CRITICAL: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800 animate-pulse',
      dot: 'bg-rose-600',
      label: 'Critical Alert',
    },
  };

  const style = styles[normalized] || styles.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
      {typeof score === 'number' && <span className="opacity-75">({score}/100)</span>}
    </span>
  );
};
