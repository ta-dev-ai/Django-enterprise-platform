import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionViewToggle from './SectionViewToggle';
import EnterpriseDataTable from './EnterpriseDataTable';
import ParisArrondissement3D from './ParisArrondissement3D';
import BuildingsBubbleChart from './BuildingsBubbleChart';
import { fetchDashboardSource } from '../../api/dashboardApi';
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

function aggregateBuildingsData(payload) {
  const aggregated = new Map();

  const ensureItem = (arrondissement) => {
    if (!aggregated.has(arrondissement)) {
      aggregated.set(arrondissement, {
        arrondissement,
        label: `${arrondissement}e`,
        total: 0,
        renovated: 0,
      });
    }
    return aggregated.get(arrondissement);
  };

  const accumulate = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item) => {
      const arrondissement = Number(item.arrondissement);
      if (!Number.isFinite(arrondissement) || arrondissement < 1 || arrondissement > 20) return;
      const total =
        Number(item.logements_prives ?? 0) + Number(item.logements_sociaux ?? 0) ||
        Number(item.total_logements ?? 0);
      const renovated =
        Number(item.total_logements_renoves ?? 0) ||
        Number(item.logements_prives_renoves ?? 0) + Number(item.logements_sociaux_renoves ?? 0);
      const entry = ensureItem(arrondissement);
      entry.total += total;
      entry.renovated += renovated;
    });
  };

  if (payload && typeof payload === 'object') {
    Object.values(payload).forEach(accumulate);
  }

  return Array.from(aggregated.values())
    .sort((a, b) => a.arrondissement - b.arrondissement)
    .map((item) => ({
      ...item,
      rate: item.total > 0 ? Math.round((item.renovated / item.total) * 100) : 0,
      z: Math.max(item.total, 1),
    }));
}

export default function BatimentSectionPanel({ sectionId = 'section-batiment', onModeChange }) {
  const [mode, setMode] = useState('chart');
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
    let cancelled = false;
    const loadBuildings = async () => {
      try {
        const payload = await fetchDashboardSource('buildings');
        if (!cancelled) {
          setBuildingRows(aggregateBuildingsData(payload));
        }
      } catch (err) {
        console.error('[BatimentSectionPanel] Building source load failed:', err);
        if (!cancelled) {
          setBuildingRows([]);
        }
      }
    };

    loadBuildings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (onModeChange) onModeChange(mode);
  }, [mode, onModeChange]);

  useEffect(() => {
    if (mode === 'chart') return;
    ensureTableData();
  }, [mode, ensureTableData]);

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
        <div className={`re-react-panel${mode === 'table' ? ' re-react-panel--table-mode' : ''}`}>
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
