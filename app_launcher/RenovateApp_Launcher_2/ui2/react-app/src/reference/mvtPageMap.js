/**
 * Source of truth for React migration — DO NOT invent UI.
 * Priority: current MVT production pages, then controllers, then archive (HTML only).
 */
export const MVT_PAGE_MAP = [
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
      'static/css/base/variables.css',
      'static/css/base/base.css',
      'static/css/components/sidebar.css',
      'static/css/pages/dashboard.css',
      'static/css/modules/dashboard_table.css',
    ],
    note: 'Référence principale — dashboard production (:8000/dashboard/).',
  },
  {
    reactTarget: 'pages/BatimentPage.jsx',
    primary: 'templates/pages/dashboard/batiment.html',
    controller: 'static/js/controllers/buildingController.js',
    note: 'À porter après DashboardPage.',
  },
  {
    reactTarget: 'pages/DpePage.jsx',
    primary: 'templates/pages/dashboard/dpe.html',
    controller: 'static/js/controllers/dpeController.js',
    note: 'À porter après BatimentPage.',
  },
  {
    reactTarget: 'pages/TypesPage.jsx',
    primary: 'templates/pages/dashboard/types.html',
    controller: 'static/js/controllers/typesController.js',
    note: 'À porter après DpePage.',
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
