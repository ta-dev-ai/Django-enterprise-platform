import { useState, useEffect, useRef } from 'react';
import { getBarOptions, getDonutOptions, donutColors } from '../../utils/configChart';
import { renderList, clearContainer } from '../../utils/ui';

/**
 * Section Performance DPE modulaire et autonome
 */
export default function DpeSection({ data, loading }) {
  const [mode, setMode] = useState('chart');
  const chartInstancesRef = useRef([]);

  useEffect(() => {
    if (!data?.dpe || data.dpe.length === 0 || mode !== 'chart' || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const dpeBarData = data.dpe.map((d) => ({ name: d.name || `Classe ${d.classe}` || 'Inconnu', total: d.total ?? d.volume ?? 0, renovated: d.renovated ?? d.renoves ?? d.volume ?? 0 }));
    const dpeBarEl = document.querySelector('#dpeBar');
    if (dpeBarEl) {
      clearContainer('dpeBar');
      const c7 = new window.ApexCharts(dpeBarEl, getBarOptions(dpeBarData, 'Classes DPE'));
      c7.render(); chartInstancesRef.current.push(c7);
    }
    const dpeTotal = dpeBarData.reduce((a, b) => a + b.total, 0);
    const dpePieData = dpeBarData.map((d, i) => ({
      name: d.name,
      value: d.total,
      percent: dpeTotal > 0 ? Math.round((d.total / dpeTotal) * 100 * 10) / 10 : 0,
      color: donutColors[i % 20],
    }));
    
    const dpeDonutEl = document.querySelector('#dpeDonut');
    if (dpeDonutEl) {
      clearContainer('dpeDonut');
      const c8 = new window.ApexCharts(dpeDonutEl, getDonutOptions(dpePieData, 'DPE'));
      c8.render(); chartInstancesRef.current.push(c8);
    }
    renderList('dpeList', dpePieData.slice(0, 20));

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data?.dpe, mode]);

  return (
    <section id="section-dpe" className="view-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="neu-icon-btn">
            <span className="material-symbols-outlined text-primary">bolt</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Performance Énergétique DPE</h2>
            <p className="text-xs text-slate-400">Distribution des étiquettes énergie et gains GES</p>
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
              {data?.dpe && data.dpe.map((d, idx) => {
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
  );
}
