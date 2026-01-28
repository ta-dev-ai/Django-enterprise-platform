/* 
Syntax: JavaScript ES6.
Role: VERSION DE TEST - Service de récupération des données avec Mapper pour transformer les JSON locaux vers le format de l'interface.
*/

const CACHE_KEY = 'RENOVATION_DASHBOARD_DATA_TEST';
const CACHE_DURATION = 2 * 60 * 60 * 1000;

export async function fetchDashboardData(forceRefresh = false) {
  console.log(`🚀 [apiFetch_test] Requesting Data... (Force Refresh: ${forceRefresh})`);

  // 1. Check Cache
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('✅ [apiFetch_test] Returning valid CACHED data');
          return data;
        }
      } catch (e) {
        console.warn('⚠️ [apiFetch_test] Cache corrupted');
      }
    }
  }

  // 2. Fetch from Network (Django Test Routes)
  console.log('🌐 [apiFetch_test] Fetching from Django test endpoints...');

  // Ces routes correspondent aux nouveaux contrôleurs Django créés dans views_test.py
  const urls = {
    buildings: '/api/test/Batiment_renovates/',
    types: '/api/test/Renovation-types/',
    dpe: '/api/test/energy-classes/',
  };

  const results = await Promise.allSettled([
    fetch(urls.buildings).then((r) => (r.ok ? r.json() : Promise.reject('Buildings File Missing'))),
    fetch(urls.types).then((r) => (r.ok ? r.json() : Promise.reject('Types File Missing'))),
    fetch(urls.dpe).then((r) => (r.ok ? r.json() : Promise.reject('DPE File Missing'))),
  ]);

  const [bRes, tRes, dRes] = results;

  // 3. Transformation & Mapping (Pour ne pas casser l'interface)
  const finalData = {
    buildings: mapAllBuildings(bRes.status === 'fulfilled' ? bRes.value : {}),
    types: mapAllTypes(tRes.status === 'fulfilled' ? tRes.value : {}),
    dpe: mapAllDpe(dRes.status === 'fulfilled' ? dRes.value : {}),
  };

  // 4. Save to Cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: finalData }));

  return finalData;
}

/**
 * Mapper pour tous les bâtiments par année
 */
function mapAllBuildings(rawData) {
  const yearsData = {};
  Object.entries(rawData).forEach(([year, data]) => {
    yearsData[year] = data.map((item) => ({
      name: item.arrondissement === 1 ? '1er' : `${item.arrondissement}e`,
      total: Math.round(item.total_logements || 0),
      renovated: Math.round(item.total_logements_renoves || 0),
      private_renovated: Math.round(item.logements_prives_renoves || 0),
      social_renovated: Math.round(item.logements_sociaux_renoves || 0),
    }));
  });
  return yearsData;
}

/**
 * Mapper pour tous les types par année
 */
function mapAllTypes(rawData) {
  const yearsData = {};
  Object.entries(rawData).forEach(([year, categories]) => {
    yearsData[year] = Object.entries(categories).map(([categoryName, items]) => {
      const totalForCategory = items.reduce((sum, item) => sum + (item.total_logements || 0), 0);
      return {
        type: categoryName,
        count: Math.round(totalForCategory),
      };
    });
  });
  return yearsData;
}

/**
 * Mapper pour tous les DPE par année
 */
function mapAllDpe(rawData) {
  const yearsData = {};
  Object.entries(rawData).forEach(([year, data]) => {
    yearsData[year] = data.map((item) => ({
      className: item.classe,
      count: Math.round(item.total || 0),
    }));
  });
  return yearsData;
}
