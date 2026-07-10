import { API_BASE, CACHE_DURATION, CACHE_KEY, DATA_SOURCES } from './constants';

/**
 * Parity copy of static/js/apiFetch.js — same endpoints, same merge logic.
 * Only the localStorage cache key differs (REACT_V1 vs V5_NO_CACHE).
 */
export async function fetchDashboardData(forceRefresh = false) {
  console.log(`🚀 [dashboardApi] Requesting data... (forceRefresh: ${forceRefresh})`);

  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('✅ [dashboardApi] Returning cached data');
          return data;
        }
        console.log('⚠️ [dashboardApi] Cache expired');
      } catch {
        console.warn('⚠️ [dashboardApi] Cache corrupted');
      }
    }
  }

  console.log('🌐 [dashboardApi] Fetching from Django API...');

  const fetchPromises = Object.entries(DATA_SOURCES).map(([key, filename]) =>
    fetch(`${API_BASE}${filename}/`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => ({ key, status: 'fulfilled', value: data }))
      .catch((error) => ({ key, status: 'rejected', reason: error })),
  );

  const results = await Promise.all(fetchPromises);

  const finalData = {};
  results.forEach((res) => {
    if (res.status === 'fulfilled') {
      finalData[res.key] = res.value;
    } else {
      console.error(`❌ [dashboardApi] Failed to fetch ${res.key}:`, res.reason);
      finalData[res.key] = [];
    }
  });

  if (Object.keys(finalData).length > 0) {
    try {
      const cacheableData = { ...finalData };
      delete cacheableData.market;
      delete cacheableData.technical;
      delete cacheableData.financial;

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data: cacheableData }),
      );
      console.log('💾 [dashboardApi] Lightweight data saved to cache');
    } catch (e) {
      console.warn('❌ [dashboardApi] Failed to save cache', e);
    }
  }

  return finalData;
}

/** Quick summary for parity checks against MVT dashboard. */
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
