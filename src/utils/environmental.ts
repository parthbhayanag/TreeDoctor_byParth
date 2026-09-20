import { EnvironmentalData } from '../types';

interface LiveEnvironmentalResponse {
  treeId?: string;
  treeCode?: string;
  latitude: number;
  longitude: number;
  environmental: EnvironmentalData;
}

/**
 * Fetch real-time temperature, rainfall, relative humidity, and AQI
 * for a specific tree by ID. Uses the backend telemetry service backed by
 * Open-Meteo Precision Weather & Air Quality APIs.
 */
export async function fetchTreeEnvironmentalTelemetry(treeId: string): Promise<EnvironmentalData | null> {
  try {
    const res = await fetch(`/api/trees/${treeId}/environmental`);
    if (!res.ok) {
      throw new Error(`Environmental fetch failed: ${res.status}`);
    }
    const data: LiveEnvironmentalResponse = await res.json();
    return data.environmental;
  } catch (err) {
    console.warn(`Could not load live telemetry for tree ${treeId}:`, err);
    return null;
  }
}

/**
 * Fetch real-time environmental telemetry for any arbitrary coordinates (lat/lng).
 * Useful when pinning a location on the interactive map before tree creation.
 */
export async function fetchLocationEnvironmentalTelemetry(
  lat: number,
  lng: number
): Promise<EnvironmentalData | null> {
  try {
    const res = await fetch(`/api/environmental-telemetry?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      throw new Error(`Telemetry fetch failed: ${res.status}`);
    }
    const data: LiveEnvironmentalResponse = await res.json();
    return data.environmental;
  } catch (err) {
    console.warn(`Could not load telemetry for coords [${lat}, ${lng}]:`, err);
    return null;
  }
}
