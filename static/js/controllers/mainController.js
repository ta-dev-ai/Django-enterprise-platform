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
  } // S: Fin du constructeur

  async init() {
    // S: Méthode asynchrone | R: Point d'entrée de la logique métier | W: S'exécute au chargement du DOM pour construire la page.
    console.log('🚀 [SPA] Booting Single Page Dashboard'); // S: Log console | R: Signale le démarrage | W: Trace visuelle pour le débogage.

    try {
      // S: Bloc de protection | R: Gère les erreurs fatales | W: Capture les échecs de fetch ou d'authentification.
      if (!AuthService.isAuthenticated()) return; // S: Condition if | R: Vérifie le statut de connexion | W: Stoppe l'exécution si l'utilisateur n'est pas autorisé.

      this.data = await fetchDashboardData(); // S: Attribution avec await | R: Récupère les données JSON | W: Attend la réponse du service apiFetch avant de continuer.
      this.renderAll(); // S: Appel de méthode interne | R: Lance l'affichage global | W: Déclenche le rendu initial de tous les composants graphiques.
      this.setupNavigation(); // S: Appel de méthode interne | R: Active l'interactivité | W: Initialise les écouteurs d'événements sur la sidebar.

      // Default view detection from body data-page attribute
      const bodyPage = document.body.getAttribute('data-page') || 'overview';
      const initialView = bodyPage === 'dashboard' ? 'overview' : bodyPage;
      this.switchView(initialView);
      this.updateActiveStyles(null);
    } catch (error) {
      // S: Bloc catch | R: Intercepte les exceptions | W: Journalise l'erreur pour analyse technique.
      console.error('❌ [FrontController] Failure:', error); // S: Log d'erreur console | R: Affiche le détail de l'échec | W: Aide à la résolution d'incidents.
    } // S: Fin du bloc try-catch
  } // S: Fin de la méthode init

  renderAll() {
    const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
    const isGlobal = bodyPage === 'dashboard';

    // 1. Logique Bâtiments
    if (isGlobal || bodyPage === 'batiment') {
      BuildingController.init(this.data, { isOverview: isGlobal });
    }

    // 2. Logique Types
    if (isGlobal || bodyPage === 'types') {
      TypesController.init(this.data, {
        isOverview: isGlobal,
        bar: 'typesBar',
        donut: 'typesDonut',
        list: 'typesList',
      });
    }

    // 3. Logique DPE
    if (isGlobal || bodyPage === 'dpe') {
      DpeController.init(this.data, {
        isOverview: isGlobal,
        bar: 'dpeBar',
        donut: 'dpeDonut',
        list: 'dpeList',
      });
    }
  } // S: Fin de renderAll

  setupNavigation() {
    const sidebar = document.getElementById('sidebarNav');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
      const btn = e.target.closest('.accordion-btn, .nav-item');
      if (!btn) return;

      const view = btn.getAttribute('data-view');
      const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
      const isGlobalDashboard = bodyPage === 'dashboard';

      // Check if we are clicking an already active accordion to toggle it
      if (btn.classList.contains('accordion-btn')) {
        const submenu = btn.nextElementSibling;
        const isMenuLinkToCurrentPage =
          view === bodyPage || (view === 'overview' && bodyPage === 'dashboard');

        if (isMenuLinkToCurrentPage && submenu) {
          e.preventDefault();
          const isCurrentlyOpen = !submenu.classList.contains('hidden');

          // Toggle logic
          btn.classList.toggle('open', !isCurrentlyOpen);
          submenu.classList.toggle('hidden', isCurrentlyOpen);
          const chevron = btn.querySelector('.material-symbols-outlined:last-child');
          if (chevron) chevron.classList.toggle('rotate-180', !isCurrentlyOpen);
          return;
        }
      }

      if (view && isGlobalDashboard) {
        e.preventDefault();
        this.switchView(view);
        this.updateActiveStyles(btn);
      } else {
        // Normal navigation for <a> tags
        this.updateActiveStyles(btn);
      }
    });

    // Submenu Filtering
    document.querySelectorAll('.submenu-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        item.parentElement
          .querySelectorAll('.submenu-item')
          .forEach((el) => el.classList.remove('selected'));
        item.classList.add('selected');
        console.log(`🔍 [Filter] Applied: ${item.textContent}`);
      });
    });
  } // S: Fin de setupNavigation

  updateActiveStyles(activeBtn) {
    if (!activeBtn) {
      const bodyPage = document.body.getAttribute('data-page') || 'dashboard';
      const targetView = bodyPage === 'dashboard' ? 'overview' : bodyPage;
      activeBtn = document.querySelector(`[data-view="${targetView}"]`);
    }

    // Reset all menu items and accordions
    document.querySelectorAll('.nav-item, .accordion-btn').forEach((el) => {
      el.classList.remove('active', 'open');
      const sub = el.nextElementSibling;
      if (sub && sub.classList.contains('submenu')) {
        sub.classList.add('hidden');
      }
      // Also handle the icon/chevron if present
      const chevron = el.querySelector('.material-symbols-outlined:last-child');
      if (chevron) chevron.classList.remove('rotate-180');
    });

    if (!activeBtn) return;

    // Apply active state
    activeBtn.classList.add('active');

    // Handle accordion specific logic
    if (activeBtn.classList.contains('accordion-btn')) {
      activeBtn.classList.add('open');
      const submenu = activeBtn.nextElementSibling;
      if (submenu) submenu.classList.remove('hidden');
      const chevron = activeBtn.querySelector('.material-symbols-outlined:last-child');
      if (chevron) chevron.classList.add('rotate-180');
    }
  } // S: Fin de updateActiveStyles

  switchView(viewType) {
    // S: Méthode de routing interne | R: Bascule l'affichage des sections | W: Gère la visibilité des blocs HTML et met à jour les titres de l'en-tête.
    const sections = document.querySelectorAll('.view-section'); // S: Sélection de masse | R: Liste toutes les pages SPA | W: Permet de les masquer/afficher en bloc.
    const title = document.getElementById('viewTitle'); // S: Cible titre | R: En-tête principal | W: Zone de mise à jour textuelle.
    const subtitle = document.getElementById('viewSubtitle'); // S: Cible sous-titre | R: Description secondaire | W: Zone de mise à jour textuelle.

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
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100); // S: setTimeout + Event Dispatch | R: Force le redimensionnement | W: Indispensable pour que ApexCharts recalcule sa taille après le changement de display:none à block.
  } // S: Fin de switchView
} // S: Fin de la classe FrontController

document.addEventListener('DOMContentLoaded', () => {
  // S: Écouteur système | R: Détecteur de chargement DOM | W: Point de lancement sécurisé de l'application JS.
  new FrontController().init(); // S: Instanciation et appel | R: Initialisation globale | W: Crée l'objet contrôleur et lance la procédure de démarrage (boot).
}); // S: Fin du script
