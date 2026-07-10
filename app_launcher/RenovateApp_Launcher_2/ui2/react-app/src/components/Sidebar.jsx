export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="#overview" className="contact-brand nav-item" data-view="overview">
          <div className="contact-logo">
            <span className="material-symbols-outlined">energy_savings_leaf</span>
          </div>
          <h2 className="contact-brand-title">RenovateEnergy</h2>
        </a>
      </div>

      <nav className="nav-container" id="sidebarNav">
        <a href="#overview" className="nav-item active" data-view="overview">
          <div className="accordion-content">
            <span className="material-symbols-outlined icon-active">dashboard</span>
            <span>Vue d'ensemble</span>
          </div>
        </a>

        <div className="accordion-section">
          <a href="#batiment" className="accordion-btn" data-view="batiment">
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">apartment</span>
              <span>Bâtiments Rénovés</span>
            </div>
            <span className="material-symbols-outlined icon-inactive text-sm transition-transform">
              expand_more
            </span>
          </a>
          <div className="submenu hidden" data-filter-group="batiment">
            <a href="#" className="submenu-item selected" data-year="all"><span>Toutes les années</span></a>
            <a href="#" className="submenu-item" data-year="2026"><span>2026</span></a>
            <a href="#" className="submenu-item" data-year="2025"><span>2025</span></a>
            <a href="#" className="submenu-item" data-year="2024"><span>2024</span></a>
            <a href="#" className="submenu-item" data-year="2023"><span>2023</span></a>
            <a href="#" className="submenu-item" data-year="2022"><span>2022</span></a>
            <a href="#" className="submenu-item" data-year="2021"><span>2021</span></a>
          </div>
        </div>

        <div className="accordion-section">
          <div className="accordion-btn group-btn" data-view="types">
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">construction</span>
              <span>Types de Rénovation</span>
            </div>
            <span className="material-symbols-outlined icon-inactive text-sm transition-transform">
              expand_more
            </span>
          </div>

          <div className="submenu hidden" data-filter-group="types">
            <div className="nested-accordion">
              <div className="nested-btn" data-type="Isolation">
                <span>Isolation</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </div>
              <div className="nested-submenu hidden">
                <a href="#" className="submenu-item" data-type="Isolation" data-year="all"><span>Toutes les années</span></a>
                <a href="#" className="submenu-item" data-year="2026" data-type="Isolation"><span>2026</span></a>
                <a href="#" className="submenu-item" data-year="2025" data-type="Isolation"><span>2025</span></a>
                <a href="#" className="submenu-item" data-year="2024" data-type="Isolation"><span>2024</span></a>
                <a href="#" className="submenu-item" data-year="2023" data-type="Isolation"><span>2023</span></a>
              </div>
            </div>

            <div className="nested-accordion">
              <div className="nested-btn" data-type="Chauffage">
                <span>Chauffage</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </div>
              <div className="nested-submenu hidden">
                <a href="#" className="submenu-item" data-type="Chauffage" data-year="all"><span>Toutes les années</span></a>
                <a href="#" className="submenu-item" data-year="2026" data-type="Chauffage"><span>2026</span></a>
                <a href="#" className="submenu-item" data-year="2025" data-type="Chauffage"><span>2025</span></a>
                <a href="#" className="submenu-item" data-year="2024" data-type="Chauffage"><span>2024</span></a>
              </div>
            </div>

            <div className="nested-accordion">
              <div className="nested-btn" data-type="Menuiseries">
                <span>Menuiseries</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </div>
              <div className="nested-submenu hidden">
                <a href="#" className="submenu-item" data-type="Menuiseries" data-year="all"><span>Toutes les années</span></a>
                <a href="#" className="submenu-item" data-year="2026" data-type="Menuiseries"><span>2026</span></a>
                <a href="#" className="submenu-item" data-year="2025" data-type="Menuiseries"><span>2025</span></a>
              </div>
            </div>

            <div className="nested-accordion">
              <div className="nested-btn" data-type="Ventilation">
                <span>Ventilation</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </div>
              <div className="nested-submenu hidden">
                <a href="#" className="submenu-item" data-type="Ventilation" data-year="all"><span>Toutes les années</span></a>
                <a href="#" className="submenu-item" data-year="2026" data-type="Ventilation"><span>2026</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-section">
          <div className="accordion-btn group-btn" data-view="dpe">
            <div className="accordion-content">
              <span className="material-symbols-outlined icon-inactive">bolt</span>
              <span>Classe DPE</span>
            </div>
            <span className="material-symbols-outlined icon-inactive text-sm transition-transform">
              expand_more
            </span>
          </div>
          <div className="submenu hidden" data-filter-group="dpe">
            {['A','B','C','D','E','F','G'].map((cls) => (
              <div className="nested-accordion" key={cls}>
                <div className="nested-btn" data-class={cls}>
                  <span>{`Classe ${cls}`}</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                </div>
                <div className="nested-submenu hidden">
                  <a href="#" className="submenu-item" data-class={cls} data-year="all"><span>Toutes les années</span></a>
                  {cls === 'A' || cls === 'B' ? (
                    <>
                      <a href="#" className="submenu-item" data-year="2026" data-class={cls}><span>2026</span></a>
                      <a href="#" className="submenu-item" data-year="2025" data-class={cls}><span>2025</span></a>
                    </>
                  ) : cls === 'C' || cls === 'D' || cls === 'E' ? (
                    <>
                      <a href="#" className="submenu-item" data-year="2024" data-class={cls}><span>2024</span></a>
                      <a href="#" className="submenu-item" data-year="2023" data-class={cls}><span>2023</span></a>
                    </>
                  ) : (
                    <a href="#" className="submenu-item" data-year="2024" data-class={cls}><span>2024</span></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <a href="#admin" className="nav-item">
          <div className="accordion-content">
            <span className="material-symbols-outlined">settings</span>
            <span>Administration</span>
          </div>
        </a>
      </div>
    </aside>
  );
}
