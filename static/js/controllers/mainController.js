/* 
Syntax: JavaScript ES6 orienté objet (Classes) et architecture par modules.
Role: Contrôleur frontal principal (Main Front Controller) qui orchestre l'expérience Single Page Application (SPA) du tableau de bord.
Workflow: Initialise l'application, vérifie l'authentification, récupère les données globales et pilote le rendu dynamique des différentes vues (Overview, Bâtiments, DPE, Types).
*/

// Main Front Controller - SPA Architecture with Integrated Filters
import { fetchDashboardData } from '../apiFetch.js'; // S: Importation nommée | R: Importe le service de données | W: Permet au contrôleur de demander les datasets JSON.
import { AuthService } from '../services/authService.js'; // S: Importation nommée | R: Importe le service de sécurité | W: Utilisé pour valider l'accès à la page au démarrage.
import { BuildingController } from './buildingController.js'; // S: Importation nommée | R: Importe le contrôleur Bâtiments | W: Délègue le rendu de la section bâtiment.
import { TypesController } from './typesController.js'; // S: Importation nommée | R: Importe le contrôleur Types | W: Délègue le rendu de la section travaux.
import { DpeController } from './dpeController.js'; // S: Importation nommée | R: Importe le contrôleur DPE | W: Délègue le rendu de la section énergétique.

class FrontController {
  // S: Déclaration de classe ES6 | R: Définit l'orchestrateur de l'application | W: Centralise la logique de navigation et d'initialisation.
  constructor() {
    // S: Méthode constructor | R: Initialise l'instance de la classe | W: Prépare les variables de stockage (propriétés de l'instance).
    this.data = null; // S: Assignation de propriété | R: Stockage local du dataset | W: Maintient les données en mémoire pour éviter de multiples fetch.
    this.currentView = 'overview'; // S: État SPA | R: Vue active | W: Permet de savoir si on est en mode "Vue d'ensemble" ou "Détails".
  } // S: Fin du constructeur

  async init() {
    console.log('🚀 [SPA] Booting Single Page Dashboard');

    try {
      if (!AuthService.isAuthenticated()) return;

      this.rawData = await fetchDashboardData();
      if (!this.rawData) throw new Error('No data received');

      // Enhanced Filtering State
      this.filters = {
        batiment: { year: 'all' },
        types: { type: 'Isolation', year: 'all' },
        dpe: { class: 'A', year: 'all' },
      };

      this.setupNavigation();
      this.renderAll();

      const bodyPage = document.body.getAttribute('data-page') || 'overview';
      this.switchView(bodyPage === 'dashboard' ? 'overview' : bodyPage);
      this.updateActiveStyles(null);
    } catch (error) {
      console.error('❌ [FrontController] Fatal Failure:', error);
    }
  }

  processDataForView(viewType, forceGlobalSummary = false, yearOverride = null) {
    if (!this.rawData) return [];

    const target = viewType === 'overview' ? 'batiment' : viewType;
    const filter = this.filters[target];
    const dataKey = target === 'batiment' ? 'buildings' : target;
    const source = this.rawData[dataKey];

    if (!source) return [];

    console.log(
      `🔍 [DataProcessor] View: ${viewType}, DataKey: ${dataKey}, forceGlobal: ${forceGlobalSummary}`,
    );

    // 1. Buildings (by Arrondissement)
    if (dataKey === 'buildings') {
      const year = yearOverride || filter.year || 'all';
      if (year === 'all') {
        const aggregated = {};
        Object.values(source).forEach((yearList) => {
          yearList.forEach((arr) => {
            const id = arr.arrondissement;
            if (!aggregated[id]) aggregated[id] = { ...arr, name: `${id}e` };
            else {
              aggregated[id].logements_prives += arr.logements_prives || 0;
              aggregated[id].logements_sociaux += arr.logements_sociaux || 0;
              aggregated[id].logements_prives_renoves += arr.logements_prives_renoves || 0;
              aggregated[id].logements_sociaux_renoves += arr.logements_sociaux_renoves || 0;
              aggregated[id].total_logements += arr.total_logements || 0;
              aggregated[id].total_logements_renoves += arr.total_logements_renoves || 0;
            }
          });
        });
        return Object.values(aggregated).sort((a, b) => a.arrondissement - b.arrondissement);
      }
      return (source[year] || []).map((arr) => ({ ...arr, name: `${arr.arrondissement}e` }));
    }

    // 2. Types
    if (dataKey === 'types') {
      const activeYear = filter.year || 'all';

      if (forceGlobalSummary) {
        const summary = {};

        const processYearData = (yData) => {
          if (!yData) return;
          Object.entries(yData).forEach(([type, arrList]) => {
            if (!summary[type]) summary[type] = 0;
            arrList.forEach((item) => (summary[type] += item.total_logements || 0));
          });
        };

        if (activeYear === 'all') {
          Object.values(source).forEach(processYearData);
        } else {
          processYearData(source[activeYear]);
        }

        return Object.entries(summary).map(([type, count]) => ({ type, count }));
      }

      // Drill-down: Show arrondissements for selected type
      const activeType = filter.type || 'Isolation';
      // activeYear is already declared above

      console.log(`🔍 [Types Drill-down] Type: ${activeType}, Year: ${activeYear}`);

      // Get stock data for ratio calculation (using CURRENT section's year)
      const stockData = this.processDataForView('batiment', false, activeYear) || [];
      const stockMap = {};
      stockData.forEach((s) => {
        const id = s.arrondissement;
        stockMap[id] = (s.logements_prives || 0) + (s.logements_sociaux || 0);
      });

      const aggregated = {};
      const addYearData = (yData, yearLabel) => {
        if (!yData) return;

        // Robust key access: Try direct access, then find ignoring case
        let targetKey = activeType;
        if (!yData[targetKey]) {
          const match = Object.keys(yData).find(
            (k) => k.toLowerCase() === activeType.toLowerCase(),
          );
          if (match) targetKey = match;
        }

        if (!yData[targetKey]) {
          console.warn(`⚠️ Type '${activeType}' not found in data for year ${yearLabel}`);
          return;
        }

        yData[targetKey].forEach((item) => {
          const id = item.arrondissement;
          if (!aggregated[id]) aggregated[id] = { count: 0, name: `${id}e`, arrondissement: id };
          aggregated[id].count += item.total_logements || 0;
        });
      };

      if (activeYear === 'all') {
        Object.entries(source).forEach(([yr, yData]) => addYearData(yData, yr));
      } else {
        addYearData(source[activeYear], activeYear);
      }

      const results = Object.values(aggregated)
        .sort((a, b) => a.arrondissement - b.arrondissement)
        .map((r) => {
          const totalStock = stockMap[r.arrondissement] || 0;
          const ratio = totalStock > 0 ? (r.count / totalStock) * 100 : 0;
          return {
            type: r.name,
            count: r.count,
            total: totalStock, // For comparison in bar chart
            ratio: parseFloat(ratio.toFixed(2)),
          };
        });

      console.log(`✅ [Types Drill-down] Results: ${results.length} arrondissements found.`);
      return results;
    }

    // 3. DPE
    if (dataKey === 'dpe') {
      const year = filter.year || 'all';
      const activeClass = filter.class || 'A';

      if (forceGlobalSummary) {
        // Summary by Class (Across all arrondissements)
        const aggregated = {};
        const addData = (list) => {
          if (!list) return;
          list.forEach((item) => {
            if (!aggregated[item.classe])
              aggregated[item.classe] = { classe: item.classe, total: 0, renoves: 0 };
            aggregated[item.classe].total += item.total || 0;
            aggregated[item.classe].renoves += item.renoves || 0;
          });
        };
        if (year === 'all') Object.values(source).forEach((list) => addData(list));
        else addData(source[year] || []);
        return Object.values(aggregated).sort((a, b) => a.classe.localeCompare(b.classe));
      }

      // Drill-down: Show arrondissements for selected class
      // Get stock data for ratio calculation
      const stockData = this.processDataForView('batiment', false, year) || [];
      const stockMap = {};
      stockData.forEach((s) => {
        const id = s.arrondissement;
        stockMap[id] = (s.logements_prives || 0) + (s.logements_sociaux || 0);
      });

      const aggregated = {};
      const addData = (list) => {
        list
          .filter((item) => item.classe === activeClass)
          .forEach((item) => {
            const id = item.arrondissement;
            if (!aggregated[id]) aggregated[id] = { count: 0, name: `${id}e`, arrondissement: id };
            aggregated[id].count += item.total || 0; // Total buildings of this class
          });
      };

      if (year === 'all') Object.values(source).forEach((list) => addData(list));
      else addData(source[year] || []);

      return Object.values(aggregated)
        .sort((a, b) => a.arrondissement - b.arrondissement)
        .map((r) => {
          const totalStock = stockMap[r.arrondissement] || 0;
          const ratio = totalStock > 0 ? (r.count / totalStock) * 100 : 0;
          return {
            type: r.name,
            count: r.count,
            total: totalStock,
            ratio: parseFloat(ratio.toFixed(2)),
          };
        });
    }

    // 4. Green Tables (Raw Data for Table View)
    if (['market', 'technical', 'financial'].includes(dataKey)) {
      return source || [];
    }

    return [];
  }

  renderAll() {
    if (!this.rawData) return;

    // Determine the active view context based on SPA state
    const currentView = this.currentView || 'overview';
    const bodyPage = document.body.getAttribute('data-page') || 'dashboard'; // Static initial page
    // GLOBAL MODE only if bodyPage is dashboard AND we are in the 'overview' section of the SPA
    const isGlobal = bodyPage === 'dashboard' && currentView === 'overview';

    console.log(`🎨 [RenderAll] CurrentView: ${currentView}, IsGlobal: ${isGlobal}`);

    // 1. Buildings Logic
    if (isGlobal || currentView === 'batiment' || bodyPage === 'batiment') {
      const data = this.processDataForView('batiment');
      const tableData = this.processDataForView('market'); // Green Table
      BuildingController.init({ buildings: data, table: tableData }, { isOverview: isGlobal });
      if (tableData.length) this.renderTable('batimentTableContainer', tableData);
    }

    // 2. Types Logic
    if (isGlobal || currentView === 'types' || bodyPage === 'types') {
      // FORCE GLOBAL SUMMARY: Only if we are in Overview mode.
      // If we are in 'Type' specific view, we want Detail (Drill-down).
      const data = this.processDataForView('types', isGlobal);
      const tableData = this.processDataForView('technical'); // Green Table
      TypesController.init(
        { types: data, table: tableData },
        {
          isOverview: isGlobal,
          bar: 'typesBar',
          donut: 'typesDonut',
          list: 'typesList',
        },
      );
      if (tableData.length) this.renderTable('typesTableContainer', tableData);
    }

    // 3. DPE Logic
    if (isGlobal || currentView === 'dpe' || bodyPage === 'dpe') {
      // FORCE GLOBAL SUMMARY: Only if we are in Overview mode.
      const data = this.processDataForView('dpe', isGlobal);
      const tableData = this.processDataForView('financial'); // Green Table
      DpeController.init(
        { dpe: data, table: tableData },
        {
          isOverview: isGlobal,
          bar: 'dpeBar',
          donut: 'dpeDonut',
          list: 'dpeList',
        },
      );
      if (tableData.length) this.renderTable('dpeTableContainer', tableData);
    }
  }

  renderTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data) return;

    // Décodage du nouveau format {meta, data}
    let rows = [];
    let columns = [];

    if (data.meta && data.data) {
      // Nouveau format compressé
      columns = data.meta.columns;
      // PERFORMANCE FIX: Slice high volume records BEFORE mapping
      const subset = data.data.slice(0, 100);
      rows = subset.map((row) => {
        const obj = {};
        columns.forEach((col, i) => (obj[col] = row[i]));
        return obj;
      });
    } else if (Array.isArray(data)) {
      // Ancien format (fallback)
      rows = data.slice(0, 100);
      columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    } else {
      console.warn('[renderTable] Format de données inconnu:', data);
      return;
    }

    if (rows.length === 0) {
      container.innerHTML =
        '<p class="text-center p-4 text-slate-400">Aucune donnée disponible</p>';
      return;
    }

    let html = `
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-500">
          <thead class="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              ${columns.map((col) => `<th class="px-6 py-3">${col.replace(/_/g, ' ')}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => ` 
              <tr class="bg-white border-b hover:bg-slate-50">
                ${columns.map((col) => `<td class="px-6 py-4 font-medium text-slate-900">${row[col] ?? '-'}</td>`).join('')}
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
        <p class="text-xs text-center p-2 text-slate-400 italic">Affichage limité aux 100 premiers résultats pour préserver la fluidité</p>
      </div>
    `;

    container.innerHTML = html;
  }

  setupViewToggles() {
    document.querySelectorAll('.view-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = btn.getAttribute('data-section');
        const mode = btn.getAttribute('data-mode'); // 'chart' or 'table'

        // Update Buttons
        document
          .querySelectorAll(`.view-toggle-btn[data-section="${sectionId}"]`)
          .forEach((b) => b.classList.remove('active', 'text-primary', 'bg-white', 'shadow-sm'));
        btn.classList.add('active', 'text-primary', 'bg-white', 'shadow-sm');

        // Toggle Views
        const section = document.getElementById(sectionId);
        if (!section) return;

        const charts = section.querySelector('.charts-container');
        const table = section.querySelector('.table-container');

        if (mode === 'chart') {
          if (charts) charts.classList.remove('hidden');
          if (table) table.classList.add('hidden');
        } else {
          if (charts) charts.classList.add('hidden');
          if (table) table.classList.remove('hidden');
        }
      });
    });
  }

  setupNavigation() {
    this.setupViewToggles();
    // ... rest of setupNavigation ...
    const sidebar = document.getElementById('sidebarNav');
    if (!sidebar) return;

    // 1. Primary Group Accordions (Bâtiment, Types, DPE)
    sidebar.addEventListener('click', (e) => {
      const btn = e.target.closest('.accordion-btn');
      if (!btn) return;

      const view = btn.getAttribute('data-view');
      const submenu = btn.nextElementSibling;
      if (!submenu) return;

      e.preventDefault();
      const isCurrentlyOpen = !submenu.classList.contains('hidden');

      btn.classList.toggle('open', !isCurrentlyOpen);
      submenu.classList.toggle('hidden', isCurrentlyOpen);
      const chevron = btn.querySelector('.material-symbols-outlined:last-child');
      if (chevron) chevron.classList.toggle('rotate-180', !isCurrentlyOpen);

      if (view) this.switchView(view);
    });

    // 2. Nested Accordions (Type selection within Types/DPE section)
    document.querySelectorAll('.nested-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = btn.nextElementSibling;
        const parent = btn.closest('.submenu');
        const group = parent.getAttribute('data-filter-group');

        parent.querySelectorAll('.nested-submenu').forEach((s) => {
          if (s !== submenu) s.classList.add('hidden');
        });
        parent.querySelectorAll('.nested-btn').forEach((b) => {
          if (b !== btn) b.classList.remove('open');
        });

        const isShown = !submenu.classList.contains('hidden');
        submenu.classList.toggle('hidden', isShown);
        btn.classList.toggle('open', !isShown);

        // Update state category
        const valType = btn.getAttribute('data-type');
        const valClass = btn.getAttribute('data-class');
        if (group === 'types' && valType) this.filters.types.type = valType;
        if (group === 'dpe' && valClass) this.filters.dpe.class = valClass;

        this.renderAll();
      });
    });

    // 3. Submenu Items (Year selection)
    document.querySelectorAll('.submenu-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const year = item.getAttribute('data-year') || 'all';
        const type = item.getAttribute('data-type');
        const dpeClass = item.getAttribute('data-class');

        const parentSubmenu = item.closest('.submenu');
        const filterGroup = parentSubmenu.getAttribute('data-filter-group');

        parentSubmenu
          .querySelectorAll('.submenu-item')
          .forEach((el) => el.classList.remove('selected'));
        item.classList.add('selected');

        if (filterGroup === 'batiment') {
          this.filters.batiment.year = year;
        } else if (filterGroup === 'types') {
          this.filters.types.year = year;
          if (type) this.filters.types.type = type;
        } else if (filterGroup === 'dpe') {
          this.filters.dpe.year = year;
          if (dpeClass) this.filters.dpe.class = dpeClass;
        }

        this.renderAll();
      });
    });
  }

  updateActiveStyles(activeBtn) {
    if (!activeBtn) {
      const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
      const targetView = bodyPage === 'dashboard' ? 'overview' : bodyPage;
      activeBtn = document.querySelector(`[data-view="${targetView}"]`);
    }

    document.querySelectorAll('.nav-item, .accordion-btn').forEach((el) => {
      el.classList.remove('active', 'open');
      const sub = el.nextElementSibling;
      if (sub && sub.classList.contains('submenu')) {
        sub.classList.add('hidden');
      }
      const chevron = el.querySelector('.material-symbols-outlined:last-child');
      if (chevron) chevron.classList.remove('rotate-180');
    });

    if (!activeBtn) return;
    activeBtn.classList.add('active');

    if (activeBtn.classList.contains('accordion-btn')) {
      activeBtn.classList.add('open');
      const submenu = activeBtn.nextElementSibling;
      if (submenu) {
        submenu.classList.remove('hidden');
        const chevron = activeBtn.querySelector('.material-symbols-outlined:last-child');
        if (chevron) chevron.classList.add('rotate-180');
      }
    }
  }

  switchView(viewType) {
    // S: Méthode de routing interne | R: Bascule l'affichage des sections | W: Gère la visibilité des blocs HTML et met à jour les titres de l'en-tête.
    const sections = document.querySelectorAll('.view-section'); // S: Sélection de masse | R: Liste toutes les pages SPA | W: Permet de les masquer/afficher en bloc.
    const title = document.getElementById('viewTitle'); // S: Cible titre | R: En-tête principal | W: Zone de mise à jour textuelle.
    const subtitle = document.getElementById('viewSubtitle'); // S: Cible sous-titre | R: Description secondaire | W: Zone de mise à jour textuelle.

    // Update internal state
    this.currentView = viewType;

    if (viewType === 'overview') {
      // S: Structure conditionnelle | R: Cas "Vue Globale" | W: Affiche toutes les sections simultanément.
      sections.forEach((s) => (s.style.display = 'block')); // S: Boucle + style inline | R: Affiche tout | W: Rend visibles les 3 dashboards en même temps.
      title.textContent = 'Tableau de Bord Global'; // S: Texte | R: Titre général | W: Informe l'utilisateur du mode "Synthèse".
      subtitle.textContent = 'Synthèse Interactive'; // S: Texte | R: Sous-titre | W: Complète l'information.
    } else {
      // S: Clause else | R: Cas "Vue Spécifique" | W: Sélectionne une seule section à afficher.
      sections.forEach((s) => {
        // S: Boucle de filtrage | R: Masque les éléments non ciblés | W: Assure qu'une seule "page" est visible à la fois dans le conteneur principal.
        s.style.display = s.id === `section-${viewType}` ? 'block' : 'none'; // S: Opérateur ternaire | R: Visibilité sélective | W: Compare l'ID avec la cible demandée.
      }); // S: Fin boucle sections
      const labels = { batiment: 'Bâtiments', types: 'Types', dpe: 'DPE' }; // S: Objet de mapping | R: Traductions des IDs | W: Associe un joli texte à chaque identifiant technique.
      title.textContent = labels[viewType] || 'Détails'; // S: Assignation fallback | R: Mise à jour titre | W: Affiche le nom correspondant ou "Détails" par défaut.
      subtitle.textContent = 'Filtres actifs appliqués'; // S: Texte fixe | R: Sous-titre | W: Indique que la vue est filtrable.
    } // S: Fin du bloc conditionnel

    window.scrollTo({ top: 0, behavior: 'smooth' }); // S: API Window Scroll | R: Remonte au sommet | W: Améliore l'UX lors de la navigation SPA en évitant de rester en bas de page.
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.renderAll(); // Re-render to apply correct aggregation (Summary vs Drill-down)
    }, 100); // S: setTimeout + Event Dispatch | R: Force le redimensionnement | W: Indispensable pour que ApexCharts recalcule sa taille après le changement de display:none à block.
  } // S: Fin de switchView
} // S: Fin de la classe FrontController

document.addEventListener('DOMContentLoaded', () => {
  // S: Écouteur système | R: Détecteur de chargement DOM | W: Point de lancement sécurisé de l'application JS.
  new FrontController().init(); // S: Instanciation et appel | R: Initialisation globale | W: Crée l'objet contrôleur et lance la procédure de démarrage (boot).
}); // S: Fin du script
