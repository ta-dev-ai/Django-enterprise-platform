import { useEffect, useRef } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { getBarOptions, getDonutOptions, donutColors } from '../utils/configChart.js';
import { renderList, clearContainer } from '../utils/ui.js';

export default function TypesPage() {
  const { data, loading } = useDashboardData();
  const chartInstancesRef = useRef([]);

  useEffect(() => {
    if (!data || !data.types || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const rawTypes = data.types;

    const barData = rawTypes.map((d) => ({
      name: d.name,
      total: d.total || d.volume || 100,
      renovated: d.renovated || d.volume || 50,
    }));

    const privateChartEl = document.querySelector('#privateChart');
    if (privateChartEl) {
      clearContainer('privateChart');
      const chart1 = new window.ApexCharts(privateChartEl, getBarOptions(barData, 'Types de Travaux'));
      chart1.render();
      chartInstancesRef.current.push(chart1);
    }

    const totalVal = barData.reduce((a, b) => a + b.renovated, 0);
    const pieData = barData.map((d, i) => ({
      name: d.name,
      value: d.renovated,
      percent: totalVal > 0 ? Math.round((d.renovated / totalVal) * 100 * 10) / 10 : 0,
      color: donutColors[i % 20],
    }));

    const privateDonutEl = document.querySelector('#privateDonut');
    if (privateDonutEl) {
      clearContainer('privateDonut');
      const chart2 = new window.ApexCharts(privateDonutEl, getDonutOptions(pieData, 'TYPES'));
      chart2.render();
      chartInstancesRef.current.push(chart2);
    }

    renderList('privateListContainer', pieData.slice(0, 20));

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
            Analyse par Type de Travaux (Isolation, Chauffage...)
          </span>
          <h1 className="text-2xl font-bold" id="viewTitle">Types de Rénovation</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" />
          </div>
        </div>
      </header>

      <div id="dashboardContent">
        <section id="section-types" className="view-section">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Vue Détaillée</h2>
            <div className="flex items-center gap-10">
              <div id="rt-filter-container" className="hidden">
                <select id="rt-filter-arrondissement" className="rt-filter-select">
                  <option value="">Tous les arrondissements</option>
                </select>
              </div>
              <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className="view-toggle-btn px-3 py-1 rounded-md active text-primary bg-white shadow-sm" data-section="section-types" data-mode="chart" type="button">Graphique</button>
                <button className="view-toggle-btn px-3 py-1 rounded-md transition-all hover:text-slate-700" data-section="section-types" data-mode="table" type="button">Données</button>
              </div>
            </div>
          </div>

          <div className="charts-container space-y-8">
            <div className="card">
              <div id="privateChart" style={{ height: '380px' }}>
                {loading && (
                  <div className="rt-loading-wrapper">
                    <div className="rt-spinner" />
                    <div className="rt-loading-text">Analyse des types...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-base font-bold text-slate-800 mb-8">Répartition des Types</h3>
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
                    <span className="chart-center-text">TYPES</span>
                  </div>
                </div>
                <div className="list-section">
                  <div className="split-list-container" id="privateListContainer" />
                </div>
              </div>
            </div>
          </div>

          <div id="typesTableContainer" className="table-container hidden" />
        </section>
      </div>
    </main>
  );
}



