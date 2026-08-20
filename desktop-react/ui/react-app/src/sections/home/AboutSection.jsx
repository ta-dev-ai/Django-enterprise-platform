export default function AboutSection() {
  return (
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
  );
}
