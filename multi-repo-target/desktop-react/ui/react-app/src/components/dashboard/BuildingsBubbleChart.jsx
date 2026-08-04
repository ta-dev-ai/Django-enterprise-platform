import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="re-bubble-tooltip">
      <strong>{d.name}</strong>
      <div>Total : {d.total.toLocaleString('fr-FR')}</div>
      <div>Rénovés : {d.renovated.toLocaleString('fr-FR')}</div>
      <div>Taux : {d.rate}%</div>
    </div>
  );
}

export default function BuildingsBubbleChart({ data }) {
  const [ready, setReady] = useState(data.length > 0);

  useEffect(() => {
    if (data.length > 0) {
      setReady(true);
      return undefined;
    }

    const poll = setInterval(() => {
      const fc = window.frontController;
      if (fc?.isInitialized && fc.rawData) {
        setReady(true);
        clearInterval(poll);
      }
    }, 400);

    return () => clearInterval(poll);
  }, [data.length]);

  const points = useMemo(() => {
    return data.map((d) => {
      const total = (d.logements_prives ?? 0) + (d.logements_sociaux ?? 0) || d.total_logements || 0;
      const renovated =
        d.total_logements_renoves ??
        (d.logements_prives_renoves ?? 0) + (d.logements_sociaux_renoves ?? 0);
      const rate = total > 0 ? Math.round((renovated / total) * 100) : 0;
      return {
        name: d.name ?? `${d.arrondissement}e`,
        arrondissement: d.arrondissement,
        total,
        renovated,
        rate,
        z: Math.max(total, 1),
      };
    });
  }, [data]);

  if (!ready || points.length === 0) {
    return (
      <div className="re-data-card re-data-card--loading">
        <div className="rt-spinner" />
        <p>Chargement des données graphiques…</p>
      </div>
    );
  }

  return (
    <div className="re-data-card">
      <div className="re-data-card__header">
        <div className="re-data-card__brand">
          <div className="re-data-card__logo" aria-hidden>
            <span className="material-symbols-outlined">bubble_chart</span>
          </div>
          <div>
            <h3 className="re-data-card__title">Vue bulles — Paris 1-20</h3>
            <p className="re-data-card__subtitle">
              Taille = volume total · Position Y = logements rénovés · Couleur = arrondissement
            </p>
          </div>
        </div>
      </div>
      <div className="re-bubble-chart">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="arrondissement"
              name="Arrondissement"
              domain={[0.5, 20.5]}
              tickCount={20}
              stroke="#64748b"
              fontSize={11}
            />
            <YAxis
              type="number"
              dataKey="renovated"
              name="Rénovés"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => v.toLocaleString('fr-FR')}
            />
            <ZAxis type="number" dataKey="z" range={[80, 800]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={points}
              fill="#0ea5e9"
              fillOpacity={0.65}
              stroke="#0284c7"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
