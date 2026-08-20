import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ensureCsrfCookie } from '../utils/csrf';
import { fetchDashboardData } from '../api/dashboardApi';
import LocaleSwitcher from '../components/LocaleSwitcher';
import SiteFooter from '../components/SiteFooter';
import { useLocale } from '../i18n/LocaleContext';
import { useSwissVitrine } from '../hooks/useSwissVitrine';
import SwissHomeBento from '../components/SwissHomeBento';

/**
 * Porté fidèle depuis templates/pages/home.html d'origine
 */
export default function HomePage() {
  const { t } = useLocale();
  useSwissVitrine('home-body');

  useEffect(() => {
    document.body.removeAttribute('data-page');
    document.title = 'RenovateEnergy - Rénovez votre maison, illuminez votre avenir';

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
          {/* Hero Section Originale */}
          <div className="home-hero">
            <img
              alt="Illustration d'une maison moderne et écologique"
              className="home-hero-bg"
              src="/static/assets/imageHome.png"
            />
            <div className="home-hero-overlay"></div>
            <div className="home-hero-content">
              <div className="home-hero-inner">
                <h1 className="home-hero-title">Rénovez votre maison, illuminez votre avenir.</h1>
                <p className="home-hero-description">
                  Analysez, planifiez et financez vos rénovations énergétiques avec notre plateforme
                  intuitive et performante.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/dashboard" className="home-hero-cta">Lancer l&apos;Analyse</Link>
                  <Link to="/cv" className="home-btn home-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', fontWeight: 600, borderRadius: '0.75rem' }}>
                    <span className="material-symbols-outlined">badge</span> Profil Architecte
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Key Features Cards */}
          <div className="home-features">
            <div className="home-features-grid">
              <Link className="home-feature-card" to="/dashboard">
                <div className="home-feature-bg home-feature-bg-lavender"></div>
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-lavender">
                    <span className="material-symbols-outlined home-feature-icon">apartment</span>
                  </div>
                  <h3 className="home-feature-title">Bâtiments Rénovés</h3>
                  <p className="home-feature-description">
                    Visualisez les projets de rénovation terminés et l&apos;historique complet.
                  </p>
                </div>
              </Link>
              <Link className="home-feature-card" to="/dashboard">
                <div className="home-feature-bg home-feature-bg-pink"></div>
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-pink">
                    <span className="material-symbols-outlined home-feature-icon">construction</span>
                  </div>
                  <h3 className="home-feature-title">Types de Rénovation</h3>
                  <p className="home-feature-description">
                    Explorez les différentes catégories de travaux et isolations réalisés.
                  </p>
                </div>
              </Link>
              <Link className="home-feature-card" to="/dashboard">
                <div className="home-feature-bg home-feature-bg-blue"></div>
                <div className="home-feature-content">
                  <div className="home-feature-icon-wrapper home-feature-icon-blue">
                    <span className="material-symbols-outlined home-feature-icon">bar_chart_4_bars</span>
                  </div>
                  <h3 className="home-feature-title">Classe DPE</h3>
                  <p className="home-feature-description">
                    Analysez la performance énergétique et les gains GES des bâtiments.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Mission Section */}
          <div className="home-mission">
            <img
              alt="Maison écologique en pleine nature"
              className="home-mission-bg"
              src="/static/assets/imageGreen.png"
            />
            <div className="home-mission-overlay"></div>
            <div className="home-mission-content">
              <div className="home-mission-inner">
                <h2 className="home-mission-title">Notre Mission : Rénover pour Sauvegarder</h2>
                <div className="home-mission-items">
                  <div className="home-mission-item">
                    <div className="home-mission-icon-wrapper">
                      <span className="material-symbols-outlined home-mission-icon">eco</span>
                    </div>
                    <div className="home-mission-item-text">
                      <h4 className="home-mission-item-title">Impact Écologique</h4>
                      <p className="home-mission-item-description">
                        Réduire l&apos;empreinte carbone grâce à des rénovations thermiques durables et ciblées.
                      </p>
                    </div>
                  </div>
                  <div className="home-mission-item">
                    <div className="home-mission-icon-wrapper">
                      <span className="material-symbols-outlined home-mission-icon">savings</span>
                    </div>
                    <div className="home-mission-item-text">
                      <h4 className="home-mission-item-title">Économies Financières</h4>
                      <p className="home-mission-item-description">
                        Optimiser votre budget énergétique et bénéficier des aides disponibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section with Panels Image */}
          <div className="home-about">
            <div className="home-about-grid">
              <div className="home-about-text-col">
                <h2 className="home-about-title">Une Expertise Énergétique Reconnue</h2>
                <p className="home-about-description">
                  RenovateEnergy combine l&apos;intelligence des données DPE et les technologies modernes
                  pour accompagner particuliers et professionnels dans la transition écologique.
                </p>
                <div className="home-about-features">
                  <div className="home-about-feature">
                    <div className="home-about-icon-wrapper">
                      <span className="material-symbols-outlined home-about-icon">analytics</span>
                    </div>
                    <div>
                      <h4 className="home-about-feature-title">Analyses Prédictives</h4>
                      <p className="home-about-feature-text">Algorithmes d&apos;estimation thermique fiables.</p>
                    </div>
                  </div>
                  <div className="home-about-feature">
                    <div className="home-about-icon-wrapper">
                      <span className="material-symbols-outlined home-about-icon">shield</span>
                    </div>
                    <div>
                      <h4 className="home-about-feature-title">Données Certifiées</h4>
                      <p className="home-about-feature-text">Conformité aux normes réglementaires en vigueur.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-about-image-col">
                <div className="home-about-image-container">
                  <img
                    alt="Panneaux solaires et transition énergétique"
                    className="home-about-image"
                    src="/static/assets/ImagePanels.png"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="home-team">
            <div className="home-team-header">
              <h2 className="home-team-title">Notre Équipe</h2>
              <p className="home-team-subtitle">Les experts derrière la plateforme RenovateEnergy.</p>
            </div>
            <div className="home-team-grid">
              {/* Tayier NIMAIT */}
              <div className="home-team-card">
                <div className="home-team-avatar-container">
                  <div className="home-team-avatar-inset">
                    <img
                      alt="Portrait de Tayier NIMAIT"
                      className="home-team-avatar"
                      src="/static/assets/tayier_photo_pro.jpg"
                    />
                  </div>
                </div>
                <h3 className="home-team-name">Tayier NIMAIT</h3>
                <p className="home-team-role">ARCHITECTE IA &amp; SYSTÈMES</p>
                <div className="home-team-socials">
                  <a className="home-team-social-link" href="mailto:ntparis9@gmail.com" title="Email">
                    <span className="material-symbols-outlined home-team-social-icon">mail</span>
                  </a>
                  <a className="home-team-social-link" href="https://github.com/ta-dev-ai/Django-enterprise-platform" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <span className="material-symbols-outlined home-team-social-icon">code</span>
                  </a>
                  <a className="home-team-social-link" href="https://linkedin.com/in/tayier-nimait" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <span className="material-symbols-outlined home-team-social-icon">share</span>
                  </a>
                </div>
                <Link to="/cv" className="home-team-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined">visibility</span> Voir mon CV
                </Link>
              </div>

              {/* Thomas Dubois */}
              <div className="home-team-card">
                <div className="home-team-avatar-container">
                  <div className="home-team-avatar-inset">
                    <img
                      alt="Portrait de Thomas Dubois"
                      className="home-team-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHGY6KK6KaQixhBTaf2ZjRgSvxxZTCvnX8DnNmWQD5wLPCz-Lh0LzPLAq8IiObuVBZs_u5YQ36PeayS8-x1laAGjGnTPj7r60dmMYggNilGH2iLg0KNJLRS6tr3ehLrc4C1QoP0r6sbpup5nz7jHnGcdskCoJNFZRONpknCBoG2oGxEO9o5SenNngZWWcRbBWWZ2l8dllP0eyBJMv9egAKTuDJkNf-BsGFxL_oEdznCwRe5S2hG5N6m808Q1QEWV8jBFvsWR9Aeevx"
                    />
                  </div>
                </div>
                <h3 className="home-team-name">Thomas Dubois</h3>
                <p className="home-team-role">CHEF DE PROJET</p>
                <div className="home-team-socials">
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
                </div>
                <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
              </div>

              {/* Julien Lefevre */}
              <div className="home-team-card">
                <div className="home-team-avatar-container">
                  <div className="home-team-avatar-inset">
                    <img
                      alt="Portrait de Julien Lefevre"
                      className="home-team-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3X2zfVhvUreC0aVPWhPjeNypHiCm6-XR7W_7ZGDgWJRA5_V0j41ilZP-M8szuewrmRwTL3It2Q0raVdN7uy44Ad27OLKvQn2vrteT9INGKl_2Q_q5jQ60jtFNVfGtdrC5hzcN9pZxcV1DPvqb1B09t_8ekM2dZ0LEq-I8QFEggFmJmqSsw651Gl4W9qLvsY2N09LF62wgln8qmams0Q3UK6dc4vTyZ9XJrkPV_84CSnAyTNHFQszlk380I-JYDRXLmTxrhp1o4HJc"
                    />
                  </div>
                </div>
                <h3 className="home-team-name">Julien Lefevre</h3>
                <p className="home-team-role">DEV BACK-END</p>
                <div className="home-team-socials">
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
                </div>
                <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
              </div>

              {/* Nicolas Moreau */}
              <div className="home-team-card">
                <div className="home-team-avatar-container">
                  <div className="home-team-avatar-inset">
                    <img
                      alt="Portrait de Nicolas Moreau"
                      className="home-team-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLlAPnAPsEMoGDxPRDN4tNkfo1WWJyoOqTIt-fRQK6uojCurC6P7gGPRTk7TKnJYdW-8VlfZZmCtkB7GpapOO-DYYLgsMb6gND5qrnP4Tkm8Xv4CYFL6NtWfGCJg9Tlsy_fJJbhGwKFKZ2tEgP9o3XFD4dynJjG7S1xK3nxQJnBrWvbhCLTn9JFiSYRj2jQ4YRwZhMjWsG2eIZJPvp4x_If8ISlhOLKz8XZexbocvAbUsK0EmOHWcx8bCy7ydT_WtM88mMCokvgvyZ"
                    />
                  </div>
                </div>
                <h3 className="home-team-name">Nicolas Moreau</h3>
                <p className="home-team-role">CONCEPTEUR LOGICIEL</p>
                <div className="home-team-socials">
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">mail</span></a>
                  <a className="home-team-social-link" href="#"><span className="material-symbols-outlined home-team-social-icon">call</span></a>
                </div>
                <button className="home-team-btn"><span className="material-symbols-outlined">download</span> CV</button>
              </div>
            </div>
          </div>

          {/* Section Portfolio ESN Bento */}
          <div style={{ marginTop: '4rem' }}>
            <SwissHomeBento />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
