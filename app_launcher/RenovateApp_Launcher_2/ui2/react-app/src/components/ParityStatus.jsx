import { useDashboardData } from '../hooks/useDashboardData';

function DatasetCard({ label, stats }) {
  if (!stats) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="mt-2 text-2xl font-bold text-blue-600">{stats.rows}</p>
      <p className="text-xs text-slate-500">{stats.years} année(s) de données</p>
    </div>
  );
}

export default function ParityStatus() {
  const { summary, loading, error, refresh } = useDashboardData();

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Phase 1 — Parité API
          </p>
          <h2 className="text-xl font-bold text-slate-900">
            Connexion React → Django API
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Mêmes endpoints que <code className="text-xs">static/js/apiFetch.js</code> — MVT
            inchangé.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Rafraîchir
        </button>
      </div>

      {loading && (
        <p className="rounded-lg bg-white p-4 text-sm text-slate-600">
          Chargement des données via <code>/api/dashboard/</code>…
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">API indisponible</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-xs text-red-600">
            Lancez Django sur le port 8000, puis{' '}
            <code>npm run dev</code> (proxy Vite → :8000).
          </p>
        </div>
      )}

      {!loading && !error && summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <DatasetCard label="Bâtiments (tableau_recherche)" stats={summary.buildings} />
          <DatasetCard label="Types travaux" stats={summary.types} />
          <DatasetCard label="Classes DPE" stats={summary.dpe} />
        </div>
      )}

      {!loading && !error && (
        <p className="mt-4 text-xs text-slate-500">
          Comparez ces chiffres avec le dashboard MVT (:8000/dashboard/) — ils doivent
          correspondre avant toute migration UI.
        </p>
      )}
    </section>
  );
}
