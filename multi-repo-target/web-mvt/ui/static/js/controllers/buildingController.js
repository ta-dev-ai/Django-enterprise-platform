/* 
Syntax: JavaScript ES6 (objets littéraux, méthodes, déstructuration).
Role: Contrôleur spécialisé dans le traitement et l'affichage des données de rénovation par type de bâtiment (Privé vs Social).
Workflow: Transforme les données brutes issues de l'API Fetch en formats compatibles avec ApexCharts et met à jour les éléments DOM du tableau de bord.
*/

import { getBarOptions, getDonutOptions, donutColors } from '../configChart.js'; // S: Importations nommées | R: Importe les utilitaires de graphiques | W: Permet la création uniforme des visuels ApexCharts.
import { renderList, updatePageTitle, setActiveMenu, clearContainer } from '../utils/ui.js'; // S: Importations nommées | R: Importe les utilitaires UI | W: Gère la manipulation DOM transverse.

export const BuildingController = {
  // S: Exportation d'un objet littéral | R: Namespace pour la logique "Bâtiment" | W: Regroupe toutes les fonctions liées à cette thématique.
  /**
   * Initializes the Building Dashboard view.
   * @param {Object} data - The full dataset (we'll extract buildings).
   */
  init(data, config = {}) {
    // S: Méthode d'objet avec paramètres par défaut | R: Prépare la vue | W: Configure l'interface et lance le rendu des statistiques.
    console.log('🏗️ [BuildingController] Initializing...'); // S: Log console | R: Trace d'activité | W: Indique le lancement du contrôleur dans la console.

    // 1. Logic handled by mainController
    // Title and Menu are set globally based on the data-page attribute
    // or by switchView.

    // 2. Render content
    this.renderStats(data.buildings, config); // S: Appel de méthode interne | R: Déclenche l'affichage | W: Transmet les données de bâtiments pour le rendu graphique.
  }, // S: Fin de init

  renderStats(data, config = {}) {
    // S: Méthode de rendu | R: Construit les graphiques | W: Mappe les IDs, transforme les données et instancie les instances ApexCharts.
    const ids = {
      // S: Déclaration d'objet constant | R: Mapping d'IDs HTML | W: Permet de cibler les bons conteneurs selon le mode (Overview ou Détail).
      privateBar: config.privateBar || 'privateChart', // S: Opérateur de repli (OR) | R: ID barre privée | W: Flexible selon le paramétrage.
      socialBar: config.socialBar || 'socialChart', // S: OR | R: ID barre sociale | W: Flexible.
      privateDonut: config.privateDonut || 'privateDonut', // S: OR | R: ID donut privé | W: Flexible.
      socialDonut: config.socialDonut || 'socialDonut', // S: OR | R: ID donut social | W: Flexible.
      privateList: config.privateList || 'privateListContainer', // S: OR | R: ID liste privée | W: Flexible.
      socialList: config.socialList || 'socialListContainer' // S: OR | R: ID liste sociale | W: Flexible.
    }; // S: Fin de l'objet ids

    // Transform DTO to Chart format
    const privateData = data.map((d) => ({
      name: d.name,
      total: d.logements_prives,
      renovated: d.logements_prives_renoves,
    }));

    const socialData = data.map((d) => ({
      name: d.name,
      total: d.logements_sociaux,
      renovated: d.logements_sociaux_renoves,
    }));

    // Render Bar Charts
    if (document.querySelector(`#${ids.privateBar}`)) {
      clearContainer(ids.privateBar);
      new ApexCharts(
        document.querySelector(`#${ids.privateBar}`),
        getBarOptions(privateData, 'Logement Privé'),
      ).render();
    }

    if (document.querySelector(`#${ids.socialBar}`)) {
      clearContainer(ids.socialBar);
      new ApexCharts(
        document.querySelector(`#${ids.socialBar}`),
        getBarOptions(socialData, 'Logement Social'),
      ).render();
    }


    // Prepare & Render Donut Data
    const generatePieData = (
      dataset, // S: Fonction fléchée interne | R: Transformateur spécifique | W: Calcule les pourcentages et assigne des couleurs aux segments du donut.
    ) =>
      dataset.map((d, i) => ({
        // S: Méthode map avec index | R: Enrichissement de données | W: Prépare chaque part du donut.
        name: d.name, // S: Propriété | R: Nom segment | W: Nom de l'arrondissement.
        value: d.renovated, // S: Propriété | R: Valeur numérique | W: Volume absolu pour le calcul de la part.
        percent: (() => {
          const totalVal = dataset.reduce((a, b) => a + b.renovated, 0);
          return totalVal > 0 ? Math.round((d.renovated / totalVal) * 100 * 10) / 10 : 0;
        })(),
        color: donutColors[i % 20], // S: Modulo sur palette | R: Assignation couleur | W: Cycle à travers les 20 couleurs définies.
      })); // S: Fin du map donut

    const pieDataPrivate = generatePieData(privateData); // S: Appel fonction transformation | R: Données donut privé | W: Résultats prêts pour ApexCharts.
    const pieDataSocial = generatePieData(socialData); // S: Appel fonction transformation | R: Données donut social | W: Résultats prêts pour ApexCharts.

    if (document.querySelector(`#${ids.privateDonut}`)) {
      clearContainer(ids.privateDonut);
      new ApexCharts(
        document.querySelector(`#${ids.privateDonut}`),
        getDonutOptions(pieDataPrivate, 'PRIVÉ'),
      ).render();
    }

    if (document.querySelector(`#${ids.socialDonut}`)) {
      clearContainer(ids.socialDonut);
      new ApexCharts(
        document.querySelector(`#${ids.socialDonut}`),
        getDonutOptions(pieDataSocial, 'SOCIAL'),
      ).render();
    }


    // Render Lists
    renderList(ids.privateList, pieDataPrivate.slice(0, 20)); // S: Appel utilitaire | R: Affiche la légende | W: Génère le tableau HTML pour les 20 arrondissements privés.
    renderList(ids.socialList, pieDataSocial.slice(0, 20)); // S: Appel utilitaire | R: Affiche la légende | W: Génère le tableau HTML pour les 20 arrondissements sociaux.
  } // S: Fin de renderStats
}; // S: Fin de BuildingController
