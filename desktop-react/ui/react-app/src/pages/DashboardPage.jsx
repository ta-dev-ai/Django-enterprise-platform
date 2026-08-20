import DashboardLayout from '../layouts/DashboardLayout';
import BatimentSectionPanel from '../sections/dashboard/BatimentSectionPanel';
import TypesSection from '../sections/dashboard/TypesSection';
import DpeSection from '../sections/dashboard/DpeSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Dashboard Centrale Unique (< 25 lignes)
 * Gère l'affichage global ou ciblé par section (Batiments, Types, DPE)
 */
export default function DashboardPage({ view = 'all' }) {
  const { data, loading, year, setYear } = useDashboardData();

  const handleFilter = (group, filters) => {
    if (filters?.year) setYear(filters.year);
  };

  return (
    <DashboardLayout
      title="Tableau de Bord &amp; Visualisation 3D / 2D"
      subtitle="Synthèse Interactive Multi-Dimensions"
      onFilter={handleFilter}
    >
      {(view === 'all' || view === 'batiment') && <BatimentSectionPanel data={data} loading={loading} year={year} />}
      {(view === 'all' || view === 'types') && <TypesSection data={data} loading={loading} />}
      {(view === 'all' || view === 'dpe') && <DpeSection data={data} loading={loading} />}
    </DashboardLayout>
  );
}
