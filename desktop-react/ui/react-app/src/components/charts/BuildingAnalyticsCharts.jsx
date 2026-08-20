import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DONUT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#4f46e5', '#6366f1',
  '#6d28d9', '#4c1d95'
];

function SplitLegendList({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-slate-700 truncate">{item.name}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <span className="font-bold text-slate-800">{item.value.toLocaleString('fr-FR')}</span>
            <span className="text-slate-400 font-medium">{item.percent}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BuildingAnalyticsCharts({ rawData }) {
  const { privateBarData, socialBarData, privatePieData, socialPieData } = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { privateBarData: [], socialBarData: [], privatePieData: [], socialPieData: [] };
    }

    const privBar = rawData.map((d) => ({
      name: d.name || `${d.arrondissement}e`,
      'Logements Privés': Number(d.logements_prives || 0),
      'Privés Rénovés': Number(d.logements_prives_renoves || 0),
    }));

    const socBar = rawData.map((d) => ({
      name: d.name || `${d.arrondissement}e`,
      'Logements Sociaux': Number(d.logements_sociaux || 0),
      'Sociaux Rénovés': Number(d.logements_sociaux_renoves || 0),
    }));

    const totalPrivRenov = rawData.reduce((acc, curr) => acc + Number(curr.logements_prives_renoves || 0), 0);
    const privPie = rawData.map((d, i) => {
      const val = Number(d.logements_prives_renoves || 0);
      return {
        name: d.name || `${d.arrondissement}e`,
        value: val,
        percent: totalPrivRenov > 0 ? Math.round((val / totalPrivRenov) * 1000) / 10 : 0,
        color: DONUT_COLORS[i % DONUT_COLORS.length],
      };
    });

    const totalSocRenov = rawData.reduce((acc, curr) => acc + Number(curr.logements_sociaux_renoves || 0), 0);
    const socPie = rawData.map((d, i) => {
      const val = Number(d.logements_sociaux_renoves || 0);
      return {
        name: d.name || `${d.arrondissement}e`,
        value: val,
        percent: totalSocRenov > 0 ? Math.round((val / totalSocRenov) * 1000) / 10 : 0,
        color: DONUT_COLORS[i % DONUT_COLORS.length],
      };
    });

    return { privateBarData: privBar, socialBarData: socBar, privatePieData: privPie, socialPieData: socPie };
  }, [rawData]);

  return (
    <div className="space-y-8">
      {/* Logements Privés - Barres */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">
          Logements Privés par Arrondissement (Total vs Rénovés)
        </h3>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={privateBarData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Logements Privés" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Privés Rénovés" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logements Sociaux - Barres */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">
          Logements Sociaux (HLM) par Arrondissement (Total vs Rénovés)
        </h3>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={socialBarData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Logements Sociaux" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sociaux Rénovés" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Rénovation Privé - Donut & Liste */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-6">Volume Rénovation (Parc Privé)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={privatePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {privatePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PRIVÉ</span>
              <span className="text-xl font-extrabold text-slate-800">
                {privatePieData.reduce((a, b) => a + b.value, 0).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SplitLegendList data={privatePieData} />
          </div>
        </div>
      </div>

      {/* Volume Rénovation Social - Donut & Liste */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-6">Volume Rénovation (Parc Social)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={socialPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {socialPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SOCIAL</span>
              <span className="text-xl font-extrabold text-slate-800">
                {socialPieData.reduce((a, b) => a + b.value, 0).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SplitLegendList data={socialPieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
