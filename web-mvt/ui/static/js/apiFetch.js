/* 
Syntax: JavaScript ES6 utilisant les modules (export), les fonctions asynchrones (async/await) et l'API IndexedDB.
Rôle: Service de récupération des données (Data Fetching) avec une stratégie de mise en cache sur disque navigateur.
Workflow: Vérifie d'abord le cache IndexedDB. Si un chunk est manquant ou expiré, il le charge progressivement depuis l'API, puis le stocke.
*/

const CACHE_KEY = 'RENOVATION_DASHBOARD_DATA_V5_NO_CACHE';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const IDB_DB = 'renovation-dashboard-data';
const IDB_STORE = 'cache';
const IDB_VERSION = 1;

const API_BASE = '/api/dashboard/';

const DATA_SOURCES = {
  buildings: 'tableau_recherche',
  types: 'tableau_types_travaux',
  dpe: 'tableau_classes_dpe',
};

const memoryCache = new Map();
const inFlightRequests = new Map();

function openIdb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    const request = indexedDB.open(IDB_DB, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(key) {
  return openIdb()
    .then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const store = tx.objectStore(IDB_STORE);
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        }),
    )
    .catch(() => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    });
}

function idbSet(key, value) {
  return openIdb()
    .then(
      (db) =>
        new Promise((resolve, reject) => {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          const store = tx.objectStore(IDB_STORE);
          const request = store.put(value, key);
          request.onsuccess = () => resolve(value);
          request.onerror = () => reject(request.error);
        }),
    )
    .catch((error) => {
      console.warn('[apiFetch] IndexedDB unavailable, fallback localStorage', error);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore storage quota / private mode failures.
      }
      return value;
    });
}

function cacheStorageKey(key) {
  return `${CACHE_KEY}:${key}`;
}

function isFreshEntry(entry) {
  return Boolean(entry && entry.timestamp && entry.data && Date.now() - entry.timestamp <= CACHE_DURATION);
}

async function readCachedSource(key, allowStale = false) {
  const memoryEntry = memoryCache.get(key);
  if (isFreshEntry(memoryEntry)) {
    return memoryEntry.data;
  }

  const entry = await idbGet(cacheStorageKey(key));
  if (!entry || !entry.timestamp || !entry.data) return null;
  memoryCache.set(key, entry);
  if (allowStale || Date.now() - entry.timestamp <= CACHE_DURATION) {
    return entry.data;
  }
  return null;
}

async function writeCachedSource(key, data) {
  const entry = {
    timestamp: Date.now(),
    data,
  };
  memoryCache.set(key, entry);
  await idbSet(cacheStorageKey(key), entry);
  return data;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data && typeof data === 'object' && !Array.isArray(data) && data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function fetchCachedJson(cacheKey, url, forceRefresh = false) {
  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    if (!forceRefresh) {
      const cached = await readCachedSource(cacheKey);
      if (cached !== null) {
        console.log(`✅ [apiFetch] Using cached chunk ${cacheKey}`);
        return cached;
      }
    }

    console.log(`🌐 [apiFetch] Fetching ${cacheKey}`);
    try {
      const data = await fetchJson(url);
      await writeCachedSource(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch ${cacheKey}:`, error);
      const stale = await readCachedSource(cacheKey, true);
      if (stale !== null) {
        console.warn(`⚠️ [apiFetch] Falling back to stale cache for ${cacheKey}`);
        return stale;
      }
      throw error;
    }
  })();

  inFlightRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

export async function fetchDashboardData(forceRefresh = false) {
  console.log(`🚀 [apiFetch] Requesting Data... (Force Refresh: ${forceRefresh})`);

  const result = {};

  for (const [key, filename] of Object.entries(DATA_SOURCES)) {
    try {
      result[key] = await fetchCachedJson(`dashboard:${key}`, `${API_BASE}${filename}/`, forceRefresh);
    } catch (error) {
      result[key] = [];
    }
  }

  return result;
}
