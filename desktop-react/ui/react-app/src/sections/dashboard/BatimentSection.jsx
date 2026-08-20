import { useState, useMemo } from 'react';
import SectionViewToggle from '../../components/ui/SectionViewToggle';
import ParisArrondissement3D from '../../components/charts/ParisArrondissement3D';
import BuildingsBubbleChart from '../../components/charts/BuildingsBubbleChart';
import EnterpriseDataTable from '../../components/tables/EnterpriseTable';
import { getBarOptions, getDonutOptions, donutColors } from '../../utils/configChart';
import { renderList, clearContainer } from '../../utils/ui';
import { useEffect, useRef } from 'react';

/**
 * Section Bâtiments modulaire et autonome
 */
export default function BatimentSection({ data, loading }) {
  const [mode, setMode] = useState('chart');
  const chartInstancesRef = useRef([]);

  // Données pour la 3D Three.js et les Bulles 2D
  const arrondissement3DData = useMemo(() => {
    if (!data?.buildings || data.buildings.length === 0) return [];
    return data.buildings.map((b, idx) => {
      const arrNum = idx + 1;
      const total = (b.logements_prives || 0) + (b.logements_sociaux || 0);
      const renov = (b.logements_prives_renoves || 0) + (b.logements_sociaux_renoves || 0);
      return {
        arrondissement: arrNum,
        label: `${arrNum}e`,
        count: renov,
        total: total,
        renovated: renov,
        rate: total > 0 ? Math.round((renov / total) * 100) : 0,
      };
    });
  }, [data?.buildings]);

  // Données pour EnterpriseDataTable
  const enterpriseTableData = useMemo(() => {
    if (!data?.buildings || data.buildings.length === 0) return { columns: [], rows: [] };
    const columns = [
      { key: 'name', label: 'Arrondissement / Nom', sortable: true },
      { key: 'logements_prives', label: 'Logements Privés', numeric: true, sortable: true },
      { key: 'logements_prives_renoves', label: 'Privés Rénovés', numeric: true, sortable: true },
      { key: 'logements_sociaux', label: 'Logements Sociaux', numeric: true, sortable: true },
      { key: 'logements_sociaux_renoves', label: 'Sociaux Rénovés', numeric: true, sortable: true },
      { key: 'taux_renovation', label: 'Taux Rénovation (%)', numeric: true, sortable: true },
    ];
    const rows = data.buildings.map((b, idx) => {
      const total = (b.logements_prives || 0) + (b.logements_sociaux || 0);
      const renov = (b.logements_prives_renoves || 0) + (b.logements_sociaux_renoves || 0);
      const rate = total > 0 ? Number(((renov / total) * 100).toFixed(1)) : 0;
      return {
        id: idx + 1,
        name: b.name || `${idx + 1}e Arrondissement`,
        logements_prives: b.logements_prives || 0,
        logements_prives_renoves: b.logements_prives_renoves || 0,
        logements_sociaux: b.logements_sociaux || 0,
        logements_sociaux_renoves: b.logements_sociaux_renoves || 0,
        taux_renovation: rate,
      };
    });
    return { columns, rows };
  }, [data?.buildings]);

  // Render Charts en mode 'chart'
  useEffect(() => {
    if (!data?.buildings || data.buildings.length === 0 || mode !== 'chart' || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const privateData = data.buildings.map((d) => ({ name: d.name, total: d.logements_prives, renovated: d.logements_prives_renoves }));
    const socialData = data.buildings.map((d) => ({ name: d.name, total: d.logements_sociaux, renovated: d.logements_sociaux_renoves }));
    
    const privChartEl = document.querySelector('#privateChart');
    if (privChartEl) {
      clearContainer('privateChart');
      const c1 = new window.ApexCharts(privChartEl, getBarOptions(privateData, 'Logement Privé'));
      c1.render(); chartInstancesRef.current.push(c1);
    }
    const socChartEl = document.querySelector('#socialChart');
    if (socChartEl) {
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
    if (privDonutEl) {
      clearContainer('privateDonut');
      const c3 = new window.ApexCharts(privDonutEl, getDonutOptions(piePriv, 'PRIVÉ'));
      c3.render(); chartInstancesRef.current.push(c3);
    }
    const socDonutEl = document.querySelector('#socialDonut');
    if (socDonutEl) {
      clearContainer('socialDonut');
      const c4 = new window.ApexCharts(socDonutEl, getDonutOptions(pieSoc, 'SOCIAL'));
      c4.render(); chartInstancesRef.current.push(c4);
    }
    renderList('privateListContainer', piePriv.slice(0, 20));
    renderList('socialListContainer', pieSoc.slice(0, 20));

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data?.buildings, mode]);

  return (
    <section id="section-batiment" className="view-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="neu-icon-btn">
            <span className="material-symbols-outlined text-primary">apartment</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Bâtiments Rénovés (Paris 1-20)</h2>
            <p className="text-xs text-slate-400">Registre et indicateurs par arrondissement</p>
          </div>
        </div>
        
        {/* Barre de sélection multi-modes */}
        <div className="bg-slate-200 p-1 rounded-xl flex flex-wrap text-xs font-semibold text-slate-600 gap-1">
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
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${mode === 'bubbles' ? 'active text-primary bg-white shadow-sm font-bold' : 'hover:text-slate-900'}`}
            onClick={() => setMode('bubbles')}
          >
            <span className="material-symbols-outlined text-sm">bubble_chart</span>
            Bulles 2D
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${mode === '3d' ? 'active text-cyan-600 bg-white shadow-sm font-bold' : 'hover:text-slate-900'}`}
            onClick={() => setMode('3d')}
          >
            <span className="material-symbols-outlined text-sm">3d_rotation</span>
            Carte 3D
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

      {/* 1. Mode Graphiques */}
      {mode === 'chart' && (
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
      )}

      {/* 2. Mode Bulles 2D */}
      {mode === 'bubbles' && (
        <div className="card p-6">
          <BuildingsBubbleChart data={arrondissement3DData} />
        </div>
      )}

      {/* 3. Mode Carte 3D */}
      {mode === '3d' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Maquette 3D Interactive — Arrondissements de Paris</h3>
            <span className="text-xs text-slate-500">Cliquez et glissez pour pivoter / Molette pour zoomer</span>
          </div>
          <ParisArrondissement3D data={arrondissement3DData} />
        </div>
      )}

      {/* 4. Mode Tableau */}
      {mode === 'table' && (
        <EnterpriseDataTable
          title="Registre Bâtiments Rénovés"
          subtitle="Paris 1-20 — Tri, recherche, pagination et export CSV"
          columns={enterpriseTableData.columns}
          rows={enterpriseTableData.rows}
        />
      )}
    </section>
  );
}
