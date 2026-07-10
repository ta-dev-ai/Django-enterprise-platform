import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function navClass(path, current) {
  return current === path ? 'active' : '';
}

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.className = 'contact-body';
    document.body.removeAttribute('data-page');
    return () => {
      document.body.className = '';
    };
  }, []);

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
            <Link to="/" className={navClass('/', pathname)}>Accueil</Link>
            <Link to="/about" className={navClass('/about', pathname)}>À propos</Link>
            <Link to="/contact" className={navClass('/contact', pathname)}>Contact</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <div className="contact-actions">
            <Link to="/login" className="contact-btn-secondary">Connexion</Link>
            <Link to="/login" className="contact-btn-primary">Inscription</Link>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="home-footer" style={{ marginTop: '5rem' }}>
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
                <h2 className="contact-brand-title">RenovateEnergy</h2>
              </Link>
              <p style={{ marginTop: '1rem', color: '#64748b' }}>
                Simplifions ensemble la rénovation énergétique.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/" style={{ textDecoration: 'none', color: '#64748b' }}>Accueil</Link></li>
                <li><Link to="/about" style={{ textDecoration: 'none', color: '#64748b' }}>À propos</Link></li>
                <li><Link to="/contact" style={{ textDecoration: 'none', color: '#64748b' }}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Légal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><a href="#" style={{ textDecoration: 'none', color: '#64748b' }}>Mentions Légales</a></li>
                <li><a href="#" style={{ textDecoration: 'none', color: '#64748b' }}>Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div
            style={{
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px solid #d1d9e6',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.875rem',
            }}
          >
            © 2026 RenovateEnergy. Tous droits réservés.
          </div>
        </div>
      </footer>
    </>
  );
}
