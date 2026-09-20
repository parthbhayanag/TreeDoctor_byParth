import React, { useState, useEffect } from 'react';
import { Tree, MunicipalActionItem } from './types';
import { SEED_TREES, INITIAL_MUNICIPAL_ACTIONS } from './data/seedTrees';
import { LandingView } from './components/LandingView';
import { TreeHealthMap } from './components/TreeHealthMap';
import { TreeScannerView } from './components/TreeScannerView';
import { MunicipalDashboard } from './components/MunicipalDashboard';
import { TreeProfileModal } from './components/TreeProfileModal';
import { AddTreeModal } from './components/AddTreeModal';
import { HackathonWalkthrough } from './components/HackathonWalkthrough';
import {
  Trees,
  MapPin,
  Camera,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Play,
  RotateCcw,
  PlusCircle,
  Download,
  FileText,
} from 'lucide-react';

export default function App() {
  const [trees, setTrees] = useState<Tree[]>(SEED_TREES);
  const [actions, setActions] = useState<MunicipalActionItem[]>(INITIAL_MUNICIPAL_ACTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentView, setCurrentView] = useState<'landing' | 'map' | 'scan' | 'dashboard'>('landing');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [activeProfileTree, setActiveProfileTree] = useState<Tree | null>(null);
  const [scannerTargetTree, setScannerTargetTree] = useState<Tree | null>(null);

  // Hackathon walkthrough state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState<boolean>(false);

  // Fetch initial data from server
  const fetchTreesAndActions = async () => {
    try {
      setIsLoading(true);
      const [treesRes, actionsRes] = await Promise.all([
        fetch('/api/trees').then((r) => r.json()),
        fetch('/api/actions').then((r) => r.json()),
      ]);

      if (treesRes && treesRes.trees) {
        setTrees(treesRes.trees);
      }
      if (actionsRes && actionsRes.actions) {
        setActions(actionsRes.actions);
      }
    } catch (err) {
      console.warn('Using local seed data fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreesAndActions();
  }, []);

  // Reset demo state back to pristine seed
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      await fetchTreesAndActions();
      setDemoStep(1);
      setCurrentView('landing');
      setSelectedTree(null);
      setActiveProfileTree(null);
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // Demo step synchronization
  const handleSetDemoStep = (step: number) => {
    setDemoStep(step);
    if (step === 1) {
      setActiveProfileTree(null);
      setCurrentView('landing');
    } else if (step === 2) {
      setActiveProfileTree(null);
      setCurrentView('map');
    } else if (step === 3) {
      setCurrentView('map');
      // Find the demo tree
      const target = trees.find((t) => t.id === 'tree-demo' || t.treeCode === 'TREE-DEMO-001' || t.id === 'tree-003') || trees[0];
      setSelectedTree(target);
      setActiveProfileTree(target);
    } else if (step === 4) {
      setActiveProfileTree(null);
      const target = trees.find((t) => t.id === 'tree-demo' || t.treeCode === 'TREE-DEMO-001' || t.id === 'tree-003') || trees[0];
      setScannerTargetTree(target);
      setCurrentView('scan');
    } else if (step === 5) {
      setActiveProfileTree(null);
      setCurrentView('dashboard');
    }
  };

  const handleStartDemo = () => {
    setIsDemoActive(true);
    handleSetDemoStep(1);
  };

  // Municipal action status updater
  const handleUpdateAction = async (id: string, updates: Partial<MunicipalActionItem>) => {
    try {
      const res = await fetch(`/api/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.action) {
        setActions((prev) => prev.map((a) => (a.id === id ? data.action : a)));
      }
    } catch (err) {
      console.error('Failed to update action:', err);
      // Local fallback
      setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    }
  };

  // Handle saved scan
  const handleScanSaved = (treeId: string, updatedTree: Tree) => {
    setTrees((prev) => {
      const exists = prev.some((t) => t.id === treeId);
      if (exists) {
        return prev.map((t) => (t.id === treeId ? updatedTree : t));
      }
      return [updatedTree, ...prev];
    });
    setSelectedTree(updatedTree);
    fetchTreesAndActions(); // refresh municipal queue too
  };

  // Add user tree handler
  const handleTreeAdded = (newTree: Tree) => {
    setTrees((prev) => [newTree, ...prev.filter((t) => t.id !== newTree.id)]);
    setSelectedTree(newTree);
    setCurrentView('map');
  };

  // Delete tree handler
  const handleDeleteTree = async (treeId: string) => {
    try {
      await fetch(`/api/trees/${treeId}`, { method: 'DELETE' });
      setTrees((prev) => prev.filter((t) => t.id !== treeId));
      if (selectedTree?.id === treeId) setSelectedTree(null);
      if (activeProfileTree?.id === treeId) setActiveProfileTree(null);
      fetchTreesAndActions();
    } catch (err) {
      console.error('Failed to delete tree:', err);
    }
  };

  const criticalPendingActions = actions.filter(
    (a) => a.severity === 'critical' && a.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-[600] bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              setCurrentView('landing');
              setActiveProfileTree(null);
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-stone-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trees className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-stone-100 group-hover:text-emerald-400 transition-colors">
                  TreeDoctor
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block -mt-0.5">
                Urban Tree Health & Early Warning
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-900/80 p-1 rounded-2xl border border-stone-800/80 text-xs">
            <button
              onClick={() => {
                setCurrentView('landing');
                setActiveProfileTree(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-stone-800 text-stone-100 shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => {
                setCurrentView('map');
                setActiveProfileTree(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'map'
                  ? 'bg-stone-800 text-stone-100 shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Canopy Map
            </button>

            <button
              onClick={() => {
                setCurrentView('scan');
                setActiveProfileTree(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'scan'
                  ? 'bg-stone-800 text-stone-100 shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Scan a Tree
            </button>

            <button
              onClick={() => setIsAddTreeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 text-stone-400 hover:text-emerald-400 hover:bg-stone-800/60"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              Add Tree
            </button>

            <button
              onClick={() => {
                setCurrentView('dashboard');
                setActiveProfileTree(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-stone-800 text-stone-100 shadow-sm border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Municipal Queue
              {criticalPendingActions > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-stone-950 font-mono">
                  {criticalPendingActions}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Demo, README Download & Reset Tools */}
          <div className="flex items-center gap-2">
            <a
              href="/api/readme"
              download="README.md"
              title="Download full project README.md"
              className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-emerald-400 border border-stone-800 hover:border-emerald-500/40 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">README.md</span>
            </a>

            <button
              onClick={handleStartDemo}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>3-Min Demo</span>
            </button>

            <button
              onClick={handleResetDemo}
              title="Reset sample dataset to initial state"
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentView === 'landing' && (
          <LandingView
            trees={trees}
            onStartDemo={handleStartDemo}
            onOpenMap={() => setCurrentView('map')}
            onOpenScanner={() => {
              setScannerTargetTree(null);
              setCurrentView('scan');
            }}
            onOpenDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Urban Canopy Health Map
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Interactive real-time spatial monitor. Color indicates 0–100 health score; pulsing pins signal active rapid deterioration alerts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddTreeModalOpen(true)}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Add Tree
                </button>
                <button
                  onClick={() => {
                    setScannerTargetTree(null);
                    setCurrentView('scan');
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Scan Tree at Location
                </button>
              </div>
            </div>

            <TreeHealthMap
              trees={trees}
              selectedTree={selectedTree}
              onSelectTree={(tree) => setSelectedTree(tree)}
              onOpenProfile={(tree) => setActiveProfileTree(tree)}
              onScanTree={(tree) => {
                setScannerTargetTree(tree);
                setCurrentView('scan');
              }}
              onOpenAddTree={() => setIsAddTreeModalOpen(true)}
              onDeleteTree={handleDeleteTree}
            />
          </div>
        )}

        {currentView === 'scan' && (
          <TreeScannerView
            trees={trees}
            targetTree={scannerTargetTree}
            onScanSaved={handleScanSaved}
            onNavigateToTree={(tree) => {
              setSelectedTree(tree);
              setActiveProfileTree(tree);
            }}
            onCancel={() => setCurrentView('map')}
          />
        )}

        {currentView === 'dashboard' && (
          <MunicipalDashboard
            trees={trees}
            actions={actions}
            onUpdateAction={handleUpdateAction}
            onSelectTree={(tree) => {
              setSelectedTree(tree);
              setActiveProfileTree(tree);
            }}
            onRefresh={fetchTreesAndActions}
          />
        )}
      </main>

      {/* Full Tree Profile Modal (Longitudinal History, Chart & Early Warning) */}
      {activeProfileTree && (
        <TreeProfileModal
          tree={activeProfileTree}
          onClose={() => setActiveProfileTree(null)}
          onScanTree={(tree) => {
            setActiveProfileTree(null);
            setScannerTargetTree(tree);
            setCurrentView('scan');
          }}
          onDeleteTree={handleDeleteTree}
          onResolveAlert={async (treeId) => {
            try {
              await fetch(`/api/trees/${treeId}/resolve-alert`, { method: 'POST' });
              fetchTreesAndActions();
              setActiveProfileTree((prev) => (prev ? { ...prev, activeAlert: undefined } : null));
            } catch (err) {
              console.error('Resolve alert error:', err);
            }
          }}
        />
      )}

      {/* Register New Tree Modal */}
      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={() => setIsAddTreeModalOpen(false)}
        onTreeAdded={handleTreeAdded}
      />

      {/* Floating 3-Minute Hackathon Demo Tour Bar */}
      {isDemoActive && (
        <HackathonWalkthrough
          currentStep={demoStep}
          onSetStep={handleSetDemoStep}
          onClose={() => setIsDemoActive(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-400">TreeDoctor</span>
            <span>—</span>
            <span>Tech for a Better Tomorrow: Urban Canopy Preservation</span>
          </div>
          <div className="text-[11px] text-stone-500">
            Powered by Gemini Multimodal Vision & Calibrated Arborist Biometrics
          </div>
        </div>
      </footer>
    </div>
  );
}
