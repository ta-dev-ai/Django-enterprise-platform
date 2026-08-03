import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ensureCsrfCookie } from '../utils/csrf';
import { fetchDashboardData } from '../api/dashboardApi';
import LocaleSwitcher from '../components/LocaleSwitcher';
import SiteFooter from '../components/SiteFooter';
import { useLocale } from '../i18n/LocaleContext';
import { useSwissVitrine } from '../hooks/useSwissVitrine';
import SwissHomeBento from '../components/SwissHomeBento';

/**
 * Porté depuis templates/pages/home.html
 */
export default function HomePage() {
  const { t } = useLocale();
  useSwissVitrine('home-body');

  useEffect(() => {
    document.body.removeAttribute('data-page');

    const prefetch = async () => {
      try {
        await fetchDashboardData();
      } catch (e) {
        console.warn('[Home] Background fetch failed:', e);
      }
    };
    prefetch();
    ensureCsrfCookie();

    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div>
      <header className="home-header">
        <div className="home-header-container">
          <nav className="home-nav">
            <Link to="/" className="home-brand">
              <div className="contact-logo">
                <span className="material-symbols-outlined">energy_savings_leaf</span>
              </div>
              <h2 className="contact-brand-title">RenovateEnergy</h2>
            </Link>
            <div className="home-nav-links">
              <Link className="home-nav-link" to="/">
                {t('nav.home')}
              </Link>
              <Link className="home-nav-link" to="/about">
                {t('nav.about')}
              </Link>
              <Link className="home-nav-link" to="/contact">
                {t('nav.contact')}
              </Link>
              <Link className="home-nav-link" to="/dashboard">
                {t('nav.dashboard')}
              </Link>
            </div>
            <div
              className="home-nav-actions"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <LocaleSwitcher />
              <Link to="/login" className="home-btn home-btn-secondary">
                {t('nav.login')}
              </Link>
              <Link to="/login" className="home-btn home-btn-primary">
                {t('nav.signup')}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="home-page">
          <SwissHomeBento />


        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TeamCard({ name, role, cvLink, email, github }) {
  return (
    <div className="home-team-card">
      <div className="home-team-avatar-container">
        <div className="home-team-avatar-inset">
          <img alt={name} className="home-team-avatar" src={`https://i.pravatar.cc/300?u=${encodeURIComponent(name)}`} />
        </div>
      </div>
      <h3 className="home-team-name">{name}</h3>
      <p className="home-team-role">{role}</p>
      <div className="home-team-socials">
        {email && (
          <a className="home-team-social-link" href={email}>
            <span className="material-symbols-outlined home-team-social-icon">mail</span>
          </a>
        )}
        {github && (
          <a className="home-team-social-link" href={github} target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined home-team-social-icon">code</span>
          </a>
        )}
      </div>
      {cvLink ? (
        <Link to={cvLink} className="home-team-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <span className="material-symbols-outlined">visibility</span> Voir mon CV
        </Link>
      ) : (
        <button type="button" className="home-team-btn">
          <span className="material-symbols-outlined">download</span> CV
        </button>
      )}
    </div>
  );
}
