import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import BatimentSection from '../components/sections/BatimentSection';
import TypesSection from '../components/sections/TypesSection';
import DpeSection from '../components/sections/DpeSection';

/**
 * Page Dashboard — Orchestrateur léger et modulaire
 * Assemble la couche sections (BatimentSection, TypesSection, DpeSection)
 */
export default function DashboardPage() {
  const { data, loading, setYear, setType, setDpeClass } = useDashboardData();
  const location = useLocation();
  const route = location.pathname.replace('/', '') || 'dashboard';

  // Synchronisation des filtres globaux émis par la Sidebar
  useEffect(() => {
    const handleFilterChange = (e) => {
      const { group, updates } = e.detail;
      if (group === 'batiment' && updates.year) setYear(updates.year);
      if (group === 'types') {
        if (updates.year) setYear(updates.year);
        if (updates.type) setType(updates.type);
      }
      if (group === 'dpe') {
        if (updates.year) setYear(updates.year);
        if (updates.class) setDpeClass(updates.class);
      }
    };
    window.addEventListener('dashboardFilterChanged', handleFilterChange);
    return () => window.removeEventListener('dashboardFilterChanged', handleFilterChange);
  }, [setYear, setType, setDpeClass]);

  return (
    <main className="main-content">
      {/* Header du Dashboard */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-1" id="viewSubtitle">
            Synthèse Interactive Multi-Dimensions
          </span>
          <h1 className="text-2xl font-bold text-slate-800" id="viewTitle">
            Tableau de Bord &amp; Visualisation 3D / 2D
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
            <img src="https://i.pravatar.cc/100?u=admin" className="w-full h-full object-cover" alt="Profil" />
          </div>
        </div>
      </header>

      {/* Contenu Orchestré par la Couche Sections */}
      <div id="dashboardContent" className="space-y-12">
        {/* 1. Section Bâtiments */}
        {(route === 'dashboard' || route === 'batiment') && (
          <BatimentSection data={data} loading={loading} />
        )}

        {/* 2. Section Types de Travaux */}
        {(route === 'dashboard' || route === 'types') && (
          <TypesSection data={data} loading={loading} />
        )}

        {/* 3. Section Performance DPE */}
        {(route === 'dashboard' || route === 'dpe') && (
          <DpeSection data={data} loading={loading} />
        )}
      </div>
    </main>
  );
}
