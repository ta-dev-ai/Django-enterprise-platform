import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import BatimentSectionPanel from './BatimentSectionPanel';
import { getBarOptions, getDonutOptions, donutColors } from '../../utils/configChart';
import { clearContainer } from '../../utils/ui';

function toShareData(items) {
  const total = items.reduce((a, b) => a + b.total, 0);
  return items.map((d, i) => ({
    name: d.name,
    value: d.total,
    percent: total > 0 ? Math.round((d.total / total) * 100 * 10) / 10 : 0,
    color: donutColors[i % donutColors.length],
  }));
}

function buildingTotals(b) {
  const total =
    Number(b.total_logements || 0) ||
    Number(b.logements_prives || 0) + Number(b.logements_sociaux || 0);
  const renovated =
    Number(b.total_logements_renoves || 0) ||
    Number(b.logements_prives_renoves || 0) + Number(b.logements_sociaux_renoves || 0);
  return { total, renovated };
}

/**
 * Vue d'ensemble — cas spécial :
 * 1) Synthèse globale (KPIs + aperçus) sur l'ensemble des données
 * 2) Puis les 3 modes Affichage (Graphique / Données / Carte 3D) sur le même ensemble
 */
export default function OverviewSection({ data, loading }) {
  const chartInstancesRef = useRef([]);

  const kpis = useMemo(() => {
    const buildings = data?.buildings ?? [];
    const types = data?.types ?? [];
    const dpe = data?.dpe ?? [];

    const totalLogements = buildings.reduce((a, b) => a + buildingTotals(b).total, 0);
    const totalRenoves = buildings.reduce((a, b) => a + buildingTotals(b).renovated, 0);
    const globalRate = totalLogements > 0 ? (totalRenoves / totalLogements) * 100 : 0;

    const topArrondissement = buildings.reduce((best, b) => {
      const { total, renovated } = buildingTotals(b);
      const rate = total > 0 ? renovated / total : 0;
      return !best || rate > best.rate ? { name: b.name, rate } : best;
    }, null);

    const topType = types.reduce((best, t) => (!best || t.total > best.total ? t : best), null);
    const typesTotal = types.reduce((a, b) => a + (b.total || 0), 0);
    const topTypeShare = topType && typesTotal > 0 ? (topType.total / typesTotal) * 100 : 0;

    const topDpe = dpe.reduce((best, d) => {
      const rate = d.total > 0 ? d.renovated / d.total : 0;
      return !best || rate > best.rate ? { name: d.name, rate } : best;
    }, null);

    return { totalLogements, totalRenoves, globalRate, topArrondissement, topType, topTypeShare, topDpe };
  }, [data]);

  useEffect(() => {
    if (!data || loading || !window.ApexCharts) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    const buildings = (data.buildings ?? [])
      .slice()
      .sort((a, b) => buildingTotals(b).total - buildingTotals(a).total)
      .slice(0, 8);
    const barData = buildings.map((b) => {
      const { total, renovated } = buildingTotals(b);
      return { name: b.name, total, renovated };
    });
    const barEl = document.querySelector('#overviewBatimentChart');
    if (barEl && barData.length > 0 && barData.some((d) => d.total > 0 || d.renovated > 0)) {
      clearContainer('overviewBatimentChart');
      const base = getBarOptions(barData, '');
      const c1 = new window.ApexCharts(barEl, {
        ...base,
        chart: { ...base.chart, height: 220, toolbar: { show: false } },
        legend: { show: false },
        title: { text: '' },
      });
      c1.render();
      chartInstancesRef.current.push(c1);
    }

    const typesShare = toShareData(data.types ?? []);
    const typesEl = document.querySelector('#overviewTypesChart');
    if (typesEl && typesShare.length > 0) {
      clearContainer('overviewTypesChart');
      const base = getDonutOptions(typesShare, 'TYPES');
      const c2 = new window.ApexCharts(typesEl, {
        ...base,
        chart: { ...base.chart, height: 220 },
      });
      c2.render();
      chartInstancesRef.current.push(c2);
    }

    const dpeShare = toShareData((data.dpe ?? []).map((d) => ({ name: d.name, total: d.total })));
    const dpeEl = document.querySelector('#overviewDpeChart');
    if (dpeEl && dpeShare.length > 0) {
      clearContainer('overviewDpeChart');
      const base = getDonutOptions(dpeShare, 'DPE');
      const c3 = new window.ApexCharts(dpeEl, {
        ...base,
        chart: { ...base.chart, height: 220 },
      });
      c3.render();
      chartInstancesRef.current.push(c3);
    }

    return () => {
      chartInstancesRef.current.forEach((instance) => {
        try { instance.destroy(); } catch (e) {}
      });
      chartInstancesRef.current = [];
    };
  }, [data, loading]);

  if (loading) {
    return (
      <section id="section-overview" className="view-section">
        <div className="rt-loading-wrapper">
          <div className="rt-spinner" />
          <div className="rt-loading-text">Chargement...</div>
        </div>
      </section>
    );
  }

  return (
    <div className="overview-stack space-y-10">
      <section id="section-overview" className="view-section">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="card p-6 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">apartment</span></div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Logements</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{kpis.totalLogements.toLocaleString()}</div>
          </div>

          <div className="card p-6 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">check_circle</span></div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Logements Rénovés</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {kpis.totalRenoves.toLocaleString()}
              <span className="re-badge re-badge--accent ml-2">{kpis.globalRate.toFixed(1)}%</span>
            </div>
          </div>

          <Link to="/batiment" className="card p-6 flex-1 min-w-[200px] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">location_city</span></div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Meilleur Arrondissement</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {kpis.topArrondissement ? kpis.topArrondissement.name : '—'}
              {kpis.topArrondissement && (
                <span className="re-badge re-badge--accent ml-2">{(kpis.topArrondissement.rate * 100).toFixed(1)}%</span>
              )}
            </div>
          </Link>

          <Link to="/types" className="card p-6 flex-1 min-w-[200px] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">construction</span></div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Travaux Dominants</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {kpis.topType ? kpis.topType.name : '—'}
              {kpis.topType && <span className="re-badge re-badge--accent ml-2">{kpis.topTypeShare.toFixed(1)}%</span>}
            </div>
          </Link>

          <Link to="/dpe" className="card p-6 flex-1 min-w-[200px] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-icon-btn"><span className="material-symbols-outlined text-primary">bolt</span></div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Classe DPE la + Rénovée</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {kpis.topDpe ? kpis.topDpe.name : '—'}
              {kpis.topDpe && (
                <span className="re-badge re-badge--accent ml-2">{(kpis.topDpe.rate * 100).toFixed(1)}%</span>
              )}
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Bâtiments</h3>
              <Link to="/batiment" className="text-xs font-semibold text-primary hover:underline">Voir plus →</Link>
            </div>
            <div id="overviewBatimentChart" style={{ height: '220px' }} />
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Types de Travaux</h3>
              <Link to="/types" className="text-xs font-semibold text-primary hover:underline">Voir plus →</Link>
            </div>
            <div id="overviewTypesChart" style={{ height: '220px' }} />
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase">Classe DPE</h3>
              <Link to="/dpe" className="text-xs font-semibold text-primary hover:underline">Voir plus →</Link>
            </div>
            <div id="overviewDpeChart" style={{ height: '220px' }} />
          </div>
        </div>
      </section>

      {/* Affichage ensemble — même UI que Bâtiments, chiffres = totalité */}
      <BatimentSectionPanel
        sectionId="section-overview-affichage"
        title="Ensemble des données"
        data={data}
        loading={loading}
        year="all"
      />
    </div>
  );
}
