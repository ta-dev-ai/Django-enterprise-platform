import { CACHE_KEY } from './constants';
import { getDbValue, setDbValue } from '../utils/indexedDbCache';

const TABLE_KEYS = {
  market: 'table_market',
  types: 'table_types',
  dpe: 'table_dpe',
};

const TABLE_CACHE_DURATION = 24 * 60 * 60 * 1000;
const TABLE_CACHE_PREFIX = `${CACHE_KEY}:table`;
const inFlightRequests = new Map();

/** Cache mémoire — un seul téléchargement par clé */
const payloadCache = new Map();

function hasPayloadData(payload) {
  if (!payload) return false;
  if (Array.isArray(payload)) return payload.length > 0;
  if (payload.data?.length) return true;
  return false;
}

async function readTableCache(key) {
  const entry = await getDbValue(`${TABLE_CACHE_PREFIX}:${key}`);
  if (!entry || !entry.timestamp || !entry.data) return null;
  if (Date.now() - entry.timestamp > TABLE_CACHE_DURATION) return null;
  return entry.data;
}

async function writeTableCache(key, data) {
  await setDbValue(`${TABLE_CACHE_PREFIX}:${key}`, {
    timestamp: Date.now(),
    data,
  });
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

  const existingRequest = inFlightRequests.get(key);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const cached = await readTableCache(key);
    if (cached) {
      payloadCache.set(key, cached);
      return cached;
    }

    const payload = await fetchTableDataset(key);
    payloadCache.set(key, payload);
    await writeTableCache(key, payload);
    return payload;
  })();

  inFlightRequests.set(key, request);
  try {
    return await request;
  } finally {
    inFlightRequests.delete(key);
  }
}

export function peekTableDatasetCached(key = 'market') {
  if (payloadCache.has(key)) return payloadCache.get(key);
  return null;
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
    columns.find((c) => /code_postal|postal/i.test(c)) ?? columns.find((c) => /postal/i.test(c));

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
