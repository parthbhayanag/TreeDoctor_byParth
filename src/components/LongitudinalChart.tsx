import React, { useState } from 'react';
import { TreeScan } from '../types';
import { formatDate, getStatusColor } from '../utils/helpers';
import { Calendar, Info } from 'lucide-react';

interface LongitudinalChartProps {
  scans: TreeScan[];
  treeCode: string;
}

export const LongitudinalChart: React.FC<LongitudinalChartProps> = ({ scans, treeCode }) => {
  const [hoveredScanIndex, setHoveredScanIndex] = useState<number | null>(null);

  if (!scans || scans.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl">
        No longitudinal scan records available yet.
      </div>
    );
  }

  // Sort scans chronologically
  const sortedScans = [...scans].sort(
    (a, b) => new Date(a.scanDate).getTime() - new Date(b.scanDate).getTime()
  );

  // SVG dimensions
  const width = 640;
  const height = 240;
  const padding = { top: 25, right: 35, bottom: 45, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // X coordinate mapping (evenly spaced across scan points or by date)
  const getX = (index: number) => {
    if (sortedScans.length === 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (sortedScans.length - 1)) * graphWidth;
  };

  // Y coordinate mapping (0 to 100)
  const getY = (score: number) => {
    const clamped = Math.min(100, Math.max(0, score));
    return padding.top + graphHeight - (clamped / 100) * graphHeight;
  };

  // Build SVG path
  const points = sortedScans.map((s, idx) => ({
    x: getX(idx),
    y: getY(s.healthScore),
    scan: s,
  }));

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    // Catmull-Rom or cubic curve for smooth organic arborist curve
    const prev = points[idx - 1];
    const cX1 = prev.x + (pt.x - prev.x) / 2;
    const cY1 = prev.y;
    const cX2 = prev.x + (pt.x - prev.x) / 2;
    const cY2 = pt.y;
    return `${acc} C ${cX1},${cY1} ${cX2},${cY2} ${pt.x},${pt.y}`;
  }, '');

  // Fill area under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x},${padding.top + graphHeight} L ${points[0].x},${
    padding.top + graphHeight
  } Z`;

  // Calculate net health delta between first and last scan
  const firstScore = sortedScans[0].healthScore;
  const latestScore = sortedScans[sortedScans.length - 1].healthScore;
  const delta = latestScore - firstScore;

  return (
    <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">
              Longitudinal Health Trajectory
            </h4>
            <span className="text-xs font-mono text-stone-500 font-medium">
              ({sortedScans.length} scans recorded)
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Continuous health score evaluation tracking canopy and vascular vigor over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {delta < -10 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ↓ Declining ({delta} pts)
            </span>
          ) : delta > 5 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ↑ Improving (+{delta} pts)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              → Stable Trend
            </span>
          )}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-64 font-mono text-xs select-none"
        >
          <defs>
            <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Horizontal grid bands */}
          {[100, 80, 60, 40, 20].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#292524"
                  strokeWidth="1"
                  strokeDasharray={level === 80 || level === 40 ? '4 4' : undefined}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#78716c"
                  className="text-[10px]"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Critical Threshold Highlight line (Score = 60) */}
          <line
            x1={padding.left}
            y1={getY(60)}
            x2={padding.left + graphWidth}
            y2={getY(60)}
            stroke="#f97316"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.4"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#scoreAreaGradient)" />

          {/* Main Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const statusColor = getStatusColor(pt.scan.status);
            const isHovered = hoveredScanIndex === idx;

            return (
              <g
                key={pt.scan.id}
                onMouseEnter={() => setHoveredScanIndex(idx)}
                onMouseLeave={() => setHoveredScanIndex(null)}
                className="cursor-pointer group"
              >
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 12 : 7}
                  fill={statusColor.hex}
                  fillOpacity={isHovered ? 0.4 : 0.2}
                  className="transition-all duration-300"
                />
                {/* Core dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4.5}
                  fill={statusColor.hex}
                  stroke="#1c1917"
                  strokeWidth="2"
                />

                {/* Score value above dot */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#e7e5e4"
                  className="text-[10px] font-bold font-mono"
                >
                  {pt.scan.healthScore}
                </text>

                {/* Date on X Axis */}
                <text
                  x={pt.x}
                  y={padding.top + graphHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? '#34d399' : '#a8a29e'}
                  className="text-[10px] transition-colors"
                >
                  {formatDate(pt.scan.scanDate).split(',')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Tooltip Card for hovered point or latest point */}
      {(() => {
        const activeIndex = hoveredScanIndex !== null ? hoveredScanIndex : points.length - 1;
        const activeScan = sortedScans[activeIndex];
        const statusColors = getStatusColor(activeScan.status);

        return (
          <div className="mt-3 p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-300 font-medium">
                Scan on {formatDate(activeScan.scanDate)}:
              </span>
              <span className={`font-mono font-bold ${statusColors.text}`}>
                Score {activeScan.healthScore}/100
              </span>
            </div>
            <div className="text-stone-400 truncate max-w-md">
              {activeScan.symptoms[0] || 'Nominal baseline condition'}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
