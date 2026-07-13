export const messages = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      contact: 'Contact',
      dashboard: 'Dashboard',
      cv: 'CV',
      login: 'Connexion',
      signup: 'Inscription',
    },
    footer: {
      tagline:
        'Plateforme data énergie bâtiment — vitrine technique pour recruteurs ESN & entreprises CH.',
      navigation: 'Navigation',
      legal: 'Légal',
      mentions: 'Mentions légales',
      privacy: 'Confidentialité',
      impressum: 'Impressum (DE)',
      recruiting: 'Recrutement',
      recruiterContact: 'Contact recruteur',
      rights: 'Tous droits réservés.',
    },
    home: {
      eyebrow: 'Portfolio technique · Suisse · ESN',
      title: 'Plateforme data énergie bâtiment — Django & React',
      lead: 'Démonstration full-stack pour recruteurs et ESN : API Django, dashboard analytique, migration React à parité MVT. Données DPE Paris (arrond. 1–20).',
      cvTitle: 'Tayier NIMAIT — Architecte IA & Systèmes',
      cvText: 'CV interactif, stack Python/Django/React, cas d’usage data & gouvernance IA.',
      cvCta: 'Voir le CV',
      dashboardTitle: 'Dashboard démo',
      dashboardText: 'Registre bâtiments, graphiques ApexCharts, table enterprise, vue 3D.',
      dashboardCta: 'Ouvrir le dashboard',
      stackTitle: 'Stack',
      stackText: 'Django 6 MVT (prod) + React V2 (migration) · SQLite · API REST',
      dataTitle: 'Jeu de données',
      dataStat: 'Paris 1–20',
      dataText: 'Registre DPE et rénovation — export CSV, filtres sidebar.',
      githubCta: 'Code source',
      demoCta: 'Connexion démo',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      about: 'Über uns',
      contact: 'Kontakt',
      dashboard: 'Dashboard',
      cv: 'CV',
      login: 'Anmelden',
      signup: 'Registrieren',
    },
    footer: {
      tagline:
        'Energiedaten-Plattform Gebäude — technische Vitrine für ESN-Recruiter & CH-Unternehmen.',
      navigation: 'Navigation',
      legal: 'Rechtliches',
      mentions: 'Rechtliche Hinweise',
      privacy: 'Datenschutz',
      impressum: 'Impressum',
      recruiting: 'Recruiting',
      recruiterContact: 'Recruiter-Kontakt',
      rights: 'Alle Rechte vorbehalten.',
    },
    home: {
      eyebrow: 'Technisches Portfolio · Schweiz · ESN',
      title: 'Energiedaten-Plattform Gebäude — Django & React',
      lead: 'Full-Stack-Demo für Recruiter und ESN: Django-API, Analytics-Dashboard, React-Migration mit MVT-Parität. DPE-Daten Paris (1–20).',
      cvTitle: 'Tayier NIMAIT — KI- & Systemarchitekt',
      cvText: 'Interaktiver CV, Python/Django/React, Data & KI-Governance.',
      cvCta: 'CV ansehen',
      dashboardTitle: 'Dashboard-Demo',
      dashboardText: 'Gebäuderegister, ApexCharts, Enterprise-Tabelle, 3D-Ansicht.',
      dashboardCta: 'Dashboard öffnen',
      stackTitle: 'Stack',
      stackText: 'Django 6 MVT (Prod) + React V2 (Migration) · SQLite · REST API',
      dataTitle: 'Datensatz',
      dataStat: 'Paris 1–20',
      dataText: 'DPE- und Renovierungsregister — CSV-Export, Sidebar-Filter.',
      githubCta: 'Quellcode',
      demoCta: 'Demo-Login',
    },
  },
};

export function t(locale, key) {
  const parts = key.split('.');
  let node = messages[locale] || messages.fr;
  for (const part of parts) {
    node = node?.[part];
  }
  return node ?? key;
}
