import { getColumnLabel } from '../constants/tableColumnMeta';

export function exportCsv(columns, rows, filename = 'renovateenergy-export.csv') {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = columns.map((col) => escape(getColumnLabel(col))).join(';');
  const body = rows.map((row) => columns.map((col) => escape(row[col])).join(';')).join('\n');
  const blob = new Blob(['\ufeff' + header + '\n' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJsonRows(rows, filename = 'renovateenergy-export.csv') {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  exportCsv(columns, rows, filename);
}
