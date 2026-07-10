import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Porté depuis templates/pages/404.html
 */
export default function NotFoundPage() {
  useEffect(() => {
    document.body.className = 'error-body';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <header className="error-header">
        <div className="error-header-container">
          <nav className="error-nav">
            <Link className="error-brand" to="/">
              <span className="material-symbols-outlined error-logo-icon">energy_savings_leaf</span>
              <span className="error-brand-text">RenovateEnergy</span>
            </Link>
            <div className="error-nav-links">
              <Link className="error-nav-link" to="/">Accueil</Link>
              <Link className="error-nav-link" to="/about">À propos</Link>
              <Link className="error-nav-link" to="/contact">Contact</Link>
            </div>
            <div className="error-nav-actions">
              <Link to="/login" className="error-btn-secondary">Connexion</Link>
              <Link to="/login" className="error-btn-primary">Inscription</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="error-main">
        <div className="error-content">
          <div className="error-icon-wrapper">
            <span className="material-symbols-outlined error-icon">error</span>
          </div>
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page non trouvée</h2>
          <p className="error-description">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="error-actions">
            <Link to="/" className="error-action-btn error-action-primary">
              <span className="material-symbols-outlined">home</span>
              <span>Retour à l&apos;accueil</span>
            </Link>
            <button type="button" onClick={() => window.history.back()} className="error-action-btn error-action-secondary">
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Page précédente</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
