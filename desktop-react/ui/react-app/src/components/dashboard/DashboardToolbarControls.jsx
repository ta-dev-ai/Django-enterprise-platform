import { useState, useRef, useEffect } from 'react';

/**
 * Composant de Contrôles Interactifs Fonctionnels (Période, Filtres, Export)
 */
export default function DashboardToolbarControls({
  currentYear = 'all',
  onYearChange,
  onSectorChange,
  activeSector = 'all',
  data,
}) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState('1 Mai – 31 Mai 2026');

  const periodRef = useRef(null);
  const filterRef = useRef(null);
  const exportRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (periodRef.current && !periodRef.current.contains(event.target)) {
        setPeriodOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodSelect = (yearVal, label) => {
    setSelectedPeriodLabel(label);
    if (onYearChange) onYearChange(yearVal);
    setPeriodOpen(false);
  };

  const handleSectorSelect = (sector) => {
    if (onSectorChange) onSectorChange(sector);
    setFilterOpen(false);
  };

  // --- Real Export Functions ---
  const exportCSV = () => {
    const buildings = data?.buildings || [];
    if (buildings.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const headers = ['Arrondissement', 'Total_Logements', 'Logements_Prives', 'Logements_Prives_Renoves', 'Logements_Sociaux', 'Logements_Sociaux_Renoves'];
    const csvRows = [
      headers.join(';'),
      ...buildings.map((b) =>
        [
          `"${b.name}"`,
          b.total_logements || 0,
          b.logements_prives || 0,
          b.logements_prives_renoves || 0,
          b.logements_sociaux || 0,
          b.logements_sociaux_renoves || 0,
        ].join(';')
      ),
    ];
    const blob = new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `renovate_energy_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data || {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `renovate_energy_export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const printDashboard = () => {
    setExportOpen(false);
    window.print();
  };

  return (
    <div className="toolbar-middle-group">
      {/* 1. Date / Période Dropdown */}
      <div className="relative inline-block text-left" ref={periodRef}>
        <button
          type="button"
          className={`toolbar-pill-btn ${periodOpen ? 'toolbar-pill-btn--active' : ''}`}
          onClick={() => {
            setPeriodOpen((v) => !v);
            setFilterOpen(false);
            setExportOpen(false);
          }}
          aria-expanded={periodOpen}
        >
          <span className="material-symbols-outlined text-cyan-500 text-[17px]">calendar_today</span>
          <span>{selectedPeriodLabel}</span>
          <span className={`material-symbols-outlined text-slate-400 text-[15px] transition-transform ${periodOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {periodOpen && (
          <div className="dashboard-dropdown-menu">
            <div className="dropdown-header">Sélectionner la période</div>
            <button
              type="button"
              className={`dropdown-item ${currentYear === 'all' && selectedPeriodLabel === '1 Mai – 31 Mai 2026' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('all', '1 Mai – 31 Mai 2026')}
            >
              <span>1 Mai – 31 Mai 2026</span>
              <span className="dropdown-badge">Mois en cours</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${currentYear === 'all' && selectedPeriodLabel === 'Toutes les années (Global)' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('all', 'Toutes les années (Global)')}
            >
              <span>Toutes les années (Global)</span>
            </button>
            <div className="dropdown-divider" />
            <button
              type="button"
              className={`dropdown-item ${currentYear === '2026' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('2026', 'Année 2026')}
            >
              <span>Année 2026</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${currentYear === '2025' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('2025', 'Année 2025')}
            >
              <span>Année 2025</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${currentYear === '2024' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('2024', 'Année 2024')}
            >
              <span>Année 2024</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${currentYear === '2023' ? 'active' : ''}`}
              onClick={() => handlePeriodSelect('2023', 'Année 2023')}
            >
              <span>Année 2023</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Filtres Dropdown */}
      <div className="relative inline-block text-left" ref={filterRef}>
        <button
          type="button"
          className={`toolbar-pill-btn ${filterOpen ? 'toolbar-pill-btn--active' : ''} ${activeSector !== 'all' ? 'border-cyan-500' : ''}`}
          onClick={() => {
            setFilterOpen((v) => !v);
            setPeriodOpen(false);
            setExportOpen(false);
          }}
          aria-expanded={filterOpen}
        >
          <span className="material-symbols-outlined text-cyan-500 text-[17px]">filter_list</span>
          <span>Filtres</span>
          {activeSector !== 'all' && (
            <span className="size-2 rounded-full bg-cyan-500" />
          )}
          <span className={`material-symbols-outlined text-slate-400 text-[15px] transition-transform ${filterOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {filterOpen && (
          <div className="dashboard-dropdown-menu">
            <div className="dropdown-header">Filtrer par secteur</div>
            <button
              type="button"
              className={`dropdown-item ${activeSector === 'all' ? 'active' : ''}`}
              onClick={() => handleSectorSelect('all')}
            >
              <span>Tous les secteurs</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${activeSector === 'prive' ? 'active' : ''}`}
              onClick={() => handleSectorSelect('prive')}
            >
              <span>Logements Privés uniquement</span>
            </button>
            <button
              type="button"
              className={`dropdown-item ${activeSector === 'social' ? 'active' : ''}`}
              onClick={() => handleSectorSelect('social')}
            >
              <span>Logements Sociaux uniquement</span>
            </button>
            <div className="dropdown-divider" />
            <button
              type="button"
              className="dropdown-reset-btn"
              onClick={() => {
                handleSectorSelect('all');
                handlePeriodSelect('all', '1 Mai – 31 Mai 2026');
              }}
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Exporter Dropdown */}
      <div className="relative inline-block text-left" ref={exportRef}>
        <button
          type="button"
          className={`toolbar-pill-btn ${exportOpen ? 'toolbar-pill-btn--active' : ''}`}
          onClick={() => {
            setExportOpen((v) => !v);
            setPeriodOpen(false);
            setFilterOpen(false);
          }}
          aria-expanded={exportOpen}
        >
          <span className="material-symbols-outlined text-cyan-500 text-[17px]">download</span>
          <span>Exporter</span>
          <span className={`material-symbols-outlined text-slate-400 text-[15px] transition-transform ${exportOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {exportOpen && (
          <div className="dashboard-dropdown-menu">
            <div className="dropdown-header">Format d&apos;export</div>
            <button type="button" className="dropdown-item" onClick={exportCSV}>
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">table_view</span>
              <span>Exporter en CSV (.csv)</span>
            </button>
            <button type="button" className="dropdown-item" onClick={exportJSON}>
              <span className="material-symbols-outlined text-blue-500 text-[18px]">code</span>
              <span>Exporter en JSON (.json)</span>
            </button>
            <button type="button" className="dropdown-item" onClick={printDashboard}>
              <span className="material-symbols-outlined text-purple-500 text-[18px]">print</span>
              <span>Imprimer / Sauvegarder PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
