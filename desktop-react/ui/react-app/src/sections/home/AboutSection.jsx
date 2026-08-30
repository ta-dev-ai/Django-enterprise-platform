export default function AboutSection({ hideAnchor = false }) {
  return (
    <section id={hideAnchor ? undefined : 'about'} className="home-about">
      <div className="home-about-grid">
        {/* Column Left: Text & Key Highlights */}
        <div className="home-about-text-col">
          <h2 className="home-about-title">Une Expertise Énergétique Reconnue</h2>
          <p className="home-about-description">
            RenovateEnergy combine l&apos;intelligence des données DPE et les technologies
            d&apos;analyse pour vous accompagner pendant tout votre parcours de rénovation.
          </p>

          <div className="expertise-list">
            <div className="expertise-item">
              <div className="expertise-icon-circle icon-circle-blue">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div className="expertise-info">
                <h4 className="expertise-item-title">Analyses précises</h4>
                <p className="expertise-item-text">
                  Évaluation détaillée de l&apos;état thermique.
                </p>
              </div>
            </div>

            <div className="expertise-item">
              <div className="expertise-icon-circle icon-circle-cyan">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div className="expertise-info">
                <h4 className="expertise-item-title">Scénarios personnalisés</h4>
                <p className="expertise-item-text">Solutions adaptées à vos objectifs et budget.</p>
              </div>
            </div>

            <div className="expertise-item">
              <div className="expertise-icon-circle icon-circle-indigo">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div className="expertise-info">
                <h4 className="expertise-item-title">Données certifiées</h4>
                <p className="expertise-item-text">
                  Conformes aux normes réglementaires en vigueur.
                </p>
              </div>
            </div>

            <div className="expertise-item">
              <div className="expertise-icon-circle icon-circle-teal">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div className="expertise-info">
                <h4 className="expertise-item-title">Suivi &amp; optimisation</h4>
                <p className="expertise-item-text">Suivez vos performances et vos économies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column Right: Solar Panels Image & Dark Floating Widget (-60%) */}
        <div className="home-about-image-col">
          <div className="expertise-image-wrapper">
            <img
              alt="Panneaux solaires et éoliennes transition énergétique"
              className="expertise-main-img"
              src="/static/assets/ImagePanels.png"
            />
            {/* Dark Floating Stat Widget */}
            <div className="expertise-dark-widget">
              <span className="widget-eco-leaf">⚡ Économisez jusqu&apos;à</span>
              <div className="widget-stat-number">60 %</div>
              <span className="widget-stat-subtitle">sur votre consommation énergétique.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
