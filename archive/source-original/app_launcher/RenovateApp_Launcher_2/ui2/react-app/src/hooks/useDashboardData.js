import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardData, summarizeDashboardData } from '../api/dashboardApi';

/**
 * React hook equivalent to mainController's initial fetchDashboardData() call.
 */
export function useDashboardData() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchDashboardData(forceRefresh);
      setData(result);
      setSummary(summarizeDashboardData(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      setData(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, summary, loading, error, refresh: () => load(true) };
}
