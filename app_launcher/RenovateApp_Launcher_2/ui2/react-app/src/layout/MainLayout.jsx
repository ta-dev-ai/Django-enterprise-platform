import { Link, Outlet, useLocation } from 'react-router-dom';
import LocaleSwitcher from './LocaleSwitcher';
import SiteFooter from './SiteFooter';
import { useLocale } from '../i18n/LocaleContext';
import { useSwissVitrine } from '../hooks/useSwissVitrine';

function navClass(path, current) {
  return current === path ? 'active' : '';
}

export default function MainLayout() {
  const { pathname } = useLocation();
  const { t } = useLocale();
  useSwissVitrine('contact-body');

  return (
    <>
      <header className="contact-header">
        <div className="contact-header-inner">
          <Link to="/" className="contact-brand">
            <div className="contact-logo">
              <span className="material-symbols-outlined">energy_savings_leaf</span>
            </div>
            <h2 className="contact-brand-title">RenovateEnergy</h2>
          </Link>

          <nav className="contact-nav">
            <Link to="/" className={navClass('/', pathname)}>
              {t('nav.home')}
            </Link>
            <Link to="/about" className={navClass('/about', pathname)}>
              {t('nav.about')}
            </Link>
            <Link to="/contact" className={navClass('/contact', pathname)}>
              {t('nav.contact')}
            </Link>
            <Link to="/dashboard">{t('nav.dashboard')}</Link>
          </nav>

          <div
            className="contact-actions"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <LocaleSwitcher />
            <Link to="/login" className="contact-btn-secondary">
              {t('nav.login')}
            </Link>
            <Link to="/login" className="contact-btn-primary">
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

      <SiteFooter style={{ marginTop: '5rem' }} />
    </>
  );
}
