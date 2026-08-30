import { useMemo, useState, useEffect } from 'react';
import {
  getColumnLabel,
  getColumnMeta,
  partitionColumns,
  getVisibleTableColumns,
} from '../../constants/tableColumnMeta';
import { exportCsv as downloadCsv } from '../../utils/exportCsv';

const PAGE_SIZES = [25, 50, 100];

const DPE_COLORS = {
  A: { bg: '#166534', text: '#fff' },
  B: { bg: '#22c55e', text: '#fff' },
  C: { bg: '#84cc16', text: '#1e293b' },
  D: { bg: '#eab308', text: '#1e293b' },
  E: { bg: '#f97316', text: '#fff' },
  F: { bg: '#ef4444', text: '#fff' },
  G: { bg: '#991b1b', text: '#fff' },
};

function formatCell(col, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (String(value).trim() === '-') return '—';

  const meta = getColumnMeta(col);
  if (meta.date && /^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    try {
      return new Date(value).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return value;
    }
  }

  return value;
}

function isDpeClassColumn(col) {
  const meta = getColumnMeta(col);
  return meta.dpe === true && /classe|etiquette/i.test(col);
}

function DpeBadge({ value }) {
  const letter = String(value).trim().toUpperCase().charAt(0);
  const style = DPE_COLORS[letter];
  if (!style) return formatCell('', value);
  return (
    <span className="re-dpe-badge" style={{ '--re-dpe-dot': style.bg }}>
      <span className="re-dpe-badge__dot" />
      Classe {letter}
    </span>
  );
}

function getRowId(row, fallbackIndex) {
  if (row.numero_dpe) return `dpe:${row.numero_dpe}`;
  if (row.n_dpe) return `dpe:${row.n_dpe}`;
  if (row.id != null) return `id:${row.id}`;
  return `row:${fallbackIndex}:${row.adresse_brut ?? ''}|${row.code_postal_ban ?? ''}|${row.date_etablissement_dpe ?? ''}`;
}

export default function EnterpriseDataTable({
  title = 'Données bâtiments',
  subtitle = 'Registre professionnel — Paris 1-20',
  columns,
  rows,
  onSelectionChange,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [showDetailColumns, setShowDetailColumns] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const { detail: detailCols } = useMemo(() => partitionColumns(columns), [columns]);
  const displayColumns = useMemo(
    () => getVisibleTableColumns(columns, showDetailColumns),
    [columns, showDetailColumns],
  );
  const detailColSet = useMemo(() => new Set(detailCols), [detailCols]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, columns, query]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      const aEmpty = av === null || av === undefined || av === '';
      const bEmpty = bv === null || bv === undefined || bv === '';
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;
      const cmp = String(av).localeCompare(String(bv), 'fr', { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const sortedWithIds = useMemo(
    () => sorted.map((row, index) => ({ row, id: getRowId(row, index) })),
    [sorted],
  );

  const pageCount = Math.max(1, Math.ceil(sortedWithIds.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = sortedWithIds.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const pageIds = pageItems.map((item) => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const selectedRows = useMemo(
    () => sortedWithIds.filter((item) => selectedIds.has(item.id)).map((item) => item.row),
    [sortedWithIds, selectedIds],
  );

  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const toggleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setPage(0);
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePageSelection = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleExport = () => {
    const cols = showDetailColumns ? columns : displayColumns;
    const exportRows = selectedRows.length > 0 ? selectedRows : sorted;
    const suffix = selectedRows.length > 0 ? `-selection-${selectedRows.length}` : '';
    downloadCsv(cols, exportRows, `renovateenergy-export${suffix}.csv`);
  };

  if (columns.length === 0) {
    return (
      <div className="re-data-card et-table-card">
        <p className="re-empty">Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    <div className="re-data-card et-table-card">
      <div className="re-data-card__header et-table-card__header">
        <div className="re-data-card__brand">
          <div className="re-data-card__logo et-table-card__logo" aria-hidden>
            <span className="material-symbols-outlined">energy_savings_leaf</span>
          </div>
          <div>
            <h3 className="re-data-card__title et-table-card__title">{title}</h3>
            <p className="re-data-card__subtitle re-audience-hint">{subtitle}</p>
          </div>
        </div>
        <div className="re-data-card__meta">
          <span className="re-badge et-badge">{sorted.length.toLocaleString('fr-FR')} lignes</span>
          {selectedIds.size > 0 && (
            <span className="re-badge et-badge et-badge--selection">
              {selectedIds.size.toLocaleString('fr-FR')} sélectionnée{selectedIds.size > 1 ? 's' : ''}
            </span>
          )}
          <input
            type="search"
            className="re-search et-search"
            placeholder="Rechercher adresse, DPE, code postal…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            aria-label="Rechercher dans le tableau"
          />
          {detailCols.length > 0 && (
            <button
              type="button"
              className={`et-btn-columns ${showDetailColumns ? 'et-btn-columns--active' : ''}`}
              onClick={() => setShowDetailColumns((v) => !v)}
              aria-pressed={showDetailColumns}
            >
              {showDetailColumns ? 'Masquer détails' : `+ ${detailCols.length} colonnes détail`}
            </button>
          )}
          {selectedIds.size > 0 && (
            <button type="button" className="et-btn-columns" onClick={clearSelection}>
              Tout désélectionner
            </button>
          )}
          <button type="button" className="re-btn-export" onClick={handleExport}>
            {selectedRows.length > 0
              ? `Export CSV (${selectedRows.length})`
              : 'Export CSV'}
          </button>
        </div>
      </div>

      <div className="re-table-wrap">
        <table className="re-table et-table">
          <thead>
            <tr>
              <th className="re-table__col-check">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePageSelected && !allPageSelected;
                  }}
                  onChange={togglePageSelection}
                  aria-label="Sélectionner toutes les lignes de la page"
                />
              </th>
              {displayColumns.map((col) => {
                const active = sortCol === col;
                return (
                  <th
                    key={col}
                    className={detailColSet.has(col) ? 'et-col--detail' : ''}
                    aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button
                      type="button"
                      className={`re-th-sort et-th-sort${active ? ' et-th-sort--active' : ''}`}
                      onClick={() => toggleSort(col)}
                    >
                      <span>{getColumnLabel(col)}</span>
                      <span className="material-symbols-outlined re-th-sort-icon" aria-hidden="true">
                        {active ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageItems.map(({ row, id }, idx) => {
              const selected = selectedIds.has(id);
              return (
                <tr
                  key={id}
                  className={[
                    idx % 2 === 0 ? 're-table__row--even' : '',
                    selected ? 're-table__row--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={(e) => {
                    if (e.target.closest('input[type="checkbox"]')) return;
                    toggleRow(id);
                  }}
                >
                  <td className="re-table__col-check">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleRow(id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Sélectionner la ligne ${id}`}
                    />
                  </td>
                  {displayColumns.map((col) => {
                    const val = row[col];
                    const meta = getColumnMeta(col);
                    return (
                      <td
                        key={col}
                        className={[
                          meta.strong ? 're-table__cell--strong' : '',
                          meta.mono ? 're-table__cell--mono' : '',
                          meta.address ? 're-table__cell--address' : '',
                          detailColSet.has(col) ? 're-table__cell--detail et-col--detail' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {isDpeClassColumn(col) ? <DpeBadge value={val} /> : formatCell(col, val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="re-data-card__footer et-table-card__footer re-pagination">
        <div className="re-pagination__controls">
          <button
            type="button"
            className="re-page-btn"
            disabled={safePage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          <span className="re-page-info">
            Page {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            className="re-page-btn"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
          <select
            className="re-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            aria-label="Lignes par page"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
        <span>
          {selectedIds.size > 0
            ? `Export ciblé prêt · ${selectedIds.size} ligne(s)`
            : `Mode ${showDetailColumns ? 'complet' : 'synthèse'} · cache local`}
        </span>
      </div>
    </div>
  );
}
