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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H11L10 22L20 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1"/>
                </svg>
              </div>
              <h2 className="contact-brand-title">Renovate<span className="brand-accent">Energy</span></h2>
            </Link>

            <div className="home-nav-links">
              <Link className="home-nav-link" to="/">Accueil</Link>
              <Link className="home-nav-link" to="/about">À propos</Link>
              <Link className="home-nav-link" to="/dashboard/types">Solutions <span className="dropdown-arrow">▾</span></Link>
              <Link className="home-nav-link" to="/dashboard">Ressources</Link>
              <Link className="home-nav-link" to="/contact">Contact</Link>
              <Link className="home-nav-link" to="/dashboard">Mon espace</Link>
            </div>

            <div className="home-nav-actions">
              <div className="lang-pill">
                <span>FR</span> <span className="dropdown-arrow">▾</span>
              </div>
              <Link to="/login" className="btn-connexion">Connexion</Link>
              <Link to="/login" className="btn-inscription">Inscription</Link>
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
