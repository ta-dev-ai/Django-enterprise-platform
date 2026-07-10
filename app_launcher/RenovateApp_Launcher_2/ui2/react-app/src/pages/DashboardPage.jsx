function ChartLoader({ text = 'Chargement du graphique...' }) {
  return (
    <div className="rt-loading-wrapper">
      <div className="rt-spinner" />
      <div className="rt-loading-text">{text}</div>
    </div>
  );
}

function SectionToggle({ sectionId }) {
  return (
    <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
      <button
        type="button"
        className="view-toggle-btn px-3 py-1 rounded-md active text-primary bg-white shadow-sm"
        data-section={sectionId}
        data-mode="chart"
      >
        Graphique
      </button>
      <button
        type="button"
        className="view-toggle-btn px-3 py-1 rounded-md transition-all hover:text-slate-700"
        data-section={sectionId}
        data-mode="table"
      >
        Données
      </button>
    </div>
  );
}

/**
 * Structure portée depuis templates/pages/dashboard/dashboard.html
 * Logique charts : à brancher depuis buildingController / typesController / dpeController
 */
export default function DashboardPage() {
  return (
    <main className="main-content">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">
            Synthèse Interactive
          </span>
          <h1 className="text-2xl font-bold text-slate-800" id="viewTitle">
            Tableau de Bord Global
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img
              src="https://i.pravatar.cc/100?u=admin"
              className="w-full h-full object-cover"
              alt="Profil"
            />
          </div>
        </div>
      </header>

      <div id="dashboardContent" className="space-y-8">
        <section id="section-batiment" className="view-section">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="neu-icon-btn">
                <span className="material-symbols-outlined text-primary">apartment</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Bâtiments (Paris 1-20)</h2>
            </div>
            <SectionToggle sectionId="section-batiment" />
          </div>

          <div className="charts-container space-y-8">
            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">
                Logements Privés (Toutes les années)
              </h3>
              <div id="privateChart" style={{ height: '380px' }}>
                <ChartLoader />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">
                Logements Sociaux (Toutes les années)
              </h3>
              <div id="socialChart" style={{ height: '380px' }}>
                <ChartLoader />
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Privé)</h3>
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="privateDonut" style={{ width: '100%', height: '350px' }}>
                    <ChartLoader />
                  </div>
                  <div className="chart-center-label">
                    <span className="chart-center-text">PRIVÉ</span>
                  </div>
                </div>
                <div className="list-section">
                  <div id="privateListContainer" className="split-list-container" />
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Social)</h3>
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="socialDonut" style={{ width: '100%', height: '350px' }}>
                    <ChartLoader />
                  </div>
                  <div className="chart-center-label">
                    <span className="chart-center-text">SOCIAL</span>
                  </div>
                </div>
                <div className="list-section">
                  <div id="socialListContainer" className="split-list-container" />
                </div>
              </div>
            </div>
          </div>

          <div
            id="batimentTableContainer"
            className="table-container hidden card p-0 overflow-hidden shadow-sm"
          />
        </section>

        <section id="section-types" className="view-section">
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
              <div className="neu-icon-btn">
                <span className="material-symbols-outlined text-primary">construction</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Types de Travaux</h2>
            </div>
            <SectionToggle sectionId="section-types" />
          </div>

          <div className="charts-container space-y-8">
            <div className="card p-6">
              <div id="typesBar" style={{ height: '380px' }}>
                <ChartLoader text="Analyse des types..." />
              </div>
            </div>

            <div className="card p-8">
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="typesDonut" style={{ height: '350px' }}>
                    <ChartLoader />
                  </div>
                </div>
                <div className="list-section">
                  <div id="typesList" className="split-list-container" />
                </div>
              </div>
            </div>
          </div>

          <div
            id="typesTableContainer"
            className="table-container hidden card p-0 overflow-hidden shadow-sm"
          />
        </section>

        <section id="section-dpe" className="view-section">
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
              <div className="neu-icon-btn">
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Performance DPE</h2>
            </div>
            <SectionToggle sectionId="section-dpe" />
          </div>

          <div className="charts-container space-y-8">
            <div className="card p-6">
              <div id="dpeBar" style={{ height: '380px' }}>
                <ChartLoader text="Analyse énergétique..." />
              </div>
            </div>

            <div className="card p-8">
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="dpeDonut" style={{ height: '350px' }}>
                    <ChartLoader />
                  </div>
                </div>
                <div className="list-section">
                  <div id="dpeList" className="split-list-container" />
                </div>
              </div>
            </div>
          </div>

          <div
            id="dpeTableContainer"
            className="table-container hidden card p-0 overflow-hidden shadow-sm"
          />
        </section>
      </div>
    </main>
  );
}
