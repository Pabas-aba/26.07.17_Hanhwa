import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'danger';
  description?: string;
  onClick?: () => void;
  tooltipText?: string;
  showTooltip?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subValue,
  icon: Icon,
  status,
  description,
  onClick,
  tooltipText,
  showTooltip = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          indicator: 'bg-emerald-500',
          ring: 'ring-emerald-500/20'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          indicator: 'bg-amber-500',
          ring: 'ring-amber-500/20'
        };
      case 'danger':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          indicator: 'bg-rose-500',
          ring: 'ring-rose-500/20'
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-slate-900 p-5 transition-all duration-200 
        ${onClick ? 'cursor-pointer active:scale-98 hover:border-slate-700 hover:bg-slate-850 shadow-md' : ''} 
        ${colors.ring} ring-1`}
    >
      {/* Glow effect matching status */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-xl ${colors.indicator}`} />

      {/* Header with Icon and Signal lamp */}
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-slate-800 p-3 text-slate-300">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          {/* Tri-color indicator lamp */}
          <span className="text-xs font-mono font-medium text-slate-400 uppercase">
            {status === 'normal' ? '정상 (SAFE)' : status === 'warning' ? '주의 (WARN)' : '위험 (ALERT)'}
          </span>
          <span className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.indicator}`} />
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${colors.indicator}`} />
          </span>
        </div>
      </div>

      {/* Primary Value */}
      <div className="mt-4">
        <h3 className="text-sm font-medium tracking-tight text-slate-400">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3.5xl font-bold font-sans tracking-tight text-white">{value}</span>
          {subValue && (
            <span className="text-sm font-semibold text-slate-400 font-mono">{subValue}</span>
          )}
        </div>
      </div>

      {/* Footer descriptor */}
      {description && (
        <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">{description}</p>
      )}

      {/* Junior engineer tooltip */}
      {showTooltip && tooltipText && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-xs text-indigo-200">
          <span className="font-bold text-indigo-400 select-none">💡 신입가이드:</span>
          <span>{tooltipText}</span>
        </div>
      )}
    </div>
  );
};
