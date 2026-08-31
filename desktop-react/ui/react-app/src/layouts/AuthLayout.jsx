import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import BrandTitle from '../components/ui/BrandTitle';

/**
 * Layout spécifique pour l'authentification (split screen)
 */
export default function AuthLayout({ children }) {
  return (
    <div className="login-container">
      <div className="brand-section">
        <Link to="/" className="brand-link">
          <div className="brand-icon-wrapper">
            <span className="material-symbols-outlined brand-icon">energy_savings_leaf</span>
          </div>
          <BrandTitle as="h1" className="brand-title" />
        </Link>
      </div>

      <div className="auth-card">
        <button type="button" onClick={() => window.history.back()} className="close-btn">
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
      <ThemeToggle variant="auth" />
    </div>
  );
}
