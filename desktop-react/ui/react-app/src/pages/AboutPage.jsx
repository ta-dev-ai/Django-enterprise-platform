import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AboutSection from '../sections/home/AboutSection';
import MissionSection from '../sections/home/MissionSection';
import TeamSection from '../sections/home/TeamSection';
import { brandPageTitle } from '../components/ui/BrandTitle';
import { SITE_BRAND } from '../constants/siteBrand';
import { clearPageBodyClasses, setPageBodyClasses } from '../utils/bodyClass';

/**
 * Page À propos — vitrine dédiée (hero + expertise + mission + équipe)
 */
export default function AboutPage() {
  useEffect(() => {
    setPageBodyClasses('home-body about-page');
    document.title = brandPageTitle('À propos');
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => {
      clearPageBodyClasses();
    };
  }, []);

  return (
    <PublicLayout contentClassName="about-page-shell">
      <div className="about-main">
        <section className="about-hero" aria-labelledby="about-hero-title">
          <div className="about-hero-visual">
            <img
              src="/static/assets/imageAbout.png"
              className="about-hero-img"
              alt=""
              aria-hidden="true"
            />
            <div className="about-hero-overlay" />
          </div>
          <div className="about-hero-content">
            <p className="about-hero-eyebrow">À PROPOS DE NOUS</p>
            <h1 id="about-hero-title" className="about-hero-title">
              Notre engagement pour un{' '}
              <span className="about-hero-accent">Paris durable</span>
            </h1>
            <p className="about-hero-text">
              Nous aidons les propriétaires et les copropriétés à transformer leurs bâtiments pour
              un avenir plus vert et plus économique.
            </p>
            <Link to="/dashboard" className="about-hero-cta">
              Découvrir la plateforme <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        <section className="about-grid" aria-labelledby="about-intro-title">
          <div className="about-content">
            <h2 id="about-intro-title" className="about-content-title">
              Qui sommes-nous ?
            </h2>
            <p className="about-text">
              {SITE_BRAND.productName} est un MVP d&apos;analyse et de visualisation de données.
              Le premier cas d&apos;usage porte sur la rénovation énergétique accélérée dans la
              métropole parisienne. Notre plateforme centralise les données DPE, les aides et les
              scénarios de travaux pour simplifier chaque étape de votre projet.
            </p>
            <div className="about-stats-container">
              <div className="about-stat-card">
                <span className="about-stat-value">750k+</span>
                <span className="about-stat-label">Logements analysés</span>
              </div>
              <div className="about-stat-card">
                <span className="about-stat-value">20</span>
                <span className="about-stat-label">Arrondissements</span>
              </div>
            </div>
          </div>
          <div className="about-image-frame">
            <img
              src="/static/assets/ImagePanels.png"
              alt="Éoliennes et panneaux solaires — transition énergétique"
            />
          </div>
        </section>

        <AboutSection hideAnchor />
        <MissionSection />
        <TeamSection />
      </div>
    </PublicLayout>
  );
}
