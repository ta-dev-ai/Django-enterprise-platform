import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ensureCsrfCookie, getCsrfToken } from '../utils/csrf';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../constants/demoAuth';

/**
 * Porté depuis templates/pages/login.html
 */
export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    document.body.className = 'login-body';
    ensureCsrfCookie();
    return () => {
      document.body.className = '';
    };
  }, []);

  const csrf = getCsrfToken();

  const fillDemoLogin = () => {
    setMode('login');
    if (emailRef.current) emailRef.current.value = DEMO_EMAIL;
    if (passwordRef.current) passwordRef.current.value = DEMO_PASSWORD;
  };

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
        <button type="button" onClick={() => window.history.back()} className="close-btn">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="auth-layout">
          <div className="auth-content-left">
            <div className="tab-container">
              <button
                type="button"
                id="loginTab"
                onClick={() => setMode('login')}
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              >
                Connexion
              </button>
              <button
                type="button"
                id="registerTab"
                onClick={() => setMode('register')}
                className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              >
                Créer un compte
              </button>
            </div>

            <div className="demo-access-box">
              <p className="demo-access-title">Accès démo — simple</p>
              <p className="demo-access-hint">
                Email : <strong>{DEMO_EMAIL}</strong>
                <br />
                Mot de passe : <strong>{DEMO_PASSWORD}</strong>
              </p>
              <div className="demo-access-actions">
                <button type="button" className="btn-submit btn-secondary" onClick={fillDemoLogin}>
                  Remplir automatiquement
                </button>
                <form method="post" action="/login/?mode=demo" className="demo-quick-form">
                  <input type="hidden" name="csrfmiddlewaretoken" value={csrf} />
                  <button type="submit" className="btn-submit">
                    Connexion démo (1 clic)
                  </button>
                </form>
              </div>
            </div>

            <form
              id="loginForm"
              className={`auth-form ${mode === 'login' ? '' : 'hidden'}`}
              method="post"
              action="/login/?mode=login"
            >
              <input type="hidden" name="csrfmiddlewaretoken" value={csrf} />
              <p className="instruction-text">
                Vous avez déjà un accès ? Saisissez votre code ici.
              </p>

              <div className="form-field">
                <label className="form-label" htmlFor="login-email">
                  Email
                </label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">mail</span>
                  <input
                    ref={emailRef}
                    id="login-email"
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder={DEMO_EMAIL}
                    defaultValue=""
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="login-password">
                  Mot de passe
                </label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    ref={passwordRef}
                    id="login-password"
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="demo1234"
                    required
                  />
                </div>
              </div>

              <div className="submit-section">
                <button type="submit" className="btn-submit">
                  Se connecter
                </button>
              </div>

              <div className="registration-zone">
                <p className="registration-label">Vous n&apos;avez pas encore de code ?</p>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="btn-submit btn-secondary"
                >
                  Créer un compte
                </button>
              </div>
            </form>

            <form
              id="registerForm"
              className={`auth-form ${mode === 'register' ? '' : 'hidden'}`}
              method="post"
              action="/login/?mode=register"
            >
              <input type="hidden" name="csrfmiddlewaretoken" value={csrf} />

              <div className="form-field">
                <label className="form-label" htmlFor="register-email">
                  Email
                </label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">mail</span>
                  <input
                    id="register-email"
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="register-password1">
                  Mot de passe
                </label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    id="register-password1"
                    className="auth-input"
                    type="password"
                    name="password1"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="register-password2">
                  Confirmer le mot de passe
                </label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">verified_user</span>
                  <input
                    id="register-password2"
                    className="auth-input"
                    type="password"
                    name="password2"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="submit-section">
                <button type="submit" className="btn-submit">
                  Créer un compte
                </button>
              </div>

              <p className="form-footer">
                Déjà membre ?{' '}
                <button type="button" className="link-like" onClick={() => setMode('login')}>
                  Se connecter
                </button>
              </p>
            </form>
          </div>

          <div className="auth-content-right">
            <div id="info-login" className={`guide-content ${mode === 'login' ? '' : 'hidden'}`}>
              <h3>Heureux de vous revoir !</h3>
              <p className="guide-intro">Connectez-vous pour accéder à votre espace :</p>
              <div className="login-illustration">
                <span className="material-symbols-outlined guide-main-icon">verified_user</span>
              </div>
              <p className="guide-text">
                Retrouvez vos simulations sauvegardées, mettez à jour les données de vos bâtiments
                et suivez l&apos;évolution de vos projets en temps réel.
              </p>
            </div>

            <div
              id="info-register"
              className={`guide-content ${mode === 'register' ? '' : 'hidden'}`}
            >
              <h3>Pourquoi créer un compte ?</h3>
              <p className="guide-intro">Rejoignez RenovateEnergy pour bénéficier de :</p>
              <ul className="guide-list">
                <li>
                  <span className="material-symbols-outlined guide-icon">dashboard</span>
                  <span>
                    <strong>Suivi personnalisé :</strong> Retrouvez l&apos;historique complet de
                    votre bâtiment.
                  </span>
                </li>
                <li>
                  <span className="material-symbols-outlined guide-icon">analytics</span>
                  <span>
                    <strong>Simulations précises :</strong> Estimez les coûts et les économies
                    d&apos;énergie.
                  </span>
                </li>
                <li>
                  <span className="material-symbols-outlined guide-icon">lock_person</span>
                  <span>
                    <strong>Espace Sécurisé :</strong> Vos données restent confidentielles.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
