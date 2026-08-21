const MODES = [
  { id: 'chart', label: 'Graphique', icon: 'bar_chart' },
  { id: 'table', label: 'Données', icon: 'table_chart' },
  { id: '3d', label: 'Carte 3D', icon: 'public' },
];

export default function SectionViewToggle({ mode, onChange }) {
  return (
    <div className="re-toggle" role="tablist" aria-label="Mode d'affichage">
      {MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={mode === item.id}
          className={`re-toggle-btn ${mode === item.id ? 're-toggle-btn--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="material-symbols-outlined text-base leading-none">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
