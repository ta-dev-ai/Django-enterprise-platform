import { Link } from 'react-router-dom';

export default function FeaturesSection() {
  return (
    <section id="features" className="home-features">
      <div className="home-features-grid">
        <Link className="home-feature-card feature-card-blue" to="/batiment">
          <div className="feature-card-header">
            <div className="feature-icon-box icon-box-blue">
              <span className="material-symbols-outlined">home</span>
            </div>
          </div>
          <h3 className="home-feature-title">Bâtiments Rénovés</h3>
          <p className="home-feature-description">
            Suivez et optimisez la rénovation de maisons individuelles et de bâtiments.
          </p>
          <div className="feature-card-arrow">&rarr;</div>
        </Link>

        <Link className="home-feature-card feature-card-green" to="/types">
          <div className="feature-card-header">
            <div className="feature-icon-box icon-box-green">
              <span className="material-symbols-outlined">construction</span>
            </div>
          </div>
          <h3 className="home-feature-title">Types de Rénovation</h3>
          <p className="home-feature-description">
            Explorez les différentes approches de travaux et solutions adaptées à chaque habitat.
          </p>
          <div className="feature-card-arrow">&rarr;</div>
        </Link>

        <Link className="home-feature-card feature-card-purple" to="/dpe">
          <div className="feature-card-header">
            <div className="feature-icon-box icon-box-purple">
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
          </div>
          <h3 className="home-feature-title">Classe DPE</h3>
          <p className="home-feature-description">
            Analysez la performance énergétique et les gains CO₂ de vos bâtiments.
          </p>
          <div className="feature-card-arrow">&rarr;</div>
        </Link>

        <Link className="home-feature-card feature-card-amber" to="/dashboard">
          <div className="feature-card-header">
            <div className="feature-icon-box icon-box-amber">
              <span className="material-symbols-outlined">euro</span>
            </div>
          </div>
          <h3 className="home-feature-title">Aides &amp; Financements</h3>
          <p className="home-feature-description">
            Trouvez les aides disponibles et estimez vos financements facilement.
          </p>
          <div className="feature-card-arrow">&rarr;</div>
        </Link>
      </div>
    </section>
  );
}
