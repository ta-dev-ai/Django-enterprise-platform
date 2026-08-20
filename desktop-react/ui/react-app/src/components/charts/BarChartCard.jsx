export default function BarChartCard({ title, children }) {
  return (
    <div className="chart-card bar-chart-card bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      {title && <h4 className="text-sm font-bold mb-3 text-slate-700">{title}</h4>}
      {children}
    </div>
  );
}
