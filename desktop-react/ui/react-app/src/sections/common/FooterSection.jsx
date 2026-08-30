import { Link } from 'react-router-dom';
import { SITE_CONTACT } from '../../constants/siteContact';

export default function SiteFooter({ className = 'home-footer', style }) {
  return (
    <footer className={className} style={style}>
      <div className="home-footer-container">
        <div className="home-footer-5col-grid">
          {/* Col 1: Brand */}
          <div className="footer-col-brand">
            <Link to="/" className="contact-brand">
              <div className="contact-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 className="contact-brand-title">Renovate<span className="brand-accent">Energy</span></h2>
            </Link>
            <p className="footer-brand-text">
              Plateforme de rénovation énergétique intelligente pour un avenir durable. Analysez. Rénovez. Économisez.
            </p>
            <div className="footer-social-links">
              <a href={SITE_CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="LinkedIn">in</a>
              <a href="#" className="footer-social-icon" title="X/Twitter">𝕏</a>
              <a href="#" className="footer-social-icon" title="Instagram">📷</a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-col-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/dashboard">Solutions</Link></li>
              <li><Link to="/dashboard">Ressources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="footer-col">
            <h4 className="footer-col-title">Solutions</h4>
            <ul className="footer-col-links">
              <li><Link to="/dashboard">Bâtiments Rénovés</Link></li>
              <li><Link to="/dashboard">Types de Rénovation</Link></li>
              <li><Link to="/dashboard">Classe DPE</Link></li>
              <li><Link to="/dashboard">Aides &amp; Financements</Link></li>
            </ul>
          </div>

          {/* Col 4: Ressources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ressources</h4>
            <ul className="footer-col-links">
              <li><Link to="/about">Blog</Link></li>
              <li><Link to="/dashboard">Guides</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
              <li><Link to="/cv">Études de cas</Link></li>
            </ul>
          </div>

          {/* Col 5: Légal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Légal</h4>
            <ul className="footer-col-links">
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/confidentialite">Confidentialité</Link></li>
              <li><Link to="/confidentialite">CGU</Link></li>
              <li><Link to="/impressum">Cookies</Link></li>
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
