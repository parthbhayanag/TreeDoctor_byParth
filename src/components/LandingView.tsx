import React from 'react';
import {
  Camera,
  MapPin,
  TrendingDown,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Thermometer,
  Truck,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Tree } from '../types';

interface LandingViewProps {
  trees: Tree[];
  onStartDemo: () => void;
  onOpenMap: () => void;
  onOpenScanner: () => void;
  onOpenDashboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  trees,
  onStartDemo,
  onOpenMap,
  onOpenScanner,
  onOpenDashboard,
}) => {
  const criticalCount = trees.filter((t) => t.currentStatus === 'critical').length;
  const totalScans = trees.reduce((acc, t) => acc + t.scanCount, 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60 p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            TECH FOR A BETTER TOMORROW • URBAN RESILIENCE
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
            Google Maps tells us where trees are.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300">
              TreeDoctor tells us which ones need our help.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
            Give every tree a longitudinal health record. TreeDoctor combines citizen & arborist smartphone photos with AI computer vision, microclimate weather data, and proactive early-warning algorithms to detect silent canopy stress weeks before structural death.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenScanner}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-sm transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Scan a Tree Now
            </button>

            <button
              onClick={onOpenMap}
              className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold rounded-2xl text-sm border border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explore Tree Health Map
            </button>

            <button
              onClick={onStartDemo}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-semibold rounded-2xl text-sm border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-amber-400" />
              3-Min Hackathon Demo Tour
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Platform Proof Counters */}
          <div className="pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-500 uppercase tracking-wider block text-[10px]">
                Monitored Canopy
              </span>
              <span className="font-mono font-bold text-lg text-stone-200">
                {trees.length} Specimens
              </span>
            </div>
            <div>
              <span className="text-stone-500 uppercase tracking-wider block text-[10px]">
                Scans Logged
              </span>
              <span className="font-mono font-bold text-lg text-stone-200">
                {totalScans} Observations
              </span>
            </div>
            <div>
              <span className="text-rose-400 uppercase tracking-wider block text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Active Early Warnings
              </span>
              <span className="font-mono font-bold text-lg text-rose-400">
                {criticalCount} Critical Declines
              </span>
            </div>
            <div>
              <span className="text-emerald-400 uppercase tracking-wider block text-[10px]">
                Longitudinal Engine
              </span>
              <span className="font-mono font-bold text-lg text-emerald-400">
                Active & Calibrated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Real-World Problem vs. The TreeDoctor Solution */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            The Core Real-World Challenge
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
            Why Urban Trees Die Silently
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Cities spend millions planting new saplings while mature 40-year-old shade trees collapse from preventable root stress and unmonitored drought.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Way */}
          <div className="bg-stone-900/40 p-6 rounded-3xl border border-stone-800/80 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold uppercase tracking-wider">
                The Status Quo: Reactive & Blind
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  <strong>Municipal Tree Inventories are Static:</strong> Censuses are conducted once every 5 to 7 years. By the time a city notices stress, the tree is dead.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  <strong>One-Off "Photo Checkers" Lack Memory:</strong> Taking a single photo with a generic plant app cannot tell if a yellow leaf is seasonal or a 20-point health collapse.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  <strong>No Civic Dispatch Pipeline:</strong> Citizens take pictures but have no way to trigger an arborist root-collar excavation or municipal water tanker.
                </span>
              </li>
            </ul>
          </div>

          {/* TreeDoctor Way */}
          <div className="bg-emerald-950/20 p-6 rounded-3xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold uppercase tracking-wider">
                The TreeDoctor Paradigm: Longitudinal & Proactive
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Longitudinal Tree Health Records:</strong> Each tree maintains a medical-grade record tracking leaf necrosis, crown density, and bark condition over time.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Automated Early Warning Algorithm:</strong> Detects sharp drops (e.g. score plummeting from 84 to 61 in 14 days) and triggers warnings before root failure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Municipal Rapid Action Queue:</strong> Converts AI detections into prioritized work orders for city foresters and watering tankers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How TreeDoctor Works: 4-Step Architecture */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
            How Continuous Monitoring Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold">
              01
            </div>
            <h4 className="text-sm font-bold text-stone-100">Crowdsourced & Arborist Scans</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Users snap smartphone photos of leaves, crown, and trunk bark tied to GPS coordinates.
            </p>
          </div>

          <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
              02
            </div>
            <h4 className="text-sm font-bold text-stone-100">Multi-factor Biometric AI</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Computes calibrated 0–100 health scores across chlorosis, canopy porosity, and structural lesions.
            </p>
          </div>

          <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold">
              03
            </div>
            <h4 className="text-sm font-bold text-stone-100">Early Warning Detection</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Compares today's score with historical baseline. Trajectory drops trigger rapid arborist alerts.
            </p>
          </div>

          <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold">
              04
            </div>
            <h4 className="text-sm font-bold text-stone-100">Municipal Action Queue</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dispatches targeted interventions (depaving, root aeration, fungicide, water tankers) saving the tree.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Demonstration Callout: The Tree in Danger */}
      <section className="bg-stone-900/70 rounded-3xl border border-stone-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              🚨 Live Hackathon Case Study
            </span>
            <span className="text-xs font-mono text-stone-400">Specimen Heritage Rain Tree (TREE-DEMO-001)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-100">
            Heritage Rain Tree: Dropping from 84 to 61 in 14 Days
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Inspect the live medical history of this mature Albizia saman shade tree. See the longitudinal graph, the heatwave correlation, and how the system flags it for immediate intervention before crown collapse.
          </p>
        </div>

        <button
          onClick={onStartDemo}
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs transition-all flex items-center gap-2 shadow-xl shadow-rose-600/20 shrink-0 cursor-pointer"
        >
          <TrendingDown className="w-4 h-4" />
          Inspect Case Study & Warning
        </button>
      </section>
    </div>
  );
};
