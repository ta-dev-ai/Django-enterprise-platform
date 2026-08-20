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

const DPE_COLORS = {
  A: '#009036',
  B: '#53af31',
  C: '#c6d802',
  D: '#f5e700',
  E: '#fbad18',
  F: '#ec661e',
  G: '#e31d2b',
};

const FALLBACK_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
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

export default function DpeAnalyticsCharts({ rawData }) {
  const { barData, pieData, isDrillDown } = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return { barData: [], pieData: [], isDrillDown: false };
    }

    const checkDrillDown = rawData.length > 0 && rawData[0].type && String(rawData[0].type).endsWith('e');
    const totalVal = rawData.reduce((acc, curr) => acc + Number(curr.count !== undefined ? curr.count : curr.total || 0), 0);

    const processedPie = rawData.map((d, index) => {
      const name = checkDrillDown ? d.type : `Classe ${d.classe}`;
      const color = checkDrillDown
        ? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
        : DPE_COLORS[d.classe] || '#cbd5e1';
      const val = Number(d.count !== undefined ? d.count : d.total || 0);

      return {
        name,
        value: val,
        percent: totalVal > 0 ? Math.round((val / totalVal) * 1000) / 10 : 0,
        color,
      };
    });

    const processedBar = rawData.map((d, index) => {
      const name = checkDrillDown ? d.type : `Classe ${d.classe}`;
      return {
        name,
        'Nombre de Logements': Number(d.count !== undefined ? d.count : d.total || 0),
        color: checkDrillDown ? FALLBACK_COLORS[index % FALLBACK_COLORS.length] : DPE_COLORS[d.classe] || '#3b82f6',
      };
    });

    return { barData: processedBar, pieData: processedPie, isDrillDown: checkDrillDown };
  }, [rawData]);

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">
          {isDrillDown ? 'Répartition par Arrondissement (Performance Energetique)' : 'Répartition par Classe DPE'}
        </h3>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Nombre de Logements" fill="#10b981" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart & List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-6">Répartition Énergétique Global (DPE)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DPE</span>
              <span className="text-xl font-extrabold text-slate-800">
                {pieData.reduce((a, b) => a + b.value, 0).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SplitLegendList data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
