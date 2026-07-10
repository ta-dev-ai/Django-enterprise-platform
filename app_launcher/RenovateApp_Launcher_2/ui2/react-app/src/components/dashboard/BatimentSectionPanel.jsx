import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionViewToggle from './SectionViewToggle';
import ChartVariantToggle from './ChartVariantToggle';
import EnterpriseDataTable from './EnterpriseDataTable';
import ParisArrondissement3D from './ParisArrondissement3D';
import BuildingsBubbleChart from './BuildingsBubbleChart';
import {
  aggregateByArrondissement,
  fetchTableDatasetCached,
  getBuildingChartRows,
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

function applyChartVisibility(section, chartVariant) {
  if (!section) return;

  const charts = section.querySelector('.charts-container');
  if (!charts) return;

  charts.querySelectorAll('[data-chart-group]').forEach((el) => {
    const group = el.getAttribute('data-chart-group');
    const show = group === chartVariant;
    el.classList.toggle('hidden', !show);
  });
}

export default function BatimentSectionPanel({ sectionId = 'section-batiment' }) {
  const [mode, setMode] = useState('chart');
  const [chartVariant, setChartVariant] = useState('bars');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableState, setTableState] = useState({ columns: [], rows: [] });
  const tableCacheRef = useRef(null);
  const [buildingRows, setBuildingRows] = useState([]);

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
    const section = document.getElementById(sectionId);
    if (!section) return;

    const charts = section.querySelector('.charts-container');
    const legacyTable = section.querySelector('#batimentTableContainer');
    const bubblePanel = section.querySelector('.re-bubble-panel');

    if (mode === 'chart') {
      charts?.classList.remove('hidden');
      if (legacyTable) legacyTable.classList.add('hidden');
      if (bubblePanel) bubblePanel.classList.toggle('hidden', chartVariant !== 'bubble');
      applyChartVisibility(section, chartVariant);
      if (chartVariant === 'bubble') charts?.classList.add('hidden');
    } else {
      charts?.classList.add('hidden');
      if (legacyTable) legacyTable.classList.add('hidden');
      if (bubblePanel) bubblePanel.classList.add('hidden');
    }
  }, [mode, chartVariant, sectionId]);

  useEffect(() => {
    if (mode === 'chart') return;
    ensureTableData();
  }, [mode, ensureTableData]);

  useEffect(() => {
    if (mode !== 'chart' || chartVariant !== 'bubble') return;

    const sync = () => setBuildingRows(getBuildingChartRows());
    sync();

    const poll = setInterval(() => {
      const rows = getBuildingChartRows();
      if (rows.length > 0) {
        setBuildingRows(rows);
        clearInterval(poll);
      }
    }, 400);

    return () => clearInterval(poll);
  }, [mode, chartVariant]);

  const arrondissementData = useMemo(
    () => aggregateByArrondissement(tableState.rows, tableState.columns),
    [tableState],
  );

  const showTableContent = mode === 'table' && !loading && !error && tableState.rows.length > 0;
  const show3dContent = mode === '3d' && !loading && !error && tableState.rows.length > 0;
  const showTableLoader = mode === 'table' && loading && !tableCacheRef.current;
  const show3dLoader = mode === '3d' && loading && !tableCacheRef.current;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 re-section-toolbar">
        <div className="flex items-center gap-3">
          <div className="neu-icon-btn">
            <span className="material-symbols-outlined text-primary">apartment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Bâtiments (Paris 1-20)</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {mode === 'chart' && (
            <ChartVariantToggle variant={chartVariant} onChange={setChartVariant} />
          )}
          <SectionViewToggle mode={mode} onChange={setMode} />
        </div>
      </div>

      {mode === 'chart' && chartVariant === 'bubble' && (
        <div className="re-bubble-panel re-react-panel">
          <BuildingsBubbleChart data={buildingRows} />
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
        <div className="re-react-panel">
          <EnterpriseDataTable
            title="Registre bâtiments"
            subtitle="Données DPE — tri, pagination et export"
            columns={tableState.columns}
            rows={tableState.rows}
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

      {show3dContent && (
        <div className="re-react-panel">
          <ParisArrondissement3D data={arrondissementData} />
        </div>
      )}
    </>
  );
}
