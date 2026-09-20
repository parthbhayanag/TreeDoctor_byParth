export type HealthStatus = 'healthy' | 'needs_attention' | 'at_risk' | 'critical';

export type HealthTrend = 'improving' | 'stable' | 'declining' | 'rapidly_deteriorating';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface ScoreBreakdown {
  leafCondition: number; // 0 - 100
  canopyDensity: number; // 0 - 100
  visibleDamage: number; // 0 - 100
  colorAbnormalities: number; // 0 - 100 (100 = healthy normal colors, 0 = severe chlorosis/necrosis)
  overallVitality: number; // 0 - 100
}

export interface EnvironmentalData {
  temperatureC: number;
  humidityPct: number;
  rainfallDeficitMm: number; // rainfall or deficit indicator
  rainfallMm?: number; // actual precipitation/rainfall in mm
  aqi: number;
  aqiCategory?: string; // e.g. "Good", "Moderate", "Unhealthy for Sensitive Groups"
  pm2_5?: number;
  pm10?: number;
  weatherDescription?: string; // e.g. "Scattered Clouds", "Clear Sky"
  soilDrynessIndex: 'Moist' | 'Moderate' | 'Severe Dry' | 'Extreme Drought';
  summaryCorrelation: string;
  stationSource?: string; // e.g. "Open-Meteo High-Res Telemetry & Air Quality Grid"
  lastUpdated?: string;
}

export interface TreeScan {
  id: string;
  treeId: string;
  scanDate: string; // ISO string
  imageUrl: string;
  healthScore: number; // 0 - 100
  status: HealthStatus;
  confidence: number; // e.g. 0.85
  breakdown: ScoreBreakdown;
  symptoms: string[];
  possibleCauses: string[];
  recommendations: string[];
  urgency: UrgencyLevel;
  deltaNotes?: string;
  scoreChange?: number; // e.g. -19
  environmentalContext?: EnvironmentalData;
}

export interface Tree {
  id: string;
  treeCode: string; // e.g. "TREE-IND-000124"
  species: string;
  commonName: string;
  latitude: number;
  longitude: number;
  address: string;
  zone: string; // e.g. "Sector 4 - Central Park", "North Campus Avenue"
  estimatedAgeYears?: number;
  firstScanDate: string;
  latestScanDate: string;
  scanCount: number;
  currentHealthScore: number;
  currentStatus: HealthStatus;
  trend: HealthTrend;
  primaryImageUrl: string;
  scans: TreeScan[];
  activeAlert?: TreeAlert;
}

export interface TreeAlert {
  id: string;
  treeId: string;
  treeCode: string;
  severity: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  previousScore: number;
  currentScore: number;
  scoreDrop: number;
  detectedDaysAgo: number;
  recommendedAction: string;
  createdAt: string;
  resolved: boolean;
}

export interface MunicipalActionItem {
  id: string;
  treeId: string;
  treeCode: string;
  species: string;
  zone: string;
  status: 'pending' | 'dispatched' | 'resolved';
  severity: 'critical' | 'at_risk' | 'needs_attention';
  issue: string;
  recommendedAction: string;
  priorityScore: number;
  reportedDate: string;
  assignedTeam?: string;
  logs?: string[];
}

export interface AIAnalysisResult {
  healthScore: number;
  status: HealthStatus;
  confidence: number;
  breakdown: ScoreBreakdown;
  symptoms: string[];
  possibleCauses: string[];
  recommendations: string[];
  urgency: UrgencyLevel;
  observationSummary: string;
  monitoringIntervalDays: number;
}
