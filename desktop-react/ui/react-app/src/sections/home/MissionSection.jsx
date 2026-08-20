export default function MissionSection() {
  return (
    <div className="home-mission">
      <img
        alt="Maison écologique en pleine nature"
        className="home-mission-bg"
        src="/static/assets/imageGreen.png"
      />
      <div className="home-mission-overlay"></div>
      <div className="home-mission-content">
        <div className="home-mission-inner">
          <h2 className="home-mission-title">Notre Mission : Rénover pour Sauvegarder</h2>
          <div className="home-mission-items">
            <div className="home-mission-item">
              <div className="home-mission-icon-wrapper">
                <span className="material-symbols-outlined home-mission-icon">eco</span>
              </div>
              <div className="home-mission-item-text">
                <h4 className="home-mission-item-title">Impact Écologique</h4>
                <p className="home-mission-item-description">
                  Réduire l&apos;empreinte carbone grâce à des rénovations thermiques durables et ciblées.
                </p>
              </div>
            </div>
            <div className="home-mission-item">
              <div className="home-mission-icon-wrapper">
                <span className="material-symbols-outlined home-mission-icon">savings</span>
              </div>
              <div className="home-mission-item-text">
                <h4 className="home-mission-item-title">Économies Financières</h4>
                <p className="home-mission-item-description">
                  Optimiser votre budget énergétique et bénéficier des aides disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
