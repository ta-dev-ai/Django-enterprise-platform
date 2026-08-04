import { API_BASE, CACHE_DURATION, CACHE_KEY, DATA_SOURCES } from './constants';
import { getDbValue, removeDbValue, setDbValue } from '../utils/indexedDbCache';

const CHUNK_CACHE_PREFIX = `${CACHE_KEY}:chunk`;
const inFlightRequests = new Map();

async function readCachedSource(key) {
  if (CACHE_DURATION <= 0) return null;
  const entry = await getDbValue(`${CHUNK_CACHE_PREFIX}:${key}`);
  if (!entry || !entry.timestamp || entry.timestamp <= 0) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    await removeDbValue(`${CHUNK_CACHE_PREFIX}:${key}`);
    return null;
  }
  return entry.data;
}

async function writeCachedSource(key, data) {
  if (CACHE_DURATION <= 0) return;
  await setDbValue(`${CHUNK_CACHE_PREFIX}:${key}`, {
    timestamp: Date.now(),
    data,
  });
}

export async function fetchDashboardSource(key, forceRefresh = false) {
  const filename = DATA_SOURCES[key];
  if (!filename) throw new Error(`Source inconnue: ${key}`);

  const existingRequest = inFlightRequests.get(key);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    if (!forceRefresh) {
      const cached = await readCachedSource(key);
      if (cached) {
        console.log(`✅ [dashboardApi] Using cached source ${key}`);
        return cached;
      }
    }

    console.log(`🌐 [dashboardApi] Fetching source ${key}`);
    const response = await fetch(`${API_BASE}${filename}/`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    await writeCachedSource(key, data);
    return data;
  })();

  inFlightRequests.set(key, request);
  try {
    return await request;
  } finally {
    inFlightRequests.delete(key);
  }
}

export async function fetchDashboardData(forceRefresh = false) {
  const finalData = {};
  for (const key of Object.keys(DATA_SOURCES)) {
    try {
      finalData[key] = await fetchDashboardSource(key, forceRefresh);
    } catch (error) {
      console.error(`❌ [dashboardApi] Failed to fetch ${key}:`, error);
      finalData[key] = [];
    }
  }
  return finalData;
}

export function summarizeDashboardData(data) {
  if (!data) return null;

  const summarizePayload = (payload) => {
    if (Array.isArray(payload)) {
      return { years: 1, rows: payload.length };
    }
    if (payload && typeof payload === 'object') {
      const years = Object.keys(payload);
      const rows = years.reduce(
        (sum, year) => sum + (Array.isArray(payload[year]) ? payload[year].length : 0),
        0,
      );
      return { years: years.length, rows };
    }
    return { years: 0, rows: 0 };
  };

  return {
    buildings: summarizePayload(data.buildings),
    types: summarizePayload(data.types),
    dpe: summarizePayload(data.dpe),
  };
}
