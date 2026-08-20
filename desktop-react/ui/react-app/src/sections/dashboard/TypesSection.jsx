import { useState, useEffect, useRef } from 'react';
import { getBarOptions, getDonutOptions, donutColors } from '../../utils/configChart';
import { renderList, clearContainer } from '../../utils/ui';

/**
 * Section Types de Travaux modulaire et autonome
 */
export default function TypesSection({ data, loading }) {
  const [mode, setMode] = useState('chart');
  const chartInstancesRef = useRef([]);

  useEffect(() => {
    if (!data?.types || data.types.length === 0 || mode !== 'chart' || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const typeBarData = data.types.map((d) => ({ name: d.name || d.type || 'Inconnu', total: d.total ?? d.volume ?? 0, renovated: d.renovated ?? d.volume ?? 0 }));
    const typesBarEl = document.querySelector('#typesBar');
    if (typesBarEl) {
      clearContainer('typesBar');
      const c5 = new window.ApexCharts(typesBarEl, getBarOptions(typeBarData, 'Types de Travaux'));
      c5.render(); chartInstancesRef.current.push(c5);
    }
    const typeTotal = typeBarData.reduce((a, b) => a + b.renovated, 0);
    const typePieData = typeBarData.map((d, i) => ({ name: d.name, value: d.renovated, percent: typeTotal > 0 ? Math.round((d.renovated / typeTotal) * 100 * 10) / 10 : 0, color: donutColors[i % 20] }));
    
    const typesDonutEl = document.querySelector('#typesDonut');
    if (typesDonutEl) {
      clearContainer('typesDonut');
      const c6 = new window.ApexCharts(typesDonutEl, getDonutOptions(typePieData, 'TYPES'));
      c6.render(); chartInstancesRef.current.push(c6);
    }
    renderList('typesList', typePieData.slice(0, 20));

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data?.types, mode]);

  return (
    <section id="section-types" className="view-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="neu-icon-btn">
            <span className="material-symbols-outlined text-primary">construction</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Types de Travaux de Rénovation</h2>
            <p className="text-xs text-slate-400">Répartition des catégories d&apos;isolation et équipements</p>
          </div>
        </div>
        <div className="bg-slate-200 p-1 rounded-xl flex text-xs font-semibold text-slate-600 gap-1">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${mode === 'chart' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-900'}`}
            onClick={() => setMode('chart')}
          >
            <span className="material-symbols-outlined text-sm">bar_chart</span>
            Graphique
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${mode === 'table' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-900'}`}
            onClick={() => setMode('table')}
          >
            <span className="material-symbols-outlined text-sm">table_chart</span>
            Données
          </button>
        </div>
      </div>
      
      {mode === 'chart' ? (
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
              {data?.types && data.types.map((t, idx) => {
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
  );
}
