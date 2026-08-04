const VARIANTS = [
  { id: 'bars', label: 'Barres', icon: 'bar_chart' },
  { id: 'donut', label: 'Anneau', icon: 'donut_small' },
  { id: 'bubble', label: 'Bulles', icon: 'bubble_chart' },
];

export default function ChartVariantToggle({ variant, onChange }) {
  return (
    <div className="re-chart-toggle" role="tablist" aria-label="Type de graphique">
      {VARIANTS.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={variant === item.id}
          className={`re-chart-toggle-btn ${variant === item.id ? 're-chart-toggle-btn--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="material-symbols-outlined text-base leading-none">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
