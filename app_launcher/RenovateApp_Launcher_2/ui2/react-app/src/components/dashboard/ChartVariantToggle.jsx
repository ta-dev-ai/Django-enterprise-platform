const VARIANTS = [
  { id: 'bars', label: 'Barres' },
  { id: 'donut', label: 'Anneau' },
  { id: 'bubble', label: 'Bulles' },
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
          {item.label}
        </button>
      ))}
    </div>
  );
}
