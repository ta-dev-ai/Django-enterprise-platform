const TABLE_KEYS = {
  market: 'table_market',
  types: 'table_types',
  dpe: 'table_dpe',
};

/** Cache mémoire — un seul téléchargement par clé */
const payloadCache = new Map();

function hasPayloadData(payload) {
  if (!payload) return false;
  if (Array.isArray(payload)) return payload.length > 0;
  if (payload.data?.length) return true;
  return false;
}

function readLegacyPayload(key) {
  const legacy = window.frontController?.rawData?.[key];
  return hasPayloadData(legacy) ? legacy : null;
}

export async function fetchTableDataset(key = 'market') {
  const filename = TABLE_KEYS[key] ?? TABLE_KEYS.market;
  const res = await fetch(`/api/dashboard/${filename}/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Réutilise le cache React, puis le store legacy, sinon fetch une fois */
export async function fetchTableDatasetCached(key = 'market') {
  if (payloadCache.has(key)) {
    return payloadCache.get(key);
  }

  const legacy = readLegacyPayload(key);
  if (legacy) {
    payloadCache.set(key, legacy);
    return legacy;
  }

  const payload = await fetchTableDataset(key);
  payloadCache.set(key, payload);

  if (window.frontController?.rawData) {
    window.frontController.rawData[key] = payload;
  }

  return payload;
}

export function peekTableDatasetCached(key = 'market') {
  if (payloadCache.has(key)) return payloadCache.get(key);
  return readLegacyPayload(key);
}

export function normalizeTablePayload(payload) {
  if (!payload) return { columns: [], rows: [] };

  if (payload.meta?.columns && Array.isArray(payload.data)) {
    const columns = payload.meta.columns;
    const rows = payload.data.map((row) => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
    return { columns, rows };
  }

  if (Array.isArray(payload) && payload.length > 0) {
    const columns = Object.keys(payload[0]);
    return { columns, rows: payload };
  }

  return { columns: [], rows: [] };
}

export function getVisibleColumns(columns, rows) {
  return columns.filter((col) => {
    const filled = rows.filter((row) => {
      const val = row[col];
      return (
        val !== null && val !== undefined && String(val).trim() !== '' && String(val).trim() !== '-'
      );
    }).length;
    return filled > 0;
  });
}

export function aggregateByArrondissement(rows, columns) {
  const postalCol =
    columns.find((c) => /code_postal|postal/i.test(c)) ??
    columns.find((c) => /postal/i.test(c));

  const counts = Array.from({ length: 20 }, (_, i) => ({
    arrondissement: i + 1,
    label: `${i + 1}e`,
    count: 0,
  }));

  if (!postalCol) return counts;

  rows.forEach((row) => {
    const raw = String(row[postalCol] ?? '');
    const match = raw.match(/750(\d{2})/);
    if (!match) return;
    const arr = parseInt(match[1], 10);
    if (arr >= 1 && arr <= 20) counts[arr - 1].count += 1;
  });

  return counts;
}

export function getBuildingChartRows() {
  const fc = window.frontController;
  if (!fc?.isInitialized || !fc.rawData) return [];
  try {
    return fc.processDataForView('batiment') ?? [];
  } catch {
    return [];
  }
}
