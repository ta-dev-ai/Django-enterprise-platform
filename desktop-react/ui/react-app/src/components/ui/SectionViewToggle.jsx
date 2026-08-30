const MODES = [
  { id: 'chart', label: 'Graphique', icon: 'show_chart' },
  { id: 'table', label: 'Données', icon: 'table_rows' },
  { id: '3d', label: 'Carte 3D', icon: 'view_in_ar' },
];

export default function SectionViewToggle({ mode, onChange }) {
  return (
    <div className="re-toggle-pill-group" role="tablist" aria-label="Mode d'affichage">
      {MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={mode === item.id}
          className={`re-toggle-pill-btn ${mode === item.id ? 're-toggle-pill-btn--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="material-symbols-outlined text-[17px] leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
