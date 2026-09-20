import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  Camera,
  Truck,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface HackathonWalkthroughProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onClose: () => void;
}

export const HackathonWalkthrough: React.FC<HackathonWalkthroughProps> = ({
  currentStep,
  onSetStep,
  onClose,
}) => {
  const [showPitchNotes, setShowPitchNotes] = useState(true);

  const steps = [
    {
      number: 1,
      title: 'Problem & Mission',
      tabKey: 'landing',
      pitch:
        '"Google Maps tells us where trees are. TreeDoctor tells us which ones need our help. We give every urban tree a continuous longitudinal health record so cities catch decline before it’s too late."',
      actionText: 'Go to Overview',
    },
    {
      number: 2,
      title: 'Canopy Health Map',
      tabKey: 'map',
      pitch:
        '"Here is our live urban tree map. Notice the color coding: green for thriving trees, yellow for moderate stress, and pulsing red pins indicating active early-warning alerts."',
      actionText: 'View Tree Map',
    },
    {
      number: 3,
      title: 'Inspect Deteriorating Tree',
      tabKey: 'inspect-tree',
      pitch:
        '"Notice the Heritage Rain Tree (TREE-DEMO-001). In May its health was 91. In August it was 84. Today it dropped to 61—a 23-point plunge during a 36°C heatwave! Our system triggered an automatic Early Warning."',
      actionText: 'Inspect Early Warning',
    },
    {
      number: 4,
      title: 'AI Vision Diagnostic',
      tabKey: 'scan',
      pitch:
        '"Anyone can scan a tree with their phone. Our server-side AI analyzes leaf necrosis, canopy porosity, and bark conks—providing honest calibrated observations instead of fake certainties."',
      actionText: 'Run AI Scanner',
    },
    {
      number: 5,
      title: 'Municipal Action Queue',
      tabKey: 'dashboard',
      pitch:
        '"Detections don\'t get lost in an app: they flow directly into the Municipal Action Queue as prioritized work orders, allowing city foresters to dispatch aeration and watering squads immediately."',
      actionText: 'Open Action Queue',
    },
  ];

  const currentStepData = steps[currentStep - 1] || steps[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-11/12 max-w-4xl bg-stone-900/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl p-4 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            3-Minute Hackathon Demo Tour
          </span>
          <span className="text-xs font-mono text-stone-400">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPitchNotes(!showPitchNotes)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showPitchNotes ? 'Hide Pitch Script' : 'Show Pitch Script'}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-5 gap-1.5 pt-2.5 mb-3">
        {steps.map((s) => {
          const isDone = s.number < currentStep;
          const isCurrent = s.number === currentStep;

          return (
            <button
              key={s.number}
              onClick={() => onSetStep(s.number)}
              className={`py-1.5 px-2 rounded-xl text-left transition-all border ${
                isCurrent
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                  : isDone
                  ? 'bg-stone-800/80 border-stone-700 text-stone-300'
                  : 'bg-stone-950/40 border-stone-800 text-stone-500 hover:text-stone-400'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px]">
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <span className="font-mono">{s.number}.</span>
                )}
                <span className="truncate">{s.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pitch Notes & Nav Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {showPitchNotes ? (
          <div className="p-2.5 bg-stone-950/70 border border-stone-800/80 rounded-xl text-xs text-stone-300 italic flex-1 leading-relaxed">
            <strong className="text-amber-400 not-italic uppercase tracking-wide mr-1 text-[10px]">
              Presenter Talking Point:
            </strong>
            {currentStepData.pitch}
          </div>
        ) : (
          <div className="text-xs text-stone-300 font-semibold flex-1">
            {currentStepData.title}
          </div>
        )}

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => onSetStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="p-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300 rounded-xl text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={() => onSetStep(currentStep + 1)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Next: {steps[currentStep].title}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
