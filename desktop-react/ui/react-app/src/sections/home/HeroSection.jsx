import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero-card-banner">
        {/* Background house image with smooth gradient blend */}
        <div className="hero-bg-visual">
          <img
            src="/static/assets/imageHome.png"
            alt="Maison moderne écologique avec panneaux solaires"
            className="hero-house-img"
          />
          <div className="hero-gradient-overlay" />
        </div>

        {/* Content Left */}
        <div className="home-hero-content">
          {/* Eyebrow Badge */}
          <div className="home-hero-eyebrow">
            <span className="eyebrow-leaf">🍃</span>
            <span className="eyebrow-text">RÉNOVATION ÉNERGÉTIQUE INTELLIGENTE</span>
          </div>

          {/* H1 Title */}
          <h1 className="home-hero-title">
            Rénover votre maison,<br />
            <span className="text-primary-blue">illuminez</span> votre avenir.
          </h1>

          {/* Description */}
          <p className="home-hero-description">
            Analysez, planifiez et financez vos rénovations énergétiques<br />
            avec notre plateforme intuitive et performante.
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
            <div className="trust-text">
              Plus de 2 500 projets accompagnés<br />en France
            </div>
          </div>
        </div>

        {/* Floating Glass Badge (Bottom Right) */}
        <div className="hero-floating-glass-badge">
          <div className="glass-badge-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>eco</span>
          </div>
          <div className="glass-badge-content">
            <strong className="glass-badge-title">Un avenir durable</strong>
            <span className="glass-badge-sub">commence chez vous</span>
          </div>
        </div>
      </div>
    </section>
  );
}
