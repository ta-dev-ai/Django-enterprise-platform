import { Link } from 'react-router-dom';
import { SITE_CONTACT } from '../../constants/siteContact';
import BrandTitle from '../../components/ui/BrandTitle';
import { SITE_BRAND } from '../../constants/siteBrand';
import {
  HOME_FOOTER_RESOURCES,
  HOME_FOOTER_SOLUTIONS,
  HOME_NAV_ITEMS,
} from '../../config/homeNavigation';

export default function SiteFooter({ className = 'home-footer', style }) {
  return (
    <footer className={className} style={style}>
      <div className="home-footer-container">
        <div className="home-footer-5col-grid">
          {/* Col 1: Brand */}
          <div className="footer-col-brand">
            <Link to="/" className="contact-brand">
              <div className="contact-logo">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <BrandTitle />
            </Link>
            <p className="footer-brand-text">{SITE_BRAND.footerDescription}</p>
            <div className="footer-social-links">
              <a
                href={`mailto:${SITE_CONTACT.email}`}
                className="footer-social-icon"
                title="Contact"
              >
                @
              </a>
              <a
                href={SITE_CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                title="LinkedIn"
              >
                in
              </a>
              <a href="#" className="footer-social-icon" title="X/Twitter">
                𝕏
              </a>
              <a href="#" className="footer-social-icon" title="Instagram">
                📷
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-col-links">
              {HOME_NAV_ITEMS.filter(
                (item) => item.type !== 'dropdown' && item.id !== 'workspace',
              ).map((item) => {
                if (item.type === 'home') {
                  return (
                    <li key={item.id}>
                      <Link to="/">{item.label}</Link>
                    </li>
                  );
                }
                if (item.type === 'section') {
                  return (
                    <li key={item.id}>
                      <Link to={item.sectionId === 'features' ? '/solutions' : '/about'}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.id}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="footer-col">
            <h4 className="footer-col-title">Solutions</h4>
            <ul className="footer-col-links">
              {HOME_FOOTER_SOLUTIONS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Ressources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ressources</h4>
            <ul className="footer-col-links">
              {HOME_FOOTER_RESOURCES.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Légal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Légal</h4>
            <ul className="footer-col-links">
              <li>
                <Link to="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link to="/confidentialite">Confidentialité</Link>
              </li>
              <li>
                <Link to="/confidentialite">CGU</Link>
              </li>
              <li>
                <Link to="/impressum">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          &copy; 2026 {SITE_CONTACT.company}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
