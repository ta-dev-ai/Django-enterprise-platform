/* 
Syntax: JavaScript ES6 (Classes, Async/Await).
Role: Main Front Controller - Centralized Store & Routing.
*/

import { fetchDashboardData } from '../apiFetch.js';
import { AuthService } from '../services/authService.js';
import { BuildingController } from './buildingController.js';
import { TypesController } from './typesController.js';
import { DpeController } from './dpeController.js';

class FrontController {
  constructor() {
    this.rawData = null;
    this.currentView = 'overview';
    this.isInitialized = false;
    this.filters = {
      batiment: { year: 'all' },
      types: { type: 'Isolation', year: 'all' },
      dpe: { class: 'A', year: 'all' },
    };
  }

  async init() {
    console.log('🚀 [SPA] Centralized Store Booting...');

    // 1. Initial Loaders
    this.showChartLoaders();

    try {
      if (!AuthService.isAuthenticated()) return;

      // 2. Fetch ALL Data (Simulating Redux Store)
      this.rawData = await fetchDashboardData();
      if (!this.rawData) throw new Error('Impossible de charger les données');

      // 3. Setup Logic
      this.setupNavigation();

      // 4. Determine Initial Page
      const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
      const initialView = bodyPage === 'dashboard' ? 'overview' : bodyPage;

      // 5. First Render (Guaranteed Data)
      this.isInitialized = true;
      this.switchView(initialView);

      // Theme Listener
      document.addEventListener('themeChanged', () => this.renderAll());
    } catch (error) {
      console.error('❌ [FrontController] Fatal Error:', error);
      this.showErrorMessage(error.message);
    }
  }

  showErrorMessage(msg) {
    const containers = ['dashboardContent', 'section-batiment', 'section-types', 'section-dpe'];
    containers.forEach((id) => {
      const el = document.getElementById(id);
      if (el)
        el.innerHTML = `<div class="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                <strong>Erreur :</strong> ${msg}<br>Veuillez rafraîchir la page.
            </div>`;
    });
  }

  // --- STORE / DATA PROCESSING ---

  processDataForView(viewType, forceGlobalSummary = false, yearOverride = null) {
    if (!this.rawData) return [];

    const target = viewType === 'overview' ? 'batiment' : viewType;
    const filter = this.filters[target] || { year: 'all' };
    const dataKey = target === 'batiment' ? 'buildings' : target;
    const source = this.rawData[dataKey];

    if (!source) return [];

    // 1. Buildings (Arrondissement logic)
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
        const processYear = (yData) => {
          if (!yData) return;
          Object.entries(yData).forEach(([type, arrList]) => {
            if (!summary[type]) summary[type] = 0;
            arrList.forEach((item) => (summary[type] += item.total_logements || 0));
          });
        };
        if (activeYear === 'all') Object.values(source).forEach(processYear);
        else processYear(source[activeYear]);
        return Object.entries(summary).map(([type, count]) => ({ type, count }));
      }

      // Drill-down: Show arrondissements for selected type
      const activeType = filter.type || 'Isolation';
      const stockData = this.processDataForView('batiment', false, activeYear) || [];
      const stockMap = {};
      stockData.forEach(
        (s) =>
          (stockMap[s.arrondissement] = (s.logements_prives || 0) + (s.logements_sociaux || 0)),
      );

      const aggregated = {};
      const addYearData = (yData) => {
        if (!yData) return;
        let targetKey = activeType;
        if (!yData[targetKey]) {
          const match = Object.keys(yData).find(
            (k) => k.toLowerCase() === activeType.toLowerCase(),
          );
          if (match) targetKey = match;
        }
        if (!yData[targetKey]) return;
        yData[targetKey].forEach((item) => {
          const id = item.arrondissement;
          if (!aggregated[id]) aggregated[id] = { count: 0, name: `${id}e`, arrondissement: id };
          aggregated[id].count += item.total_logements || 0;
        });
      };

      if (activeYear === 'all') Object.values(source).forEach(addYearData);
      else addYearData(source[activeYear]);

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

    // 3. DPE
    if (dataKey === 'dpe') {
      const year = filter.year || 'all';
      const activeClass = filter.class || 'A';

      if (forceGlobalSummary) {
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
        if (year === 'all') Object.values(source).forEach(addData);
        else addData(source[year] || []);
        return Object.values(aggregated).sort((a, b) => a.classe.localeCompare(b.classe));
      }

      // Drill-down: Show arrondissements for selected class
      const stockData = this.processDataForView('batiment', false, year) || [];
      const stockMap = {};
      stockData.forEach(
        (s) =>
          (stockMap[s.arrondissement] = (s.logements_prives || 0) + (s.logements_sociaux || 0)),
      );

      const aggregated = {};
      const addData = (list) => {
        if (!list) return;
        list
          .filter((item) => item.classe === activeClass)
          .forEach((item) => {
            const id = item.arrondissement;
            if (!aggregated[id]) aggregated[id] = { count: 0, name: `${id}e`, arrondissement: id };
            aggregated[id].count += item.total || 0;
          });
      };

      if (year === 'all') Object.values(source).forEach(addData);
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

    return [];
  }

  // --- RENDERING ---

  async renderAll() {
    if (!this.rawData || !this.isInitialized) return;

    console.log(`🎨 [SPA] Rendering view: ${this.currentView}`);

    const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
    const isGlobal = bodyPage === 'dashboard' && this.currentView === 'overview';

    // 1. Render Section Bâtiments
    if (isGlobal || this.currentView === 'batiment' || bodyPage === 'batiment') {
      const data = this.processDataForView('batiment');
      BuildingController.init({ buildings: data }, { isOverview: isGlobal });
      this.ensureAndRenderTable('batimentTableContainer', 'market');
    }

    // 2. Render Section Types
    if (isGlobal || this.currentView === 'types' || bodyPage === 'types') {
      const data = this.processDataForView('types', isGlobal);
      TypesController.init({ types: data }, { isOverview: isGlobal });
      this.ensureAndRenderTable('typesTableContainer', 'technical');
    }

    // 3. Render Section DPE
    if (isGlobal || this.currentView === 'dpe' || bodyPage === 'dpe') {
      const data = this.processDataForView('dpe', isGlobal);
      DpeController.init({ dpe: data }, { isOverview: isGlobal });
      this.ensureAndRenderTable('dpeTableContainer', 'financial');
    }
  }

  async ensureAndRenderTable(containerId, key) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Si le conteneur est déjà visible et rempli, on peut sauter ou rafraîchir
    // Pour l'instant, on rafraîchit s'il y a des données ou on fetch

    const existingData = this.rawData[key];
    if (
      existingData &&
      (existingData.length > 0 || (existingData.data && existingData.data.length > 0))
    ) {
      this.renderTable(containerId, existingData);
    } else {
      console.log(`📡 Fetching missing table data for: ${key}`);
      try {
        // On utilise table_financial comme fallback universel si les petits fichiers manquent
        const url =
          key === 'financial'
            ? '/static/data/table_financial.json'
            : `/static/data/table_${key}.json`;
        // Fallback to financial if specific table fails
        const res = await fetch(url).catch(() => fetch('/static/data/table_financial.json'));
        const json = await res.json();
        this.rawData[key] = json;
        this.renderTable(containerId, json);
      } catch (e) {
        console.error(`❌ Error loading table ${key}:`, e);
      }
    }
  }

  renderTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container || !data) return;

    let rows = [];
    let columns = [];

    if (data.meta && data.data) {
      columns = data.meta.columns;
      rows = data.data.slice(0, 100).map((row) => {
        const obj = {};
        columns.forEach((col, i) => (obj[col] = row[i]));
        return obj;
      });
    } else if (Array.isArray(data)) {
      rows = data.slice(0, 100);
      columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    }

    if (rows.length === 0) {
      container.innerHTML = `<p class="p-8 text-center text-slate-400">Aucune donnée trouvée.</p>`;
      return;
    }

    const html = `
            <div class="rt-container" style="border:none; box-shadow:none; border-radius:12px; height: 500px;">
                <div class="overflow-x-auto rt-scroll-area" style="height: 100%;">
                    <table class="rt-table">
                        <thead class="rt-thead">
                            <tr>${columns.map((c) => `<th>${c.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}</tr>
                        </thead>
                        <tbody class="rt-tbody">
                            ${rows
                              .map(
                                (row) => `
                                <tr class="rt-row">
                                    ${columns
                                      .map((col) => {
                                        const val = row[col] ?? '-';
                                        const isBold =
                                          col.toLowerCase().includes('adresse') ||
                                          col.toLowerCase().includes('cout');
                                        return `<td class="${isBold ? 'rt-cell-bold' : ''}">${val}</td>`;
                                      })
                                      .join('')}
                                </tr>
                            `,
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
                <div class="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <small class="text-slate-400 italic">Aperçu des 100 premiers résultats (Stock centralisé)</small>
                </div>
            </div>
        `;
    container.innerHTML = html;
  }

  // --- NAVIGATION & UI ---

  switchView(viewType) {
    this.currentView = viewType;
    const sections = document.querySelectorAll('.view-section');
    const title = document.getElementById('viewTitle');
    const subtitle = document.getElementById('viewSubtitle');

    if (!title || !subtitle) return; // Crash protection

    if (viewType === 'overview') {
      sections.forEach((s) => (s.style.display = 'block'));
      title.textContent = 'Tableau de Bord Global';
      subtitle.textContent = 'Synthèse Interactive';
    } else {
      sections.forEach(
        (s) => (s.style.display = s.id === `section-${viewType}` ? 'block' : 'none'),
      );
      const labels = {
        batiment: 'Bâtiments Rénovés',
        types: 'Types de Rénovation',
        dpe: 'Performance DPE',
      };
      title.textContent = labels[viewType] || 'Détails';
      subtitle.textContent = 'Analyse sectorielle détaillée';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.renderAll();
    }, 50);
  }

  setupNavigation() {
    // 1. Sidebar Links (SPA)
    const sidebar = document.getElementById('sidebarNav');
    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        // Handle direct nav-items and accordion-btns
        const navItem = e.target.closest('.nav-item, .accordion-btn');
        if (navItem) {
          const view = navItem.getAttribute('data-view');
          if (view) {
            e.preventDefault();
            this.switchView(view);
            this.updateSidebarActive(navItem);
          }

          // Toggle Accordion if it's one
          if (navItem.classList.contains('accordion-btn')) {
            const submenu = navItem.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
              const isHidden = submenu.classList.contains('hidden');
              submenu.classList.toggle('hidden', !isHidden);
              navItem.classList.toggle('open', isHidden);
              const icon = navItem.querySelector('.material-symbols-outlined:last-child');
              if (icon) icon.classList.toggle('rotate-180', isHidden);
            }
          }
        }
      });
    }

    // 2. View Toggles (Chart vs Table inside pages)
    document.querySelectorAll('.view-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = btn.getAttribute('data-section');
        const mode = btn.getAttribute('data-mode');

        // UI Toggle
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Update Button states
        section
          .querySelectorAll('.view-toggle-btn')
          .forEach((b) => b.classList.remove('active', 'text-primary', 'bg-white', 'shadow-sm'));
        btn.classList.add('active', 'text-primary', 'bg-white', 'shadow-sm');

        const charts = section.querySelector('.charts-container');
        const table = section.querySelector('.table-container');

        if (mode === 'chart') {
          if (charts) charts.classList.remove('hidden');
          if (table) table.classList.add('hidden');
        } else {
          if (charts) charts.classList.add('hidden');
          if (table) {
            table.classList.remove('hidden');
            if (table.innerHTML.trim() === '') this.renderAll(); // Re-render to populate table
          }
        }
      });
    });
  }

  updateSidebarActive(activeNode) {
    document
      .querySelectorAll('.nav-item, .accordion-btn')
      .forEach((el) => el.classList.remove('active'));
    activeNode.classList.add('active');
  }

  showChartLoaders() {
    const loaders = document.querySelectorAll('.charts-container, .table-container');
    const loaderHtml = `
            <div class="rt-loading-wrapper" style="min-height: 200px;">
                <div class="rt-spinner"></div>
                <div class="rt-loading-text">Synchronisation des données...</div>
            </div>`;

    loaders.forEach((l) => {
      // Uniquement si le conteneur n'a pas déjà de contenu et qu'il a des enfants IDs ciblés
      const targets = ['privateChart', 'socialChart', 'typesBar', 'dpeBar'];
      targets.forEach((tid) => {
        const el = document.getElementById(tid);
        if (el) el.innerHTML = loaderHtml;
      });
    });
  }
}

// Global bootstrap
window.frontController = new FrontController();
document.addEventListener('DOMContentLoaded', () => window.frontController.init());
