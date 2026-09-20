import React, { useState } from 'react';
import { MunicipalActionItem, Tree } from '../types';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  AlertOctagon,
  ArrowUpRight,
  Filter,
  Check,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface MunicipalDashboardProps {
  trees: Tree[];
  actions: MunicipalActionItem[];
  onUpdateAction: (id: string, updates: Partial<MunicipalActionItem>) => void;
  onSelectTree: (tree: Tree) => void;
  onRefresh?: () => void;
}

export const MunicipalDashboard: React.FC<MunicipalDashboardProps> = ({
  trees,
  actions,
  onUpdateAction,
  onSelectTree,
  onRefresh,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'at_risk' | 'needs_attention'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'dispatched' | 'resolved'>('all');
  const [activeLogModalAction, setActiveLogModalAction] = useState<MunicipalActionItem | null>(null);
  const [newLogText, setNewLogText] = useState('');

  // Stats
  const totalTrees = trees.length;
  const criticalCount = trees.filter((t) => t.currentStatus === 'critical').length;
  const atRiskCount = trees.filter((t) => t.currentStatus === 'at_risk').length;
  const attentionCount = trees.filter((t) => t.currentStatus === 'needs_attention').length;
  const healthyCount = trees.filter((t) => t.currentStatus === 'healthy').length;

  const averageScore = Math.round(
    trees.reduce((acc, t) => acc + t.currentHealthScore, 0) / (totalTrees || 1)
  );

  const filteredActions = actions.filter((act) => {
    const matchesSeverity = severityFilter === 'all' || act.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || act.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const handleAddLog = (actionId: string) => {
    if (!newLogText.trim()) return;
    onUpdateAction(actionId, {
      logs: [...(activeLogModalAction?.logs || []), `[${new Date().toLocaleDateString()}] ${newLogText}`],
    });
    setNewLogText('');
    setActiveLogModalAction(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-6 rounded-3xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Urban Forestry Operations
            </span>
            <span className="text-xs font-mono text-stone-400">Civic Response Center</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mt-1">
            Municipal Canopy Health & Rapid Action Queue
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time urban forestry triage platform converting citizen & sensor detections into arborist work orders.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="self-start md:self-center px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
        )}
      </div>

      {/* City Canopy KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Total Monitored Trees
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold text-stone-100">{totalTrees}</span>
            <span className="text-xs text-emerald-400">Specimens</span>
          </div>
          <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div className="w-full h-full bg-emerald-500" />
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
          <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Critical Status
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold text-rose-400">{criticalCount}</span>
            <span className="text-xs text-stone-400">({Math.round((criticalCount / totalTrees) * 100)}%)</span>
          </div>
          <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-rose-500"
              style={{ width: `${(criticalCount / totalTrees) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
          <span className="text-[10px] uppercase font-bold text-orange-400 block tracking-wider">
            At Risk
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold text-orange-400">{atRiskCount}</span>
            <span className="text-xs text-stone-400">({Math.round((atRiskCount / totalTrees) * 100)}%)</span>
          </div>
          <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${(atRiskCount / totalTrees) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
            Needs Attention
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold text-amber-400">{attentionCount}</span>
            <span className="text-xs text-stone-400">({Math.round((attentionCount / totalTrees) * 100)}%)</span>
          </div>
          <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${(attentionCount / totalTrees) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
            Average Canopy Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold text-emerald-400">{averageScore}</span>
            <span className="text-xs text-stone-400">/100 index</span>
          </div>
          <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${averageScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Queue Control Bar */}
      <div className="bg-stone-900/80 p-5 rounded-3xl border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Prioritized Arborist Action Queue ({filteredActions.length})
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Work orders generated from AI early-warning triggers and arborist threshold breaches.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${
                  severityFilter === 'all' ? 'bg-stone-800 text-stone-100 font-semibold' : 'text-stone-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-2.5 py-1 rounded-lg ${
                  severityFilter === 'critical' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setSeverityFilter('at_risk')}
                className={`px-2.5 py-1 rounded-lg ${
                  severityFilter === 'at_risk' ? 'bg-orange-500/20 text-orange-300 font-semibold' : 'text-stone-400'
                }`}
              >
                At Risk
              </button>
            </div>

            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'all' ? 'bg-stone-800 text-stone-100 font-semibold' : 'text-stone-400'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('dispatched')}
                className={`px-2.5 py-1 rounded-lg ${
                  statusFilter === 'dispatched' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-stone-400'
                }`}
              >
                Dispatched
              </button>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-3 pt-2">
          {filteredActions.map((action) => {
            const isCritical = action.severity === 'critical';
            const matchedTree = trees.find((t) => t.id === action.treeId);

            return (
              <div
                key={action.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 mt-1 ${
                      isCritical
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                        : action.severity === 'at_risk'
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-stone-200">
                        {action.treeCode}
                      </span>
                      <span className="text-xs text-stone-400">({action.species})</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          action.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : action.status === 'dispatched'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {action.status}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        Priority: {action.priorityScore}/100
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-stone-100">{action.issue}</h4>

                    <p className="text-xs text-stone-300 flex items-center gap-1.5">
                      <strong className="text-stone-400">Action:</strong>
                      <span>{action.recommendedAction}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {action.zone}
                      </span>
                      {action.assignedTeam && (
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3 text-cyan-400" />
                          {action.assignedTeam}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Operations Buttons */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {matchedTree && (
                    <button
                      onClick={() => onSelectTree(matchedTree)}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl border border-stone-700 transition-colors flex items-center gap-1"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      View Tree
                    </button>
                  )}

                  {action.status === 'pending' && (
                    <button
                      onClick={() =>
                        onUpdateAction(action.id, {
                          status: 'dispatched',
                          assignedTeam: 'Rapid Response Arborist Squad 1',
                        })
                      }
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Dispatch Squad
                    </button>
                  )}

                  {action.status === 'dispatched' && (
                    <button
                      onClick={() => onUpdateAction(action.id, { status: 'resolved' })}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Inspected
                    </button>
                  )}

                  {action.status === 'resolved' && (
                    <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Work Complete
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
