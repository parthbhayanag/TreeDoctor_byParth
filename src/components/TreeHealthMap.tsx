import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Tree, HealthStatus } from '../types';
import { getStatusColor, getStatusLabel, getTrendInfo } from '../utils/helpers';
import {
  Search,
  Filter,
  AlertTriangle,
  Eye,
  Camera,
  MapPin,
  Layers,
  Crosshair,
  Moon,
  Sun,
  Globe,
  PlusCircle,
  Trash2,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
} from 'lucide-react';

interface TreeHealthMapProps {
  trees: Tree[];
  selectedTree: Tree | null;
  onSelectTree: (tree: Tree) => void;
  onOpenProfile: (tree: Tree) => void;
  onScanTree: (tree: Tree) => void;
  onPinLocation?: (lat: number, lng: number) => void;
  isPinningMode?: boolean;
  onOpenAddTree?: () => void;
  onDeleteTree?: (treeId: string) => void;
}

type MapTheme = 'dark' | 'street' | 'satellite';

export const TreeHealthMap: React.FC<TreeHealthMapProps> = ({
  trees,
  selectedTree,
  onSelectTree,
  onOpenProfile,
  onScanTree,
  onPinLocation,
  isPinningMode = false,
  onOpenAddTree,
  onDeleteTree,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);

  const [statusFilter, setStatusFilter] = useState<HealthStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedCoord, setPinnedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [mapTheme, setMapTheme] = useState<MapTheme>('dark');

  // Filtered trees
  const filteredTrees = trees.filter((tree) => {
    const matchesStatus = statusFilter === 'all' || tree.currentStatus === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tree.treeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Switch or update Tile Layer - 100% Free OpenStreetMap & Esri (Zero API Key required)
  const applyTileLayer = (theme: MapTheme, map: L.Map) => {
    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
      activeTileLayerRef.current = null;
    }

    if (theme === 'satellite') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19,
        }
      );
      satLayer.addTo(map);
      activeTileLayerRef.current = satLayer;
    } else {
      // OpenStreetMap standard (Free, open-source, no API keys)
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      });
      osmLayer.addTo(map);
      activeTileLayerRef.current = osmLayer;
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on urban corridor
    const map = L.map(mapContainerRef.current, {
      center: [12.9734, 77.5925],
      zoom: 15,
      zoomControl: false,
    });

    applyTileLayer(mapTheme, map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Click handler on map
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onPinLocation) {
        setPinnedCoord({ lat: e.latlng.lat, lng: e.latlng.lng });
        onPinLocation(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update theme tile layer when mapTheme changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(mapTheme, mapInstanceRef.current);
    }
  }, [mapTheme]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers for filtered trees
    filteredTrees.forEach((tree) => {
      const colors = getStatusColor(tree.currentStatus);
      const isCritical = tree.currentStatus === 'critical';
      const isSelected = selectedTree?.id === tree.id;

      // Custom HTML Marker icon
      const customIcon = L.divIcon({
        className: 'custom-tree-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            ${
              isCritical
                ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${colors.hex}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              border-radius: 50%;
              background: #1c1917;
              border: 3px solid ${colors.hex};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              transition: transform 0.2s;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            ">
              <span style="font-size: 11px; font-weight: 800; font-family: monospace; color: ${colors.hex};">
                ${tree.currentHealthScore}
              </span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([tree.latitude, tree.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectTree(tree);
      });

      markersRef.current[tree.id] = marker;
    });
  }, [filteredTrees, selectedTree]);

  // Pan to selected tree when selected
  useEffect(() => {
    if (selectedTree && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedTree.latitude, selectedTree.longitude], {
        animate: true,
        duration: 0.6,
      });
    }
  }, [selectedTree]);

  return (
    <div className="relative w-full h-[720px] rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950 flex flex-col">
      {/* Top Map Filter and Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Search input */}
        <div className="flex items-center bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl px-3.5 py-2 shadow-xl w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tree ID, species, zone..."
            className="bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-stone-500 hover:text-stone-300 text-xs ml-1"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl p-1.5 shadow-xl overflow-x-auto">
            {(
              [
                { key: 'all', label: 'All Trees', count: trees.length, dot: 'bg-stone-300' },
                {
                  key: 'critical',
                  label: 'Critical',
                  count: trees.filter((t) => t.currentStatus === 'critical').length,
                  dot: 'bg-rose-500',
                },
                {
                  key: 'at_risk',
                  label: 'At Risk',
                  count: trees.filter((t) => t.currentStatus === 'at_risk').length,
                  dot: 'bg-orange-500',
                },
                {
                  key: 'needs_attention',
                  label: 'Attention',
                  count: trees.filter((t) => t.currentStatus === 'needs_attention').length,
                  dot: 'bg-amber-400',
                },
                {
                  key: 'healthy',
                  label: 'Healthy',
                  count: trees.filter((t) => t.currentStatus === 'healthy').length,
                  dot: 'bg-emerald-400',
                },
              ] as const
            ).map((filter) => {
              const isActive = statusFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-800 text-stone-100 shadow-sm border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${filter.dot}`} />
                  <span>{filter.label}</span>
                  <span className="text-[10px] text-stone-500 font-mono">({filter.count})</span>
                </button>
              );
            })}
          </div>

          {/* Map Layer Theme Switcher */}
          <div className="flex items-center gap-1 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl p-1.5 shadow-xl">
            <button
              onClick={() => setMapTheme('dark')}
              title="Dark Urban (Zero API keys)"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                mapTheme === 'dark'
                  ? 'bg-stone-800 text-emerald-400 font-bold border border-stone-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => setMapTheme('street')}
              title="OpenStreetMap Standard"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                mapTheme === 'street'
                  ? 'bg-stone-800 text-emerald-400 font-bold border border-stone-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Street</span>
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              title="Esri Satellite Imagery"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 ${
                mapTheme === 'satellite'
                  ? 'bg-stone-800 text-emerald-400 font-bold border border-stone-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Satellite</span>
            </button>
          </div>

          {/* Quick Add Tree Button */}
          {onOpenAddTree && (
            <button
              onClick={onOpenAddTree}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Tree</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas Container with dynamic theme filter */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full z-0 map-style-${mapTheme}`}
      />

      {/* Legend badge (bottom-left) */}
      <div className="absolute bottom-4 left-4 z-[500] bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-2xl p-3 shadow-xl pointer-events-auto text-[11px] text-stone-300 hidden md:block">
        <div className="font-semibold text-stone-200 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-emerald-400" />
          Tree Health Scoring Key
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>80 - 100 Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>60 - 79 Attention</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>40 - 59 At Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>&lt; 40 Critical</span>
          </div>
        </div>
      </div>

      {/* Selected Tree Floating Profile Drawer (bottom-right / slide-up) */}
      {selectedTree && (
        <div className="absolute bottom-4 right-4 z-[500] w-full max-w-sm bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-3xl p-5 shadow-2xl pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedTree.primaryImageUrl}
                alt={selectedTree.species}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-stone-200">
                    {selectedTree.treeCode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      getStatusColor(selectedTree.currentStatus).badgeBg
                    }`}
                  >
                    {getStatusLabel(selectedTree.currentStatus)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-100 mt-0.5 line-clamp-1">
                  {selectedTree.commonName}
                </h4>
                <p className="text-xs text-stone-400 italic line-clamp-1">{selectedTree.species}</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTree(null as any)}
              className="text-stone-400 hover:text-stone-200 text-xs p-1"
            >
              ✕
            </button>
          </div>

          {/* Quick delta notice */}
          {selectedTree.activeAlert && (
            <div className="mt-3 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="line-clamp-2">
                <strong>🚨 Early Warning:</strong> Dropped from{' '}
                {selectedTree.activeAlert.previousScore} to {selectedTree.activeAlert.currentScore} (
                -{selectedTree.activeAlert.scoreDrop} pts) in 14 days.
              </span>
            </div>
          )}

          {/* Metrics summary */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Health</span>
              <span className="font-mono font-bold text-sm text-stone-200">
                {selectedTree.currentHealthScore}/100
              </span>
            </div>
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Trend</span>
              <span className={`font-mono font-bold text-sm ${getTrendInfo(selectedTree.trend).color}`}>
                {getTrendInfo(selectedTree.trend).iconText} {getTrendInfo(selectedTree.trend).label}
              </span>
            </div>
            <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Scans</span>
              <span className="font-mono font-bold text-sm text-stone-200">
                {selectedTree.scanCount} records
              </span>
            </div>
          </div>

          {/* Quick environmental telemetry summary if available */}
          {selectedTree.scans[selectedTree.scans.length - 1]?.environmentalContext && (
            <div className="mt-2.5 p-2 bg-stone-950/70 border border-stone-800/80 rounded-xl flex items-center justify-between text-[11px] text-stone-300 font-mono">
              <div className="flex items-center gap-1" title="Actual local temperature">
                <Thermometer className="w-3 h-3 text-orange-400" />
                <span>{selectedTree.scans[selectedTree.scans.length - 1].environmentalContext?.temperatureC}°C</span>
              </div>
              <div className="flex items-center gap-1" title="Actual precipitation / rainfall">
                <CloudRain className="w-3 h-3 text-sky-400" />
                <span>{selectedTree.scans[selectedTree.scans.length - 1].environmentalContext?.rainfallMm ?? 0}mm</span>
              </div>
              <div className="flex items-center gap-1" title="Relative humidity">
                <Droplets className="w-3 h-3 text-teal-400" />
                <span>{selectedTree.scans[selectedTree.scans.length - 1].environmentalContext?.humidityPct}%</span>
              </div>
              <div className="flex items-center gap-1" title="Air Quality Index">
                <Wind className="w-3 h-3 text-purple-400" />
                <span>AQI {selectedTree.scans[selectedTree.scans.length - 1].environmentalContext?.aqi}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => onOpenProfile(selectedTree)}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Eye className="w-3.5 h-3.5" />
              View Full Profile
            </button>
            <button
              onClick={() => onScanTree(selectedTree)}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              Scan
            </button>
            {onDeleteTree && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove "${selectedTree.commonName}" from the map?`)) {
                    onDeleteTree(selectedTree.id);
                  }
                }}
                title="Remove tree"
                className="p-2.5 bg-stone-800 hover:bg-rose-950/60 hover:text-rose-400 text-stone-400 rounded-xl text-xs border border-stone-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
