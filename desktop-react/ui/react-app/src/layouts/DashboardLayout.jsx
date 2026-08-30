import { useState } from 'react';
import Sidebar from '../sections/common/SidebarSection';
import ThemeToggle from '../components/ui/ThemeToggle';

/**
 * Layout Dashboard — Organise la Sidebar + Header de Contrôle + Zone de Sections
 */
export default function DashboardLayout({
  title = 'Tableau de Bord Global',
  subtitle = 'Synthèse Interactive Multi-Dimensions',
  onFilter,
  syncYear,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      <div className="dashboard-mobile-bar">
        <button
          type="button"
          className="dashboard-menu-btn"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="dashboard-mobile-title">{title}</span>
      </div>
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} onFilter={onFilter} syncYear={syncYear} />
      <div
        className={`dashboard-sidebar-overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="flex-1 overflow-y-auto">
        <main className="main-content">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-600 mb-1 tracking-wide" id="viewSubtitle">
                {subtitle}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" id="viewTitle">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Filter Pill Button */}
              <button
                type="button"
                className="dashboard-action-pill flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-sm text-sm font-semibold text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-slate-500 text-[18px]">calendar_today</span>
                <span>1 Mai – 31 Mai 2026</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
              </button>

              {/* Export Pill Button */}
              <button
                type="button"
                className="dashboard-action-pill flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-sm text-sm font-semibold text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-slate-600 text-[18px]">download</span>
                <span>Exporter</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
              </button>

              <ThemeToggle variant="inline" />

              {/* User Avatar */}
              <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer shadow-sm">
                <img src="/static/assets/tayier_photo_pro.jpg" className="w-full h-full object-cover" alt="Profil" />
              </div>
            </div>
          </header>

          <div id="dashboardContent" className="space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
