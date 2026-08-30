import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
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
          <div className="home-hero-actions">
            <Link to="/dashboard" className="home-hero-cta">
              Lancer l&apos;Analyse
            </Link>
            <Link to="/cv" className="home-btn home-btn-secondary home-hero-secondary">
              <span className="material-symbols-outlined" aria-hidden="true">
                badge
              </span>
              Profil Architecte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
