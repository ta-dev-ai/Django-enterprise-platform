import { Link } from 'react-router-dom';
import LocaleSwitcher from '../components/ui/LocaleSwitcher';
import ThemeToggle from '../components/ui/ThemeToggle';
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20V10.5z"/>
                  <path d="M12 9a4 4 0 0 1 4 4c0 2.5-4 6.5-4 6.5s-4-4-4-6.5a4 4 0 0 1 4-4z" fill="rgba(255,255,255,0.25)"/>
                </svg>
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
                {t('nav.mySpace')}
              </Link>
            </div>
            <div
              className="home-nav-actions"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <LocaleSwitcher />
              <ThemeToggle variant="inline" />
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
