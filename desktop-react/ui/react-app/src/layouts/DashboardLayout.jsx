import Sidebar from '../sections/common/SidebarSection';

/**
 * Layout Dashboard — Organise la Sidebar + Header de Contrôle + Zone de Sections
 */
export default function DashboardLayout({ title = 'Tableau de Bord Global', subtitle = 'Synthèse Interactive Multi-Dimensions', children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="main-content">
          <header className="mb-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">
                {subtitle}
              </span>
              <h1 className="text-2xl font-bold text-slate-800" id="viewTitle">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
                <img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" />
              </div>
            </div>
          </header>

          <div id="dashboardContent" className="space-y-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
