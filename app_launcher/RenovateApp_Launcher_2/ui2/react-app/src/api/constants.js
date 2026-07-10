/** Mirrors static/js/apiFetch.js — React uses its own cache key to avoid MVT conflicts. */
export const API_BASE = '/api/dashboard/';

export const CACHE_KEY = 'RENOVATION_DASHBOARD_DATA_REACT_V1';
export const CACHE_DURATION = 0;

/** Internal key -> API filename (same mapping as apiFetch.js) */
export const DATA_SOURCES = {
  buildings: 'tableau_recherche',
  types: 'tableau_types_travaux',
  dpe: 'tableau_classes_dpe',
};
