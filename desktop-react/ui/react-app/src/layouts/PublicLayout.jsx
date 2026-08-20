import { Link } from 'react-router-dom';
import LocaleSwitcher from '../components/ui/LocaleSwitcher';
import SiteFooter from '../sections/common/FooterSection';
import { useLocale } from '../i18n/LocaleContext';

/**
 * Layout Public (Vitrine) — Organise Header + Navigation + Zone Enfant + Footer
 */
export default function PublicLayout({ children }) {
  const { t } = useLocale();

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
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
