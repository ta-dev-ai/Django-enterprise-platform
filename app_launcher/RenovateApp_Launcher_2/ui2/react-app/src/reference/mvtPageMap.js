/**
 * Source of truth for React migration — DO NOT invent UI.
 * Priority: current MVT production pages, then controllers, then archive (HTML only).
 */
export const MVT_PAGE_MAP = [
  {
    reactTarget: 'pages/HomePage.jsx',
    primary: 'templates/pages/home.html',
    styles: ['static/css/pages/home.css', 'static/css/pages/homeDark.css'],
    note: 'Accueil vitrine — route #/',
  },
  {
    reactTarget: 'pages/AboutPage.jsx',
    primary: 'templates/pages/about.html',
    layout: 'templates/layouts/main_layout.html',
    styles: ['static/css/pages/about.css'],
    note: 'Route #/about',
  },
  {
    reactTarget: 'pages/ContactPage.jsx',
    primary: 'templates/pages/contact.html',
    layout: 'templates/layouts/main_layout.html',
    styles: ['static/css/pages/contact.css'],
    note: 'Route #/contact — formulaire POST via proxy Django',
  },
  {
    reactTarget: 'pages/CvPage.jsx',
    primary: 'templates/pages/cv_tayier.html',
    data: 'static/data/cv_data.json',
    note: 'Route #/cv',
  },
  {
    reactTarget: 'pages/LoginPage.jsx',
    primary: 'templates/pages/login.html',
    styles: ['static/css/pages/login.css'],
    note: 'Route #/login — auth Django via proxy',
  },
  {
    reactTarget: 'pages/AdminLoginPage.jsx',
    primary: 'templates/pages/admin_login.html',
    styles: ['static/css/pages/admin_login.css'],
    note: 'Route #/admin_login — template vitrine (pas de URL Django)',
  },
  {
    reactTarget: 'pages/AdminPage.jsx',
    primary: 'templates/pages/admin_page.html',
    styles: ['static/css/pages/admin_page.css'],
    note: 'Route #/admin_page',
  },
  {
    reactTarget: 'pages/NotFoundPage.jsx',
    primary: 'templates/pages/404.html',
    styles: ['static/css/pages/404.css'],
    note: 'Route #/404 et catch-all *',
  },
  {
    reactTarget: 'pages/DashboardPage.jsx',
    primary: 'templates/pages/dashboard/dashboard.html',
    layout: 'templates/layouts/dashboard_layout.html',
    sidebar: 'templates/components/sidebar/sidebar.html',
    controller: 'static/js/controllers/mainController.js',
    subControllers: [
      'static/js/controllers/buildingController.js',
      'static/js/controllers/typesController.js',
      'static/js/controllers/dpeController.js',
    ],
    api: 'static/js/apiFetch.js',
    charts: 'static/js/configChart.js',
    styles: [
      'static/css/components/sidebar.css',
      'static/css/pages/dashboard.css',
      'static/css/modules/dashboard_table.css',
    ],
    note: 'Dashboard production — route #/dashboard',
  },
  {
    reactTarget: 'pages/BatimentPage.jsx',
    primary: 'templates/pages/dashboard/batiment.html',
    controller: 'static/js/controllers/buildingController.js',
    note: 'Route #/batiment',
  },
  {
    reactTarget: 'pages/DpePage.jsx',
    primary: 'templates/pages/dashboard/dpe.html',
    controller: 'static/js/controllers/dpeController.js',
    note: 'Route #/dpe',
  },
  {
    reactTarget: 'pages/TypesPage.jsx',
    primary: 'templates/pages/dashboard/types.html',
    controller: 'static/js/controllers/typesController.js',
    note: 'Route #/types',
  },
];

/** Old React stub — NOT a valid UI reference for RenovateEnergy. */
export const DEPRECATED_REACT_REF = {
  file: 'src/App.jsx (ancien stub Velos Paris)',
  status: 'deprecated',
  note: 'Remplacé par la parité MVT. Ne pas réutiliser ce design.',
};

/** Archive HTML — secondary reference only (failed migration). */
export const ARCHIVE_HTML_REF = {
  folder: '_ARCHIVE_TEMPLATES_FAIL/',
  status: 'secondary',
  note: 'HTML historique. La référence sûre reste templates/ actuel.',
};
