import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionViewToggle from '../../components/ui/SectionViewToggle';
import EnterpriseDataTable from '../../components/tables/EnterpriseTable';
import ParisArrondissement3D from '../../components/charts/ParisArrondissement3D';
import { getBarOptions, getDonutOptions, donutColors } from '../../utils/configChart';
import { renderList, clearContainer } from '../../utils/ui';
import {
  aggregateByArrondissement,
  fetchTableDatasetCached,
  getVisibleColumns,
  normalizeTablePayload,
  peekTableDatasetCached,
} from '../../api/tableApi';

function PanelLoader({ text = 'Chargement des données…' }) {
  return (
    <div className="re-data-card re-data-card--loading">
      <div className="rt-spinner" />
      <p>{text}</p>
    </div>
  );
}

function filterRowsByYear(rows, year) {
  if (!year || year === 'all') return rows;
  return rows.filter((row) => String(row.date_etablissement_dpe ?? '').startsWith(year));
}

export default function BatimentSectionPanel({ sectionId = 'section-batiment', onModeChange, data, loading: dataLoading, year = 'all' }) {
  const [mode, setMode] = useState('chart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableState, setTableState] = useState({ columns: [], rows: [] });
  const tableCacheRef = useRef(null);
  const chartInstancesRef = useRef([]);

  const ensureTableData = useCallback(async () => {
    if (tableCacheRef.current) {
      setTableState(tableCacheRef.current);
      return;
    }

    const peek = peekTableDatasetCached('market');
    if (peek) {
      const { columns, rows } = normalizeTablePayload(peek);
      const normalized = { columns: getVisibleColumns(columns, rows), rows };
      tableCacheRef.current = normalized;
      setTableState(normalized);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = await fetchTableDatasetCached('market');
      const { columns, rows } = normalizeTablePayload(payload);
      const normalized = { columns: getVisibleColumns(columns, rows), rows };
      tableCacheRef.current = normalized;
      setTableState(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (onModeChange) onModeChange(mode);
  }, [mode, onModeChange]);

  // Render ApexCharts en mode 'chart' — réagit au filtre année via `data`
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

  useEffect(() => {
    if (mode === 'chart') return;
    ensureTableData();
  }, [mode, ensureTableData]);

  const filteredRows = useMemo(
    () => filterRowsByYear(tableState.rows, year),
    [tableState.rows, year],
  );

  const arrondissementData = useMemo(
    () => aggregateByArrondissement(filteredRows, tableState.columns),
    [filteredRows, tableState.columns],
  );

  const has3dData = !loading && !error && filteredRows.length > 0;
  const [has3dMounted, setHas3dMounted] = useState(false);
  useEffect(() => {
    if (mode === '3d' && has3dData) setHas3dMounted(true);
  }, [mode, has3dData]);

  const showTableContent = mode === 'table' && !loading && !error && filteredRows.length > 0;
  const showTableLoader = mode === 'table' && loading && !tableCacheRef.current;
  const show3dLoader = mode === '3d' && loading && !tableCacheRef.current;

  return (
    <section id={sectionId} className="view-section">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 re-section-toolbar">
        <div className="flex flex-wrap items-center gap-3 order-1 sm:order-1">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500">Affichage</span>
            <div className="flex flex-wrap items-center gap-2">
              <SectionViewToggle mode={mode} onChange={setMode} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 order-2 sm:order-2">
          <div className="neu-icon-btn">
            <span className="material-symbols-outlined text-primary">apartment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Bâtiments (Paris 1-20)</h2>
        </div>
      </div>

      {mode === 'chart' && (
        <div className="charts-container space-y-8">
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Logements Privés</h3>
            <div id="privateChart" style={{ height: '380px' }}>
              {dataLoading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Logements Sociaux</h3>
            <div id="socialChart" style={{ height: '380px' }}>
              {dataLoading && <div className="rt-loading-wrapper"><div className="rt-spinner" /><div className="rt-loading-text">Chargement...</div></div>}
            </div>
          </div>
          <div className="card p-8">
            <h3 className="text-base font-bold text-slate-800 mb-8">Volume Rénovation (Privé)</h3>
            <div className="volume-card-content">
              <div className="chart-section">
                <div id="privateDonut" style={{ width: '100%', height: '350px' }}>
                  {dataLoading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
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
                  {dataLoading && <div className="rt-loading-wrapper"><div className="rt-spinner" /></div>}
                </div>
                <div className="chart-center-label"><span className="chart-center-text">SOCIAL</span></div>
              </div>
              <div className="list-section"><div id="socialListContainer" className="split-list-container" /></div>
            </div>
          </div>
        </div>
      )}

      {showTableLoader && (
        <div className="re-react-panel">
          <PanelLoader />
        </div>
      )}

      {mode === 'table' && error && (
        <div className="re-react-panel">
          <div className="re-data-card re-data-card--error">
            <p>
              Impossible de charger les données ({error}). Vérifiez que Django tourne sur :8000.
            </p>
          </div>
        </div>
      )}

      {showTableContent && (
        <div className={`re-react-panel${mode === 'table' ? ' re-react-panel--table-mode' : ''}`}>
          <EnterpriseDataTable
            title="Registre bâtiments"
            subtitle="Données DPE — tri, pagination et export"
            columns={tableState.columns}
            rows={filteredRows}
          />
        </div>
      )}

      {show3dLoader && (
        <div className="re-react-panel">
          <PanelLoader text="Préparation de la carte 3D…" />
        </div>
      )}

      {mode === '3d' && error && (
        <div className="re-react-panel">
          <div className="re-data-card re-data-card--error">
            <p>Carte 3D indisponible ({error}).</p>
          </div>
        </div>
      )}

      {has3dMounted && (
        <div className="re-react-panel" style={{ display: mode === '3d' ? undefined : 'none' }}>
          <ParisArrondissement3D data={arrondissementData} />
        </div>
      )}
    </section>
  );
}
