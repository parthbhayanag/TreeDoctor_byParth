import React from 'react';
import { ScoreBreakdown, HealthStatus } from '../types';
import { getStatusColor, getStatusLabel } from '../utils/helpers';

interface ScoreGaugeProps {
  score: number;
  status: HealthStatus;
  breakdown?: ScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  status,
  breakdown,
  size = 'md',
  showBreakdown = true,
}) => {
  const statusColors = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  // Circular gauge calculations
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const radius = size === 'lg' ? 68 : size === 'md' ? 52 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  const categories = [
    { label: 'Leaf Condition', value: breakdown?.leafCondition ?? score, weight: 'Turgidity & necrosis' },
    { label: 'Canopy Density', value: breakdown?.canopyDensity ?? score, weight: 'Foliar coverage index' },
    { label: 'Visible Damage', value: breakdown?.visibleDamage ?? score, weight: 'Trunk bark & limbs' },
    { label: 'Color Pigmentation', value: breakdown?.colorAbnormalities ?? score, weight: 'Chlorophyll integrity' },
    { label: 'Overall Vitality', value: breakdown?.overallVitality ?? score, weight: 'Vascular sap vigor' },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Circle Gauge */}
      <div className="relative flex items-center justify-center">
        <svg width={svgSize} height={svgSize} className="-rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-stone-800"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={statusColors.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono font-bold tracking-tight text-stone-100 ${
              size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'
            }`}
          >
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            / 100
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors.badgeBg}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusColors.dot} animate-pulse`} />
          {statusLabel}
        </span>
      </div>

      {/* Category breakdown bars */}
      {showBreakdown && (
        <div className="w-full mt-6 space-y-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1 flex justify-between items-center">
            <span>Canopy Health Metrics</span>
            <span className="text-[10px] text-stone-500 font-normal">0 - 100 scale</span>
          </div>

          {categories.map((cat) => {
            const barWidth = Math.min(100, Math.max(0, cat.value));
            const catColor =
              cat.value >= 80 ? 'bg-emerald-500' : cat.value >= 60 ? 'bg-amber-500' : cat.value >= 40 ? 'bg-orange-500' : 'bg-rose-500';

            return (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300 font-medium">{cat.label}</span>
                  <span className="font-mono text-stone-400 font-semibold">{cat.value}/100</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${catColor} rounded-full transition-all duration-700`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
