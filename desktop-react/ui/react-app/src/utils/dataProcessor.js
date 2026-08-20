/**
 * dataProcessor.js
 * Réplique exacte de la logique processDataForView() du mainController.js legacy.
 * Transforme le format API {annee: [...]} en tableaux plats prêts pour ApexCharts.
 * Entièrement autonome — aucune dépendance externe.
 */

/**
 * Agrège toutes les années de buildings en un tableau par arrondissement.
 * API format: { "2021": [{arrondissement, logements_prives, ...}], "2022": [...] }
 * @param {Object} source - rawData.buildings
 * @param {string} year - 'all' ou '2021'/'2022'/...
 * @returns {Array} tableau plat [{name, arrondissement, logements_prives, ...}]
 */
export function processBuildings(source, year = 'all') {
  if (!source || typeof source !== 'object') return [];

  if (year === 'all') {
    // Agréger toutes les années par arrondissement (logique identique au legacy)
    const aggregated = {};
    Object.values(source).forEach((yearList) => {
      if (!Array.isArray(yearList)) return;
      yearList.forEach((arr) => {
        const id = arr.arrondissement;
        if (!aggregated[id]) {
          aggregated[id] = {
            ...arr,
            name: `${id}e`,
            logements_prives: 0,
            logements_sociaux: 0,
            logements_prives_renoves: 0,
            logements_sociaux_renoves: 0,
            total_logements: 0,
            total_logements_renoves: 0,
          };
        }
        aggregated[id].logements_prives          += arr.logements_prives || 0;
        aggregated[id].logements_sociaux         += arr.logements_sociaux || 0;
        aggregated[id].logements_prives_renoves  += arr.logements_prives_renoves || 0;
        aggregated[id].logements_sociaux_renoves += arr.logements_sociaux_renoves || 0;
        aggregated[id].total_logements           += arr.total_logements || 0;
        aggregated[id].total_logements_renoves   += arr.total_logements_renoves || 0;
      });
    });
    return Object.values(aggregated).sort((a, b) => a.arrondissement - b.arrondissement);
  }

  // Année spécifique
  const yearList = source[year];
  if (!Array.isArray(yearList)) return [];
  return yearList.map((arr) => ({ ...arr, name: `${arr.arrondissement}e` }));
}

/**
 * Agrège les types de travaux en résumé global.
 * API format: { "2021": { "Isolation": [{arrondissement, total_logements}], ... }, ... }
 * @param {Object} source - rawData.types
 * @param {string} year - 'all' ou année spécifique
 * @returns {Array} [{name, total, renovated}]
 */
export function processTypes(source, year = 'all') {
  if (!source || typeof source !== 'object') return [];

  const summary = {};

  const processYear = (yData) => {
    if (!yData || typeof yData !== 'object') return;
    Object.entries(yData).forEach(([type, arrList]) => {
      if (!Array.isArray(arrList)) return;
      if (!summary[type]) summary[type] = { name: type, total: 0, renovated: 0 };
      arrList.forEach((item) => {
        summary[type].total    += item.total_logements || item.total || 0;
        summary[type].renovated += item.total_logements_renoves || item.renoves || 0;
      });
    });
  };

  if (year === 'all') {
    Object.values(source).forEach(processYear);
  } else {
    processYear(source[year]);
  }

  return Object.values(summary);
}

/**
 * Agrège les classes DPE.
 * API format: { "2021": [{arrondissement, classe, total, renoves}], ... }
 * @param {Object} source - rawData.dpe
 * @param {string} year - 'all' ou année spécifique
 * @returns {Array} [{name, total, renovated}]
 */
export function processDpe(source, year = 'all') {
  if (!source || typeof source !== 'object') return [];

  const aggregated = {};

  const addData = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      const key = item.classe || item.name || '?';
      if (!aggregated[key]) aggregated[key] = { name: `Classe ${key}`, total: 0, renovated: 0 };
      aggregated[key].total    += item.total || 0;
      aggregated[key].renovated += item.renoves || item.renovated || 0;
    });
  };

  if (year === 'all') {
    Object.values(source).forEach(addData);
  } else {
    addData(source[year] || []);
  }

  return Object.values(aggregated).sort((a, b) => a.name.localeCompare(b.name));
}
