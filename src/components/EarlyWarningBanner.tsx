import React from 'react';
import { AlertTriangle, TrendingDown, ArrowDownRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TreeAlert } from '../types';

interface EarlyWarningBannerProps {
  alert: TreeAlert;
  onResolve?: () => void;
}

export const EarlyWarningBanner: React.FC<EarlyWarningBannerProps> = ({ alert, onResolve }) => {
  return (
    <div
      id={`early-warning-${alert.id}`}
      className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/80 via-stone-900 to-rose-950/40 p-5 shadow-xl shadow-rose-950/20"
    >
      {/* Glow accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400 shrink-0 mt-0.5 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-stone-950">
                🚨 EARLY WARNING TRIGGERED
              </span>
              <span className="text-xs font-mono text-stone-400">
                Ref: {alert.treeCode}
              </span>
            </div>

            <h4 className="text-lg font-bold text-stone-100 mt-1.5 flex items-center gap-2">
              {alert.title}
            </h4>

            <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {alert.message}
            </p>

            {/* Change delta indicators */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 rounded-xl px-3.5 py-2">
                <span className="text-xs text-stone-400 font-medium">Previous Score:</span>
                <span className="font-mono font-bold text-stone-200">{alert.previousScore}</span>
              </div>

              <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 rounded-xl px-3.5 py-2">
                <span className="text-xs text-stone-400 font-medium">Current Score:</span>
                <span className="font-mono font-bold text-rose-400">{alert.currentScore}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 rounded-xl px-3.5 py-2 text-rose-300">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold">Change:</span>
                <span className="font-mono font-extrabold text-rose-400">
                  -{alert.scoreDrop} pts
                </span>
                <span className="text-[11px] text-rose-300/80">(in 14 days)</span>
              </div>
            </div>

            {/* Recommended action box */}
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/20 rounded-xl text-xs text-stone-200 flex items-start gap-2">
              <ArrowDownRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-300 font-semibold uppercase tracking-wide mr-1">
                  Immediate Action Required:
                </strong>
                <span>{alert.recommendedAction}</span>
              </div>
            </div>
          </div>
        </div>

        {onResolve && !alert.resolved && (
          <button
            onClick={onResolve}
            className="self-start md:self-center px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Mark Work Order Filed
          </button>
        )}
      </div>
    </div>
  );
};
