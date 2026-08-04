import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Porté depuis templates/pages/admin_login.html
 * Note: pas de route Django dédiée — template vitrine uniquement.
 */
export default function AdminLoginPage() {
  useEffect(() => {
    document.body.className = 'login-body';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="login-container">
      <div className="brand-section">
        <Link to="/" className="brand-link">
          <div className="brand-icon-wrapper">
            <span className="material-symbols-outlined brand-icon">energy_savings_leaf</span>
          </div>
          <h1 className="brand-title">RenovateEnergy</h1>
        </Link>
      </div>

      <div className="auth-card">
        <span className="admin-badge">Portail Administrateur</span>
        <h2 className="auth-header-title">Accès Sécurisé</h2>

        <form id="adminLoginForm" className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-field">
            <label className="form-label">Identifiant Admin</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">admin_panel_settings</span>
              <input type="text" className="auth-input" placeholder="Nom d'utilisateur" required />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Mot de passe</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input type="password" className="auth-input" placeholder="••••••••" required />
            </div>
          </div>
          <div className="submit-section">
            <Link to="/admin_page" className="btn-submit">Entrer dans le Dashboard</Link>
          </div>
          <p className="form-footer">Accès restreint aux employés autorisés.</p>
        </form>
      </div>
    </div>
  );
}
