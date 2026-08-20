import { Link } from 'react-router-dom';

export default function FeaturesSection() {
  return (
    <div className="home-features">
      <div className="home-features-grid">
        <Link className="home-feature-card" to="/batiment">
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
        <Link className="home-feature-card" to="/types">
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
        <Link className="home-feature-card" to="/dpe">
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
  );
}
