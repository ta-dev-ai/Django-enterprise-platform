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
        <div className="overview-kpi-strip" role="list">
          <div className="overview-kpi" role="listitem">
            <span className="material-symbols-outlined overview-kpi__icon" aria-hidden="true">apartment</span>
            <div className="overview-kpi__body">
              <span className="overview-kpi__label">Total logements</span>
              <span className="overview-kpi__value">{kpis.totalLogements.toLocaleString('fr-FR')}</span>
            </div>
          </div>

          <div className="overview-kpi" role="listitem">
            <span className="material-symbols-outlined overview-kpi__icon" aria-hidden="true">verified</span>
            <div className="overview-kpi__body">
              <span className="overview-kpi__label">Logements rénovés</span>
              <span className="overview-kpi__value">
                {kpis.totalRenoves.toLocaleString('fr-FR')}
                <span className="overview-kpi__badge">{kpis.globalRate.toFixed(1)}%</span>
              </span>
            </div>
          </div>

          <Link to="/batiment" className="overview-kpi overview-kpi--link" role="listitem">
            <span className="material-symbols-outlined overview-kpi__icon" aria-hidden="true">location_on</span>
            <div className="overview-kpi__body">
              <span className="overview-kpi__label">Arrondissement phare</span>
              <span className="overview-kpi__value">
                {kpis.topArrondissement ? kpis.topArrondissement.name : '—'}
                {kpis.topArrondissement && (
                  <span className="overview-kpi__badge">
                    {(kpis.topArrondissement.rate * 100).toFixed(1)}%
                  </span>
                )}
              </span>
            </div>
          </Link>

          <Link to="/types" className="overview-kpi overview-kpi--link" role="listitem">
            <span className="material-symbols-outlined overview-kpi__icon" aria-hidden="true">construction</span>
            <div className="overview-kpi__body">
              <span className="overview-kpi__label">Types de travaux</span>
              <span className="overview-kpi__value">
                {kpis.topType ? kpis.topType.name : '—'}
                {kpis.topType && (
                  <span className="overview-kpi__badge">{kpis.topTypeShare.toFixed(1)}%</span>
                )}
              </span>
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
