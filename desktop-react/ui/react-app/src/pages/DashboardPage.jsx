import { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import OverviewSection from '../sections/dashboard/OverviewSection';
import BatimentSectionPanel from '../sections/dashboard/BatimentSectionPanel';
import TypesSection from '../sections/dashboard/TypesSection';
import DpeSection from '../sections/dashboard/DpeSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Dashboard Centrale Unique
 * Vue d'ensemble (synthèse) ou section ciblée (Bâtiments, Types, DPE)
 */
export default function DashboardPage({ view = 'all' }) {
  const { data, rawData, loading, year, setYear } = useDashboardData();

  // Vue d'ensemble = toujours l'ensemble des données (pas de filtre année résiduel)
  useEffect(() => {
    if (view === 'all') setYear('all');
  }, [view, setYear]);

  const handleFilter = (group, filters) => {
    if (filters?.year) setYear(filters.year);
  };

  return (
    <DashboardLayout
      title="Tableau de Bord &amp; Visualisation 3D / 2D"
      subtitle="Synthèse Interactive Multi-Dimensions"
      onFilter={handleFilter}
    >
      {view === 'all' && (
        <OverviewSection data={data} rawData={rawData} loading={loading} />
      )}
      {view === 'batiment' && (
        <BatimentSectionPanel data={data} loading={loading} year={year} />
      )}
      {view === 'types' && <TypesSection data={data} loading={loading} />}
      {view === 'dpe' && <DpeSection data={data} loading={loading} />}
    </DashboardLayout>
  );
}
