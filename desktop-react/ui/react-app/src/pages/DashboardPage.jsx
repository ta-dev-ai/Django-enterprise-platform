import DashboardLayout from '../layouts/DashboardLayout';
import BatimentSection from '../sections/dashboard/BatimentSection';
import TypesSection from '../sections/dashboard/TypesSection';
import DpeSection from '../sections/dashboard/DpeSection';
import { useDashboardData } from '../hooks/useDashboardData';

/**
 * Page Dashboard Centrale Unique (< 25 lignes)
 * Gère l'affichage global ou ciblé par section (Batiments, Types, DPE)
 */
export default function DashboardPage({ view = 'all' }) {
  const { data, loading } = useDashboardData();

  return (
    <DashboardLayout
      title="Tableau de Bord &amp; Visualisation 3D / 2D"
      subtitle="Synthèse Interactive Multi-Dimensions"
    >
      {(view === 'all' || view === 'batiment') && <BatimentSection data={data} loading={loading} />}
      {(view === 'all' || view === 'types') && <TypesSection data={data} loading={loading} />}
      {(view === 'all' || view === 'dpe') && <DpeSection data={data} loading={loading} />}
    </DashboardLayout>
  );
}
