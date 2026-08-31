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
            <span className="eyebrow-text">MVP DATA · CAS PARIS ÉNERGIE</span>
          </div>

          {/* H1 Title */}
          <h1 className="home-hero-title">
            Rénover votre maison,<br />
            <span className="text-primary-blue">illuminez</span> votre avenir.
          </h1>

          {/* Description */}
          <p className="home-hero-description">
            Filtrez, analysez et visualisez des données réelles — graphiques, tableaux et vues 3D.
            <br />
            Premier cas : rénovation énergétique parisienne (DPE 2020–2026).
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

          {/* Trust Badge / Social Proof - Solo Developer */}
          <div className="home-hero-trust">
            <div className="trust-avatars">
              <img
                src="/static/assets/tayier_photo_pro.jpg"
                alt="Tayier - Concepteur & Développeur"
                className="trust-avatar"
                style={{ width: '40px', height: '40px', objectPosition: 'center top' }}
              />
              <div
                className="trust-badge-count"
                style={{ width: '40px', height: '40px', background: '#10b981', fontSize: '0.8rem', fontWeight: 800 }}
              >
                +30
              </div>
            </div>
            <div className="trust-text">
              Plus de 30 projets conçus &amp; réalisés<br />en Data &amp; Full-Stack
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
