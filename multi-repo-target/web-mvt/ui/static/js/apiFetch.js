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
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
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
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    });
}

async function readCachedSource(key) {
  const entry = await idbGet(`${CACHE_KEY}:${key}`);
  if (!entry || !entry.timestamp || !entry.data) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    return null;
  }
  return entry.data;
}

async function writeCachedSource(key, data) {
  await idbSet(`${CACHE_KEY}:${key}`, {
    timestamp: Date.now(),
    data,
  });
}

export async function fetchDashboardData(forceRefresh = false) {
  console.log(`🚀 [apiFetch] Requesting Data... (Force Refresh: ${forceRefresh})`);

  const result = {};

  for (const [key, filename] of Object.entries(DATA_SOURCES)) {
    if (!forceRefresh) {
      const cached = await readCachedSource(key);
      if (cached) {
        console.log(`✅ [apiFetch] Using cached chunk ${key}`);
        result[key] = cached;
        continue;
      }
    }

    console.log(`🌐 [apiFetch] Fetching ${key}`);
    try {
      const response = await fetch(`${API_BASE}${filename}/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      result[key] = data;
      await writeCachedSource(key, data);
    } catch (error) {
      console.error(`❌ Failed to fetch ${key}:`, error);
      result[key] = [];
    }
  }

  return result;
}
