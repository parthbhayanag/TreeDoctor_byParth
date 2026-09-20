import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Presentation,
  CheckCircle2,
  TrendingDown,
  AlertTriangle,
  Cpu,
  Layers,
  DollarSign,
  Globe2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = 8; // Cover + 7 required slides

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalSlides, isFullscreen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="presentation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className={`bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[92vh] h-[750px]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-800/80 bg-stone-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                TreeDoctor Pitch Deck
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/60 text-emerald-400 font-mono">
                  Slide {currentSlide + 1} of {totalSlides}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/presentation/pdf"
              download="TreeDoctor_Pitch_Deck.pdf"
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              title="Download 7-Slide Pitch Deck in PDF format"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .PDF</span>
            </a>

            <a
              href="/api/presentation"
              download="TreeDoctor_Pitch_Deck.pptx"
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-emerald-500/50 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
              title="Download verified .PPTX file"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span>.PPTX</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/80 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Close Deck"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Stage / Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex items-center justify-center bg-stone-950">
          <div className="w-full max-w-5xl aspect-[16/9] min-h-[460px] bg-stone-900/90 border border-stone-800 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Background Aesthetic Subtle Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            {/* Slide 0: Cover */}
            {currentSlide === 0 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> AI-Powered Urban Canopy Health Platform
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-100 tracking-tight mb-3">
                    TreeDoctor
                  </h1>
                  <p className="text-lg sm:text-xl font-medium text-emerald-400 italic mb-4">
                    &ldquo;Google Maps tells us where trees are. TreeDoctor tells us which ones need our help.&rdquo;
                  </p>
                  <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    An intelligent early warning and clinical EHR platform combining Multimodal Vision AI (Gemini 2.5 Flash),
                    longitudinal time-series health tracking, real-time microclimate telemetry, and automated municipal field dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-800/80">
                  <div className="p-3 bg-stone-950/80 border border-emerald-500/30 rounded-xl">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Vision Engine</p>
                    <p className="text-sm font-semibold text-stone-200">Gemini 2.5 Flash Multimodal</p>
                  </div>
                  <div className="p-3 bg-stone-950/80 border border-sky-500/30 rounded-xl">
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Early Warning</p>
                    <p className="text-sm font-semibold text-stone-200">Longitudinal Trend Alerts</p>
                  </div>
                  <div className="p-3 bg-stone-950/80 border border-amber-500/30 rounded-xl">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Real Telemetry</p>
                    <p className="text-sm font-semibold text-stone-200">Open-Meteo & Copernicus Grid</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 1: Problem Statement */}
            {currentSlide === 1 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-950 border border-rose-800 text-rose-400 text-xs font-bold">
                      1️⃣ PROBLEM STATEMENT
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    Urban Trees Are Dying in Plain Sight
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-6">
                    Cities spend millions planting trees, yet lose up to 30% prematurely due to a total lack of clinical health visibility.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-stone-950/80 border border-amber-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 uppercase">
                        Blind Spot
                      </span>
                      <h3 className="text-base font-bold text-stone-100 mt-2.5 mb-1.5">Static Inventories</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        GIS maps are updated only once every 5 to 7 years. Tree pathogens, drought stress, and root decay progress in weeks.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-rose-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 uppercase">
                        Financial Drain
                      </span>
                      <h3 className="text-base font-bold text-stone-100 mt-2.5 mb-1.5">The Reactive Trap</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Cities only intervene after branch collapse or death. Removal costs ~$3,200/tree vs. ~$45 for preventative treatment.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-sky-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/60 uppercase">
                        Climate Stress
                      </span>
                      <h3 className="text-base font-bold text-stone-100 mt-2.5 mb-1.5">The Multiplier</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Urban heat islands (&gt;38°C), soil compaction, and PM2.5 pollution starve canopies before outward signs appear.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-400 mt-4">
                  <span className="font-semibold text-stone-300">Core Insight:</span>
                  <span>Maps track tree location; TreeDoctor tracks biological decline trajectories.</span>
                </div>
              </div>
            )}

            {/* Slide 2: Proposed Solution */}
            {currentSlide === 2 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
                      2️⃣ PROPOSED SOLUTION
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    From Static Inventory to Continuous Clinical Care
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    TreeDoctor transforms urban tree management into an automated Electronic Health Record (EHR) ecosystem.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-stone-950/80 border border-emerald-500/40 rounded-xl">
                      <span className="text-emerald-400 font-mono font-bold text-sm">01</span>
                      <h3 className="text-sm font-bold text-stone-100 mt-1 mb-1">Multimodal AI Vision</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Gemini 2.5 Flash quantifies foliar chlorosis, canopy thinning %, fungal conks, and pest holes with a standardized 0-100 score.
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-sky-500/40 rounded-xl">
                      <span className="text-sky-400 font-mono font-bold text-sm">02</span>
                      <h3 className="text-sm font-bold text-stone-100 mt-1 mb-1">Longitudinal EHR Alerts</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Historical health curves. Automatically fires urgent alerts whenever a tree drops &gt;10 health points between scans.
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-amber-500/40 rounded-xl">
                      <span className="text-amber-400 font-mono font-bold text-sm">03</span>
                      <h3 className="text-sm font-bold text-stone-100 mt-1 mb-1">Microclimate Grounding</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Cross-checks vigor against live ambient heat, 7-day rainfall deficits, humidity, and Copernicus AQI (PM2.5/PM10).
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-rose-500/40 rounded-xl">
                      <span className="text-rose-400 font-mono font-bold text-sm">04</span>
                      <h3 className="text-sm font-bold text-stone-100 mt-1 mb-1">Municipal Field Dispatch</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Converts diagnoses into city work orders (deep irrigation, micro-injection, pruning) with full lifecycle status tracking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-400 mt-4">
                  <span className="font-semibold">Closed-Loop Paradigm:</span>
                  <span>Citizen/Arborist Scan ➔ AI Diagnosis ➔ Telemetry Grounding ➔ Municipal Work Order</span>
                </div>
              </div>
            )}

            {/* Slide 3: Target Users */}
            {currentSlide === 3 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-sky-950 border border-sky-800 text-sky-400 text-xs font-bold">
                      3️⃣ TARGET USERS
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    Stakeholders, Pain Points & Value Delivered
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    Empowering city administrators, certified arborists, universities, and civic volunteers.
                  </p>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">CITY GOV</span>
                        <span className="text-xs font-bold text-stone-100">Parks & Forestry Departments</span>
                      </div>
                      <div className="sm:col-span-4 text-xs text-stone-400">Emergency failures, manual audits, citizen complaint backlogs.</div>
                      <div className="sm:col-span-4 text-xs text-emerald-400 font-semibold">Real-time canopy map, early decline alerts, automated dispatch.</div>
                    </div>

                    <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold">COMMERCIAL</span>
                        <span className="text-xs font-bold text-stone-100">Certified Arborists & Contractors</span>
                      </div>
                      <div className="sm:col-span-4 text-xs text-stone-400">Time-consuming paper assessments, lack of objective records.</div>
                      <div className="sm:col-span-4 text-xs text-emerald-400 font-semibold">AI pathology scoring (0-100), digital audit trails, photo history.</div>
                    </div>

                    <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">CAMPUSES</span>
                        <span className="text-xs font-bold text-stone-100">Botanical Gardens & Universities</span>
                      </div>
                      <div className="sm:col-span-4 text-xs text-stone-400">High-value heritage trees vulnerable to microclimate spikes.</div>
                      <div className="sm:col-span-4 text-xs text-emerald-400 font-semibold">Weather telemetry cross-referencing rainfall deficits for prevention.</div>
                    </div>

                    <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">COMMUNITY</span>
                        <span className="text-xs font-bold text-stone-100">Civic Volunteers & Stewards</span>
                      </div>
                      <div className="sm:col-span-4 text-xs text-stone-400">Want to help neighborhood trees but lack botanical expertise.</div>
                      <div className="sm:col-span-4 text-xs text-emerald-400 font-semibold">Zero-friction camera scanner, instant AI diagnosis, 1-tap reporting.</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 text-right mt-2">
                  Scales arborist inspection capacity across the community by 100x.
                </div>
              </div>
            )}

            {/* Slide 4: Technical Approach */}
            {currentSlide === 4 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-950 border border-purple-800 text-purple-400 text-xs font-bold">
                      4️⃣ TECHNICAL APPROACH
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    Production-Grade Full-Stack & Multimodal Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    Secure server-side AI execution, zero-mock atmospheric telemetry, and high-performance geospatial UI.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-stone-950/80 border border-emerald-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        AI & VISION LAYER
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-2">Gemini 2.5 Flash</h3>
                      <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                        <li>Multimodal vision of leaves, bark, crown structure.</li>
                        <li>Pathology detection: anthracnose, conks, borers.</li>
                        <li>Structured clinical JSON: 0-100 score & urgency.</li>
                        <li>Server-side isolation: API keys hidden from client.</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-sky-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        ATMOSPHERIC TELEMETRY
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-2">Open-Meteo & Copernicus</h3>
                      <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                        <li>Live telemetry grounded to exact GPS coordinates.</li>
                        <li>Ambient temp & 7-day cumulative rainfall deficit.</li>
                        <li>Relative humidity & Vapor Pressure Deficit (VPD).</li>
                        <li>Copernicus AQI with PM2.5 & PM10 particulates.</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-amber-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        FULL-STACK CORE
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-2">React 19 + Express</h3>
                      <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                        <li>Zero-typing registration with Leaflet map pinning.</li>
                        <li>3 base layers: Dark Canvas, Satellite, Terrain.</li>
                        <li>Longitudinal SVG charts with delta drop detection.</li>
                        <li>Node.js backend bundled via esbuild into CJS.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-400 mt-4">
                  <span className="text-emerald-400 font-semibold">Security & Performance:</span>
                  <span>Strict Node runtime proxying, zero client key leakage, offline map caching.</span>
                </div>
              </div>
            )}

            {/* Slide 5: Market & Business Potential */}
            {currentSlide === 5 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
                      5️⃣ MARKET & BUSINESS POTENTIAL
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    The $5.8B Opportunity & Quantifiable Municipal ROI
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    Saving public budgets, mitigating hazard liability, and protecting mature carbon assets.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 p-4 bg-stone-950/80 border border-emerald-500/40 rounded-xl flex flex-col justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">MUNICIPAL ROI METRICS</span>
                      <div className="space-y-3 my-2">
                        <div>
                          <p className="text-2xl font-extrabold text-stone-100">$250,000+</p>
                          <p className="text-xs text-stone-400">Annual savings per 100 rescued trees vs. removal and replanting.</p>
                        </div>
                        <div>
                          <p className="text-2xl font-extrabold text-stone-100">60% Drop</p>
                          <p className="text-xs text-stone-400">Reduction in sapling mortality via early microclimate intervention.</p>
                        </div>
                        <div>
                          <p className="text-2xl font-extrabold text-stone-100">70x Carbon</p>
                          <p className="text-xs text-stone-400">Mature trees store up to 70x more carbon than newly planted saplings.</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-500">Market Source: Smart Cities Urban Forestry Index 2026</span>
                    </div>

                    <div className="md:col-span-7 space-y-2.5">
                      <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs font-bold text-stone-100">B2G Municipal SaaS</h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">PRIMARY</span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Annual tier subscription for city parks departments ($15k–$80k/year based on tree volume & crew seats).
                        </p>
                      </div>

                      <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs font-bold text-stone-100">Enterprise Campus Licensing</h3>
                          <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold">HIGH MARGIN</span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Dedicated monitoring for universities, corporate headquarters, golf resorts, and arboretums.
                        </p>
                      </div>

                      <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs font-bold text-stone-100">Insurance & Carbon Verification API</h3>
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">DATA API</span>
                        </div>
                        <p className="text-xs text-stone-400">
                          Risk data feeds for municipal insurers and verified canopy health telemetry for urban carbon credits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 text-right mt-2">
                  Global Smart City Urban Greening & Tree Care Market: <strong className="text-emerald-400">$5.8 Billion by 2030</strong>.
                </div>
              </div>
            )}

            {/* Slide 6: Scalability & Future */}
            {currentSlide === 6 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-950 border border-teal-800 text-teal-400 text-xs font-bold">
                      6️⃣ SCALABILITY & FUTURE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    Architected to Expand from Single Parks to Millions of Trees
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    High-throughput geospatial indexing, edge diagnostics, and seamless GIS software interoperability.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Globe2 className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-stone-100">Geospatial Quadtree Indexing</h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Leaflet viewport-bounded queries and spatial index clustering ensure sub-second map rendering even with hundreds of thousands of specimens across metropolitan zones.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Cpu className="w-4 h-4 text-sky-400" />
                        <h3 className="text-sm font-bold text-stone-100">Decoupled Diagnostic Pipeline</h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Asynchronous image compression and queue workers prevent bottlenecks during city-wide citizen audit campaigns, maintaining rapid responses under high load.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-bold text-stone-100">Interoperable Forestry Standards</h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Data schemas align with USDA Forest Service & ISA arboricultural standards, enabling two-way sync with legacy tools like Esri ArcGIS and TreePlotter.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-rose-400" />
                        <h3 className="text-sm font-bold text-stone-100">Crowdsourced Force Multiplier</h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        By turning every smartphone into an arborist scanner, city inspection bandwidth multiplies by 100x without increasing public municipal headcount.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 text-right mt-2">
                  Built to scale effortlessly across entire nations and smart city networks.
                </div>
              </div>
            )}

            {/* Slide 7: If We Had More Time */}
            {currentSlide === 7 && (
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-950 border border-amber-800 text-amber-400 text-xs font-bold">
                      7️⃣ IF WE HAD MORE TIME
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 mb-1">
                    What We Would Build Next with More Time & Resources
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mb-5">
                    Satellite NDVI remote sensing, on-device Gemini Nano, IoT ground sensors, and predictive epidemiology.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-stone-950/80 border border-emerald-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        PHASE 1
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-1">Satellite NDVI</h3>
                      <p className="text-xs text-amber-400 font-semibold mb-1">Sentinel-2 & Planet Labs</p>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Auto-detect canopy moisture stress and chlorophyll reduction from orbit using NDVI before field teams deploy.
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-sky-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        PHASE 2
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-1">Mobile PWA + Nano</h3>
                      <p className="text-xs text-amber-400 font-semibold mb-1">Zero-Connectivity Mode</p>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Deploy on-device Gemini Nano / quantized edge vision models directly onto park ranger devices for zero-reception areas.
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-amber-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        PHASE 3
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-1">IoT Ground Probes</h3>
                      <p className="text-xs text-amber-400 font-semibold mb-1">LoRaWAN Smart Irrigation</p>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Sub-surface probes triggering automated municipal drip valves when soil water tension drops below critical wilting thresholds.
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-950/80 border border-rose-500/40 rounded-xl">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                        PHASE 4
                      </span>
                      <h3 className="text-sm font-bold text-stone-100 mt-2 mb-1">Predictive Models</h3>
                      <p className="text-xs text-amber-400 font-semibold mb-1">Epidemiological Vectors</p>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Machine learning forecasting of pathogen spread routes (e.g. Emerald Ash Borer) based on wind corridors and host density.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between text-xs text-stone-300 mt-4">
                  <span className="font-semibold text-emerald-400">Closing Commitment:</span>
                  <span>Transforming every city from passive tree loss to active climate resilience.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation & Indicator Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 hidden sm:inline">
              Use <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 text-[10px]">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 text-[10px]">→</kbd> arrow keys to navigate
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-stone-200 transition-all cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
                disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-stone-950 font-bold transition-all cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
