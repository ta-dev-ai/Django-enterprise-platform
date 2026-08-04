import { useEffect, useRef } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { getBarOptions, getDonutOptions, donutColors } from '../utils/configChart.js';
import { renderList, clearContainer } from '../utils/ui.js';

export default function BatimentPage() {
  const { data, loading } = useDashboardData();
  const chartInstancesRef = useRef([]);

  useEffect(() => {
    if (!data || !data.buildings || !window.ApexCharts) return;

    // Destroy existing instances
    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const rawBuildings = data.buildings;

    const privateData = rawBuildings.map((d) => ({
      name: d.name,
      total: d.logements_prives,
      renovated: d.logements_prives_renoves,
    }));

    const socialData = rawBuildings.map((d) => ({
      name: d.name,
      total: d.logements_sociaux,
      renovated: d.logements_sociaux_renoves,
    }));

    // 1. Bar Chart Privé
    const privateChartEl = document.querySelector('#privateChart');
    if (privateChartEl) {
      clearContainer('privateChart');
      const chart1 = new window.ApexCharts(privateChartEl, getBarOptions(privateData, 'Logement Privé'));
      chart1.render();
      chartInstancesRef.current.push(chart1);
    }

    // 2. Bar Chart Social
    const socialChartEl = document.querySelector('#socialChart');
    if (socialChartEl) {
      clearContainer('socialChart');
      const chart2 = new window.ApexCharts(socialChartEl, getBarOptions(socialData, 'Logement Social'));
      chart2.render();
      chartInstancesRef.current.push(chart2);
    }

    // 3. Donuts
    const generatePieData = (dataset) => {
      const totalVal = dataset.reduce((a, b) => a + b.renovated, 0);
      return dataset.map((d, i) => ({
        name: d.name,
        value: d.renovated,
        percent: totalVal > 0 ? Math.round((d.renovated / totalVal) * 100 * 10) / 10 : 0,
        color: donutColors[i % 20],
      }));
    };

    const pieDataPrivate = generatePieData(privateData);
    const pieDataSocial = generatePieData(socialData);

    const privateDonutEl = document.querySelector('#privateDonut');
    if (privateDonutEl) {
      clearContainer('privateDonut');
      const chart3 = new window.ApexCharts(privateDonutEl, getDonutOptions(pieDataPrivate, 'PRIVÉ'));
      chart3.render();
      chartInstancesRef.current.push(chart3);
    }

    const socialDonutEl = document.querySelector('#socialDonut');
    if (socialDonutEl) {
      clearContainer('socialDonut');
      const chart4 = new window.ApexCharts(socialDonutEl, getDonutOptions(pieDataSocial, 'SOCIAL'));
      chart4.render();
      chartInstancesRef.current.push(chart4);
    }

    // 4. Render Lists
    renderList('privateListContainer', pieDataPrivate.slice(0, 20));
    renderList('socialListContainer', pieDataSocial.slice(0, 20));

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data]);

  return (
    <main className="main-content">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">
            Logement Privé par Arrondissement (Toutes les années)
          </span>
          <h1 className="text-2xl font-bold" id="viewTitle">Bâtiments Rénovés</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" />
          </div>
        </div>
      </header>

      <div id="dashboardContent">
        <section id="section-batiment" className="view-section">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Vue Détaillée</h2>

            <div className="flex items-center gap-10">
              <div id="rt-filter-container" className="hidden">
                <select id="rt-filter-arrondissement" className="rt-filter-select">
                  <option value="">Tous les arrondissements</option>
                </select>
              </div>

              <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className="view-toggle-btn px-3 py-1 rounded-md active text-primary bg-white shadow-sm" data-section="section-batiment" data-mode="chart" type="button">Graphique</button>
                <button className="view-toggle-btn px-3 py-1 rounded-md transition-all hover:text-slate-700" data-section="section-batiment" data-mode="table" type="button">Données</button>
              </div>
            </div>
          </div>

          <div className="charts-container space-y-8">
            <div className="card">
              <div id="privateChart" style={{ height: '380px' }}>
                {loading && (
                  <div className="rt-loading-wrapper">
                    <div className="rt-spinner" />
                    <div className="rt-loading-text">Analyse du parc privé...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-base font-bold text-slate-800 mb-6">
                Logement Social (HLM) par Arrondissement (Toutes les années)
              </h3>
              <div id="socialChart" style={{ height: '380px' }}>
                {loading && (
                  <div className="rt-loading-wrapper">
                    <div className="rt-spinner" />
                    <div className="rt-loading-text">Analyse du parc social...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Privé) - 2024</h3>
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="privateDonut" style={{ width: '100%', height: '350px' }}>
                    {loading && (
                      <div className="rt-loading-wrapper">
                        <div className="rt-spinner" />
                      </div>
                    )}
                  </div>
                  <div className="chart-center-label">
                    <span className="chart-center-text">PRIVÉ</span>
                  </div>
                </div>
                <div className="list-section">
                  <div className="split-list-container" id="privateListContainer" />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Social) - 2024</h3>
              <div className="volume-card-content">
                <div className="chart-section">
                  <div id="socialDonut" style={{ width: '100%', height: '350px' }}>
                    {loading && (
                      <div className="rt-loading-wrapper">
                        <div className="rt-spinner" />
                      </div>
                    )}
                  </div>
                  <div className="chart-center-label">
                    <span className="chart-center-text">SOCIAL</span>
                  </div>
                </div>
                <div className="list-section">
                  <div className="split-list-container" id="socialListContainer" />
                </div>
              </div>
            </div>
          </div>

          <div id="batimentTableContainer" className="table-container hidden" />
        </section>
      </div>
    </main>
  );
}



