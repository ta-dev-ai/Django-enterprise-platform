import { SITE_CONTACT } from '../constants/siteContact';

const c = SITE_CONTACT;

export const legalContent = {
  mentions: {
    fr: {
      title: 'Mentions légales',
      updated: 'Dernière mise à jour : juillet 2026',
      sections: [
        {
          heading: 'Éditeur du site',
          body: `${c.company} — projet vitrine technique opéré par ${c.legalName}.\n${c.addressLine}, ${c.country}`,
        },
        {
          heading: 'Responsable de publication',
          body: c.responsible,
        },
        {
          heading: 'Contact',
          contact: true,
        },
        {
          heading: 'Hébergement',
          body:
            'Application de démonstration — hébergement à préciser lors du déploiement production. Données de démo : SQLite locale, sans données personnelles réelles.',
        },
        {
          heading: 'Propriété intellectuelle',
          body: `Le code source, les visuels et la documentation sont protégés par le droit d'auteur. Portfolio technique : ${c.github}`,
          link: { href: c.github, label: 'GitHub' },
        },
      ],
    },
    de: {
      title: 'Rechtliche Hinweise',
      updated: 'Letzte Aktualisierung: Juli 2026',
      sections: [
        {
          heading: 'Herausgeber',
          body: `${c.company} — technische Vitrine betrieben von ${c.legalName}.\n${c.addressLine}, ${c.country}`,
        },
        {
          heading: 'Verantwortlich',
          body: c.responsible,
        },
        {
          heading: 'Kontakt',
          contact: true,
        },
      ],
    },
  },
  privacy: {
    fr: {
      title: 'Politique de confidentialité',
      updated: 'Dernière mise à jour : juillet 2026 — conforme aux principes nLPD (CH)',
      sections: [
        {
          heading: '1. Responsable du traitement',
          body: `${c.legalName} / ${c.company} — ${c.responsible}\n${c.email}`,
        },
        {
          heading: '2. Données collectées',
          list: [
            'Formulaire de contact : nom, e-mail, objet, message.',
            'Compte démo : identifiants de test uniquement (environnement DEBUG).',
            'Logs techniques : adresse IP, horodatage (durée limitée).',
          ],
        },
        {
          heading: '3. Finalités',
          list: [
            'Répondre aux demandes de contact et de recrutement.',
            'Assurer le fonctionnement et la sécurité de la plateforme démo.',
            'Aucune revente de données à des tiers.',
          ],
        },
        {
          heading: '4. Vos droits (Suisse)',
          body: `Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à ${c.email}. Délai de réponse : 30 jours ouvrables.`,
        },
        {
          heading: '5. Cookies',
          body:
            'Cookie de session Django (CSRF) et préférence de langue (localStorage). Pas de traceurs publicitaires tiers.',
        },
      ],
    },
    de: {
      title: 'Datenschutzerklärung',
      updated: 'Letzte Aktualisierung: Juli 2026 — Grundsätze nDSG (CH)',
      sections: [
        {
          heading: '1. Verantwortliche Stelle',
          body: `${c.legalName} / ${c.company} — ${c.responsible}\n${c.email}`,
        },
        {
          heading: '2. Erhobene Daten',
          list: [
            'Kontaktformular: Name, E-Mail, Betreff, Nachricht.',
            'Demo-Konto: Test-Zugangsdaten (nur DEBUG).',
            'Technische Logs: IP, Zeitstempel.',
          ],
        },
        {
          heading: '3. Ihre Rechte',
          body: `Auskunft, Berichtigung oder Löschung unter ${c.email}.`,
        },
      ],
    },
  },
  impressum: {
    de: {
      title: 'Impressum',
      updated: 'Pflichtangaben für die Schweiz — Juli 2026',
      sections: [
        {
          heading: 'Anbieter & Kontakt',
          impressumCard: true,
        },
        {
          heading: 'Haftungsausschluss',
          body:
            'Diese Plattform dient als technische Demonstration (Portfolio). Keine Gewähr für Vollständigkeit der Energiedaten. Keine verbindlichen Beratungsleistungen.',
        },
      ],
    },
    fr: {
      title: 'Impressum (équivalent CH)',
      updated: 'Informations obligatoires — juillet 2026',
      sections: [
        {
          heading: 'Prestataire',
          body: `${c.company} / ${c.legalName}\n${c.addressLine}, ${c.country}\nUID : ${c.uid}\n\nContact : ${c.email}`,
        },
      ],
    },
  },
};
