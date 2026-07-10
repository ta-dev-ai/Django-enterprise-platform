const MODES = [
  { id: 'chart', label: 'Graphique' },
  { id: 'table', label: 'Données' },
  { id: '3d', label: 'Carte 3D' },
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
          {item.label}
        </button>
      ))}
    </div>
  );
}
