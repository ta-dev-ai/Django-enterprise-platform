/** Copié depuis templates/components/sidebar/sidebar.html — structure identique. */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <a href="/" className="contact-brand">
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
            <span>Vue d&apos;ensemble</span>
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
