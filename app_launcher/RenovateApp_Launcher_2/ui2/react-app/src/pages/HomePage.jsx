import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ensureCsrfCookie } from '../utils/csrf';
import { fetchDashboardData } from '../api/dashboardApi';
import LocaleSwitcher from '../components/LocaleSwitcher';
import SiteFooter from '../components/SiteFooter';
import { useLocale } from '../i18n/LocaleContext';
import { useSwissVitrine } from '../hooks/useSwissVitrine';

/**
 * Porté depuis templates/pages/home.html
 */
export default function HomePage() {
  const { t } = useLocale();
  useSwissVitrine('home-body');

  useEffect(() => {
    document.body.removeAttribute('data-page');

    const prefetch = async () => {
      try {
        await fetchDashboardData();
      } catch (e) {
        console.warn('[Home] Background fetch failed:', e);
      }
    };
    prefetch();
    ensureCsrfCookie();

    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div>
      <header className="home-header">
        <div className="home-header-container">
          <nav className="home-nav">
            <Link to="/" className="home-brand">
              <div className="contact-logo">
                <span className="material-symbols-outlined">energy_savings_leaf</span>
              </div>
              <h2 className="contact-brand-title">RenovateEnergy</h2>
            </Link>
            <div className="home-nav-links">
              <Link className="home-nav-link" to="/">
                {t('nav.home')}
              </Link>
              <Link className="home-nav-link" to="/about">
                {t('nav.about')}
              </Link>
              <Link className="home-nav-link" to="/contact">
                {t('nav.contact')}
              </Link>
              <Link className="home-nav-link" to="/dashboard">
                {t('nav.dashboard')}
              </Link>
            </div>
            <div
              className="home-nav-actions"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <LocaleSwitcher />
              <Link to="/login" className="home-btn home-btn-secondary">
                {t('nav.login')}
              </Link>
              <Link to="/login" className="home-btn home-btn-primary">
                {t('nav.signup')}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="home-page">
          <div className="home-hero">
            <img
              alt="Maison économe en énergie"
              className="home-hero-bg"
              src="/static/assets/imageHome.png"
            />
            <div className="home-hero-overlay" />
            <div className="home-hero-content">
              <div className="home-hero-inner">
                <h1 className="home-hero-title">Rénovez votre maison, illuminez votre avenir.</h1>
                <p className="home-hero-description">
                  Analysez, planifiez et financez vos rénovations énergétiques avec notre plateforme
                  intuitive.
                </p>
                <Link to="/dashboard" className="home-hero-cta">
                  Lancer l&apos;Analyse
                </Link>
              </div>
            </div>
          </div>

          <div className="home-features">
            <div className="home-features-grid">
              <Link className="home-feature-card" to="/batiment">
                <div className="home-feature-bg home-feature-bg-lavender" />
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-lavender">
                    <span className="material-symbols-outlined home-feature-icon">apartment</span>
                  </div>
                  <h3 className="home-feature-title">Bâtiments Rénovés</h3>
                  <p className="home-feature-description">
                    Visualisez les projets de rénovation terminés.
                  </p>
                </div>
              </Link>
              <Link className="home-feature-card" to="/types">
                <div className="home-feature-bg home-feature-bg-pink" />
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-pink">
                    <span className="material-symbols-outlined home-feature-icon">
                      construction
                    </span>
                  </div>
                  <h3 className="home-feature-title">Types de Rénovation</h3>
                  <p className="home-feature-description">
                    Explorez les différentes catégories de travaux réalisés.
                  </p>
                </div>
              </Link>
              <Link className="home-feature-card" to="/dpe">
                <div className="home-feature-bg home-feature-bg-blue" />
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-blue">
                    <span className="material-symbols-outlined home-feature-icon">
                      bar_chart_4_bars
                    </span>
                  </div>
                  <h3 className="home-feature-title">Classe DPE</h3>
                  <p className="home-feature-description">
                    Analysez la performance énergétique des bâtiments.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="home-mission">
            <img
              alt="Motif nature"
              className="home-mission-bg"
              src="/static/assets/imageAbout.png"
            />
            <div className="home-mission-content">
              <h2 className="home-mission-title">Notre Objectif, Notre Mission</h2>
              <div className="home-mission-items">
                <div className="home-mission-item">
                  <div className="home-mission-icon-wrapper">
                    <span className="material-symbols-outlined home-mission-icon">lightbulb</span>
                  </div>
                  <div>
                    <h4 className="home-mission-item-title">Objectif</h4>
                    <p className="home-mission-item-description">
                      Notre objectif: offrir une plateforme claire et intuitive pour visualiser
                      l&apos;état de rénovation énergétique des bâtiments parisiens.
                    </p>
                  </div>
                </div>
                <div className="home-mission-item">
                  <div className="home-mission-icon-wrapper">
                    <span className="material-symbols-outlined home-mission-icon">
                      data_exploration
                    </span>
                  </div>
                  <div>
                    <h4 className="home-mission-item-title">Axes de Présentation</h4>
                    <p className="home-mission-item-description">
                      Notre présentation de données s&apos;articule autour de 3 axes essentiels:
                      suivi de rénovation des bâtiments analysés, des types de travaux réalisés,
                      visualiser les classes énergétiques DPE.
                    </p>
                  </div>
                </div>
                <div className="home-mission-item">
                  <div className="home-mission-icon-wrapper">
                    <span className="material-symbols-outlined home-mission-icon">flag</span>
                  </div>
                  <div>
                    <h4 className="home-mission-item-title">Mission</h4>
                    <p className="home-mission-item-description">
                      Notre mission: rendre ces données accessible et intelligible pour les
                      professionnels, collectivités et décideurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-about">
            <img
              alt="Panneaux solaires"
              className="home-about-bg"
              src="/static/assets/imagePanels.png"
            />
            <div className="home-about-content">
              <h2 className="home-about-title">À Propos de Nous</h2>
              <p className="home-about-description">
                Investir dans la rénovation énergétique, c&apos;est bien plus qu&apos;une simple
                mise à niveau. C&apos;est un choix intelligent pour votre portefeuille, votre
                confort et la planète.
              </p>
              <div className="home-about-features">
                <div className="home-about-feature">
                  <div className="home-about-icon-wrapper home-about-icon-wrapper-pink">
                    <span className="material-symbols-outlined text-dark-text">savings</span>
                  </div>
                  <div>
                    <h4 className="home-about-feature-title">Économies durables</h4>
                    <p className="home-about-feature-text">
                      Réduisez vos factures d&apos;énergie jusqu&apos;à 70% et augmentez la valeur
                      de votre bien.
                    </p>
                  </div>
                </div>
                <div className="home-about-feature">
                  <div className="home-about-icon-wrapper home-about-icon-wrapper-blue">
                    <span className="material-symbols-outlined text-dark-text">home_health</span>
                  </div>
                  <div>
                    <h4 className="home-about-feature-title">Confort amélioré</h4>
                    <p className="home-about-feature-text">
                      Profitez d&apos;une température idéale toute l&apos;année et d&apos;un air
                      intérieur plus sain.
                    </p>
                  </div>
                </div>
                <div className="home-about-feature">
                  <div className="home-about-icon-wrapper home-about-icon-wrapper-lavender">
                    <span className="material-symbols-outlined text-dark-text">eco</span>
                  </div>
                  <div>
                    <h4 className="home-about-feature-title">Geste pour la planète</h4>
                    <p className="home-about-feature-text">
                      Diminuez votre empreinte carbone et participez à la transition énergétique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-about-image-container">
              <img alt="Feuillage vert" src="/static/assets/imageGreen.png" />
              <div className="home-about-overlay" />
            </div>
          </div>

          <div className="home-team">
            <div className="home-team-header">
              <h2 className="home-team-title">Notre Équipe</h2>
              <p className="home-team-description">
                Des experts passionnés dédiés à la réussite de votre transition énergétique.
              </p>
            </div>
            <div className="home-team-grid">
              <TeamCard name="Sophie Martin" role="RESPONSABLE OA" />
              <TeamCard name="Thomas Dubois" role="CHEF DE PROJET" />
              <TeamCard
                name="Tayier NIMAIT"
                role="ARCHITECTE IA & SYSTEMES"
                cvLink="/cv"
                email="mailto:ntparis9@gmail.com"
                github="https://github.com/ta-dev-ai/Django-enterprise-platform"
              />
              <TeamCard name="Nicolas Moreau" role="CONCEPTEUR LOGICIEL" />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function TeamCard({ name, role, cvLink, email, github }) {
  return (
    <div className="home-team-card">
      <div className="home-team-avatar-container">
        <div className="home-team-avatar-inset">
          <img alt={name} className="home-team-avatar" src={`https://i.pravatar.cc/300?u=${encodeURIComponent(name)}`} />
        </div>
      </div>
      <h3 className="home-team-name">{name}</h3>
      <p className="home-team-role">{role}</p>
      <div className="home-team-socials">
        {email && (
          <a className="home-team-social-link" href={email}>
            <span className="material-symbols-outlined home-team-social-icon">mail</span>
          </a>
        )}
        {github && (
          <a className="home-team-social-link" href={github} target="_blank" rel="noreferrer">
            <span className="material-symbols-outlined home-team-social-icon">code</span>
          </a>
        )}
      </div>
      {cvLink ? (
        <Link to={cvLink} className="home-team-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <span className="material-symbols-outlined">visibility</span> Voir mon CV
        </Link>
      ) : (
        <button type="button" className="home-team-btn">
          <span className="material-symbols-outlined">download</span> CV
        </button>
      )}
    </div>
  );
}
