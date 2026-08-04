import { Link } from 'react-router-dom';
import { SITE_CONTACT } from '../constants/siteContact';
import { useLocale } from '../i18n/LocaleContext';

export default function SiteFooter({ className = 'home-footer', style }) {
  const { t } = useLocale();

  return (
    <footer className={className} style={style}>
      <div className="home-footer-container">
        <div
          className="home-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}
        >
          <div className="home-footer-brand">
            <Link to="/" className="contact-brand">
              <div className="contact-logo">
                <span className="material-symbols-outlined">energy_savings_leaf</span>
              </div>
              <h2 className="contact-brand-title">{SITE_CONTACT.company}</h2>
            </Link>
            <p style={{ marginTop: '1rem', color: '#5c6b73', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              {t('footer.tagline')}
            </p>
            <p style={{ marginTop: '0.75rem', color: '#5c6b73', fontSize: '0.875rem' }}>
              <a href={`mailto:${SITE_CONTACT.email}`} style={{ color: '#0d5c63', textDecoration: 'none' }}>
                {SITE_CONTACT.email}
              </a>
              <br />
              {SITE_CONTACT.addressLine}, {SITE_CONTACT.country}
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>{t('footer.navigation')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('nav.home')}</Link></li>
              <li><Link to="/about" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('nav.about')}</Link></li>
              <li><Link to="/contact" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('nav.contact')}</Link></li>
              <li><Link to="/cv" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('nav.cv')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>{t('footer.legal')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/mentions-legales" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('footer.mentions')}</Link></li>
              <li><Link to="/confidentialite" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('footer.privacy')}</Link></li>
              <li><Link to="/impressum" style={{ textDecoration: 'none', color: '#5c6b73' }}>{t('footer.impressum')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>{t('footer.recruiting')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href={`mailto:${SITE_CONTACT.recruiterEmail}`} style={{ textDecoration: 'none', color: '#5c6b73' }}>
                  {t('footer.recruiterContact')}
                </a>
              </li>
              <li>
                <a href={SITE_CONTACT.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#5c6b73' }}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SITE_CONTACT.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#5c6b73' }}>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e4e8e6',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.875rem',
          }}
        >
          © 2026 {SITE_CONTACT.company}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
