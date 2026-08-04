/* 
Syntax: JavaScript ES6.
Role: Contrôleur dédié à la visualisation de la performance énergétique (DPE) des bâtiments parisiens.
Workflow: Cartographie les données DPE, applique les codes couleurs officiels (A à G) et génère les graphiques de répartition correspondants.
*/

import { getBarOptions, getDonutOptions } from "../configChart.js"; // S: Imports nommés | R: Accès aux helpers ApexCharts | W: Assure la cohérence des styles graphiques avec le reste de l'app.
import { renderList, updatePageTitle, setActiveMenu, clearContainer } from "../utils/ui.js"; // S: Imports nommés | R: Utilitaires DOM | W: Permet de modifier le titre et le menu de navigation.

export const DpeController = {
  // S: Objet exporté | R: Namespace DPE | W: Encapsule toute la logique de traitement énergétique.
  /**
   * Initializes the DPE Dashboard view.
   * @param {Object} data
   */
  init(data, config = {}) {
    // S: Méthode d'initialisation | R: Prépare l'affichage DPE | W: Configure l'interface spécifique et lance le rendu des statistiques.
    console.log('📊 [DpeController] Initializing...'); // S: Log console | R: Trace de démarrage | W: Informe le développeur de l'activation du contrôleur.

    if (!config.isOverview) {
      // S: Logic handled by mainController (Title/Menu)
      this.adjustLayout(); // S: Appel méthode interne | R: Nettoyage UI | W: Cache les éléments inutiles (ex: sections sociales) pour cette vue.
    } // S: Fin du bloc conditionnel

    this.renderStats(data.dpe, config); // S: Appel méthode de rendu | R: Affiche les données | W: Transmet les statistiques DPE au moteur de rendu graphique.
  }, // S: Fin de init

  adjustLayout() {
    // S: Méthode de nettoyage | R: Adapte le DOM | W: Masque les conteneurs de graphiques sociaux qui ne sont pas pertinents pour le DPE.
    const socialChart = document.getElementById('socialChart'); // S: Sélection ID | R: Cible graphique social | W: Permet de manipuler sa visibilité.
    if (socialChart) socialChart.parentElement.style.display = 'none'; // S: Manipulation style | R: Cache le bloc parent | W: Libère de l'espace visuel dans le dashboard.

    const socialDonut = document.getElementById('socialDonut'); // S: Sélection ID | R: Cible donut social | W: Recherche l'élément à masquer.
    if (socialDonut) socialDonut.parentElement.parentElement.parentElement.style.display = 'none'; // S: Navigation DOM ascendante | R: Masque le bloc complexe | W: Épure la mise en page.
  }, // S: Fin de adjustLayout

  renderStats(data, config = {}) {
    // S: Méthode de rendu statistique | R: Génère les visuels | W: Mappe les couleurs DPE, calcule les parts et instancie les graphiques.
    const ids = {
      bar: config.bar || 'privateChart',
      donut: config.donut || 'privateDonut',
      list: config.list || 'privateListContainer',
    };

    // DPE Colors Mapping
    const dpeColorsMap = {
      A: '#009036',
      B: '#53af31',
      C: '#c6d802',
      D: '#f5e700',
      E: '#fbad18',
      F: '#ec661e',
      G: '#e31d2b',
    };

    // UI Colors for Arrondissements (FALLBACK if not DPE class)
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
    ];

    const isDrillDown = data.length > 0 && data[0].type && data[0].type.endsWith('e');

    const dpeItems = data.map((d, index) => {
      const name = isDrillDown ? d.type : `Classe ${d.classe}`;
      const color = isDrillDown
        ? arrColors[index % arrColors.length]
        : dpeColorsMap[d.classe] || '#ccc';

      return {
        name: name,
        value: d.count !== undefined ? d.count : d.total,
        total: d.total || 0,
        ratio: d.ratio || 0,
        percent: -1,
        color: color,
      };
    });

    const total = dpeItems.reduce((acc, curr) => acc + curr.value, 0);
    dpeItems.forEach((item) => {
      item.percent = total > 0 ? Math.round((item.value / total) * 100 * 10) / 10 : 0;
    });

    // Render Bar
    const barTitle = isDrillDown
      ? 'Répartition par Arrondissement (Volume vs Parc Total)'
      : 'Répartition DPE';
    const barData = dpeItems.map((d) => ({
      name: d.name,
      total: d.total || d.value,
      renovated: d.value,
    }));

    if (document.querySelector(`#${ids.bar}`)) {
      clearContainer(ids.bar);
      new ApexCharts(
        document.querySelector(`#${ids.bar}`),
        getBarOptions(
          barData,
          barTitle,
          isDrillDown ? ['Parc Total', 'Volume'] : ['Total', 'Rénovés'],
        ),
      ).render();
    }

    // Render Donut
    const dpeDonutOptions = getDonutOptions(dpeItems, isDrillDown ? 'ARR.' : 'DPE');
    dpeDonutOptions.colors = dpeItems.map((d) => d.color);

    if (document.querySelector(`#${ids.donut}`)) {
      clearContainer(ids.donut);
      new ApexCharts(document.querySelector(`#${ids.donut}`), dpeDonutOptions).render();
    }

    renderList(ids.list, dpeItems);
  },
  // S: Fin de renderStats
}; // S: Fin de DpeController
