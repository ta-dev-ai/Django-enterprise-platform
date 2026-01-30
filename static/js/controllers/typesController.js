/* 
Syntax: JavaScript ES6.
Role: Contrôleur spécialisé dans la présentation des différentes catégories de travaux de rénovation effectués.
Workflow: Analyse les volumes par type de travaux, calcule les ratios et met à jour dynamiquement les graphiques en barres et circulaires.
*/

import { getBarOptions, getDonutOptions, donutColors } from '../configChart.js'; // S: Imports nommés | R: Accès config et couleurs | W: Fournit les outils nécessaires pour le rendu graphique des travaux.
import { renderList, updatePageTitle, setActiveMenu, clearContainer } from '../utils/ui.js'; // S: Imports nommés | R: Utilitaires UI | W: Gère la mise à jour des éléments textuels et de navigation du DOM.

export const TypesController = {
  // S: Objet exporté | R: Namespace "Types" | W: Centralise la logique liée aux catégories de travaux.
  /**
   * Initializes the Types Dashboard view.
   * @param {Object} data
   */
  init(data, config = {}) {
    // S: Méthode d'init | R: Boot de la page Types | W: Configure l'interface detaillee ou globale et lance le calcul des stats.
    console.log('🛠️ [TypesController] Initializing...'); // S: Log console | R: Trace de démarrage | W: Permet de suivre l'exécution du code dans l'inspecteur.

    if (!config.isOverview) {
      // S: Logic handled by mainController (Title/Menu)
      this.adjustLayout(); // S: Appel méthode interne | R: Optimisation mise en page | W: Réorganise les conteneurs pour une vue focalisée sur les types.
    } // S: Fin du bloc conditionnel

    this.renderStats(data.types, config); // S: Appel de rendu | R: Production visuelle | W: Passe les données de types à la fonction de génération de graphiques.
  }, // S: Fin de init

  adjustLayout() {
    // S: Méthode utilitaire | R: Modification structurelle DOM | W: Masque les zones dédiées aux bâtiments pour ne laisser que les conteneurs réutilisés pour les types.
    // Modify UI Structure for singular chart view
    const socialChart = document.getElementById('socialChart'); // S: Sélection ID | R: Cible graphique social | W: Identifie l'élément à retirer du flux visuel.
    if (socialChart) socialChart.parentElement.style.display = 'none'; // S: Manipulation CSS | R: Masquage | W: Cache le bloc parent pour aérer l'interface.

    const socialDonut = document.getElementById('socialDonut'); // S: Sélection ID | R: Cible donut social | W: Recherche l'élément inutile.
    if (socialDonut) socialDonut.parentElement.parentElement.parentElement.style.display = 'none'; // S: Navigation DOM | R: Masquage complet | W: Retire tout le bloc complexe correspondant.
  }, // S: Fin de adjustLayout

  renderStats(data, config = {}) {
    // S: Méthode de rendu statistique | R: Génère graphiques et listes | W: Transforme les données, calcule les parts et instancie les instances ApexCharts.
    const ids = {
      bar: config.bar || 'privateChart',
      donut: config.donut || 'privateDonut',
      list: config.list || 'privateListContainer',
    };

    // DPE Colors Mapping - Using a fixed scale for arrondissements
    const arrColors = [
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
      '#f43f5e',
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#4f46e5',
      '#6366f1',
      '#6d28d9',
      '#4c1d95',
    ];

    // Process Data
    const typeItems = data.map((d, index) => {
      const isArrondissement = d.type && d.type.endsWith('e');
      return {
        name: d.type,
        value: d.count,
        total: d.total || d.count,
        ratio: d.ratio || 0,
        percent: -1,
        color: isArrondissement
          ? arrColors[(parseInt(d.type) - 1) % arrColors.length]
          : arrColors[index % arrColors.length],
      };
    });

    const total = typeItems.reduce((acc, curr) => acc + curr.value, 0);
    typeItems.forEach((item) => {
      item.percent = total > 0 ? Math.round((item.value / total) * 100 * 10) / 10 : 0;
    });

    // Render Main Bar Chart
    const isDrillDown = data.length > 0 && data[0].type && data[0].type.endsWith('e');
    const barTitle = isDrillDown
      ? 'Répartition par Arrondissement (Volume vs Parc Total)'
      : 'Types de Rénovation (Volume)';

    // For drill-down, we show Total Stock vs Renovated
    const barData = typeItems.map((d) => ({
      name: d.name,
      total: d.total,
      renovated: d.value,
    }));

    if (document.querySelector(`#${ids.bar}`)) {
      clearContainer(ids.bar);
      new ApexCharts(
        document.querySelector(`#${ids.bar}`),
        getBarOptions(barData, barTitle, ['Parc Total', 'Rénovés']),
      ).render();
    }

    if (document.querySelector(`#${ids.donut}`)) {
      clearContainer(ids.donut);
      new ApexCharts(
        document.querySelector(`#${ids.donut}`),
        getDonutOptions(typeItems, 'TYPES'),
      ).render();
    }

    // Render List
    renderList(ids.list, typeItems);
  },
  // S: Fin de renderStats
}; // S: Fin de TypesController
