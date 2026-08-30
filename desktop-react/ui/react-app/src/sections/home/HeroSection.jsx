import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero-grid">
        {/* Content Left */}
        <div className="home-hero-content">
          <div className="home-hero-inner">
            {/* Eyebrow Badge */}
            <div className="home-hero-eyebrow">
              <span className="eyebrow-icon">🌱</span>
              <span className="eyebrow-text">RÉNOVATION ÉNERGÉTIQUE INTELLIGENTE</span>
            </div>

            {/* H1 Title */}
            <h1 className="home-hero-title">
              Rénover votre maison,<br />
              <span className="text-primary-blue">illuminez</span> votre avenir.
            </h1>

            {/* Description */}
            <p className="home-hero-description">
              Analysez, planifiez et financez vos rénovations énergétiques avec notre plateforme
              intuitive et performante.
            </p>

            {/* Action Buttons */}
            <div className="home-hero-actions">
              <Link to="/dashboard" className="home-hero-cta">
                Lancer l&apos;analyse <span className="arrow">&rarr;</span>
              </Link>
              <Link to="/cv" className="home-hero-secondary-btn">
                Je suis architecte <span className="arrow">&rarr;</span>
              </Link>
            </div>

            {/* Trust Badge / Social Proof */}
            <div className="home-hero-trust">
              <div className="trust-avatars">
                <img src="/static/assets/tayier_photo_pro.jpg" alt="Membre" className="trust-avatar" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Membre" className="trust-avatar" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Membre" className="trust-avatar" />
                <div className="trust-badge-count">+2.5k</div>
              </div>
              <span className="trust-text">Plus de 2 500 projets accompagnés en France</span>
            </div>
          </div>
        </div>

        {/* Visual Right */}
        <div className="home-hero-visual-wrapper">
          <div className="home-hero-image-card">
            <img
              alt="Illustration d'une maison moderne et écologique"
              className="home-hero-bg-img"
              src="/static/assets/imageHome.png"
            />
            {/* Floating Pill Badge */}
            <div className="hero-floating-badge">
              <div className="floating-badge-icon">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <span className="floating-badge-text">Un avenir durable commence chez vous</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
