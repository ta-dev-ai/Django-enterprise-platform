export default function MissionSection() {
  return (
    <section id="mission" className="home-mission">
      <div className="mission-card-container">
        <div className="mission-text-content">
          <span className="mission-eyebrow">Notre Mission :</span>
          <h2 className="home-mission-title">Rénover pour Sauvegarder</h2>
        </div>
        <div className="mission-impact-grid">
          <div className="mission-impact-item">
            <div className="mission-icon-wrapper">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <div className="mission-item-text">
              <h4 className="mission-item-title">Impact écologique</h4>
              <p className="mission-item-description">
                Réduire l&apos;empreinte carbone en rénovant les bâtiments pour préserver notre planète.
              </p>
            </div>
          </div>
          <div className="mission-impact-item">
            <div className="mission-icon-wrapper">
              <span className="material-symbols-outlined">savings</span>
            </div>
            <div className="mission-item-text">
              <h4 className="mission-item-title">Économies financières</h4>
              <p className="mission-item-description">
                Optimiser votre budget énergétique et bénéficier des aides disponibles.
              </p>
            </div>
          </div>
        </div>
        <div className="mission-image-right">
          <img
            alt="Feuilles végétales"
            src="/static/assets/imageGreen.png"
            className="mission-leaf-img"
          />
        </div>
      </div>
    </section>
  );
}
