import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import { getBarOptions, getDonutOptions, donutColors } from '../utils/configChart.js';
import { renderList, clearContainer } from '../utils/ui.js';

export default function DashboardPage() {
  const { data, loading, setYear, setType, setDpeClass } = useDashboardData();
  const location = useLocation();
  const route = location.pathname.replace('/', '') || 'dashboard';

  // State for View toggles (Graphique vs Table) for each section
  const [viewModes, setViewModes] = useState({
    batiment: 'chart',
    types: 'chart',
    dpe: 'chart',
  });

  const chartInstancesRef = useRef([]);

  const toggleView = (section, mode) => {
    setViewModes((prev) => ({ ...prev, [section]: mode }));
  };

  // Sync Global Filters from Sidebar via CustomEvent
  useEffect(() => {
    const handleFilterChange = (e) => {
      const { group, updates } = e.detail;
      if (group === 'batiment' && updates.year) setYear(updates.year);
      if (group === 'types') {
        if (updates.year) setYear(updates.year);
        if (updates.type) setType(updates.type);
      }
      if (group === 'dpe') {
        if (updates.year) setYear(updates.year);
        if (updates.class) setDpeClass(updates.class);
      }
    };
    window.addEventListener('dashboardFilterChanged', handleFilterChange);
    return () => window.removeEventListener('dashboardFilterChanged', handleFilterChange);
  }, [setYear, setType, setDpeClass]);

  // Render Charts when data changes
  useEffect(() => {
    if (!data || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    // --- BÂTIMENTS ---
    if (data.buildings && data.buildings.length > 0) {
      const privateData = data.buildings.map((d) => ({ name: d.name, total: d.logements_prives, renovated: d.logements_prives_renoves }));
      const socialData = data.buildings.map((d) => ({ name: d.name, total: d.logements_sociaux, renovated: d.logements_sociaux_renoves }));
      
      const privChartEl = document.querySelector('#privateChart');
      if (privChartEl && viewModes.batiment === 'chart') {
        clearContainer('privateChart');
        const c1 = new window.ApexCharts(privChartEl, getBarOptions(privateData, 'Logement Privé'));
        c1.render(); chartInstancesRef.current.push(c1);
      }
      const socChartEl = document.querySelector('#socialChart');
      if (socChartEl && viewModes.batiment === 'chart') {
        clearContainer('socialChart');
        const c2 = new window.ApexCharts(socChartEl, getBarOptions(socialData, 'Logement Social'));
        c2.render(); chartInstancesRef.current.push(c2);
      }
      const generatePieData = (dataset) => {
        const total = dataset.reduce((a, b) => a + b.renovated, 0);
        return dataset.map((d, i) => ({
          name: d.name, value: d.renovated, percent: total > 0 ? Math.round((d.renovated / total) * 100 * 10) / 10 : 0, color: donutColors[i % 20],
        }));
      };
      const piePriv = generatePieData(privateData);
      const pieSoc = generatePieData(socialData);
      
      const privDonutEl = document.querySelector('#privateDonut');
      if (privDonutEl && viewModes.batiment === 'chart') {
        clearContainer('privateDonut');
        const c3 = new window.ApexCharts(privDonutEl, getDonutOptions(piePriv, 'PRIVÉ'));
        c3.render(); chartInstancesRef.current.push(c3);
      }
      const socDonutEl = document.querySelector('#socialDonut');
      if (socDonutEl && viewModes.batiment === 'chart') {
        clearContainer('socialDonut');
        const c4 = new window.ApexCharts(socDonutEl, getDonutOptions(pieSoc, 'SOCIAL'));
        c4.render(); chartInstancesRef.current.push(c4);
      }
      if (viewModes.batiment === 'chart') {
        renderList('privateListContainer', piePriv.slice(0, 20));
        renderList('socialListContainer', pieSoc.slice(0, 20));
      }
    }

    // --- TYPES ---
    if (data.types && data.types.length > 0) {
      const typeBarData = data.types.map((d) => ({ name: d.name || d.type || 'Inconnu', total: d.total ?? d.volume ?? 0, renovated: d.renovated ?? d.volume ?? 0 }));
      const typesBarEl = document.querySelector('#typesBar');
      if (typesBarEl && viewModes.types === 'chart') {
        clearContainer('typesBar');
        const c5 = new window.ApexCharts(typesBarEl, getBarOptions(typeBarData, 'Types de Travaux'));
        c5.render(); chartInstancesRef.current.push(c5);
      }
      const typeTotal = typeBarData.reduce((a, b) => a + b.renovated, 0);
      const typePieData = typeBarData.map((d, i) => ({ name: d.name, value: d.renovated, percent: typeTotal > 0 ? Math.round((d.renovated / typeTotal) * 100 * 10) / 10 : 0, color: donutColors[i % 20] }));
      
      const typesDonutEl = document.querySelector('#typesDonut');
      if (typesDonutEl && viewModes.types === 'chart') {
        clearContainer('typesDonut');
        const c6 = new window.ApexCharts(typesDonutEl, getDonutOptions(typePieData, 'TYPES'));
        c6.render(); chartInstancesRef.current.push(c6);
      }
      if (viewModes.types === 'chart') {
        renderList('typesList', typePieData.slice(0, 20));
      }
    }

    // --- DPE ---
    if (data.dpe && data.dpe.length > 0) {
      const dpeBarData = data.dpe.map((d) => ({ name: d.name || `Classe ${d.classe}` || 'Inconnu', total: d.total ?? d.volume ?? 0, renovated: d.renovated ?? d.renoves ?? d.volume ?? 0 }));
      const dpeBarEl = document.querySelector('#dpeBar');
      if (dpeBarEl && viewModes.dpe === 'chart') {
        clearContainer('dpeBar');
        const c7 = new window.ApexCharts(dpeBarEl, getBarOptions(dpeBarData, 'Classes DPE'));
        c7.render(); chartInstancesRef.current.push(c7);
      }
      const dpeTotal = dpeBarData.reduce((a, b) => a + b.renovated, 0);
      const dpePieData = dpeBarData.map((d, i) => ({ name: d.name, value: d.renovated, percent: dpeTotal > 0 ? Math.round((d.renovated / dpeTotal) * 100 * 10) / 10 : 0, color: donutColors[i % 20] }));
      
      const dpeDonutEl = document.querySelector('#dpeDonut');
      if (dpeDonutEl && viewModes.dpe === 'chart') {
        clearContainer('dpeDonut');
        const c8 = new window.ApexCharts(dpeDonutEl, getDonutOptions(dpePieData, 'DPE'));
        c8.render(); chartInstancesRef.current.push(c8);
      }
      if (viewModes.dpe === 'chart') {
        renderList('dpeList', dpePieData.slice(0, 20));
      }
    }

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data, viewModes]);

  return (
    <main className="main-content">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">Synthèse Interactive</span>
          <h1 className="text-2xl font-bold text-slate-800" id="viewTitle">Tableau de Bord Global</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" />
          </div>
        </div>
      </header>

      <div id="dashboardContent" className="space-y-8">
        
        {/* ================= SECTION BÂTIMENT ================= */}
        <section id="section-batiment" className={`view-section ${route !== 'dashboard' && route !== 'batiment' ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">apartment</span></div>
                <h2 className="text-xl font-bold text-slate-800">Bâtiments (Paris 1-20)</h2>
            </div>
            <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.batiment === 'chart' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('batiment', 'chart')}>Graphique</button>
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.batiment === 'table' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('batiment', 'table')}>Données</button>
            </div>
          </div>
          
          {viewModes.batiment === 'chart' ? (
            <div className="charts-container space-y-8">
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Logements Privés</h3>
                <div id="privateChart" style={{ height: '380px' }}>
                  {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Logements Sociaux</h3>
                <div id="socialChart" style={{ height: '380px' }}>
                  {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
                </div>
              </div>
              <div className="card p-8">
                <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Privé)</h3>
                <div className="volume-card-content">
                  <div className="chart-section">
                    <div id="privateDonut" style={{ width: '100%', height: '350px' }}>
                      {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
                    </div>
                    <div className="chart-center-label"><span className="chart-center-text">PRIVÉ</span></div>
                  </div>
                  <div className="list-section"><div id="privateListContainer" className="split-list-container" /></div>
                </div>
              </div>
              <div className="card p-8">
                <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Social)</h3>
                <div className="volume-card-content">
                  <div className="chart-section">
                    <div id="socialDonut" style={{ width: '100%', height: '350px' }}>
                      {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
                    </div>
                    <div className="chart-center-label"><span className="chart-center-text">SOCIAL</span></div>
                  </div>
                  <div className="list-section"><div id="socialListContainer" className="split-list-container" /></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                    <th className="py-3 px-4">Arrondissement / Nom</th>
                    <th className="py-3 px-4 text-right">Logements Privés</th>
                    <th className="py-3 px-4 text-right">Privés Rénovés</th>
                    <th className="py-3 px-4 text-right">Logements Sociaux</th>
                    <th className="py-3 px-4 text-right">Sociaux Rénovés</th>
                    <th className="py-3 px-4 text-right">Taux Rénovation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.buildings && data.buildings.map((b, idx) => {
                    const totalLog = (b.logements_prives || 0) + (b.logements_sociaux || 0);
                    const totalRenov = (b.logements_prives_renoves || 0) + (b.logements_sociaux_renoves || 0);
                    const rate = totalLog > 0 ? ((totalRenov / totalLog) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">{b.name}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{(b.logements_prives || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium text-emerald-600">{(b.logements_prives_renoves || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{(b.logements_sociaux || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium text-blue-600">{(b.logements_sociaux_renoves || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-primary">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ================= SECTION TYPES ================= */}
        <section id="section-types" className={`view-section ${route !== 'dashboard' && route !== 'types' ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
                <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">construction</span></div>
                <h2 className="text-xl font-bold text-slate-800">Types de Travaux</h2>
            </div>
            <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.types === 'chart' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('types', 'chart')}>Graphique</button>
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.types === 'table' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('types', 'table')}>Données</button>
            </div>
          </div>
          
          {viewModes.types === 'chart' ? (
            <div className="charts-container space-y-8">
              <div className="card p-6">
                <div id="typesBar" style={{ height: '380px' }}>
                  {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
                </div>
              </div>
              <div className="card p-8">
                <div className="volume-card-content">
                  <div className="chart-section">
                    <div id="typesDonut" style={{ height: '350px' }}>
                      {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
                    </div>
                  </div>
                  <div className="list-section"><div id="typesList" className="split-list-container" /></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                    <th className="py-3 px-4">Catégorie de Rénovation</th>
                    <th className="py-3 px-4 text-right">Volume Total</th>
                    <th className="py-3 px-4 text-right">Travaux Réalisés</th>
                    <th className="py-3 px-4 text-right">Part de Marché</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.types && data.types.map((t, idx) => {
                    const total = t.total ?? t.volume ?? 0;
                    const renov = t.renovated ?? t.volume ?? 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">{t.name || t.type || 'Isolation'}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium text-emerald-600">{renov.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-primary">{total > 0 ? ((renov / total) * 100).toFixed(1) : '100.0'}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ================= SECTION DPE ================= */}
        <section id="section-dpe" className={`view-section ${route !== 'dashboard' && route !== 'dpe' ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="flex items-center gap-3">
                <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">bolt</span></div>
                <h2 className="text-xl font-bold text-slate-800">Performance DPE</h2>
            </div>
            <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-semibold text-slate-500">
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.dpe === 'chart' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('dpe', 'chart')}>Graphique</button>
                <button className={`view-toggle-btn px-3 py-1 rounded-md transition-all ${viewModes.dpe === 'table' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-700'}`} onClick={() => toggleView('dpe', 'table')}>Données</button>
            </div>
          </div>

          {viewModes.dpe === 'chart' ? (
            <div className="charts-container space-y-8">
              <div className="card p-6">
                <div id="dpeBar" style={{ height: '380px' }}>
                  {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
                </div>
              </div>
              <div className="card p-8">
                <div className="volume-card-content">
                  <div className="chart-section">
                    <div id="dpeDonut" style={{ height: '350px' }}>
                      {loading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
                    </div>
                  </div>
                  <div className="list-section"><div id="dpeList" className="split-list-container" /></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                    <th className="py-3 px-4">Classe Énergétique</th>
                    <th className="py-3 px-4 text-right">Nombre de Bâtiments</th>
                    <th className="py-3 px-4 text-right">Rénovations Terminées</th>
                    <th className="py-3 px-4 text-right">Taux de Progression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.dpe && data.dpe.map((d, idx) => {
                    const total = d.total ?? d.volume ?? 0;
                    const renov = d.renovated ?? d.renoves ?? d.volume ?? 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mr-2 bg-slate-100 text-slate-700">
                            {d.name || `Classe ${d.classe}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">{total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium text-emerald-600">{renov.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-primary">{total > 0 ? ((renov / total) * 100).toFixed(1) : '100.0'}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
