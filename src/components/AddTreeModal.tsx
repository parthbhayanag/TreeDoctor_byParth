import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { Tree, AIAnalysisResult, EnvironmentalData } from '../types';
import { getStatusColor, getStatusLabel } from '../utils/helpers';
import { fetchLocationEnvironmentalTelemetry } from '../utils/environmental';
import {
  PlusCircle,
  X,
  MapPin,
  Sparkles,
  Camera,
  Upload,
  RefreshCw,
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  ShieldCheck,
  Zap,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Radio,
} from 'lucide-react';

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTreeAdded: (newTree: Tree) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

const TREE_SPECIES_OPTIONS = [
  { common: 'Rain Tree', species: 'Albizia saman (Rain Tree)' },
  { common: 'Banyan Tree', species: 'Ficus benghalensis (Banyan)' },
  { common: 'Gulmohar (Flamboyant)', species: 'Delonix regia (Gulmohar)' },
  { common: 'Neem Tree', species: 'Azadirachta indica (Neem)' },
  { common: 'Jacaranda', species: 'Jacaranda mimosifolia' },
  { common: 'Silver Oak', species: 'Grevillea robusta' },
  { common: 'Sacred Fig (Peepal)', species: 'Ficus religiosa (Peepal)' },
  { common: 'Mahogany', species: 'Swietenia mahagoni' },
  { common: 'Custom Urban Tree', species: 'Urban Canopy Specimen' },
];

export const AddTreeModal: React.FC<AddTreeModalProps> = ({
  isOpen,
  onClose,
  onTreeAdded,
  initialCoords,
}) => {
  // Tree metadata state
  const [commonName, setCommonName] = useState('My Monitored Tree');
  const [species, setSpecies] = useState(TREE_SPECIES_OPTIONS[0].species);

  // Map Pin Coordinates state (Default to city center or provided initial coords)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialCoords?.lat ?? 12.9734,
    lng: initialCoords?.lng ?? 77.5925,
  });
  const [isLocating, setIsLocating] = useState(false);

  // Live environmental telemetry for the pinned location
  const [pinnedEnvData, setPinnedEnvData] = useState<EnvironmentalData | null>(null);
  const [isLoadingEnv, setIsLoadingEnv] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchEnv = async () => {
      setIsLoadingEnv(true);
      try {
        const data = await fetchLocationEnvironmentalTelemetry(coords.lat, coords.lng);
        if (isMounted && data) {
          setPinnedEnvData(data);
        }
      } catch (e) {
        console.warn('Failed to fetch telemetry for pin:', e);
      } finally {
        if (isMounted) setIsLoadingEnv(false);
      }
    };

    // Debounce telemetry call so fast dragging doesn't spam APIs
    const timer = setTimeout(fetchEnv, 400);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [coords.lat, coords.lng]);

  // Photo & Camera state (No presets allowed!)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AI Health Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [engineLabel, setEngineLabel] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const deviceCameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Initialize and handle Leaflet map for interactive pin placement
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    // Short timeout to allow modal container to render with real dimensions
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 15,
        zoomControl: false,
      });

      // Free OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom high-visibility Tree Pin
      const pinIcon = L.divIcon({
        className: 'custom-tree-pin-marker',
        html: `
          <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="background: #10b981; color: #022c22; font-weight: bold; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.6); font-size: 17px;">
              🌲
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #10b981; margin-top: -1px;"></div>
          </div>
        `,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
      });

      const marker = L.marker([coords.lat, coords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCoords({ lat: Number(pos.lat.toFixed(5)), lng: Number(pos.lng.toFixed(5)) });
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = Number(e.latlng.lat.toFixed(5));
        const newLng = Number(e.latlng.lng.toFixed(5));
        setCoords({ lat: newLat, lng: newLng });
        marker.setLatLng([newLat, newLng]);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Sync coords changes to marker if changed externally (e.g. GPS locate)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(5));
        const newLng = Number(pos.coords.longitude.toFixed(5));
        setCoords({ lat: newLat, lng: newLng });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16, { animate: true });
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not retrieve GPS location. Please click directly on the map to place the pin.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Start live webcam stream
  const startCamera = async (facing?: 'environment' | 'user') => {
    setCameraError(null);
    const targetFacing = facing || facingMode;
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

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Play error:', e));
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setIsCameraActive(false);
      setCameraError(
        'Webcam access blocked or unavailable in this environment. Use "Snap Photo (Device Camera)" below to launch your camera directly!'
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

  // Capture freeze frame from live camera
  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCamera();
      setPhotoUrl(dataUrl);
      // Immediately run AI analysis on the clicked photo
      runAIAnalysis(dataUrl);
    }
  };

  // Handle direct device camera snapshot or file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        stopCamera();
        setPhotoUrl(dataUrl);
        // Automatically run AI analysis on the uploaded/snapped photo
        runAIAnalysis(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Health Analysis Engine Call
  const runAIAnalysis = async (imageSrc: string) => {
    setIsAnalyzing(true);
    setAiResult(null);

    const steps = [
      'Extracting foliar color histogram & chlorophyll index...',
      'Assessing canopy density and crown openness ratio...',
      'Evaluating bark integrity and structural stress indicators...',
      'Computing calibrated arborist health score & diagnosis...',
    ];

    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      }
    }, 450);

    try {
      const response = await fetch('/api/analyze-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc.startsWith('data:') ? imageSrc : undefined,
          imageUrl: imageSrc,
          speciesHint: species,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();

      setAiResult({
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

      setEngineLabel(data.engineLabel || 'TreeDoctor Vision System');
    } catch (err) {
      console.error('AI analysis error:', err);
      clearInterval(stepInterval);
      alert('AI analysis encountered an issue. You can retake the photo to try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Registration Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      alert('Please click or snap a photo of your tree first so AI can analyze it.');
      return;
    }

    if (!aiResult) {
      alert('Please wait for the AI to complete its health analysis of your tree photo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const derivedAddress = `Pinned Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
      const derivedZone = `Urban Canopy Zone (${coords.lat > 12.97 ? 'North' : 'South'} Sector)`;

      const res = await fetch('/api/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commonName: commonName.trim() || 'Monitored Urban Tree',
          species: species,
          address: derivedAddress,
          zone: derivedZone,
          latitude: coords.lat,
          longitude: coords.lng,
          healthScore: aiResult.healthScore,
          status: aiResult.status,
          primaryImageUrl: photoUrl,
          initialScan: {
            id: `scan-${Date.now()}`,
            scanDate: new Date().toISOString().split('T')[0],
            imageUrl: photoUrl,
            healthScore: aiResult.healthScore,
            status: aiResult.status,
            confidence: aiResult.confidence,
            breakdown: aiResult.breakdown,
            symptoms: aiResult.symptoms,
            possibleCauses: aiResult.possibleCauses,
            recommendations: aiResult.recommendations,
            urgency: aiResult.urgency,
            scoreChange: 0,
            environmentalContext: pinnedEnvData || undefined,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to register tree');
      const data = await res.json();
      onTreeAdded(data.tree);
      onClose();
    } catch (err) {
      console.error('Error adding tree:', err);
      alert('Could not save tree. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">Add Monitored Tree</h3>
              <p className="text-xs text-stone-400">
                Snap your tree photo, let AI decide its health, and drop a pin on the map
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-stone-400 hover:text-stone-200 p-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Tree Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300 block">
                Tree Name / Label <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                placeholder="e.g. Backyard Neem Tree, Street Peepal"
                className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none text-xs transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300 block">Tree Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none text-xs transition-colors"
              >
                {TREE_SPECIES_OPTIONS.map((opt) => (
                  <option key={opt.species} value={opt.species}>
                    {opt.common}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Interactive Map Pin Picker (No address typing!) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Drop Tree Pin on Map</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  (Click or drag to position)
                </span>
              </label>
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Navigation className={`w-3 h-3 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Locating...' : 'Use My GPS'}
              </button>
            </div>

            {/* Interactive Leaflet Map Container */}
            <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Coordinates Pill Overlay */}
              <div className="absolute bottom-2.5 left-2.5 z-[400] bg-stone-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700/80 text-[10px] font-mono text-stone-300 flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>
                  {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
                </span>
              </div>
            </div>

            {/* Real-time Environmental Telemetry at Pinned Location */}
            <div className="p-3 bg-stone-950/70 border border-stone-800/90 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
                  <Radio className={`w-3.5 h-3.5 ${isLoadingEnv ? 'animate-spin text-amber-400' : 'text-emerald-400 animate-pulse'}`} />
                  <span>Real-Time Environmental Readings at Pinned Location</span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  {isLoadingEnv ? 'Querying Station Grid...' : 'Live Sensor Feed'}
                </span>
              </div>

              {pinnedEnvData ? (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-stone-900/90 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-center gap-0.5 text-[10px] text-stone-400 font-medium">
                      <Thermometer className="w-3 h-3 text-orange-400" />
                      <span>Temp</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-stone-200 block mt-0.5">
                      {pinnedEnvData.temperatureC}°C
                    </span>
                  </div>

                  <div className="p-2 bg-stone-900/90 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-center gap-0.5 text-[10px] text-stone-400 font-medium">
                      <CloudRain className="w-3 h-3 text-sky-400" />
                      <span>Rainfall</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-stone-200 block mt-0.5">
                      {pinnedEnvData.rainfallMm !== undefined ? `${pinnedEnvData.rainfallMm} mm` : '0.0 mm'}
                    </span>
                  </div>

                  <div className="p-2 bg-stone-900/90 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-center gap-0.5 text-[10px] text-stone-400 font-medium">
                      <Droplets className="w-3 h-3 text-teal-400" />
                      <span>Humidity</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-stone-200 block mt-0.5">
                      {pinnedEnvData.humidityPct}%
                    </span>
                  </div>

                  <div className="p-2 bg-stone-900/90 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-center gap-0.5 text-[10px] text-stone-400 font-medium">
                      <Wind className="w-3 h-3 text-purple-400" />
                      <span>AQI</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-stone-200 block mt-0.5">
                      {pinnedEnvData.aqi}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                  <span>Connecting to high-resolution local weather & air quality telemetry...</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-400">
              No need to type an address. Simply tap anywhere on the map or drag the 🌲 pin to the tree's physical location.
            </p>
          </div>

          {/* Section 3: Click Your Tree Photo (No Stock Photos!) */}
          <div className="space-y-2.5 pt-1 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Tree Photo (Required for AI Health Analysis)</span>
              </label>
              {photoUrl && !isCameraActive && (
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Photo Captured
                </span>
              )}
            </div>

            {/* Camera Viewfinder / Photo Display Area */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-[16/10] sm:aspect-[16/9] shadow-xl flex items-center justify-center">
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

                  {/* Shutter reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-52 h-52 sm:w-64 sm:h-64 border-2 border-dashed border-emerald-400/80 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.35)]" />
                    <div className="absolute text-[10px] font-mono text-emerald-300 bg-stone-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Center Foliage & Trunk
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

                  {/* Camera action buttons */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2.5 px-4">
                    <button
                      type="button"
                      onClick={captureCameraFrame}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xl cursor-pointer"
                    >
                      <Crosshair className="w-4 h-4" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3.5 py-2 bg-stone-900/90 text-stone-300 rounded-xl text-xs border border-stone-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : photoUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={photoUrl}
                    alt="Captured tree photo"
                    className="w-full h-full object-cover"
                  />

                  {/* Retake button overlay */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl(null);
                        setAiResult(null);
                      }}
                      className="px-2.5 py-1 bg-stone-950/80 hover:bg-stone-900 text-stone-300 rounded-lg border border-stone-700/80 text-[11px] backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      Retake Photo
                    </button>
                  </div>

                  {/* Scanning Animation Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-emerald-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-in fade-in">
                      <div className="relative w-14 h-14 mb-3">
                        <div className="absolute inset-0 border-3 border-emerald-500/20 rounded-full" />
                        <div className="absolute inset-0 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-300 animate-pulse" />
                      </div>
                      <span className="text-xs font-bold text-stone-100 uppercase tracking-wider">
                        AI Arborist Analyzing Tree
                      </span>
                      <p className="text-[11px] font-mono text-emerald-300 mt-1 max-w-xs">
                        {analysisStep}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-emerald-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-stone-200 font-semibold">Click a Photo of Your Tree</p>
                    <p className="text-stone-400 text-[11px] mt-0.5 max-w-sm mx-auto">
                      Use the live camera or your phone's camera. Our AI vision system will inspect the canopy, foliage, and bark to determine its exact health score.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Error Message */}
            {cameraError && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-100">Camera Notice</p>
                  <p className="text-stone-300 mt-0.5">{cameraError}</p>
                </div>
              </div>
            )}

            {/* Photo Capture Buttons (No presets!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => (isCameraActive ? stopCamera() : startCamera())}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCameraActive
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                }`}
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                {isCameraActive ? 'Cancel Camera' : 'Open Live Camera'}
              </button>

              <button
                type="button"
                onClick={() => deviceCameraInputRef.current?.click()}
                className="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                Snap Photo (Device Camera)
              </button>
              <input
                ref={deviceCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-stone-400 hover:text-stone-300 underline cursor-pointer"
              >
                or upload an existing photo from file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          {/* Section 4: AI Health Decision (No Manual Slider!) */}
          <div className="space-y-2 pt-1 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Health Decision</span>
              </label>
              {aiResult && (
                <span className="text-[10px] text-stone-400 font-mono">
                  Engine: {engineLabel || 'Gemini 3.8 Flash Vision'}
                </span>
              )}
            </div>

            {aiResult ? (
              <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-3 animate-in fade-in">
                {/* Score & Status Highlight */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                      AI Calculated Health Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold font-mono text-emerald-400">
                        {aiResult.healthScore}
                      </span>
                      <span className="text-xs font-mono text-stone-500">/ 100</span>
                      <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                          aiResult.status
                        )}`}
                      >
                        {getStatusLabel(aiResult.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">AI Confidence</span>
                    <span className="text-xs font-mono font-bold text-stone-200">
                      {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* AI Summary Observation */}
                {aiResult.observationSummary && (
                  <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
                    "{aiResult.observationSummary}"
                  </p>
                )}

                {/* Symptoms tags */}
                {aiResult.symptoms && aiResult.symptoms.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      Detected Physiological Signs:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {aiResult.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-stone-900 text-stone-300 rounded-md text-[10px] border border-stone-800"
                        >
                          • {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : isAnalyzing ? (
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center gap-3 text-stone-300">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
                <div>
                  <p className="font-semibold text-stone-200">Evaluating tree health biometrics...</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">{analysisStep}</p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-stone-950/40 border border-dashed border-stone-800 text-center">
                <p className="text-stone-400 text-[11px]">
                  {photoUrl
                    ? 'Photo captured. Ready to analyze.'
                    : 'Click a photo of your tree above. The AI will inspect the photo to automatically calculate and decide the health score.'}
                </p>
                {photoUrl && !aiResult && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={() => runAIAnalysis(photoUrl)}
                    className="mt-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Analyze Photo Now
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-800 shrink-0">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !photoUrl || !aiResult}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {isSubmitting ? (
                'Registering Specimen...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Save & Register Tree
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
