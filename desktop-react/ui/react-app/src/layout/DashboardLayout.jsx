import { useState } from 'react';
import Sidebar from '../components/Sidebar';

/** Copié depuis templates/layouts/dashboard_layout.html + barre mobile */
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <div
        className={`dashboard-sidebar-overlay ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />
      <header className="dashboard-mobile-bar">
        <button
          type="button"
          className="dashboard-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="dashboard-mobile-title">RenovateEnergy</span>
      </header>
      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
      {children}
    </>
  );
}
