import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Sidebar — Traduction 1:1 du sidebar.html legacy.
 * Toute la structure HTML est identique à l'original.
 * Les interactions accordéon remplacent initInteractions() de ui.js.
 * Les filtres (année, type, classe) remontent via la prop onFilter jusqu'à useDashboardData (DashboardPage).
 */
export default function Sidebar({ open = false, onNavigate, onFilter, syncYear }) {
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname.replace('/', '') || 'dashboard';

  // État accordéons principaux — synchronisé avec la route
  const [openSections, setOpenSections] = useState({
    batiment: route.includes('batiment'),
    types: route.includes('types'),
    dpe: route.includes('dpe'),
  });

  // État sous-menus imbriqués (nested-accordion)
  const [openNested, setOpenNested] = useState({});

  // Filtre actif par groupe (réplique de this.filters du mainController)
  const [activeFilters, setActiveFilters] = useState({
    batiment: { year: 'all' },
    types: { type: 'Isolation', year: 'all' },
    dpe: { class: 'A', year: 'all' },
  });

  // Garde les accordéons alignés avec la route (ferme tout sur Vue d'ensemble)
  useEffect(() => {
    setOpenSections({
      batiment: route.includes('batiment'),
      types: route.includes('types'),
      dpe: route.includes('dpe'),
    });
    if (route === 'dashboard' || route === '') {
      setOpenNested({});
    }
  }, [route]);

  useEffect(() => {
    if (syncYear === undefined) return;
    setActiveFilters((prev) => ({
      ...prev,
      batiment: { ...prev.batiment, year: syncYear },
    }));
  }, [syncYear]);

  const toggleSection = (key) => {
    setOpenSections((prev) => {
      const willOpen = !prev[key];
      return { batiment: false, types: false, dpe: false, [key]: willOpen };
    });
  };

  const toggleNested = (key) => {
    setOpenNested((prev) => (prev[key] ? {} : { [key]: true }));
  };

  const handleNav = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const handleFilter = (group, updates) => {
    setActiveFilters((prev) => ({
      ...prev,
      [group]: { ...prev[group], ...updates },
    }));
    if (onFilter) onFilter(group, { ...activeFilters[group], ...updates });
  };

  const setActiveSubmenu = (group, el) => {
    // Réplique: submenu.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('selected'))
    // géré en CSS via l'état activeFilters
  };

  // Helper pour savoir si un filtre est sélectionné
  const isYearActive = (group, year) => activeFilters[group]?.year === year;
  const isTypeActive = (type) => activeFilters.types?.type === type;
  const isClassActive = (cls) => activeFilters.dpe?.class === cls;

  const submenuItemClass = (active) => `submenu-item${active ? ' selected' : ''}`;

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-header">
        <a href="#/" className="contact-brand" onClick={() => handleNav('/')}>
          <div className="contact-logo">
            <span className="material-symbols-outlined">energy_savings_leaf</span>
          </div>
          <h2 className="contact-brand-title">RenovateEnergy</h2>
        </a>
      </div>

      <nav className="nav-container" id="sidebarNav">
        {/* Vue Globale */}
        <a
          href="#/dashboard"
          className={`nav-item${route === 'dashboard' || route === '' ? ' active' : ''}`}
          data-view="overview"
          onClick={(e) => {
            e.preventDefault();
            setOpenSections({ batiment: false, types: false, dpe: false });
            setOpenNested({});
            setActiveFilters((prev) => ({
              ...prev,
              batiment: { ...prev.batiment, year: 'all' },
            }));
            if (onFilter) onFilter('batiment', { year: 'all' });
            handleNav('/dashboard');
          }}
        >
          <div className="accordion-content">
            <span
              className={`material-symbols-outlined ${route === 'dashboard' || route === '' ? 'icon-active' : 'icon-inactive'}`}
            >
              dashboard
            </span>
            <span>Vue d&apos;ensemble</span>
          </div>
        </a>

        {/* ── Section Bâtiments ── */}
        <div className="accordion-section">
          <a
            href="#/batiment"
            className={`accordion-btn${openSections.batiment ? ' open' : ''}${route.includes('batiment') ? ' active' : ''}`}
            data-view="batiment"
            onClick={(e) => {
              e.preventDefault();
              if (!route.includes('batiment')) {
                setOpenSections({ batiment: true, types: false, dpe: false });
                handleNav('/batiment');
              } else {
                toggleSection('batiment');
              }
            }}
          >
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">apartment</span>
              <span>Bâtiments Rénovés</span>
            </div>
            <span
              className={`material-symbols-outlined icon-inactive text-sm transition-transform${openSections.batiment ? ' rotate-180' : ''}`}
            >
              expand_more
            </span>
          </a>
          <div
            className={`submenu${openSections.batiment ? '' : ' hidden'}`}
            data-filter-group="batiment"
          >
            {[
              ['all', 'Toutes les années'],
              ['2026', '2026'],
              ['2025', '2025'],
              ['2024', '2024'],
              ['2023', '2023'],
              ['2022', '2022'],
              ['2021', '2021'],
            ].map(([val, label]) => (
              <a
                key={val}
                href="#"
                className={submenuItemClass(isYearActive('batiment', val))}
                data-year={val}
                onClick={(e) => {
                  e.preventDefault();
                  handleFilter('batiment', { year: val });
                }}
              >
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Section Types ── */}
        <div className="accordion-section">
          <div
            className={`accordion-btn group-btn${openSections.types ? ' open' : ''}${route.includes('types') ? ' active' : ''}`}
            data-view="types"
            onClick={() => {
              if (!route.includes('types')) {
                setOpenSections({ batiment: false, types: true, dpe: false });
                handleNav('/types');
              } else {
                toggleSection('types');
              }
            }}
          >
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">construction</span>
              <span>Types de Rénovation</span>
            </div>
            <span
              className={`material-symbols-outlined icon-inactive text-sm transition-transform${openSections.types ? ' rotate-180' : ''}`}
            >
              expand_more
            </span>
          </div>
          <div
            className={`submenu${openSections.types ? '' : ' hidden'}`}
            data-filter-group="types"
          >
            {/* Isolation */}
            <div className="nested-accordion">
              <div
                className={`nested-btn${isTypeActive('Isolation') ? ' active' : ''}`}
                data-type="Isolation"
                onClick={() => {
                  toggleNested('Isolation');
                  handleFilter('types', { type: 'Isolation' });
                }}
              >
                <span>Isolation</span>
                <span
                  className={`material-symbols-outlined text-xs${openNested['Isolation'] ? ' rotate-90' : ''}`}
                >
                  chevron_right
                </span>
              </div>
              <div className={`nested-submenu${openNested['Isolation'] ? '' : ' hidden'}`}>
                {[
                  ['all', 'Toutes les années'],
                  ['2026', '2026'],
                  ['2025', '2025'],
                  ['2024', '2024'],
                  ['2023', '2023'],
                ].map(([val, label]) => (
                  <a
                    key={val}
                    href="#"
                    className={submenuItemClass(
                      isTypeActive('Isolation') && isYearActive('types', val),
                    )}
                    data-type="Isolation"
                    data-year={val}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilter('types', { type: 'Isolation', year: val });
                    }}
                  >
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
            {/* Chauffage */}
            <div className="nested-accordion">
              <div
                className={`nested-btn${isTypeActive('Chauffage') ? ' active' : ''}`}
                data-type="Chauffage"
                onClick={() => {
                  toggleNested('Chauffage');
                  handleFilter('types', { type: 'Chauffage' });
                }}
              >
                <span>Chauffage</span>
                <span
                  className={`material-symbols-outlined text-xs${openNested['Chauffage'] ? ' rotate-90' : ''}`}
                >
                  chevron_right
                </span>
              </div>
              <div className={`nested-submenu${openNested['Chauffage'] ? '' : ' hidden'}`}>
                {[
                  ['all', 'Toutes les années'],
                  ['2026', '2026'],
                  ['2025', '2025'],
                  ['2024', '2024'],
                ].map(([val, label]) => (
                  <a
                    key={val}
                    href="#"
                    className={submenuItemClass(
                      isTypeActive('Chauffage') && isYearActive('types', val),
                    )}
                    data-type="Chauffage"
                    data-year={val}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilter('types', { type: 'Chauffage', year: val });
                    }}
                  >
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
            {/* Menuiseries */}
            <div className="nested-accordion">
              <div
                className={`nested-btn${isTypeActive('Menuiseries') ? ' active' : ''}`}
                data-type="Menuiseries"
                onClick={() => {
                  toggleNested('Menuiseries');
                  handleFilter('types', { type: 'Menuiseries' });
                }}
              >
                <span>Menuiseries</span>
                <span
                  className={`material-symbols-outlined text-xs${openNested['Menuiseries'] ? ' rotate-90' : ''}`}
                >
                  chevron_right
                </span>
              </div>
              <div className={`nested-submenu${openNested['Menuiseries'] ? '' : ' hidden'}`}>
                {[
                  ['all', 'Toutes les années'],
                  ['2026', '2026'],
                  ['2025', '2025'],
                ].map(([val, label]) => (
                  <a
                    key={val}
                    href="#"
                    className={submenuItemClass(
                      isTypeActive('Menuiseries') && isYearActive('types', val),
                    )}
                    data-type="Menuiseries"
                    data-year={val}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilter('types', { type: 'Menuiseries', year: val });
                    }}
                  >
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
            {/* Ventilation */}
            <div className="nested-accordion">
              <div
                className={`nested-btn${isTypeActive('Ventilation') ? ' active' : ''}`}
                data-type="Ventilation"
                onClick={() => {
                  toggleNested('Ventilation');
                  handleFilter('types', { type: 'Ventilation' });
                }}
              >
                <span>Ventilation</span>
                <span
                  className={`material-symbols-outlined text-xs${openNested['Ventilation'] ? ' rotate-90' : ''}`}
                >
                  chevron_right
                </span>
              </div>
              <div className={`nested-submenu${openNested['Ventilation'] ? '' : ' hidden'}`}>
                {[
                  ['all', 'Toutes les années'],
                  ['2026', '2026'],
                ].map(([val, label]) => (
                  <a
                    key={val}
                    href="#"
                    className={submenuItemClass(
                      isTypeActive('Ventilation') && isYearActive('types', val),
                    )}
                    data-type="Ventilation"
                    data-year={val}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilter('types', { type: 'Ventilation', year: val });
                    }}
                  >
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section DPE ── */}
        <div className="accordion-section">
          <div
            className={`accordion-btn group-btn${openSections.dpe ? ' open' : ''}${route.includes('dpe') ? ' active' : ''}`}
            data-view="dpe"
            onClick={() => {
              if (!route.includes('dpe')) {
                setOpenSections({ batiment: false, types: false, dpe: true });
                handleNav('/dpe');
              } else {
                toggleSection('dpe');
              }
            }}
          >
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">bolt</span>
              <span>Classe DPE</span>
            </div>
            <span
              className={`material-symbols-outlined icon-inactive text-sm transition-transform${openSections.dpe ? ' rotate-180' : ''}`}
            >
              expand_more
            </span>
          </div>
          <div className={`submenu${openSections.dpe ? '' : ' hidden'}`} data-filter-group="dpe">
            {/* A & B — 2026, 2025 */}
            {['A', 'B'].map((cls) => (
              <div className="nested-accordion" key={cls}>
                <div
                  className={`nested-btn${isClassActive(cls) ? ' active' : ''}`}
                  data-class={cls}
                  onClick={() => {
                    toggleNested(`dpe-${cls}`);
                    handleFilter('dpe', { class: cls });
                  }}
                >
                  <span>Classe {cls}</span>
                  <span
                    className={`material-symbols-outlined text-xs${openNested[`dpe-${cls}`] ? ' rotate-90' : ''}`}
                  >
                    chevron_right
                  </span>
                </div>
                <div className={`nested-submenu${openNested[`dpe-${cls}`] ? '' : ' hidden'}`}>
                  {[
                    ['all', 'Toutes les années'],
                    ['2026', '2026'],
                    ['2025', '2025'],
                  ].map(([val, label]) => (
                    <a
                      key={val}
                      href="#"
                      className={submenuItemClass(isClassActive(cls) && isYearActive('dpe', val))}
                      data-class={cls}
                      data-year={val}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilter('dpe', { class: cls, year: val });
                      }}
                    >
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {/* C, D, E — 2024, 2023 */}
            {['C', 'D', 'E'].map((cls) => (
              <div className="nested-accordion" key={cls}>
                <div
                  className={`nested-btn${isClassActive(cls) ? ' active' : ''}`}
                  data-class={cls}
                  onClick={() => {
                    toggleNested(`dpe-${cls}`);
                    handleFilter('dpe', { class: cls });
                  }}
                >
                  <span>Classe {cls}</span>
                  <span
                    className={`material-symbols-outlined text-xs${openNested[`dpe-${cls}`] ? ' rotate-90' : ''}`}
                  >
                    chevron_right
                  </span>
                </div>
                <div className={`nested-submenu${openNested[`dpe-${cls}`] ? '' : ' hidden'}`}>
                  {[
                    ['all', 'Toutes les années'],
                    ['2024', '2024'],
                    ['2023', '2023'],
                  ].map(([val, label]) => (
                    <a
                      key={val}
                      href="#"
                      className={submenuItemClass(isClassActive(cls) && isYearActive('dpe', val))}
                      data-class={cls}
                      data-year={val}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilter('dpe', { class: cls, year: val });
                      }}
                    >
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {/* F, G — 2024 seulement */}
            {['F', 'G'].map((cls) => (
              <div className="nested-accordion" key={cls}>
                <div
                  className={`nested-btn${isClassActive(cls) ? ' active' : ''}`}
                  data-class={cls}
                  onClick={() => {
                    toggleNested(`dpe-${cls}`);
                    handleFilter('dpe', { class: cls });
                  }}
                >
                  <span>Classe {cls}</span>
                  <span
                    className={`material-symbols-outlined text-xs${openNested[`dpe-${cls}`] ? ' rotate-90' : ''}`}
                  >
                    chevron_right
                  </span>
                </div>
                <div className={`nested-submenu${openNested[`dpe-${cls}`] ? '' : ' hidden'}`}>
                  {[
                    ['all', 'Toutes les années'],
                    ['2024', '2024'],
                  ].map(([val, label]) => (
                    <a
                      key={val}
                      href="#"
                      className={submenuItemClass(isClassActive(cls) && isYearActive('dpe', val))}
                      data-class={cls}
                      data-year={val}
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilter('dpe', { class: cls, year: val });
                      }}
                    >
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <a href="#/admin" className="nav-item" onClick={() => handleNav('/admin')}>
          <div className="accordion-content">
            <span className="material-symbols-outlined">settings</span>
            <span>Administration</span>
          </div>
        </a>
      </div>
    </aside>
  );
}
