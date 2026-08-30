import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AboutSection from '../sections/home/AboutSection';
import MissionSection from '../sections/home/MissionSection';
import TeamSection from '../sections/home/TeamSection';
import { clearPageBodyClasses, setPageBodyClasses } from '../utils/bodyClass';

/**
 * Page À propos — vitrine dédiée (hero + expertise + mission + équipe)
 */
export default function AboutPage() {
  useEffect(() => {
    setPageBodyClasses('home-body');
    document.title = 'À propos — RenovateEnergy';
    window.scrollTo({ top: 0, behavior: 'auto' });
    return () => {
      clearPageBodyClasses();
    };
  }, []);

  return (
    <PublicLayout>
      <main className="about-main">
        <section className="about-hero">
          <div className="about-hero-overlay" />
          <img
            src="/static/assets/imageAbout.png"
            className="about-hero-img"
            alt="Rénovation énergétique à Paris"
          />
          <div className="about-hero-content">
            <p className="about-hero-eyebrow">À PROPOS DE NOUS</p>
            <h1 className="about-hero-title">Notre engagement pour un Paris durable</h1>
            <p className="about-text">
              Nous aidons les propriétaires et les copropriétés à transformer leurs bâtiments pour un
              avenir plus vert et plus économique.
            </p>
            <Link to="/dashboard" className="about-hero-cta">
              Découvrir la plateforme <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        <section className="about-grid">
          <div className="about-content">
            <h2 className="about-content-title">Qui sommes-nous ?</h2>
            <p className="about-text">
              RenovateEnergy est une initiative dédiée à la rénovation énergétique accélérée dans la
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
            <img src="/static/assets/ImagePanels.png" alt="Transition énergétique — panneaux solaires" />
          </div>
        </section>

        <AboutSection />
        <MissionSection />
        <TeamSection />
      </main>
    </PublicLayout>
  );
}
