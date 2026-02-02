/* 
Syntax: JavaScript ES6 utilisant les modules (export), les fonctions asynchrones (async/await) et l'API Storage (localStorage).
Role: Service de récupération des données (Data Fetching) avec une stratégie de mise en cache pour optimiser les performances.
Workflow: Vérifie d'abord la validité d'un cache local. Si absent ou expiré, il récupère les fichiers JSON via des requêtes réseau simultanées (Promise.allSettled) et rafraîchit le cache.
*/



// Data Fetching Service with Caching Strategy
// Data Fetching Service with Caching Strategy
const CACHE_KEY = 'RENOVATION_DASHBOARD_DATA_V5_NO_CACHE'; 
const CACHE_DURATION = 0; // DISABLE CACHE TO FIX MISSING DATA 

// Base API URL
const API_BASE = '/api/dashboard/';

// Mapping: Internal Key -> API Filename
const DATA_SOURCES = {
  buildings: 'tableau_recherche',
  types: 'tableau_types_travaux',
  dpe: 'tableau_classes_dpe',
};

export async function fetchDashboardData(forceRefresh = false) {
  console.log(`🚀 [apiFetch] Requesting Data... (Force Refresh: ${forceRefresh})`);

  // 1. Check Cache
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('✅ [apiFetch] Returning valid CACHED data');
          return data;
        } else {
          console.log('⚠️ [apiFetch] Cache expired');
        }
      } catch (e) {
        console.warn('⚠️ [apiFetch] Cache corrupted');
      }
    }
  }

  // 2. Fetch from Network
  console.log('🌐 [apiFetch] Fetching from network via API...');

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

  // 3. Process Results
  const finalData = {};
  results.forEach((res) => {
    if (res.status === 'fulfilled') {
      finalData[res.key] = res.value;
    } else {
      console.error(`❌ Failed to fetch ${res.key}:`, res.reason);
      finalData[res.key] = []; // Fallback empty array
    }
  });

  // 4. Save to Cache (Selective caching to avoid QuotaExceededError)
  if (Object.keys(finalData).length > 0) {
    try {
      // Create a lightweight copy for cache (Exclude heavy tables > 50MB)
      const cacheableData = { ...finalData };
      delete cacheableData.market;
      delete cacheableData.technical;
      delete cacheableData.financial;

      const cacheObject = {
        timestamp: Date.now(),
        data: cacheableData,
      };

      // Attempt save (approx < 1MB now)
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
      console.log('💾 [apiFetch] Lightweight visual data saved to cache');
    } catch (e) {
      console.warn('❌ [apiFetch] Failed to save to localStorage', e);
    }
  }

  return finalData; // S: Instruction return | R: Renvoie l'objet final | W: Fournit les données prêtes à l'emploi au contrôleur appelant.
} // S: Fin de la fonction fetchDashboardData
