import React, { useState, useRef, useEffect } from 'react';
import { Tree, AIAnalysisResult, EnvironmentalData } from '../types';
import { SAMPLE_PRESET_IMAGES, SamplePresetImage } from '../data/sampleScans';
import { ScoreGauge } from './ScoreGauge';
import { getStatusColor, getStatusLabel, getUrgencyBadge } from '../utils/helpers';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight,
  Eye,
  Crosshair,
} from 'lucide-react';

interface TreeScannerViewProps {
  trees: Tree[];
  targetTree?: Tree | null;
  onScanSaved: (treeId: string, updatedTree: Tree) => void;
  onNavigateToTree: (tree: Tree) => void;
  onCancel?: () => void;
}

export const TreeScannerView: React.FC<TreeScannerViewProps> = ({
  trees,
  targetTree: initialTargetTree,
  onScanSaved,
  onNavigateToTree,
  onCancel,
}) => {
  const [selectedTargetTreeId, setSelectedTargetTreeId] = useState<string>(
    initialTargetTree?.id || 'tree-003'
  );
  const [isNewTreeMode, setIsNewTreeMode] = useState<boolean>(false);
  const [newTreeSpecies, setNewTreeSpecies] = useState('Albizia saman (Rain Tree)');
  const [newTreeCommonName, setNewTreeCommonName] = useState('Avenue Shade Tree');
  const [newTreeZone, setNewTreeZone] = useState('Urban Central Corridor');

  const [previewImage, setPreviewImage] = useState<string>(SAMPLE_PRESET_IMAGES[0].thumbnail);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_PRESET_IMAGES[0].id);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const deviceCameraInputRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [engineMeta, setEngineMeta] = useState<{ engine: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [savedTree, setSavedTree] = useState<Tree | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (requestedFacing?: 'environment' | 'user') => {
    setCameraError(null);
    const targetFacing = requestedFacing || facingMode;
    stopCamera();

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetFacing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (firstErr) {
        console.warn('Initial facingMode camera request failed, falling back to basic video stream:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);

      // If video ref is already available, attach stream immediately
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Play error:', e));
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setIsCameraActive(false);
      setCameraError(
        'Live webcam is blocked or unavailable in this browser environment. Tap "Snap Photo (Device Camera)" below to open your camera directly!'
      );
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewImage(dataUrl);
      setSelectedPresetId('');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
        setSelectedPresetId('');
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: SamplePresetImage) => {
    setPreviewImage(preset.thumbnail);
    setSelectedPresetId(preset.id);
    if (preset.targetTreeCode) {
      const match = trees.find((t) => t.treeCode === preset.targetTreeCode);
      if (match) {
        setSelectedTargetTreeId(match.id);
        setIsNewTreeMode(false);
      }
    }
    stopCamera();
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSaveSuccess(false);

    // Progressive arborist telemetry animation steps
    const steps = [
      'Extracting foliar color histogram and chlorosis indexing...',
      'Computing canopy porosity & crown density coefficient...',
      'Assessing visible bark integrity, vascular fissures & conks...',
      'Cross-referencing longitudinal arborist diagnostic matrix...',
      'Synthesizing calibrated health score & intervention protocol...',
    ];

    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      }
    }, 450);

    try {
      const targetTreeObj = trees.find((t) => t.id === selectedTargetTreeId);
      const response = await fetch('/api/analyze-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewImage.startsWith('data:') ? previewImage : undefined,
          imageUrl: previewImage,
          sampleId: selectedPresetId,
          speciesHint: targetTreeObj ? targetTreeObj.species : newTreeSpecies,
          treeCode: targetTreeObj ? targetTreeObj.treeCode : undefined,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      setAnalysisResult({
        healthScore: data.healthScore,
        status: data.status,
        confidence: data.confidence,
        breakdown: data.breakdown,
        symptoms: data.symptoms,
        possibleCauses: data.possibleCauses,
        recommendations: data.recommendations,
        urgency: data.urgency,
        observationSummary: data.observationSummary,
        monitoringIntervalDays: data.monitoringIntervalDays,
      });

      setEngineMeta({
        engine: data.analysisEngine || 'calibrated-inference',
        label: data.engineLabel || 'TreeDoctor Vision System',
      });
    } catch (err) {
      console.error('Analysis failed:', err);
      clearInterval(interval);
      alert('Analysis encountered an error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveScan = async () => {
    if (!analysisResult) return;
    setIsSaving(true);

    try {
      if (isNewTreeMode) {
        // Create new tree
        const res = await fetch('/api/trees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            species: newTreeSpecies,
            commonName: newTreeCommonName,
            zone: newTreeZone,
            primaryImageUrl: previewImage,
            initialScan: {
              id: `scan-${Date.now()}`,
              scanDate: new Date().toISOString().split('T')[0],
              imageUrl: previewImage,
              healthScore: analysisResult.healthScore,
              status: analysisResult.status,
              confidence: analysisResult.confidence,
              breakdown: analysisResult.breakdown,
              symptoms: analysisResult.symptoms,
              possibleCauses: analysisResult.possibleCauses,
              recommendations: analysisResult.recommendations,
              urgency: analysisResult.urgency,
              scoreChange: 0,
            },
          }),
        });
        const json = await res.json();
        setSavedTree(json.tree);
        setSaveSuccess(true);
        onScanSaved(json.tree.id, json.tree);
      } else {
        // Add scan to existing tree (Server automatically attaches real Open-Meteo telemetry for this tree's GPS location)
        const res = await fetch(`/api/trees/${selectedTargetTreeId}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scanResult: analysisResult,
            imageUrl: previewImage,
          }),
        });
        const json = await res.json();
        setSavedTree(json.tree);
        setSaveSuccess(true);
        onScanSaved(selectedTargetTreeId, json.tree);
      }
    } catch (err) {
      console.error('Failed to save scan:', err);
      alert('Could not save scan to history.');
    } finally {
      setIsSaving(false);
    }
  };

  const targetTreeObj = trees.find((t) => t.id === selectedTargetTreeId);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-6 rounded-3xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI Vision & Biometrics
            </span>
            <span className="text-xs font-mono text-stone-400">Urban Canopy Scanner</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mt-1">
            Urban Tree Health Diagnostic Studio
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Capture or upload foliage and trunk photos to analyze visible stress indicators, compute health scores, and record longitudinal data.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="self-start md:self-center px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl border border-stone-700 transition-colors"
          >
            Back to Map
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Source & Camera */}
        <div className="lg:col-span-6 space-y-4">
          {/* Target Tree Binding Selector */}
          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Target Tree Record
              </span>
              <button
                onClick={() => setIsNewTreeMode(!isNewTreeMode)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
              >
                {isNewTreeMode ? '← Select Existing Tree' : '+ Register as New Tree'}
              </button>
            </div>

            {isNewTreeMode ? (
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[10px] uppercase text-stone-400 block font-semibold mb-1">
                    Tree Species / Genus
                  </label>
                  <input
                    type="text"
                    value={newTreeSpecies}
                    onChange={(e) => setNewTreeSpecies(e.target.value)}
                    placeholder="e.g. Albizia saman (Rain Tree)"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase text-stone-400 block font-semibold mb-1">
                      Specimen Title
                    </label>
                    <input
                      type="text"
                      value={newTreeCommonName}
                      onChange={(e) => setNewTreeCommonName(e.target.value)}
                      placeholder="e.g. Park West Shade Tree"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-stone-400 block font-semibold mb-1">
                      Urban Zone / Street
                    </label>
                    <input
                      type="text"
                      value={newTreeZone}
                      onChange={(e) => setNewTreeZone(e.target.value)}
                      placeholder="e.g. Sector 4 Corridor"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <select
                  value={selectedTargetTreeId}
                  onChange={(e) => setSelectedTargetTreeId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {trees.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.treeCode} — {t.commonName} ({t.species}) [Current Score: {t.currentHealthScore}]
                    </option>
                  ))}
                </select>
                {targetTreeObj && (
                  <p className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>
                      Logging scan will add to <strong>{targetTreeObj.scanCount} historical records</strong> and recalculate delta score.
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Image Display & Live Camera View */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 aspect-[4/3] shadow-2xl flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-full bg-black">
                <video
                  ref={(node) => {
                    videoRef.current = node;
                    if (node && streamRef.current && node.srcObject !== streamRef.current) {
                      node.srcObject = streamRef.current;
                      node.play().catch((err) => console.warn('Video autoPlay prevented:', err));
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Camera reticle overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-dashed border-emerald-400/70 rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  <div className="absolute text-[11px] font-mono text-emerald-300 bg-stone-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Align Tree Trunk & Foliage
                  </div>
                </div>

                {/* Flip camera top corner */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    title="Switch Camera (Front / Back)"
                    className="p-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700/80 backdrop-blur-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Flip</span>
                  </button>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                  <button
                    onClick={captureCameraFrame}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xl cursor-pointer"
                  >
                    <Crosshair className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-stone-900/90 text-stone-300 rounded-2xl text-xs border border-stone-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={previewImage}
                  alt="Tree specimen"
                  className="w-full h-full object-cover"
                />
                {/* Scanning overlay effect during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-300 animate-pulse" />
                    </div>
                    <span className="text-sm font-bold text-stone-100 uppercase tracking-wider">
                      Analyzing Tree Biometrics
                    </span>
                    <p className="text-xs font-mono text-emerald-300 mt-2 max-w-sm">
                      {analysisStep}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Camera Error Alert if blocked */}
          {cameraError && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-100">Live Camera Notice</p>
                <p className="text-stone-300 mt-0.5">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Photo Source Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => (isCameraActive ? stopCamera() : startCamera())}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCameraActive
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              {isCameraActive ? 'Close Camera' : 'Live Camera'}
            </button>

            <button
              onClick={() => deviceCameraInputRef.current?.click()}
              className="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Snap with Device Camera
            </button>
            <input
              ref={deviceCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-stone-400" />
              Upload Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Preset Sample Scenario */}
          <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Preset Test Scenario (1-Click Test)
              </span>
              <span className="text-[10px] text-stone-500">1 preset ready</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_PRESET_IMAGES.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-700 shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-stone-200">
                          {preset.name}
                        </h5>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {preset.expectedScoreRange}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Run Analysis Trigger Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Biometric Indicators...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Tree Health with AI Vision
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="lg:col-span-6 space-y-4">
          {analysisResult ? (
            <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 space-y-5 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Header Result Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-400">
                      Scan Evaluation Result
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        getStatusColor(analysisResult.status).badgeBg
                      }`}
                    >
                      {getStatusLabel(analysisResult.status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-100 mt-1">
                    Tree Health Score: {analysisResult.healthScore}/100
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-stone-500 block">
                    Confidence
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-200">
                    {Math.round(analysisResult.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Score Gauge Component */}
              <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800/80">
                <ScoreGauge
                  score={analysisResult.healthScore}
                  status={analysisResult.status}
                  breakdown={analysisResult.breakdown}
                  size="md"
                  showBreakdown={true}
                />
              </div>

              {/* Observation Summary */}
              <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-xl text-xs text-stone-300 leading-relaxed">
                <strong className="text-stone-200 font-semibold block mb-1">
                  Arborist Observation Summary:
                </strong>
                {analysisResult.observationSummary}
              </div>

              {/* Symptoms & Possible Causes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
                  <h5 className="font-bold text-stone-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Observed Symptoms
                  </h5>
                  <ul className="space-y-1 text-stone-300">
                    {analysisResult.symptoms.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
                  <h5 className="font-bold text-stone-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Possible Contributing Factors
                  </h5>
                  <ul className="space-y-1 text-stone-300">
                    {analysisResult.possibleCauses.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-orange-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Recommended Protocol
                  </h5>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      getUrgencyBadge(analysisResult.urgency).bg
                    }`}
                  >
                    {getUrgencyBadge(analysisResult.urgency).text}
                  </span>
                </div>
                <ul className="space-y-1 text-stone-200">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Honest AI Disclaimer & Transparency */}
              <div className="p-3 bg-stone-950/40 border border-stone-800/80 rounded-xl text-[11px] text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-300">
                  <Info className="w-3.5 h-3.5 text-stone-500" />
                  <span>Honest Diagnostic Transparency & Engine Meta</span>
                </div>
                <p>
                  Engine: <strong className="text-stone-300">{engineMeta?.label}</strong>. Uses
                  scientific observation terminology ("observed", "possible contributing factors")
                  and does not replace a physical certified arborist climbing inspection.
                </p>
              </div>

              {/* Commit Scan Action */}
              {saveSuccess ? (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Scan recorded to longitudinal tree health record!</span>
                  </div>
                  {savedTree && (
                    <button
                      onClick={() => onNavigateToTree(savedTree)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Updated Tree Profile
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSaveScan}
                  disabled={isSaving}
                  className="w-full py-3.5 bg-stone-100 hover:bg-white text-stone-950 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating Tree Health Records & Early Warning Check...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Commit Scan & Update Longitudinal Record
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-stone-900/40 rounded-3xl border border-stone-800/80 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-8 h-8 opacity-70" />
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-bold text-stone-200">
                  Ready to Run Arborist AI Analysis
                </h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Select a preset test case, upload an urban tree photo, or use your camera. Click{' '}
                  <strong className="text-emerald-400">"Analyze Tree Health with AI Vision"</strong> to evaluate visible stress symptoms, compute the biometric score, and check for early warnings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
