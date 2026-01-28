/* 
Syntax: JavaScript ES6 orienté objet (Classes) et architecture par modules.
Role: Contrôleur frontal principal (Main Front Controller) qui orchestre l'expérience Single Page Application (SPA) du tableau de bord.
Workflow: Initialise l'application, vérifie l'authentification, récupère les données globales et pilote le rendu dynamique des différentes vues (Overview, Bâtiments, DPE, Types).
*/

// Main Front Controller - SPA Architecture with Integrated Filters
// VERSION DE TEST - Utilise apiFetch_test.js et controllers de test
import { fetchDashboardData } from '../apiFetch_test.js';
import { AuthService } from '../services/authService.js';
import { BuildingController } from './buildingController_test.js';
import { TypesController } from './typesController_test.js';
import { DpeController } from './dpeController_test.js';

class FrontController {
  constructor() {
    this.data = null;
    this.selectedYear = '2021'; // Année par défaut
    this.currentView = 'overview';
    
    // --- EXPOSITION GLOBALE POUR ONCLICK (Solution de Secours) ---
    window.filterYear = (year) => {
      console.log(`🖱️ [DirectClick] Year Clicked: ${year}`);
      
      // Gestion visuelle
      document.querySelectorAll('.submenu-item').forEach(el => el.classList.remove('selected'));
      const activeLink = document.querySelector(`.submenu-item[data-year="${year}"]`);
      if (activeLink) activeLink.classList.add('selected');

      // Logic Update
      this.selectedYear = year;
      this.renderCurrentView();
    };

    window.switchDashboardView = (viewId, btnElement) => {
      console.log(`🖱️ [DirectClick] View Clicked: ${viewId}`);
      this.switchView(viewId);
      
      // Si c'est un bouton dans la sidebar, on gère l'accordéon
      if (btnElement) {
         this.updateActiveStyles(btnElement);
      }
    };
  }

  async init() {
    console.log('🚀 [SPA-TEST] Booting Single Page Dashboard with Dynamic Filters');

    try {
      if (!AuthService.isAuthenticated()) return;

      this.data = await fetchDashboardData();

      // On initialise avec les données filtrées
      this.renderCurrentView();
      this.setupNavigation();

      this.switchView('overview');
    } catch (error) {
      console.error('❌ [FrontController-TEST] Failure:', error);
    }
  }

  /**
   * Filtre les données pour l'année sélectionnée
   */
  getFilteredData() {
    const year = this.selectedYear;
    return {
      buildings: this.data.buildings[year] || [],
      types: this.data.types[year] || [],
      dpe: this.data.dpe[year] || [],
    };
  }

  renderCurrentView() {
    const filtered = this.getFilteredData();
    console.log(`📊 Rendering view for year: ${this.selectedYear}`);

    // Mode Overview: On rend tout
    BuildingController.init(filtered, { isOverview: true });

    TypesController.init(filtered, {
      isOverview: true,
      bar: 'typesBar',
      donut: 'typesDonut',
      list: 'typesList',
    });

    DpeController.init(filtered, {
      isOverview: true,
      bar: 'dpeBar',
      donut: 'dpeDonut',
      list: 'dpeList',
    });
  }


  }

  // NOTE: setupNavigation est conservé comme fallback mais les onclick HTML prendront le dessus
  setupNavigation() { 
    // ... Legacy listeners kept just in case
  }

  updateActiveStyles(activeBtn) {
    if (!activeBtn) return;
    
    // Reset all
    document.querySelectorAll('.nav-item, .accordion-btn').forEach((el) => {
      el.classList.remove('active', 'open');
      const sub = el.nextElementSibling;
      if (sub && sub.classList.contains('submenu')) sub.classList.add('hidden');
    });

    // Activate current
    activeBtn.classList.add('active');
    
    // Si c'est un bouton accordéon (pas un lien simple)
    if (activeBtn.classList.contains('accordion-btn')) {
      activeBtn.classList.add('open');
      const submenu = activeBtn.nextElementSibling;
      if (submenu) submenu.classList.remove('hidden');
    }
  }

  switchView(viewType) {
    const sections = document.querySelectorAll('.view-section');
    const title = document.getElementById('viewTitle');
    const subtitle = document.getElementById('viewSubtitle');

    // --- MODIFICATION DEMANDÉE : TOUJOURS AFFICHER L'OVERVIEW ---
    // Peu importe le clic (Bâtiments, Types, etc.), on reste sur la vue globale
    // On met simplement à jour les graphiques avec les données filtrées.

    sections.forEach((s) => (s.style.display = 'block'));
    title.textContent = 'Tableau de Bord Global';
    subtitle.textContent = `Synthèse Interactive - Année ${this.selectedYear}`;

    // On force l'activation du bouton "Vue d'ensemble" dans la sidebar pour la cohérence visuelle
    // (Optionnel, mais nettoie l'UI)
    // this.updateActiveStyles(document.querySelector('[data-view="overview"]'));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FrontController().init();
});
