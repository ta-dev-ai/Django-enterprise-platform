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
          <h1 className="home-hero-title">
            Rénover votre maison,<br />
            illuminez votre avenir.
          </h1>
          <p className="home-hero-description">
            Analysez, planifiez et financez vos rénovations énergétiques avec notre plateforme
            intuitive et performante.
          </p>
          <div className="home-hero-actions">
            <Link to="/dashboard" className="home-hero-cta">
              Lancer l&apos;Analyse
            </Link>
            <Link to="/cv" className="home-hero-secondary-link">
              Je suis architecte <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
