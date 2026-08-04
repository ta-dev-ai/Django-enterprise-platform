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
    document.title = 'RenovateEnergy - Rénovez votre maison, illuminez votre avenir';

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
