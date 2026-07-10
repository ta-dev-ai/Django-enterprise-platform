import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONTACT } from '../constants/siteContact';
import { useLocale } from '../i18n/LocaleContext';
import { legalContent } from '../i18n/legalContent';
import LocaleSwitcher from './LocaleSwitcher';
import SiteFooter from './SiteFooter';

function ContactCard({ full = false }) {
  const c = SITE_CONTACT;
  return (
    <dl className="legal-contact-card">
      {full && (
        <>
          <dt>Firma / Projekt</dt>
          <dd>{c.company}</dd>
          <dt>Rechtlicher Name</dt>
          <dd>{c.legalName}</dd>
          <dt>Adresse</dt>
          <dd>
            {c.addressLine}, {c.country}
          </dd>
          <dt>UID / MWST</dt>
          <dd>
            {c.uid} <em>(Platzhalter)</em>
          </dd>
        </>
      )}
      <dt>E-mail</dt>
      <dd>
        <a href={`mailto:${c.email}`}>{c.email}</a>
      </dd>
      <dt>{full ? 'Recruiting / ESN' : 'Recrutement / ESN'}</dt>
      <dd>
        <a href={`mailto:${c.recruiterEmail}`}>{c.recruiterEmail}</a>
      </dd>
      {full && (
        <>
          <dt>Telefon</dt>
          <dd>{c.phone}</dd>
          <dt>Verantwortlich</dt>
          <dd>{c.responsible}</dd>
        </>
      )}
    </dl>
  );
}

function LegalSection({ section }) {
  if (section.contact) {
    return (
      <section>
        <h2>{section.heading}</h2>
        <ContactCard />
      </section>
    );
  }
  if (section.contactFull) {
    return (
      <section>
        <h2>{section.heading}</h2>
        <ContactCard full />
      </section>
    );
  }
  if (section.impressumCard) {
    return (
      <section>
        <h2>{section.heading}</h2>
        <ContactCard full />
      </section>
    );
  }
  return (
    <section>
      <h2>{section.heading}</h2>
      {section.body && (
        <p style={{ whiteSpace: 'pre-line' }}>
          {section.body}
          {section.link && (
            <>
              {' '}
              <a href={section.link.href} target="_blank" rel="noopener noreferrer">
                {section.link.label}
              </a>
              .
            </>
          )}
        </p>
      )}
      {section.list && (
        <ul>
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function LegalPageShell({ pageKey, defaultLocale }) {
  const { locale, t } = useLocale();
  const contentLocale = locale === 'de' || locale === 'fr' ? locale : defaultLocale;
  const page = legalContent[pageKey]?.[contentLocale] || legalContent[pageKey]?.fr;

  useEffect(() => {
    document.body.className = 'contact-body swiss-vitrine';
    return () => {
      document.body.className = '';
    };
  }, []);

  if (!page) return null;

  return (
    <>
      <header className="contact-header">
        <div className="contact-header-inner">
          <Link to="/" className="contact-brand">
            <div className="contact-logo">
              <span className="material-symbols-outlined">energy_savings_leaf</span>
            </div>
            <h2 className="contact-brand-title">{SITE_CONTACT.company}</h2>
          </Link>
          <nav className="contact-nav">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
          </nav>
          <div className="contact-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LocaleSwitcher />
            <Link to="/login" className="contact-btn-secondary">
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </header>

      <main className="legal-main">
        <h1>{page.title}</h1>
        <p className="legal-updated">{page.updated}</p>
        {page.sections.map((section) => (
          <LegalSection key={section.heading} section={section} />
        ))}
      </main>

      <SiteFooter style={{ marginTop: '5rem' }} />
    </>
  );
}
