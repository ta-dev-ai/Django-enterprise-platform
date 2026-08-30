import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import BatimentSectionPanel from './BatimentSectionPanel';
import { processBuildings, processDpe, processTypes } from '../../utils/dataProcessor';
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

const CHART_H = 300;

/**
 * Vue d'ensemble — toujours l'ensemble des années (indépendant du filtre sidebar).
 * 1) KPIs + aperçus (20 arrondissements)
 * 2) Affichage Graphique / Données / Carte 3D sur le même ensemble
 */
export default function OverviewSection({ data, rawData, loading }) {
  const chartInstancesRef = useRef([]);

  // Source de vérité ensemble : rawData forcé year=all (évite filtre année résiduel)
  const ensemble = useMemo(() => {
    if (rawData) {
      return {
        buildings: processBuildings(rawData.buildings, 'all'),
        types: processTypes(rawData.types, 'all'),
        dpe: processDpe(rawData.dpe, 'all'),
      };
    }
    return data ?? { buildings: [], types: [], dpe: [] };
  }, [rawData, data]);

  const kpis = useMemo(() => {
    const buildings = ensemble.buildings ?? [];
    const types = ensemble.types ?? [];

    const totalLogements = buildings.reduce((a, b) => a + buildingTotals(b).total, 0);
    const totalRenoves = buildings.reduce((a, b) => a + buildingTotals(b).renovated, 0);
    const globalRate = totalLogements > 0 ? (totalRenoves / totalLogements) * 100 : 0;

    const topArrondissement = buildings.reduce((best, b) => {
      const { renovated, total } = buildingTotals(b);
      if (!best || renovated > best.renovated) {
        return { name: b.name, renovated, rate: total > 0 ? renovated / total : 0 };
      }
      return best;
    }, null);

    const topType = types.reduce((best, t) => (!best || t.total > best.total ? t : best), null);
    const typesTotal = types.reduce((a, b) => a + (b.total || 0), 0);
    const topTypeShare = topType && typesTotal > 0 ? (topType.total / typesTotal) * 100 : 0;

    return {
      totalLogements,
      totalRenoves,
      globalRate,
      topArrondissement,
      topType,
      topTypeShare,
      arrCount: buildings.length,
    };
  }, [ensemble]);

  useEffect(() => {
    if (loading || !window.ApexCharts) return;
    const buildings = ensemble.buildings ?? [];
    if (buildings.length === 0 && !(ensemble.types?.length) && !(ensemble.dpe?.length)) return;

    chartInstancesRef.current.forEach((instance) => {
      try { instance.destroy(); } catch (e) {}
    });
    chartInstancesRef.current = [];

    // Tous les arrondissements (1e → 20e), pas un top-N
    const barData = buildings
      .slice()
      .sort((a, b) => Number(a.arrondissement) - Number(b.arrondissement))
      .map((b) => {
        const { total, renovated } = buildingTotals(b);
        return { name: b.name, total, renovated };
      });

    const barEl = document.querySelector('#overviewBatimentChart');
    if (barEl && barData.length > 0) {
      clearContainer('overviewBatimentChart');
      const base = getBarOptions(barData, '');
      const c1 = new window.ApexCharts(barEl, {
        ...base,
        chart: { ...base.chart, height: CHART_H, toolbar: { show: false } },
        legend: { show: true, position: 'bottom' },
        title: { text: '' },
      });
      c1.render();
      chartInstancesRef.current.push(c1);
    }

    const typesShare = toShareData(ensemble.types ?? []);
    const typesEl = document.querySelector('#overviewTypesChart');
    if (typesEl && typesShare.length > 0) {
      clearContainer('overviewTypesChart');
      const base = getDonutOptions(typesShare, 'TYPES');
      const c2 = new window.ApexCharts(typesEl, {
        ...base,
        chart: { ...base.chart, height: CHART_H },
      });
      c2.render();
      chartInstancesRef.current.push(c2);
    }

    // Volumes rénovés par classe (= somme KPI « Rénovés »)
    const dpeShare = toShareData(
      (ensemble.dpe ?? []).map((d) => ({ name: d.name, total: d.renovated || 0 })),
    );
    const dpeEl = document.querySelector('#overviewDpeChart');
    if (dpeEl && dpeShare.length > 0) {
      clearContainer('overviewDpeChart');
      const base = getDonutOptions(dpeShare, 'DPE');
      const c3 = new window.ApexCharts(dpeEl, {
        ...base,
        chart: { ...base.chart, height: CHART_H },
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
  }, [ensemble, loading]);

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
    <div className="overview-stack">
      <section id="section-overview" className="view-section overview-summary">
        <div className="dashboard-bento-kpi-grid" role="list">
          {/* Card 1: TOTAL LOGEMENTS */}
          <div className="bento-kpi-card" role="listitem">
            <div className="bento-kpi-top">
              <div className="bento-kpi-icon-box icon-box-blue">
                <span className="material-symbols-outlined">apartment</span>
              </div>
              <div className="bento-kpi-info">
                <span className="bento-kpi-label">TOTAL LOGEMENTS</span>
                <span className="bento-kpi-value">{kpis.totalLogements.toLocaleString('fr-FR')}</span>
              </div>
            </div>
            <div className="bento-kpi-bottom">
              <span className="bento-kpi-trend trend-up">
                <span className="trend-arrow">&uarr;</span> 12.4% <span className="trend-period">vs Avril 2026</span>
              </span>
              <div className="bento-kpi-sparkline-wrap">
                <svg className="bento-kpi-sparkline sparkline-blue" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,24 Q20,28 35,16 T70,18 T100,6" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: LOGEMENTS RÉNOVÉS */}
          <div className="bento-kpi-card" role="listitem">
            <div className="bento-kpi-top">
              <div className="bento-kpi-icon-box icon-box-green">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="bento-kpi-info">
                <span className="bento-kpi-label">LOGEMENTS RÉNOVÉS</span>
                <div className="bento-kpi-value-row">
                  <span className="bento-kpi-value">{kpis.totalRenoves.toLocaleString('fr-FR')}</span>
                  <span className="bento-kpi-pill pill-blue">{kpis.globalRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="bento-kpi-bottom">
              <span className="bento-kpi-trend trend-up">
                <span className="trend-arrow">&uarr;</span> 8.7% <span className="trend-period">vs Avril 2026</span>
              </span>
              <div className="bento-kpi-sparkline-wrap">
                <svg className="bento-kpi-sparkline sparkline-green" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,22 Q25,26 45,18 T75,12 T100,4" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: ARRONDISSEMENT PHARE */}
          <Link to="/batiment" className="bento-kpi-card bento-kpi-card--link" role="listitem">
            <div className="bento-kpi-top">
              <div className="bento-kpi-icon-box icon-box-purple">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="bento-kpi-info">
                <span className="bento-kpi-label">ARRONDISSEMENT PHARE</span>
                <div className="bento-kpi-value-row">
                  <span className="bento-kpi-value">{kpis.topArrondissement ? kpis.topArrondissement.name : '—'}</span>
                  {kpis.topArrondissement && (
                    <span className="bento-kpi-pill pill-blue">
                      {(kpis.topArrondissement.rate * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="bento-kpi-bottom">
              <span className="bento-kpi-subtext">Performance rénovation</span>
              <div className="bento-kpi-sparkline-wrap">
                <svg className="bento-kpi-sparkline sparkline-purple" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,25 Q20,20 40,25 T75,18 T100,8" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card 4: TYPES DE TRAVAUX */}
          <Link to="/types" className="bento-kpi-card bento-kpi-card--link" role="listitem">
            <div className="bento-kpi-top">
              <div className="bento-kpi-icon-box icon-box-amber">
                <span className="material-symbols-outlined">construction</span>
              </div>
              <div className="bento-kpi-info">
                <span className="bento-kpi-label">TYPES DE TRAVAUX</span>
                <div className="bento-kpi-value-row">
                  <span className="bento-kpi-value">{kpis.topType ? kpis.topType.name : '—'}</span>
                  {kpis.topType && (
                    <span className="bento-kpi-pill pill-amber">{kpis.topTypeShare.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bento-kpi-bottom">
              <span className="bento-kpi-subtext">Catégorie la plus réalisée</span>
              <div className="bento-kpi-sparkline-wrap">
                <svg className="bento-kpi-sparkline sparkline-amber" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,26 Q25,28 45,16 T75,20 T100,5" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <p className="overview-ensemble-hint">
          Vue d&apos;ensemble · toutes les années · {kpis.arrCount} arrondissements
        </p>

        <div className="overview-preview-stack">
          <article className="overview-preview-card card">
            <header className="overview-preview-card__head">
              <h3>
                <span className="material-symbols-outlined overview-preview-card__icon" aria-hidden="true">apartment</span>
                Bâtiments rénovés
              </h3>
              <Link to="/batiment">Voir plus →</Link>
            </header>
            <div id="overviewBatimentChart" className="overview-preview-card__chart" />
          </article>

          <article className="overview-preview-card card">
            <header className="overview-preview-card__head">
              <h3>
                <span className="material-symbols-outlined overview-preview-card__icon" aria-hidden="true">construction</span>
                Types de travaux
              </h3>
              <Link to="/types">Voir plus →</Link>
            </header>
            <div id="overviewTypesChart" className="overview-preview-card__chart" />
          </article>

          <article className="overview-preview-card card">
            <header className="overview-preview-card__head">
              <h3>
                <span className="material-symbols-outlined overview-preview-card__icon" aria-hidden="true">bolt</span>
                Classes DPE
              </h3>
              <Link to="/dpe">Voir plus →</Link>
            </header>
            <div id="overviewDpeChart" className="overview-preview-card__chart" />
          </article>
        </div>
      </section>

      <BatimentSectionPanel
        sectionId="section-overview-affichage"
        title="Ensemble des données"
        icon="analytics"
        data={ensemble}
        loading={loading}
        year="all"
      />
    </div>
  );
}
