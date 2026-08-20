import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData, summarizeDashboardData } from '../api/dashboardApi';
import { processBuildings, processDpe, processTypes } from '../utils/dataProcessor';

/**
 * useDashboardData — Équivalent React du FrontController legacy.
 *
 * - rawData  : données brutes de l'API (format { annee: [...] })
 * - data     : données TRAITÉES et agrégées, prêtes pour ApexCharts
 *              (réplique de processDataForView du mainController.js legacy)
 * - year     : filtre par année (setter exposé)
 */
export function useDashboardData() {
  const [rawData, setRawData] = useState(null);
  const [data, setData]       = useState({ buildings: [], types: [], dpe: [] });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [year, setYear]       = useState('all');
  const [type, setType]       = useState('all');
  const [dpeClass, setDpeClass] = useState('all');

  // Traite les données brutes selon le filtre d'année — réplique processDataForView()
  const process = useCallback((raw, selectedYear) => {
    if (!raw) return { buildings: [], types: [], dpe: [] };
    return {
      buildings: processBuildings(raw.buildings, selectedYear),
      types:     processTypes(raw.types, selectedYear),
      dpe:       processDpe(raw.dpe, selectedYear),
    };
  }, []);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboardData(forceRefresh);
      setRawData(result);
      const processed = process(result, 'all');
      setData(processed);
      setSummary(summarizeDashboardData(processed));
    } catch (err) {
      console.error('[useDashboardData] Erreur:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      setRawData(null);
      setData({ buildings: [], types: [], dpe: [] });
    } finally {
      setLoading(false);
    }
  }, [process]);

  // Reprocess when year filter changes
  useEffect(() => {
    if (!rawData) return;
    setData(process(rawData, year));
  }, [year, rawData, process]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    rawData,
    summary,
    loading,
    error,
    year,
    setYear,
    type,
    setType,
    dpeClass,
    setDpeClass,
    refresh: () => load(true),
  };
}
