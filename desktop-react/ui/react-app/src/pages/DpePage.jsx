function Loader({ text = 'Chargement...' }) {
  return (
    <div className="rt-loading-wrapper">
      <div className="rt-spinner" />
      <div className="rt-loading-text">{text}</div>
    </div>
  );
}

export default function DpePage() {
  return (
    <main className="main-content">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">Performance Énergétique (DPE) des logements</span>
          <h1 className="text-2xl font-bold" id="viewTitle">Classe DPE</h1>
        </div>
        <div className="flex items-center gap-6"><div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer"><img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" /></div></div>
      </header>
      <div id="dashboardContent">
        <section id="section-dpe" className="view-section">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Vue Détaillée</h2>
            <div className="flex items-center gap-10">
              <div id="rt-filter-container" className="hidden"><select id="rt-filter-arrondissement" className="rt-filter-select"><option value="">Tous les arrondissements</option></select></div>
              <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className="view-toggle-btn px-3 py-1 rounded-md active text-primary bg-white shadow-sm" data-section="section-dpe" data-mode="chart" type="button">Graphique</button>
                <button className="view-toggle-btn px-3 py-1 rounded-md transition-all hover:text-slate-700" data-section="section-dpe" data-mode="table" type="button">Données</button>
              </div>
            </div>
          </div>
          <div className="charts-container space-y-8">
            <div className="card"><div id="dpeBar" style={{ height: '380px' }}><Loader text="Analyse énergétique..." /></div></div>
            <div className="card">
              <h3 className="text-base font-bold text-slate-800 mb-8">Répartition DPE</h3>
              <div className="volume-card-content">
                <div className="chart-section"><div id="dpeDonut" style={{ width: '100%', height: '350px' }}><Loader /></div><div className="chart-center-label"><span className="chart-center-text">DPE</span></div></div>
                <div className="list-section"><div className="split-list-container" id="dpeList" /></div>
              </div>
            </div>
          </div>
          <div id="dpeTableContainer" className="table-container hidden" />
        </section>
      </div>
    </main>
  );
}
