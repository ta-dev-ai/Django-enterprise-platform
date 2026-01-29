/* 
Syntax: JavaScript ES6 utilisant les modules (export), les fonctions asynchrones (async/await) et l'API Storage (localStorage).
Role: Service de récupération des données (Data Fetching) avec une stratégie de mise en cache pour optimiser les performances.
Workflow: Vérifie d'abord la validité d'un cache local. Si absent ou expiré, il récupère les fichiers JSON via des requêtes réseau simultanées (Promise.allSettled) et rafraîchit le cache.
*/



// Data Fetching Service with Caching Strategy
// Data Fetching Service with Caching Strategy
const CACHE_KEY = "RENOVATION_DASHBOARD_DATA_V2"; 
const CACHE_DURATION = 2 * 60 * 60 * 1000; 

// Base API URL
const API_BASE = "http://127.0.0.1:8000/api/dashboard/";

// Mapping: Internal Key -> API Filename
const DATA_SOURCES = {
  buildings: "tableau_recherche",
  types: "tableau_types_travaux",
  dpe: "tableau_classes_dpe",
  market: "table_market",
  technical: "table_technical",
  financial: "table_financial"
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


  // Log failures if any
  if (buildingsResult.status === 'rejected') console.error('❌ Failed to fetch Buildings data'); // S: Condition if | R: Log d'erreur spécifique | W: Notifie l'échec du chargement des bâtiments.
  if (typesResult.status === 'rejected') console.error('❌ Failed to fetch Types data'); // S: Condition if | R: Log d'erreur spécifique | W: Notifie l'échec du chargement des types.
  if (dpeResult.status === 'rejected') console.error('❌ Failed to fetch DPE data'); // S: Condition if | R: Log d'erreur spécifique | W: Notifie l'échec du chargement du DPE.

  // 4. Save to Cache (only if we have at least some data)
  if (finalData.buildings.length || finalData.types.length || finalData.dpe.length) {
    // S: Condition complexe OR | R: Vérifie la présence de données | W: Prévient la mise en cache d'un objet vide en cas d'échec total.
    try {
      // S: Bloc try-catch | R: Sécurise l'écriture disque | W: Prévient les erreurs si le LocalStorage est plein.
      const cacheObject = {
        // S: Création d'objet | R: Prépare le paquet de cache | W: Associe les données au timestamp de création.
        timestamp: Date.now(), // S: Horodatage | R: Définit l'heure de sauvegarde | W: Utilisé ultérieurement pour calculer l'expiration.
        data: finalData, // S: Propriété data | R: Contient l'objet complet | W: Stocke les données récupérées.
      }; // S: Fin de cacheObject
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject)); // S: setItem et JSON.stringify | R: Sauvegarde physique en cache | W: Convertit l'objet en texte pour le stockage persistant.
      console.log('💾 [apiFetch] Data saved to cache'); // S: Log de succès | R: Confirme la persistance | W: Trace visuelle de la mise à jour du cache.
    } catch (e) {
      // S: Capture d'erreur | R: Gère les exceptions de quota | W: Log l'erreur sans bloquer l'application.
      console.error('❌ [apiFetch] Failed to save to localStorage (Quota exceeded?)', e); // S: Log d'erreur | R: Détaille l'échec de cache | W: Aide au diagnostic technique.
    }
  }

  return finalData; // S: Instruction return | R: Renvoie l'objet final | W: Fournit les données prêtes à l'emploi au contrôleur appelant.
} // S: Fin de la fonction fetchDashboardData
