import { useState } from 'react';
import BatimentSectionPanel from '../components/dashboard/BatimentSectionPanel';

function ChartLoader({ text = 'Chargement du graphique...' }) {
  return (
    <div className="rt-loading-wrapper">
      <div className="rt-spinner" />
      <div className="rt-loading-text">{text}</div>
    </div>
  );
}

function SectionToggle({ sectionId, onModeChange }) {
  const handleToggle = (mode) => {
    if (onModeChange) onModeChange(mode);
  };

  return (
    <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
      <button
        type="button"
        className="view-toggle-btn px-3 py-1 rounded-md active text-primary bg-white shadow-sm"
        data-section={sectionId}
        data-mode="chart"
        onClick={() => handleToggle('chart')}
      >
        Graphique
      </button>
      <button
        type="button"
        className="view-toggle-btn px-3 py-1 rounded-md transition-all hover:text-slate-700"
        data-section={sectionId}
        data-mode="table"
        onClick={() => handleToggle('table')}
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
  const [focusedSection, setFocusedSection] = useState(null);

  const handleSectionModeChange = (sectionId, mode) => {
    if (mode === 'table') {
      setFocusedSection(sectionId);
    } else {
      setFocusedSection(null);
    }
  };

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
        <section
          id="section-batiment"
          className="view-section"
          style={focusedSection && focusedSection !== 'section-batiment' ? { display: 'none' } : undefined}
        >
          <BatimentSectionPanel sectionId="section-batiment" onModeChange={(mode) => handleSectionModeChange('section-batiment', mode)} />

          <div className="charts-container space-y-8">
            <div data-chart-group="bars" className="space-y-8">
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
            </div>

            <div data-chart-group="donut" className="space-y-8 hidden">
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
              <h3 className="text-base font-bold text-slate-800 mb-8">
                Volume Rénovation (Social)
              </h3>
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
          </div>

          <div
            id="batimentTableContainer"
            className="table-container hidden card p-0 overflow-hidden shadow-sm"
          />
        </section>

        <section
          id="section-types"
          className="view-section"
          style={focusedSection && focusedSection !== 'section-types' ? { display: 'none' } : undefined}
        >
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
              <div className="neu-icon-btn">
                <span className="material-symbols-outlined text-primary">construction</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Types de Travaux</h2>
            </div>
            <SectionToggle
              sectionId="section-types"
              onModeChange={(mode) => handleSectionModeChange('section-types', mode)}
            />
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

        <section
          id="section-dpe"
          className="view-section"
          style={focusedSection && focusedSection !== 'section-dpe' ? { display: 'none' } : undefined}
        >
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
              <div className="neu-icon-btn">
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Performance DPE</h2>
            </div>
            <SectionToggle
              sectionId="section-dpe"
              onModeChange={(mode) => handleSectionModeChange('section-dpe', mode)}
            />
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
