import { useMemo, useState } from 'react';

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

function formatHeader(col) {
  return col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCell(col, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (String(value).trim() === '-') return '—';

  if (/date/i.test(col) && /^\d{4}-\d{2}-\d{2}/.test(String(value))) {
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

function isBoldColumn(col) {
  return /adresse|address/i.test(col);
}

function isMonoColumn(col) {
  return /numero_dpe|dpe|id/i.test(col);
}

function isDpeClassColumn(col) {
  return /classe.*dpe|dpe.*classe|etiquette/i.test(col);
}

function DpeBadge({ value }) {
  const letter = String(value).trim().toUpperCase().charAt(0);
  const style = DPE_COLORS[letter];
  if (!style) return formatCell('', value);
  return (
    <span className="re-dpe-badge" style={{ background: style.bg, color: style.text }}>
      {letter}
    </span>
  );
}

function exportCsv(columns, rows, filename = 'renovateenergy-export.csv') {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = columns.map(escape).join(';');
  const body = rows.map((row) => columns.map((col) => escape(row[col])).join(';')).join('\n');
  const blob = new Blob(['\ufeff' + header + '\n' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EnterpriseDataTable({
  title = 'Données bâtiments',
  subtitle = 'Aperçu professionnel — Paris 1-20',
  columns,
  rows,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

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
      const av = String(a[sortCol] ?? '');
      const bv = String(b[sortCol] ?? '');
      const cmp = av.localeCompare(bv, 'fr', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setPage(0);
  };

  if (columns.length === 0) {
    return (
      <div className="re-data-card">
        <p className="re-empty">Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    <div className="re-data-card">
      <div className="re-data-card__header">
        <div className="re-data-card__brand">
          <div className="re-data-card__logo" aria-hidden>
            <span className="material-symbols-outlined">energy_savings_leaf</span>
          </div>
          <div>
            <h3 className="re-data-card__title">{title}</h3>
            <p className="re-data-card__subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="re-data-card__meta">
          <span className="re-badge">{sorted.length.toLocaleString('fr-FR')} lignes</span>
          <input
            type="search"
            className="re-search"
            placeholder="Rechercher adresse, DPE, code postal…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            aria-label="Rechercher dans le tableau"
          />
          <button
            type="button"
            className="re-btn-export"
            onClick={() => exportCsv(columns, sorted)}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="re-table-wrap">
        <table className="re-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>
                  <button
                    type="button"
                    className="re-th-sort"
                    onClick={() => toggleSort(col)}
                  >
                    {formatHeader(col)}
                    {sortCol === col && (
                      <span className="re-th-sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => (
              <tr key={`${safePage}-${idx}`} className={idx % 2 === 0 ? 're-table__row--even' : ''}>
                {columns.map((col) => {
                  const val = row[col];
                  return (
                    <td
                      key={col}
                      className={[
                        isBoldColumn(col) ? 're-table__cell--strong' : '',
                        isMonoColumn(col) ? 're-table__cell--mono' : '',
                        /adresse/i.test(col) ? 're-table__cell--address' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {isDpeClassColumn(col) ? <DpeBadge value={val} /> : formatCell(col, val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="re-data-card__footer re-pagination">
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
        <span>RenovateEnergy — données en cache local</span>
      </div>
    </div>
  );
}
