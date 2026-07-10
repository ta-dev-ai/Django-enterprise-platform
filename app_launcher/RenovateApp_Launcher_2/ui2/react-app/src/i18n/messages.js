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
