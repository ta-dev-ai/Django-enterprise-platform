/** Navigation vitrine — alignée sur la maquette Home (sections + routes dashboard). */

export const HOME_SECTIONS = {
  about: 'about',
  features: 'features',
  mission: 'mission',
  team: 'team',
};

export const HOME_NAV_ITEMS = [
  { id: 'home', label: 'Accueil', type: 'home' },
  { id: 'about', label: 'À propos', type: 'route', to: '/about' },
  {
    id: 'solutions',
    label: 'Solutions',
    type: 'dropdown',
    items: [
      { label: 'Bâtiments Rénovés', to: '/batiment' },
      { label: 'Types de Rénovation', to: '/types' },
      { label: 'Classe DPE', to: '/dpe' },
      { label: 'Aides & Financements', to: '/dashboard' },
    ],
  },
  { id: 'resources', label: 'Ressources', type: 'route', to: '/dashboard' },
  { id: 'contact', label: 'Contact', type: 'route', to: '/contact' },
  { id: 'workspace', label: 'Mon espace', type: 'route', to: '/dashboard', highlight: true },
];

export const HOME_FOOTER_SOLUTIONS = [
  { label: 'Bâtiments Rénovés', to: '/batiment' },
  { label: 'Types de Rénovation', to: '/types' },
  { label: 'Classe DPE', to: '/dpe' },
  { label: 'Aides & Financements', to: '/dashboard' },
];

export const HOME_FOOTER_RESOURCES = [
  { label: 'Blog', to: '/about' },
  { label: 'Guides', to: '/dashboard' },
  { label: 'FAQ', to: '/contact' },
  { label: 'Études de cas', to: '/cv' },
];

export const HOME_SCROLL_ROUTES = {
  about: HOME_SECTIONS.about,
  solutions: HOME_SECTIONS.features,
  mission: HOME_SECTIONS.mission,
  team: HOME_SECTIONS.team,
};
